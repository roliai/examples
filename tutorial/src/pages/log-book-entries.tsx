import {useEffect, useState} from 'react';

import {useRoliClient} from "roli-react";
import {Entry, LogBook} from 'log-book-service';

export default function LogBookEntries() {    

    const roli = useRoliClient();
    const logBook = roli.getEndpoint(LogBook, 'default');
    const [entries, setEntries] = useState<Entry[]>([]);
    
    useEffect(() => {
        
        //12

    },[]);

    return (
        <div>
            <h4>Log Book Entries</h4>
            <table className="table">
                <thead className="thead-light">
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                
                {entries.map(value => {
                    return <EntryItem entry={value} key={value.primaryKey}/>;
                })}

                </tbody>
            </table>
        </div>
    );
}

interface EntryItemProps {
    entry: Entry
}

function EntryItem(props: EntryItemProps) {
    return (
        <tr>
            <td>{props.entry.firstName}</td>
            <td>{props.entry.date.toString().substring(0, 10)}</td>
        </tr>
    );
}