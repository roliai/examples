import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar"
import LogBookEntries from "./pages/log-book-entries";
import SignLogBook from "./pages/sign-log-book";
import {RoliProvider} from 'roli-react';
import {createRoliClient} from "log-book-service";

const roliClient = createRoliClient();

function App() {
    return (        
        <RoliProvider client={roliClient}>
            <BrowserRouter>
                <div className="container">
                    <Navbar/>
                    <br/>
                    <Routes>
                        <Route index path="/" element={<LogBookEntries/>}/>
                        <Route path="/sign" element={<SignLogBook/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </RoliProvider>
    );
}

export default App;
