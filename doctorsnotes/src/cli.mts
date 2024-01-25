import { 
    createRoliClient, 
    Api 
} from "doctorsnotes-service";

// Create an instance of the Roli client.
const client = createRoliClient();

// Get a handle to the Endpoint of type Api.
const api = client.getEndpoint(Api, "default");

const unstructuredNote = `38 y/o M w/ h/o intermittent back pain, presents w/ severe lumbar pain x1 wk, no known injury. Pain > with movement, sitting/standing, < when lying down. NSAIAs limited relief. PE: Localized lower back pain, ↓ lumbar ROM due to pain. SLR -ve bilaterally. Neuro exam NAD. Lumbar X-ray unremarkable, no spondylosis/fracture/dislocation.

Severe nonspecific LBP, musculoskeletal likely.

Rx Cyclobenzaprine 10mg TID PRN. Advise rest, avoid strenuous activity. PT advised. F/u in 2 wks or if pain ↑. Referral if no improvement.

Pt educated re: lifestyle changes, back care ergonomics. Agreed to follow recommendations.`;


interface Patient {
    firstName: string;
    lastName: string;
    reasonForVisit: string;
}

interface AppointmentDto {
    uuid: string;
    reasonForVisit: string;
    patient: Patient;
    provider: Provider;
}
interface Provider {
    credentials: string;
    unstructuredNote: string;
    firstName: string;
    lastName: string;
    followUpPlans?: Provider_ClinicalNoteFollowUpInput[] | undefined;
}
interface Provider_ClinicalNoteFollowUpInput {
    type: string;
    followUpTimeInDays: number;
}
interface LLMStructuredNote {
    subjective: any;
    objective: any;
    assessment: any;
    plan: any;
    patientSummary: any;
    possibleDiagnoses: any[];
}
const encounter = {
    uuid: "55",
    patient: {
        firstName: "Simon",
        lastName: "Ellis",
        reasonForVisit: "back pain",
    },
    provider: {
        firstName: "Scott",
        lastName: "McNulty",
        credentials: "MD from the Harvard School of Medicine"
    }
} as AppointmentDto;

const structuredNote = await api.createStructuredNote(encounter, unstructuredNote, []);

console.log("Received this structuredNote: " + JSON.stringify(structuredNote))

client.closeConnections();