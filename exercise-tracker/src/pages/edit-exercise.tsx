import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import {useParams} from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import {Exercise, ExerciseTrackerEndpoint, User} from 'exercise-tracker-service';
import {useRoliClient} from "roli-react";
import {Navigate} from 'react-router-dom';
import {SelectedUser, UserSelect} from "../components/user-select";

export function EditExercise() {
    const {id} = useParams();
    if (!id) {
        console.error("id is required");
    }

    const [selectedUser, setSelectedUser] = useState<SelectedUser>();
    const [exercise, setExercise] = useState<Exercise>();
    const [description, setDescription] = useState<string>();
    const [duration, setDuration] = useState<number>();
    const [date, setDate] = useState<Date>();
    const [users, setUsers] = useState<User[]>();
    const [redirect, setRedirect] = useState<boolean>(false);

    const roli = useRoliClient();
    const exerciseTracker = roli.getEndpoint(ExerciseTrackerEndpoint, 'default');

    useEffect(() => {
        //Get the exercise object instance by its primary key that was passed in via props
        roli.getData(Exercise, id!).then((value: Exercise | null) => {
            if (!value) {
                console.error("Exercise not found");
            } else {
                setExercise(value);
                setSelectedUser({selected: value.user});
                setDescription(value.description);
                setDuration(value.duration);
                setDate(value.date);
            }
        }).catch(reason => {
            console.error(reason);
        });

        //Ask the endpoint to get the full list of users
        exerciseTracker.getUsers().then((value: User[] | null) => {
            if (value) {
                setUsers(value);
            } else {
                console.error("No users defined");
            }
        }).catch(reason => {
            console.error(reason);
        })
    }, []);

    async function onSubmit(e: any) {
        e.preventDefault();

        try {
            if (!exercise) {
                console.error("no exercise selected");
                return;
            }

            // update the existing exercise's fields
            exercise.user = selectedUser?.selected!;
            exercise.description = description!;
            exercise.duration = duration!;
            exercise.date = date!;

            //Save the exercise
            await roli.saveData(exercise);

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
                    <label>Username: </label>
                    <UserSelect users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                </div>
                <div className="form-group">
                    <label>Description: </label>
                    <input type="text"
                           required
                           className="form-control"
                           value={description}
                           onChange={(e: any) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Duration (in minutes): </label>
                    <input
                        type="number"
                        required
                        min={1}
                        className="form-control"
                        value={duration}
                        onChange={(e: any) => setDuration(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Date: </label>
                    <div>
                        <DatePicker
                            required
                            selected={date}
                            onChange={(e: any) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <input type="submit" value="Edit Exercise Log" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}