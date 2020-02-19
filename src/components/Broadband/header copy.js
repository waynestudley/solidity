



import React, { Component } from 'react';
import Logo from '../../images/mex-logo.png';

export default class MainHeader extends Component {

    render() {
        return (
            <div id='headerContainer' className='header-container'>
                <header className='wrapper'>
                    <img src={Logo} alt='Logo' className='shared-logo' />
                </header>
            </div>
        )
    }
}