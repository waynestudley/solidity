import React, { Component } from 'react';
import SecondaryHeader from './secondary_header';
import { withGlobalState } from 'react-globally';
import axios from 'axios';
import { Formik } from 'formik';
import db from "./broadbandDatabase";
import {insertLog} from "../../monitor";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            postcode: '',
            postcodeList: [],
            data: [],
            mediaProvider: [],
            mediaMarketingCategory: [],
            targettedPostcodes: [],
            btTargets: [],
            btTarget: false,
            activeLookup: false
        };
        this.targets = []
        this.LogoPath = process.env.PUBLIC_URL;
        this.props.setGlobalState(() => ({
            btSpeed: null
        }))

    }

    componentDidMount() {
        // Clear the customer information from db
        db.customer.clear();
        db.customerServices.clear();
        db.package.clear();
        db.usage.clear();
        db.devices.clear();

        let thisSource = ''
        if(this.props.globalState.isBt) {
            thisSource = 'BT'
        } else if (this.props.globalState.isWeb) {
            thisSource = 'WS'
        } else {
            thisSource = 'CC'
        }

        // If not BT get promotional packages
        if (!this.props.globalState.isBt) {
            console.log(this.props.globalState.jwtAuth)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.post(process.env.REACT_APP_API + 'Media/GetPromotionalPackageList',
            { "source": thisSource })
                .then(response => {
                    this.setState({ data: response.data })
                })
                .catch(err => {
                    insertLog(3, "Media/GetPromotionalPackageList", err );
                })
            }

        // If BT get outcomes for combobox
        if (this.props.globalState.outcomeList === null && this.props.globalState.isBt) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.get(process.env.REACT_APP_API + 'LeadOutcome/GetAll')
            .then(response => {
                this.props.setGlobalState(() => ({
                    outcomeList: response.data
                }))
            })
            .catch(err => {
                insertLog(3, "LeadOutcome/GetAll", err );
            })
        }
    }    

    selectPostcode(pc) {
        this.setState({ address: pc })
        this.lookupPostcode(pc)
    }

    selectAddress(id) {
        if (this.props.globalState.isBt) {
            this.props.setGlobalState(() => ({
                isBtJourney: true,
                btSpeed: id.Speed
            }))
        } else { this.props.setGlobalState(() => ({
                isBtJourney: false
            }))
        }

        db.open().then(async () => {
            await db.customer.put({
                Address: JSON.stringify(id),
                Address1: id.Address1,
                Address2: id.Address2,
                Address3: id.Address3,
                Postcode: id.Postcode,
                Town: id.Town,
                County: id.County,
            },0).then(() => {
                window.location.hash = "/availability_checker"
            })
        })
    }

    handleChange = (e) => {
        let pc = e.target.value.toLowerCase().trim().replace(" ","")
        this.setState({ postcodeList: [],
            postcode: pc,
            btTargets: []
        })
        this.props.setGlobalState(() => ({
            isBtJourney: false
        }))
        this.setState({ address: e.target.value });
        if ( /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]{0,1}\s*\d{0,1}[A-Za-z]{2}_{0,2}$/i.test(e.target.value)) {
            this.lookupPostcode(pc.toUpperCase())
        }
    }

    async lookupPostcode(postcode) {       
        try {
            const response = await axios.get(
                process.env.REACT_APP_API + 'Address/PostcodeLookupBtGbg?postcode=' + postcode
            )
            if (response.status === 200 && !response.data['ErrorCode'] && response.data.length > 1) {
                this.setState({ postcodeList: response.data })
            } else {
                console.log("lookupPostcode : failed")
            }
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        this.featurePackage = this.state.data.slice(0, 4).map((item) => (
            <div className='card-wrapper' key={item.Id}>
                <div className="card-header-wrapper">{item.MediaMarketingCategory.MarketingCategory}</div>
                <div className="featured-package-details">
                    <div className="logo-wrapper"><img src={this.LogoPath + '/imagesPackage/' + item.MediaProvider.ProviderLogo} alt='Best Package Logo' /></div>
                    <div className="featured-package-name">{item.PackageName}</div>
                </div>
                <div className="featured-contract-details">
                    <strong>&pound;{item.MonthlyCost}</strong> a month for {item.FixedPriceMonths}&nbsp;months<br />
                    <span>Average download speeds of {item.MaxSpeed}&nbsp;Mb/s</span>
                </div>
            </div>
        ));

        return (
            <div>
                <div className="homepage-top-wrapper">
                    <SecondaryHeader />
                    <section className='feature'>
                        <h1 className='banner_text'>Get the best <span>broadband, phone<br />and TV</span> packages for you and your family</h1>
                        <h2 className='banner_text_bottom'>Quick, free and impartial comparison service</h2>
                        <Formik
                            validate={() => {
                                const errors = {};
                                if ( !/^[A-Za-z]{1,2}\d{1,2}[A-Za-z]{0,1}\s*\d{0,1}[A-Za-z]{2}_{0,2}$/i.test(this.state.postcode)) {
                                    errors.postcode = "You must supply a valid UK postcode";
                                }
                                return errors;
                            }}
                        >
                            {props => {
                                const {
                                    touched,
                                    errors,
                                    handleBlur,
                                } = props;
                                return (
                                    <form className='home-form'>
                                        <label>Your <i>full</i> postcode:</label>
                                        <input 
                                            id="postcode"
                                            name='postcode'
                                            type="text"
                                            maxLength='8'
                                            value={this.state.address}
                                            onChange={this.handleChange}
                                            onBlur={handleBlur}
                                            autoComplete='off'
                                            className='postcode-lookup'
                                            style={{
                                                borderColor:
                                                    props.errors.postcode && props.touched.postcode && "tomato"
                                            }}
                                            onKeyPress={e => { if (e.key === 'Enter') e.preventDefault()}}
                                        />
                                      
                                        {errors.postcode && touched.postcode && (
                                            <div className="validation_text">{errors.postcode}</div>
                                        )} 
                                        <div className={'address_wrapper raised-bordered'}>
                                            { this.state.postcodeList && 
                                            this.state.postcodeList.map((address, index) => (
                                                <p
                                                    key={'addressId' + index}
                                                    onClick={() => this.selectAddress(address)}
                                                    // className={`lookup_data ${this.props.globalState.isBt ? 'active' : ''}`}
                                                    className={`lookup_data ${this.props.globalState.isBt && address.Speed ? 'active' : ''}`}
                                                >
                                                    { address.Address1 + " " + address.Address2 + (this.props.globalState.isBt && address.Speed ? " - up to " + address.Speed + 'Mbps' : '') }
                                                    {/* { address.Address1 + " " + address.Address2 } */}
                                                </p>
                                            )) }
                                        </div>
                                    </form>
                                );
                            }}
                        </Formik>
                    </section>
                </div>
                { ! this.props.globalState.isBt &&
                <div className="feature-wrapper">
                    <div className='homepage-cards-wrapper'>{this.featurePackage}</div>
                </div>
                }
            </div>
        );
    }
}
export default withGlobalState(Homepage);