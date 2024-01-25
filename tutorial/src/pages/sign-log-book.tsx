import {useState} from 'react';
import {Navigate} from "react-router-dom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

//9

export default function SignLogBook() {
    const [name, setName] = useState<string>();
    const [date, setDate] = useState<Date>();
    const [redirect, setRedirect] = useState<Boolean>(false);

    //10

    function handleOnSubmit(e: any) {
        e.preventDefault();

        //11
    }

    if(redirect) {
        return (<Navigate replace to="/"/>);
    }

    return (
        <div>
            <h4>Sign the Log Book</h4>
            <form onSubmit={handleOnSubmit}>
                <div className="form-group">
                    <label>Name: </label>
                    <input type="text"
                           required
                           className="form-control"
                           value={name ?? ""}
                           onChange={(e:any) => setName(e.target.value)}
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
                    <input type="submit" value="Sign" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}
