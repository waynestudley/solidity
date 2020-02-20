import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withGlobalState } from 'react-globally';
import { openModal, closeModal } from './helper';
import ReactGA from 'react-ga';

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
        if (performance.navigation.type == 1) {
            window.location = "/";
        }
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
                                <a href='#/start'>New&nbsp;Quote</a>
                            }
                            {this.props.globalState.isSupercard &&
                                <a href='#'  onClick={(e) => openModal(e, 'modalSuperCard')}>Free&nbsp;SuperCard</a>
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

                {/*modal window*/}
                <div id='modalSuperCard' className='modal-window'>
                    <a href='#' className='background-close' onClick={(e) => closeModal(e, 'modalSuperCard')} />
                    <div>
                        <a href='#' title='CloseButton' className='modal-close' onClick={(e) => closeModal(e, 'modalSuperCard')} />
                        <div className=''>
                            <div className='supercard-wrapper'>
                                <h2><strong>Free SuperCard</strong> - worth over &pound;2000 when you switch with us today</h2>
                                <p>With 12 months free Supercard membership, you can enjoy discounts and genuine freebies from some of the UK’s best-known brands.</p>
                                <div className='brand-logos-wrapper'>
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/alton-towers.jpg'} alt='alton towers' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/argos.jpg'} alt='argos' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/currys.jpg'} alt='currys' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/gap.jpg'} alt='gap' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/halfords.jpg'} alt='halfords' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/house-of-fraser.jpg'} alt='house of fraser' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/merlin-entertainment.jpg'} alt='merlin entertainment' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/pizza-express.jpg'} alt='pizza express' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/starbucks.jpg'} alt='starbucks' />
                                    <img src={process.env.PUBLIC_URL + './imagesPackage/Supercard/zizzi.jpg'} alt='zizzi' />
                                </div>
                                <div className='supercard-list-wrapper'>
                                    <ul>
                                        <li>Free 12 month Dining card - Gourmet Society</li>
                                        <li>4% discount at Tesco</li>
                                        <li>Up to 40% off cinema tickets at Vue, Odeon, Showcase and Empire</li>
                                        <li>Free and discounted pamper treatments</li>
                                        <li>12 months free ZugarZnap gadget insurance up to &pound;1,000</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*end modal window*/}
            </div>
        );
    }
}

export default withGlobalState(SecondaryHeader);