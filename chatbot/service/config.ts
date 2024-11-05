import {Endpoint, Session, getModel, Program, Instruction, Step, Prompt, createSession, ChatModelResponse } from "./roli-runtime";

export class ChatbotSession extends Session {
    // note: Session properties aren't client visible or client addressable.
    private _history: Instruction[];
    userName: string | null;

    constructor(sessionId: string) {
        super(sessionId);
        this._history = [];
        this.userName = null;
    }
    
    /**
     * Send a message to the Chatbot
     * @param message The message to say to the Chatbot.
     * @returns The response from the Chatbot.
     */
    async tell(message: string) : Promise<string | null> {
        if(!this.userName || typeof this.userName !== "string")
            throw new Error("The user name must be set first");

        const model = getModel("my-model");

        let steps: Step[];
        if(this._history) {
            steps = Array.from(this._history);
        } else {
            steps = [];
        }

        let result: string | null = null;       

        // Append a prompt to the end of the list of steps.
        const prompt = {
            user: message,
            assistant: (response: ChatModelResponse)=> {
                result = response.message;
                return result;
            }
        } as Prompt;

        // Only specify the system message the first time.
        if(this._history.length > 0) {
            prompt.system = `You are a member of an elite social club in London England. You are having a fun and interesting discussion with a long time friend named ${this.userName}. You must always be friendly, courtious, and respectful to ${this.userName}.`;
        }

        steps.push(prompt);

        // create a Program to execute the Steps on the Model
        const program = new Program(model, steps);
        
        // execute the Program
        await this.execute(program);

        this._history.push(program.steps.peek() as Instruction);

        return result;
    }
}

/**
 * An API for creating sessions with a PoshChatbot
 */
export class ChatbotApi extends Endpoint {
    constructor(key: string) {
        super(key);
    }

    /**
     * Gets a session with the PoshChatbot
     * @param userName The user name of the person talking to the Chatbot.

     * @returns 
     */
    getSession(userName: string) : ChatbotSession {
        const session = createSession(ChatbotSession);
        session.userName = userName;
        console.log(`Session ${session.sessionId} created`);
        return session;
    }
}