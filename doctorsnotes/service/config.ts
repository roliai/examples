import { Session, Endpoint, createSession, Program, Prompt, createUuid, getModel, ChatModelResponse } from "./roli-runtime";

class Patient {
    constructor(
        public firstName: string, 
        public lastName: string, 
        public reasonForVisit: string
        ) { }
}

class AppointmentDto {
    constructor(
        public uuid: string,
        public reasonForVisit: string,
        public patient: Patient,
        public provider: Provider
    ) {}
}

class Provider {
constructor(
    public credentials: string,
    public unstructuredNote: string,
    public firstName: string,
    public lastName: string,
    public followUpPlans?: Provider_ClinicalNoteFollowUpInput[]
){}
}

class Provider_ClinicalNoteFollowUpInput {
constructor(
    public type: string,
    public followUpTimeInDays: number
){}
}

class LLMStructuredNote {
constructor(
    public subjective: any,
    public objective: any,
    public assessment: any,
    public plan: any,
    public patientSummary: any,
    public possibleDiagnoses: any[]
){}
}

function summarizeFollowup(plans?: Provider_ClinicalNoteFollowUpInput[]) {
    if (!plans?.length) {
      return '';
    }
    return plans
      .filter((p) => p.type === 'SAME_PROVIDER_SERVICE')
      .map((p) => {
        if (p.type === 'SAME_PROVIDER_SERVICE') {
          return `Provider requests follow up in ${p.followUpTimeInDays}`;
        }
      })
      .join('\n');
}

function createCommon(patient: Patient, provider: Provider): string {
    const followUpPlans = summarizeFollowup(provider.followUpPlans);
    // todo: hook this up to Contentful in some way
    return `A patient named ${patient.firstName} ${patient.lastName} made an appointment with a medical provider because:
${patient.reasonForVisit}
Provider ${provider.firstName} ${provider.lastName}, ${provider.credentials} wrote these notes:
${provider.unstructuredNote}
${followUpPlans}`.trim();
}

function cleanLLMString(apiValue: string | Array<string>) {
    if (Array.isArray(apiValue)) {
      return apiValue.join('\n');
    }
    return apiValue;
}

class DoctorsNotesSession extends Session {
    constructor(sessionId: string) {
        super(sessionId);
    }
    async parseNotes(id: string, patient: Patient, provider: Provider) : Promise<LLMStructuredNote> {
        const common = createCommon(patient, provider);
        const generatedNote = {} as LLMStructuredNote;

        // Use the same model spec for each program but just change up the headers so wiremock handles it correctly
        const model = getModel("doctorsnotes-model");
        model.settings.temperature = 0.0;

        // This could have been stored in the model spec itself but we're going to do it here so we only really need one model since this is only for mocking purposes.
        model.headers = { "x-mock-variant": 'soap' };

        const soapProgram = new Program(model, {
            system: 'You are a helpful medical assistant that helps medical providers expand loosely formatted notes into well structured SOAP notes with clear subjective and objective observations, an overall assessment, and a plan for the future.',
            user: `${common}\nPlease rewrite this clinical note in standard SOAP form as a simple JSON object with keys "subjective", "objective", "assessment" and "plan".`, 
            assistant: (response: ChatModelResponse) => {
                const content = response.choices[0].message.content;
                if(!content || typeof content !== "string")
                    throw new Error("Not content returned from soap LLM call");

                const parsed = JSON.parse(content);
                generatedNote.subjective = cleanLLMString(parsed.subjective);
                generatedNote.objective = cleanLLMString(parsed.objective);
                generatedNote.assessment = cleanLLMString(parsed.assessment);
                generatedNote.plan = cleanLLMString(parsed.plan);

                return content;
            }});
        
        model.headers = { "x-mock-variant": 'patient' };

        const patientProgram = new Program(model, {
            system: 'You are a helpful medical assistant that helps medical providers expand loosely formatted notes into well structured notes that are readable by patients and friendly and reassuring. You should not make up information that is not contained in the notes.',
            user: `${common}\nWrite a note to the patient from the provider ${provider.firstName} ${provider.lastName} summarizing the visit.`,
            assistant: (response: ChatModelResponse) => {
                const content = response.choices[0].message.content;
                if(!content || typeof content !== "string")
                    throw new Error("Not content returned from patient LLM call");

                generatedNote.patientSummary = content;
                return content;
            }});
        
        model.headers = { "x-mock-variant": 'icd' };        

        const icdProgram = new Program(model, {
            system: 'You are a helpful medical assistant that helps medical providers expand loosely formatted notes into a set of possible ICD-10 diagnostic codes that the provider can choose from. You should err on the side of more possible codes rather than fewer or more generic codes.',
            user: `${common}\nPlease return a list of possible ICD-10 codes as an array of JSON objects with the keys "code", "description" and "reasoning".`,
            assistant: (response: ChatModelResponse) => {
                const content = response.choices[0].message.content;
                if(!content || typeof content !== "string")
                    throw new Error("Not content returned from icd LLM call");

                const rawCodes = JSON.parse(content);
                generatedNote.possibleDiagnoses = Array.isArray(rawCodes) 
                    ? rawCodes.filter((c) => c.code && c.reasoning) 
                    : [];
                return content;
            }});

        // execute the programs in parallel for their side-effects.
        await Promise.all([
            this.execute(soapProgram), 
            this.execute(patientProgram), 
            this.execute(icdProgram)]
        );

        return generatedNote;
    }
}

export class Api extends Endpoint {
    constructor(primaryKey: string) { 
        super(primaryKey);
    }

    async createStructuredNote(encounter: AppointmentDto, unstructuredNote: string, followUpPlans: Provider_ClinicalNoteFollowUpInput[] | undefined) : Promise<LLMStructuredNote> {
        const { reasonForVisit, patient, provider } = encounter;
        const session = createSession(DoctorsNotesSession);
        const generatedNote = await session.parseNotes(encounter.uuid, {
            firstName: patient.firstName,
            lastName: patient.lastName,
            reasonForVisit,
        },
        {
            firstName: provider.firstName,
            lastName: provider.lastName,
            credentials: provider.credentials,
            unstructuredNote,
            followUpPlans,
        });
        return generatedNote;
    }
}