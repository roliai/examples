import {createUuid, saveData, fireEvent, Event, Data, Endpoint} from "./roli-runtime";

export class ChatServer extends Endpoint {
    private _history: ChatEntry[];
    constructor(name: string) {
        super(name);
        this._history = [];
    }

    say(userName: string, text: string) {
        const entry = new ChatEntry(userName, text);
        this._history.push(entry);
        saveData(entry); // Save data object to datastore
        fireEvent(this, new ChatEvent(entry)); // Send SSE to listening clients
    }

    getHistory() : ChatEntry[] {
        return this._history;
    }

    getTime() : Date {
        return new Date();
    }
}

export class ChatEntry extends Data {
    public readonly timestamp: Date;
    constructor(public readonly userName: string, public readonly text: string) {
        super(createUuid(false));
        this.timestamp = new Date();
    }
}

export class ChatEvent extends Event {
    constructor(public entry: ChatEntry) {
        super();
    }
}