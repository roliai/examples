import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {Exercise, ExerciseTrackerEndpoint, User} from "exercise-tracker-service";
import {useRoliClient} from "exercise-tracker-service/react";
import {Navigate} from "react-router-dom";
import {SelectedUser, UserSelect} from "../components/user-select";

export default function CreateExercise() {
    const [selectedUser, setSelectedUser] = useState<SelectedUser>();
    const [users, setUsers] = useState<User[]>([]);
    const [redirect, setRedirect] = useState(false);
    const [description, setDescription] = useState<string>();
    const [duration, setDuration] = useState<number>();
    const [date, setDate] = useState<Date>();
    const roli = useRoliClient();

    // Get a reference to the endpoint
    //  - Just getting the endpoint doesn't make a network call so this is safe to do
    //  right here in the component's body.
    const exerciseTracker = roli.getEndpoint(ExerciseTrackerEndpoint, "default");

    useEffect(() => {
        // Get the user's list from the endpoint and set the state
        exerciseTracker.getUsers()
            .then((knownUsers: User[]) => {
                if (knownUsers) {
                    setUsers(knownUsers);
                    setSelectedUser({selected: knownUsers[0]});
                } else {
                    console.error("No users found");
                }
            }).catch(reason => {
                console.error(reason);
            }
        );
    }, [])

    async function handleOnSubmit(e: any) {
        e.preventDefault();

        try {
            //Create the exercise object locally (could be done in the endpoint too, if you had a need).
            const exercise = new Exercise(selectedUser?.selected!, description!, duration!, date!);

            //Pass the exercise to the endpoint
            await exerciseTracker.addExercise(exercise);

            console.log(`Exercise ${exercise.primaryKey} added`);

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
            <h3>Create New Exercise Log</h3>
            <form onSubmit={handleOnSubmit}>
                <div className="form-group">
                    <label>Username: </label>
                    <UserSelect users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                </div>
                <div className="form-group">
                    <label>Description: </label>
                    <input type="text"
                           required
                           className="form-control"
                           value={description ?? ""}
                           onChange={(e:any) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Duration (in minutes): </label>
                    <input
                        type="number"
                        required
                        min={1}
                        className="form-control"
                        value={duration ?? ""}
                        onChange={(e:any) => setDuration(Number(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label>Date: </label>
                    <div>
                        <DatePicker
                            required
                            selected={date}
                            onChange={(d) => setDate(d!)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <input type="submit" value="Create Exercise Log" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}
