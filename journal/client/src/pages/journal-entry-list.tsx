import React, {useEffect, useState, useReducer} from 'react';
import {Link} from 'react-router-dom';

import {useRoliClient} from 'journal-service/react';
import {JournalEntry, JournalEntryAdded, JournalApi, DataUpdatedEvent} from 'journal-service';

interface JournalEntryItemProps {
    journalEntry: JournalEntry,
    journalApi: JournalApi
}

function JournalEntryItem(props: JournalEntryItemProps) {
    return (
        <tr>
            <td>{props.journalEntry.text}</td>
            <td>{props.journalEntry.date.toString().substring(0, 10)}</td>
            <td>
                <Link to={"/edit/" + props.journalEntry.primaryKey}>edit</Link> | <a href="#" onClick={
                (e) => {
                    props.journalApi.deleteJournalEntry(props.journalEntry.primaryKey).catch(reason => {
                        console.error(reason);
                    })
                }
            }>delete</a>
            </td>
        </tr>
    );
}

export function JournalEntryList() {
    const roli = useRoliClient();

    const journalApi = roli.getEndpoint(JournalApi, 'default');

    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [intervalHandle, setIntervalHandle] = useState();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    function onJournalEntryUpdate(e: DataUpdatedEvent<JournalEntry>) {
        if (e.deleted) {
            //When it's been deleted, remove it from the state
            setJournalEntries(prev => prev.filter(ex => ex.primaryKey !== e.target.primaryKey));
            console.log(`Journal entry ${e.target.primaryKey} deleted`);
        } else {
            //When it's been updated, trigger a re-render.
            forceUpdate();
        }
    }

    function onJournalEntryAdded(msg: JournalEntryAdded) {
        const journalEntry = msg.journalEntry;

        // add the new journal entry to the list of known journal entries
        setJournalEntries(prev => [...prev, journalEntry]);

        // tell Roli we want to receive all updates made by other clients to the journal entry object
        roli.subscribeUpdates(journalEntry)
            .catch((reason: any) => {
                console.error(reason)
            });

        // attach a callback for when the newly added exercise is updated by other clients or endpoints.
        roli.addUpdateListener(journalEntry, onJournalEntryUpdate);
    }

    useEffect(() => {
        // tell Roli to send us all JournalEntryAdded events sent from our api
        roli.subscribeEvent(journalApi, JournalEntryAdded, onJournalEntryAdded)
            .catch((reason: any) => console.error(reason));

        //Get all the journal entries from the api
        journalApi.getJournalEntries()
            .then((journalEntries_: JournalEntry[]) => {
                setJournalEntries(journalEntries_);
                if (journalEntries_ && journalEntries_.length > 0) {
                    // tell Roli to keep them updated
                    roli.subscribeUpdates(journalEntries_)
                        .then(() => {
                            // attach a listener when they're updated
                            roli.addUpdateListener(journalEntries_, onJournalEntryUpdate);
                        })
                }
            }).catch((reason: any) => {
            console.error(reason)
        });

        return () => {
            //stop listening for changes when we leave this page
            if (journalEntries && journalEntries.length > 0) {
                roli.unsubscribeUpdates(journalEntries).catch((reason:any) => {
                    console.error(reason);
                });
            }

            //stop receiving ExerciseAdded events
            roli.unsubscribeEvent(journalApi, JournalEntryAdded).catch((reason:any) => {
                console.error(reason);
            });

            clearInterval(intervalHandle);
        };
    }, []);

    return (
        <div>
            <h3>My Journal Entries</h3>
            <table className="table">
                <thead className="thead-light">
                <tr>
                    <th>Text</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {journalEntries.map(journalEntry_ => {
                    return <JournalEntryItem journalEntry={journalEntry_} journalApi={journalApi} key={journalEntry_.primaryKey}/>;
                })}
                </tbody>
            </table>
        </div>
    );
}
