import React, { Component } from 'react';

export default class ProductSelection extends Component {

    render() {
        return (
            <div>

            <div className='aligner'>
                    <div className='aligner-item'>

                    <div className='all-products-wrapper'>

                        <form id='ProductSelect' action='/gaselectricity/agentstart' method='get'>
                            <input type='hidden' name='ccid' value='21' />
                                <div className='text-center'>
                                    <div className='icon-wrapper energy-flash-icon'></div>
                                    <p><button type='submit' className='small'><strong>Energy</strong></button></p>
                                </div>
                        </form>

                            <div className='text-center'>
                                <div className='icon-wrapper broadband-login-icon'></div>
                                <p><button type='submit' className='small'><strong>Broadband</strong></button></p>
                            </div>

                            <form id='ProductSelect' action='/FinanceLead' method='get'>
                                <div className='text-center'>
                                    <div className='icon-wrapper uk-finance-icon'></div>
                                    <p><button type='submit' className='small'><strong>Finance Lead Form</strong></button></p>
                                </div>
                            </form>

                        </div>

                    </div>
             </div>

            </div>
        )
    }
}