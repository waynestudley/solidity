import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Breadcrumb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: true,
            future: true
        };
    }

    render() {
        return (
            <div className='breadcrumb-wrapper'>
                <ul>
                    <li className={this.state.current ? 'current' : null}><Link to='/availability_checker'><span>Current provider</span></Link></li>
                    <li className={this.state.future ? 'future' : null}><Link to='/usage_checker'><span>Package Type</span></Link></li>
                    <li><Link to='/device_checker'><span>Your Devices</span></Link></li>
                    <li><Link to='/payment_checker'><span>Current cost</span></Link></li>
                    <li><Link to='result'><span>Quote</span></Link></li>
                    <li><Link to='package_summary'><span>Package summary</span></Link></li>
                    <li><Link to='/application_form'><span>Apply</span></Link></li>
                </ul>
            </div>
        );
    };
}