import React, {useEffect, useState, useReducer} from 'react';
import {Link} from 'react-router-dom';

import {DataUpdatedEvent} from 'roli-client';
import {useRoliClient} from "roli-react";
import {Exercise, ExerciseAdded, ExerciseTrackerEndpoint} from 'exercise-tracker-service';

interface ExerciseItemProps {
    exercise: Exercise,
    exerciseTracker: ExerciseTrackerEndpoint
}

function ExerciseItem(props: ExerciseItemProps) {
    return (
        <tr>
            <td>{props.exercise.user.username}</td>
            <td>{props.exercise.description}</td>
            <td>{props.exercise.duration} minutes</td>
            <td>{props.exercise.date.toString().substring(0, 10)}</td>
            <td>
                <Link to={"/edit/" + props.exercise.primaryKey}>edit</Link> | <a href="#" onClick={
                (e) => {
                    props.exerciseTracker.deleteExercise(props.exercise.primaryKey).catch(reason => {
                        console.error(reason);
                    })
                }
            }>delete</a>
            </td>
        </tr>
    );
}

export function ExercisesList() {
    const roli = useRoliClient();

    const exerciseTracker = roli.getEndpoint(ExerciseTrackerEndpoint, 'default');

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [intervalHandle, setIntervalHandle] = useState();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    function onExerciseUpdate(e: DataUpdatedEvent<Exercise>) {
        if (e.deleted) {
            //When it's been deleted, remove it from the state
            setExercises(prev => prev.filter(ex => ex.primaryKey !== e.target.primaryKey));
            console.log(`Exercise ${e.target.primaryKey} deleted`);
        } else {
            //When it's been updated, trigger a re-render.
            forceUpdate();
        }
    }

    function onExerciseAdded(msg: ExerciseAdded) {
        const exercise = msg.exercise;

        // add the new exercise to the list of known exercises
        setExercises(prev => [...prev, exercise]);

        // tell Roli we want to receive all updates made by other clients to the exercise object
        roli.subscribeUpdates(exercise)
            .catch((reason: any) => {
                console.error(reason)
            });

        // attach a callback for when the newly added exercise is updated by other clients or endpoints.
        roli.addUpdateListener(exercise, onExerciseUpdate);
    }

    useEffect(() => {
        // tell Roli to send us all ExerciseAdded events sent from our endpoint
        roli.subscribeEvent(exerciseTracker, ExerciseAdded, onExerciseAdded)
            .catch((reason: any) => console.error(reason));

        //Get all the exercises from the endpoint
        exerciseTracker.getExercises()
            .then(exercises_ => {
                setExercises(exercises_);
                if (exercises_ && exercises_.length > 0) {
                    // tell Roli to keep them updated
                    roli.subscribeUpdates(exercises_)
                        .then(() => {
                            // attach a listener when they're updated
                            roli.addUpdateListener(exercises_, onExerciseUpdate);
                        })
                }
            }).catch((reason: any) => {
            console.error(reason)
        });

        return () => {
            //stop listening for changes when we leave this page
            if (exercises && exercises.length > 0) {
                roli.unsubscribeUpdates(exercises).catch((reason:any) => {
                    console.error(reason);
                });
            }
            //stop receiving ExerciseAdded events
            roli.unsubscribeEvent(exerciseTracker, ExerciseAdded).catch((reason:any) => {
                console.error(reason);
            });

            clearInterval(intervalHandle);
        };
    }, []);

    return (
        <div>
            <h3>Logged Exercises</h3>
            <table className="table">
                <thead className="thead-light">
                <tr>
                    <th>Username</th>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {exercises.map(exercise_ => {
                    return <ExerciseItem exercise={exercise_} exerciseTracker={exerciseTracker} key={exercise_.primaryKey}/>;
                })}
                </tbody>
            </table>
        </div>
    );
}
