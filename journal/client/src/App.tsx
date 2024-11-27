import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Navbar from "./components/navbar.js"
import {JournalEntryList} from "./pages/journal-entry-list.js";
import {EditJournalEntry} from "./pages/edit-journal-entry.js";
import CreateJournalEntry from "./pages/create-journal-entry.js";

import {createRoliClient} from "journal-service";
import {RoliProvider} from "journal-service/react";
import {key} from "journal-service/key";

// Create your roli client at the app-level, so it retains its state whilst the user is on the site.
const roliClient = createRoliClient(key);

function App() {
    return (
        <RoliProvider client={roliClient}>
            <BrowserRouter>
                <div className="container">
                    <Navbar/>
                    <br/>
                    <Routes>
                        <Route index path="/" element={<JournalEntryList/>}/>
                        <Route path="/edit/:id" element={<EditJournalEntry/>}/>
                        <Route path="/create" element={<CreateJournalEntry/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </RoliProvider>
    );
}

export default App;
