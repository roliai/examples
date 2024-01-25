import { Stack } from "./containers.js";

/**
 * Controllers execute Programs and contain business logic.
 * @see {@link Program}
 */
export declare class Controller {
    constructor(sessionId: string);
    get sessionId(): string;
    /**
     * Execute the program, step by step. This may result in multiple calls to the underlying Generative AI hosting provider.
     * @param program The program to execute.
     */
    execute(program: Program) : Promise<void>;
}

/**
 * A single unit of logic that modifies the Program's execution state at runtime.
 * Instructions are Prompts that have run before.
 * Instructions can be used to demostrate to the Generative AI what sorts of outputs are expected.
 * @see {@link Program}
 * @see {@link Prompt}
 */
export declare class Instruction {
    public system?: string;
    public user?: string;
    public assistant?: string;
    constructor (
        system: string | undefined, 
        user: string | undefined, 
        assistant: string | undefined
    );
}

/**
 * Prompts provide callbacks into the Program's execution.
 * A given prompt will only execute once during a Program's execution.
 * After a Prompt's assistant callback is called, it becomes an Instruction as part of the program execution.
 * @see {@link Instruction}
 * @see {@link Program}
 */
export declare class Prompt {
    public system?: string | null;
    public user?: string | null;
    public assistant: (output: string) => string;
    constructor (
        system: string | null | undefined, 
        user: string | null | undefined, 
        assistant: (output: string) => string
    );
}

/**
 * A Step is either an Instruction or a Prompt
 * @see {@link Instruction}
 * @see {@link Prompt}
 */
declare type Step = Instruction | Prompt;

export declare interface ProgramConfig {
    /**
     * The configuration key that, when retrieved, returns the hostname (or ip) and port of the Generative AI hosting provider.
     */
    hostPortConfigKey: string;
    /**
     * The AI model name to pass to the Generative AI hosting provider.
     */
    model: string;
    /**
     * (optional) The API key authorized to call the Generative AI hosting provider.
     */
    apiKey?: string | undefined | null;
    /**
     * Either 'azure' or 'openai'
     */
    kind: string;
    /**
     * (Azure only) Your Azure OpenAI deployment name.
     */
    deployment?: string | undefined | null;
    /**
     * (optional) The Generative AI temperature value. 
     * A floating point value from 0.0 (least creative) to 1.0 (most creative). 
     * This effects the randomness of output. The default is 0.7 which is a good balance.
     * @see https://ai.stackexchange.com/questions/32477/what-is-the-temperature-in-the-gpt-models
     */
    temperature?: number | undefined | null;
    /**
     * (optional) Additional headers to pass to the Generative AI hosting provider endpoint.
     */
    headers?: {} | undefined | null;
}

/**
 * A Program is a logical synchronous execution of Steps on a Generative AI hosting provider.
 * @see {@link Step}
 * @see {@link Instruction}
 * @see {@link Prompt}
 */
export declare class Program {
    get config(): ProgramConfig;
    get steps(): Stack<Step>;
    constructor(config: ProgramConfig, ...steps: Step[]);
}

/**
 * Defines the API available to clients.
 */
export declare class Endpoint {
    constructor(primaryKey: string);
    get primaryKey(): string;
}

/** 
* Objects you can broadcast to many clients at once.
* @see {@link Endpoint}
*/
export declare class Event {
}

/**
 * Data objects hold data.
 * @see saveData
 * @see getData
 */
export declare class Data {
    constructor(primaryKey: string);
    get primaryKey(): string;
}
