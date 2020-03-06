import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withGlobalState } from 'react-globally';
import { openModal, closeModal } from './helper';
import ReactGA from 'react-ga';
import { initLog, insertLog, getSession } from "../../monitor";

class SecondaryHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
        this.LogoPath = process.env.PUBLIC_URL;
        var pageUrl = window.location.pathname + window.location.search + window.location.hash;
        pageUrl = pageUrl.replace("/#", "");
        ReactGA.initialize('UA-9753981-19');
        ReactGA.pageview(pageUrl);
    }

    Logout(e) {
        window.location = "/";
    }

    componentDidMount() {
        if (performance.navigation.type === 1) {
            window.location = "/";
        }
    }
    resetSession(){
        initLog();
        insertLog(1, "ReInit: Broadband", "SessionId:"+getSession() );
    }
    render() {
        return (
            <div>
                <div className='agentName-presenter-super-wrapper'>
                    <div className='agentName-presenter-wrapper'>
                        <div className='top-button-wrapper'>
                            { this.props.globalState.isMultiJourney && 
                                <a href='https://portal.simplyswitch.com/'>New&nbsp;Quote</a>
                            }
                            { (!this.props.globalState.isBtJourney || this.props.isShowNewQuote === true) && !this.props.globalState.isMultiJourney && 
                                <a href='#/start' onClick={this.resetSession}>New&nbsp;Quote</a>
                            }
                        </div>
                        <div className='top-button-wrapper'>
                            {!this.props.globalState.isWeb &&
                                <Link to='/application_list' className='agent-home'>{this.state.username}</Link>
                            }
                            {!this.props.globalState.isWeb &&
                                <a href="" onClick={(e) => this.Logout(e)}> Logout</a>
                            }
                        </div>
                    </div>
                </div>
                <div className='header-container secondary'>
                    <header className='wrapper'>
                        {this.props.globalState.isBtJourney && !this.props.globalState.isWeb &&
                            <img src={this.LogoPath + '/imagesPackage/mex-logo-bt.png'} alt='Logo' className='logoMain'/>
                        }
                        {!this.props.globalState.isWeb && !this.props.globalState.isBtJourney &&
                            <img src={this.LogoPath + '/imagesPackage/mex-logo.png'} alt='Logo' className='logoMain'/>
                        }

                        {(this.props.globalState.journeyTheme==='mex' || this.props.globalState.journeyTheme==='multi') && this.props.globalState.isWeb &&
                            <img src={this.LogoPath + '/imagesPackage/mex-logo.png'} alt='Logo' className='logoMain'/>
                        }
                        {this.props.globalState.journeyTheme==='ss' && this.props.globalState.isWeb &&
                            <a href='http://www.simplyswitch.com'>
                                <img src={this.LogoPath + '/imagesPackage/simplyswitchlogo.png'} alt='Logo' className='logoMain'/>
                            </a>
                        }
                        <div className='contact'>
                            <p className='phone'>
                                <span>Call us free now on</span>
                                <span className='phone-number'>0800 011 1395</span>
                                <span>to talk to our broadband experts</span>
                            </p>
                        </div>
                    </header>
                </div>
            </div>
        );
    }
}

export default withGlobalState(SecondaryHeader);