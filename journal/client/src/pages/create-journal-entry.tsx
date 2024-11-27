import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {JournalEntry, JournalApi} from "journal-service";
import {useRoliClient} from "journal-service/react";
import {Navigate} from "react-router-dom";

export default function CreateJournalEntry() {
    const [redirect, setRedirect] = useState(false);
    const [text, setText] = useState<string>();
    const [date, setDate] = useState<Date>();
    const roli = useRoliClient();

    // Get a reference to the api object
    //  - Just getting the object doesn't make a network call so this is safe to do
    //  right here in the component's body.
    const journalApi = roli.getEndpoint(JournalApi, "default");

    async function handleOnSubmit(e: any) {
        e.preventDefault();

        try {
            //Create the JournalEntry object locally (could be done in the api too, if you had a need).
            const journalEntry = new JournalEntry(text!, date!);

            //Add the JournalEntry by passing it to the api
            await journalApi.addJournalEntry(journalEntry);

            console.log(`JournalEntry ${journalEntry.primaryKey} added`);

            setRedirect(true);
        } catch (error) {
            console.error(error);
        }
    }

    if(redirect) {
        return (<Navigate replace to="/"/>);
    }
    
    return (
        <div>
            <h3>Create New Journal Entry</h3>
            <form onSubmit={handleOnSubmit}>
                <div className="form-group">
                    <label>Text: </label>
                    <input type="text"
                           required
                           className="form-control"
                           value={text ?? ""}
                           onChange={(e:any) => setText(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Date: </label>
                    <div>
                        {/** See https://github.com/Hacker0x01/react-datepicker/issues/4039 */}
                        {/* @ts-ignore */}
                        <DatePicker
                            required
                            selected={date}
                            onChange={(d: any) => setDate(d!)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <input type="submit" value="Create Journal Entry" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}
