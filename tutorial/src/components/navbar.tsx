import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand">
            <Link to="/" className="navbar-brand">&nbsp;&nbsp;Log Book</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                        <Link to="/" className="nav-link">Entries</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/sign" className="nav-link">Sign</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}