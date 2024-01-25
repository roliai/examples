import React, {useState} from 'react';
import {ExerciseTrackerEndpoint} from 'exercise-tracker-service';
import {useRoliClient} from "roli-react";
import {Navigate} from "react-router-dom";

export default function CreateUser() {
    const [username, setUsername] = useState<string>('');
    const [redirect, setRedirect] = useState<boolean>(false);
    const roli = useRoliClient();
    const exerciseTracker = roli.getEndpoint(ExerciseTrackerEndpoint, "default");

    async function onSubmit(e: any) {
        e.preventDefault();

        try {
            await exerciseTracker.addUser(username!);
            console.log(`User ${username} added`);
            setRedirect(true);
        } catch (error) {
            console.error(error);
        }
    }

    if (redirect) {
        return (<Navigate replace to={`/create`}/>);
    }

    return (
        <div>
            <h3>Create New User</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username: </label>
                    <input type="text"
                           required
                           className="form-control"
                           value={username}
                           onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input type="submit" value="Create User" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}