import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import {useParams} from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import {JournalEntry, JournalApi} from 'journal-service';
import {useRoliClient} from 'journal-service/react';
import {Navigate} from 'react-router-dom';

export function EditJournalEntry() {
    const {id} = useParams();
    if (!id) {
        console.error("id is required");
    }

    const [journalEntry, setJournalEntry] = useState<JournalEntry>();
    const [text, setText] = useState<string>();
    const [date, setDate] = useState<Date>();
    const [redirect, setRedirect] = useState<boolean>(false);

    const roli = useRoliClient();
    const journalApi = roli.getEndpoint(JournalApi, 'default');

    useEffect(() => {
        //Get the journay entry object instance by its primary key that was passed in via props
        roli.getData(JournalEntry, id!).then((value: JournalEntry | null) => {
            if (!value) {
                console.error("Journal entry not found");
            } else {
                setJournalEntry(value);
                setText(value.text);
                setDate(value.date);
            }
        }).catch((reason: any) => {
            console.error(reason);
        });
    }, []);

    async function onSubmit(e: any) {
        e.preventDefault();

        try {
            if (!journalEntry) {
                console.error("no journal entry selected");
                return;
            }

            // update the existing exercise's fields
            journalEntry.text = text!;
            journalEntry.date = date!;

            //Save the journal entry
            await roli.saveData(journalEntry);

            setRedirect(true);
        } catch (error) {
            console.error(error);
        }
    }

    if (redirect) {
        return (<Navigate replace to="/"/>);
    }

    return (
        <div>
            <h3>Edit Exercise Log</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Text: </label>
                    <input type="text"
                           required
                           className="form-control"
                           value={text}
                           onChange={(e: any) => setText(e.target.value)}
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
                            onChange={(e: any) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <input type="submit" value="Edit Journal Entry" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}