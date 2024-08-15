import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Navbar from "./components/navbar.js"
import {ExercisesList} from "./pages/exercises-list.js";
import {EditExercise} from "./pages/edit-exercise.js";
import CreateExercise from "./pages/create-exercise.js";
import CreateUser from "./pages/create-user.js";

import {createRoliClient} from "exercise-tracker-service";
import {RoliProvider} from "exercise-tracker-service/react";

// Create your roli client at the app-level, so it retains its state whilst the user is on the site.
const roliClient = createRoliClient();

function App() {
    return (
        <RoliProvider client={roliClient}>
            <BrowserRouter>
                <div className="container">
                    <Navbar/>
                    <br/>
                    <Routes>
                        <Route index path="/" element={<ExercisesList/>}/>
                        <Route path="/edit/:id" element={<EditExercise/>}/>
                        <Route path="/create" element={<CreateExercise/>}/>
                        <Route path="/user" element={<CreateUser/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </RoliProvider>
    );
}

export default App;
