import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Terms = ({ location }) => {
    const { state = {} } = location;
    const { modal } = state;

    return (
        <div className={modal ? "modal" : undefined}>
            {modal && <Link to='/'>Close</Link>}
        </div>
    );
};

export default Terms;