import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Address_Checker extends Component {

    render() {

        console.log('address chacker address:', localStorage.getItem('address'))
        return (
            <div className='feature-wrapper'>
                <p>Address checker placeholder</p>
                <p>Your address is: {localStorage.getItem('address')}</p>
                    <Link to='/availability_checker' className='link-btn'>Click for Availability</Link>
            </div>
        )
    }
}

export default Address_Checker;