import { deleteObject, saveData, getData, fireEvent,
    createUuid, Data, Event, Endpoint } from "./roli-runtime";

export class JournalEntry extends Data {
    constructor(public text: string, 
        public date: Date) {
        const id = createUuid(false);
        console.log(`JournalEntry id= ${id}`);
        super(id);
    }
}

export class JournalEntryAdded extends Event {
    constructor(public journalEntry: JournalEntry) {
        super();
    }
}

/**
 * An endpoint whose job is to keep track of all the users and journal entries and provide access to both.
 */
export class JournalApi extends Endpoint {
    // @ts-ignore
    private _journalEntryIndex: Set<string>;

    constructor(primaryKey: string) {
        super(primaryKey);
        this._journalEntryIndex = new Set();
    }

    /**
     * Adds a new journal entry to the list of entries.
     * This method will fire the JournalEntryAdded event upon successfully adding a new JournalEntry
     * @param journalEntry The JournalEntry to add 
     */
    addJournalEntry(journalEntry: JournalEntry) {
        if (!journalEntry || !(journalEntry instanceof JournalEntry)) {
            throw new Error('JournalEntry was invalid');
        }
        
        if(this._journalEntryIndex.has(journalEntry.primaryKey)) {
            throw new Error(`The JournalEntry ${journalEntry.primaryKey} already exists`);
        }
        
        this._journalEntryIndex.add(journalEntry.primaryKey);
        saveData(journalEntry);
        fireEvent(this, new JournalEntryAdded(journalEntry));
    }

    /**
     * Deletes a journal entry
     * @param primaryKey The primaryKey of the JournalEntry you wish to delete.
     */
    deleteJournalEntry(primaryKey: string) {        
        if(!this._journalEntryIndex.delete(primaryKey)) {
            throw new Error(`The JournalEntry ${primaryKey} does not exist`);
        }
        const journalEntry = getData(JournalEntry, primaryKey);
        deleteObject(journalEntry);

        //Note: All Endpoint method are executed transactionally so even though this may appear to cause
        // dirty updates (where the index is updated when the deleteObject fails), it does not because the 
        // transaction will rollback in the case of failure.
    }

    /**
     * Gets all journal entries
     * @param username The username of the user to get the journal entries for.
     * @returns An array of all journal entries
     */
    getJournalEntries(): JournalEntry[] {
        let journalEntries: JournalEntry[] = [];
        for (const pk of this._journalEntryIndex) {
            journalEntries.push(getData(JournalEntry, pk));
        }
        return journalEntries;
    }
}