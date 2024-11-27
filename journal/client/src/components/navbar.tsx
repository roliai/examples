import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand">
            <Link to="/" className="navbar-brand">&nbsp;&nbsp;Journal</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                        <Link to="/" className="nav-link">Journal Entries</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/create" className="nav-link">Create Journal Entry</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}