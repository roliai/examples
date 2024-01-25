import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Navbar from "./components/navbar"
import {ExercisesList} from "./pages/exercises-list";
import {EditExercise} from "./pages/edit-exercise";
import CreateExercise from "./pages/create-exercise";
import CreateUser from "./pages/create-user";

import {RoliProvider} from 'roli-react';
import {createRoliClient} from "exercise-tracker-service";

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
