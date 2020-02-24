import React, { Component } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Formik, Form } from 'formik'
import axios from 'axios'
import ddMandate from '../../images/dd-logo.svg'
import { withGlobalState } from 'react-globally'
import sslSecure from '../../images/ssl-icon.svg'
import SecondaryHeader from './secondary_header'
import { openModal, closeModal } from './helper'
import { Link } from 'react-router-dom'
import Outcome from './outcome'
import ClipLoader from 'react-spinners/ClipLoader'
import db from "./broadbandDatabase"

class ApplicationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trimmedDataURL: null,
            valTest: false,
            data: '',
            media_provider: '',
            Postcode: '',
            Address1: null,
            CurrentProviderId: '',
            CurrentProviderMonths: '',
            Broadband: '',
            Phone: '',
            TV: '',
            Entertainment: '',
            Sports: '',
            Movies: '',
            Netflix: '',
            Prime: '',
            NowTV: '',
            CurrentMonthlyPay: '',
            HighUse: '',
            MediumUse: '',
            LowUse: '',
            showResults: false,
            bestPackage: [],
            bestPackageProvider: [],
            bestPackageId: '',
            Aerial: '',
            CanHaveVirgin: '',
            toggleFeatures: '0',
            suitablePackages: true,
            SuperCard: false,
            isSubmitted: false,
        }
        this.LogoPath = process.env.PUBLIC_URL
        this.trim = this.trim.bind(this)
    }

    componentWillMount() {
        let customer, customerServices, packages, userAgent, currentPay
        db.open().then(async function(){
            customer = await db.customer.toArray()
            customer = customer[0]
            customerServices = await db.customerServices.toArray()
            customerServices = customerServices[0]
            packages = await db.package.toArray()
            packages = packages[0]
            userAgent = await db.userAgent.toArray()
            userAgent = userAgent[0]
            currentPay = await db.currentPay.toArray()
            currentPay = currentPay[0]
        }).then(() => {
          this.setState({
            salesAgentId: userAgent.SalesAgentId,
            callCenterId: userAgent.CallcentreId,
            Address1: customer.Address1,
            Postcode: customer.Postcode,
            CurrentProviderId: customerServices.provider,
            CurrentProviderMonths: customerServices.total,
            Broadband: customerServices.broadbandCheck,
            Phone: customerServices.phoneCheck,
            TV: customerServices.smartCheck,
            Movies: customerServices.moviesCheck,
            Sports: customerServices.sportsCheck,
            Entertainment: customerServices.entertainmentCheck,
            Netflix: customerServices.netflixCheck,
            Prime: customerServices.primeCheck,
            NowTV: customerServices.nowTvCheck,
            HighUse: customerServices.numDevicesHighUse,
            MediumUse: customerServices.numDevicesMediumUse,
            LowUse: customerServices.numDevicesLowUse,
            CurrentMonthlyPay: currentPay.currentMonthlyPayment,
            CanHaveVirgin: customerServices.canHaveVirgin,
            Aerial: customerServices.hasAerial,
            passed_id: packages.SelectedPackageId,
            perfect: packages.PerfectPackage,
            SuperCard: packages.SuperCard
          })
          this.getQuote()
        }) 
    }

    getQuote() {
        let thisSource = ''
        if(this.props.globalState.isBtJourney) {
            thisSource = 'BT'
        } else if (this.props.globalState.isWeb) {
            thisSource = 'WS'
        } else {
            this.setState({
            Aerial: true,
            CanHaveVirgin: true
            })
            thisSource = 'CC'
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
        axios.post(process.env.REACT_APP_API + 'Media/Quote', {
            "Postcode": this.state.Postcode,
            "CurrentProviderId": this.state.CurrentProviderId,
            "CurrentProviderMonths": this.state.CurrentProviderMonths,

            "CurrentMediaPackageBroadband": this.state.Broadband,
            "CurrentMediaPackagePhone": this.state.Phone,
            "CurrentMediaPackageTV": this.state.TV,

            "CurrentTVPackagesMovies": this.state.Movies,
            "CurrentTVPackagesSports": this.state.Sports,
            "CurrentTVPackagesEntertainment": this.state.Entertainment,

            "CurrentStreamServicesNetflix": this.state.Netflix,
            "CurrentStreamServicesPrime": this.state.Prime,
            "CurrentStreamServicesNowTV": this.state.NowTV,

            "NumDevicesHighUse": this.state.HighUse,
            "NumDevicesMediumUse": this.state.MediumUse,
            "NumDevicesLowUse": this.state.LowUse,

            "CurrentMonthlyPay": this.state.CurrentMonthlyPay,
            "HasAerial": this.state.Aerial,
            "CanHaveVirgin": this.state.CanHaveVirgin,

            "SelectedPackageId": this.state.passed_id,
            "Speed": this.props.globalState.btSpeed,
            "source": thisSource
        })
        .then(response => {
            this.setState({ data: response.data[0] });
            this.setState({ media_provider: response.data[0].MediaProvider });
            db.open().then(async () => {
                await db.package.update(1,{ 
                    packageName: response.data[0].PackageName
                })
            })
        })
        .catch(error => {
            if (error.response) {
                console.error("An error has occured - please try again.")
            }
        })
    }

    sigPad = {}

    clearSig = () => {
        this.sigPad.clear();
    }

    trim = () => {
        this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') });
    }

    render() {
        return (
            <div>
                <SecondaryHeader />
                <Formik
                    initialValues={{
                        title: 'Mr',
                        firstName: '',
                        surName: '',
                        address: this.state.Address1,
                        postcode: this.state.Postcode.toUpperCase(),
                        email: '',
                        phone: '',
                        accountName: '',
                        sortcode: '',
                        accountNumber: ''
                    }}
                    validate={values => {

                        const errors = {};
                        if (!values.title) errors.title = 'Required';
                        if (!values.firstName) errors.firstName = 'Required';
                        if (!values.surName) errors.surName = 'Required';
                        if (!this.props.globalState.isBtJourney) {
                            if (!values.email) errors.email = 'Required';
                            if (!values.accountName) errors.accountName = 'Required';
                            if (!values.sortcode) errors.sortcode = 'Required';
                            if (!values.accountNumber) errors.accountNumber = 'Required';
                        }
                        if (this.sigPad.isEmpty()) errors.signature = 'Customers signature is required';
                        if (  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) && !this.props.globalState.isBtJourney) {
                            errors.email = "You must supply a valid email address";
                        }
                        if (values.phone !== "" && !/^(?:0)(?!4|0)[0-9\\s.\\/-]{10}$/i.test(values.phone)) {
                            errors.phone = "You must supply a phone number";
                        }
                        // if (values.postcode !== "" && !/^[A-Za-z]{1,2}\d{1,2}[A-Za-z]{0,1}\s*\d{0,1}[A-Za-z]{2}_{0,2}$/i.test(values.postcode)) {
                        //     errors.postcode = "You must supply a valid UK postcode";
                        // }
                        return errors;
                    }}

                    onSubmit={(values) => {
                        this.trim();
                        if (!this.props.globalState.isBtJourney) {
                            this.setState({ isSubmitted: true });
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
                            axios.post(process.env.REACT_APP_API + 'Validation/ValidateBankAccount?AllowTest=true&accountNumber=' + values.accountNumber.toString() + '&accountSortCode=' + values.sortcode.toString())
                                .then(response => {
                                    if (response.data.Result === "True") {
                                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
                                        axios.post(process.env.REACT_APP_API + 'Media/SubmitApplication', {
                                            "Title": values.title,
                                            "Firstname": values.firstName,
                                            "Surname": values.surName,
                                            "Address1": this.state.Address1,
                                            "Postcode": this.state.Postcode,
                                            "HomePhone": values.phone,
                                            "Email": values.email,
                                            "SalesAgentId": this.state.salesAgentId,
                                            "CallcentreId": this.state.callCenterId,
                                            "MediaPackageId": this.state.passed_id,
                                            "BankAccountHolderName": values.accountName,
                                            "BankSortCode": values.sortcode,
                                            "BankAccountNum": values.accountNumber,
                                            "SignatureImage": this.state.trimmedDataURL,
                                            "OptInSports": this.state.Sports,
                                            "OptInMovies": this.state.Movies,
                                            "OptInEntertainment": this.state.Entertainment,
                                            "PerfectPackage": this.state.perfect,
                                            "OptInSuperCard": this.state.SuperCard,
                                            "Savings": (this.state.CurrentMonthlyPay * 12) - (this.state.data.MonthlyCost * 12),
                                            "AnnualCost": this.state.data.MonthlyCost * 12,
                                            "Source": 'CC'
                                        })
                                        .then(response => {
                                            db.open().then(async () => {
                                                await db.customer.update(1,{ 
                                                    resultKey: response.data.Result,
                                                    TelephoneNumber: values.phone,
                                                    Firstname: values.firstName,
                                                    Lastname: values.surName,
                                                })
                                            })
                                            this.setState({ isSubmitted: false })
                                            this.props.history.push('/thank_you')
                                        })
                                    } else {
                                        this.setState({ valTest: true });
                                    }
                                })
                        } else { 
                            this.setState({
                                isSubmitted: true,
                            });
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
                            axios.post(process.env.REACT_APP_API + 'Media/SubmitApplication', {
                                "Firstname": values.firstName,
                                "Surname": values.surName,
                                "Address1": values.address,
                                "Postcode": this.state.Postcode,
                                "HomePhone": values.phone,
                                "SalesAgentId": this.state.salesAgentId,
                                "MediaPackageId": this.state.passed_id,
                                "SignatureImage": this.state.trimmedDataURL,
                                "Source": 'BT'
                            })
                            .then(response => {
                                db.open().then(async () => {
                                    await db.customer.update(1,{ 
                                        resultKey: response.data.Result,
                                        TelephoneNumber: values.phone,
                                        Firstname: values.firstName,
                                        Lastname: values.surName,
                                    })
                                })
                                this.setState({ isSubmitted: false })
                                this.props.history.push('/thank_you')
                            })
                    }}
                }
                >
                    {props => (
                        <Form>
                            <div className='feature-wrapper'>
                                <div className='question-wrapper'>
                                    <h2>Your details</h2>
                                    <div className='form-row'>
                                        <label htmlFor='title'>Title</label>
                                        <select
                                            name='title'
                                            value={props.values.title}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            style={{
                                                borderColor:
                                                    props.errors.title && props.touched.title && "tomato"
                                            }}
                                        >
                                            <option value='Mr'>Mr</option>
                                            <option value='Mrs'>Mrs</option>
                                            <option value='Miss'>Miss</option>
                                            <option value='Ms'>Ms</option>
                                            <option value='Doctor'>Doctor</option>
                                            <option value='Professor'>Professor</option>
                                            <option value='Reverend'>Reverend</option>
                                            <option value='Father'>Father</option>
                                            <option value='Lord'>Lord</option>
                                        </select>
                                        {props.errors.title && props.touched.title && (
                                            <div className='validation_text'>{props.errors.title}</div>
                                        )}
                                    </div>
                                    <div className='form-row'>
                                        <label htmlFor="firstName">First name</label>
                                        <input
                                            name="firstName"
                                            type="text"
                                            value={props.values.firstName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            style={{
                                                borderColor:
                                                    props.errors.firstName && props.touched.firstName && "tomato"
                                            }}
                                        />
                                        {props.errors.firstName && props.touched.firstName && (
                                            <div className='validation_text'>{props.errors.firstName}</div>
                                        )}
                                    </div>
                                    <div className='form-row'>
                                        <label htmlFor="surName">Surname</label>
                                        <input
                                            name="surName"
                                            type="text"
                                            value={props.values.surName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            style={{
                                                borderColor:
                                                    props.errors.surName && props.touched.surName && "tomato"
                                            }}
                                        />
                                        {props.errors.surName && props.touched.surName && (
                                            <div className='validation_text'>{props.errors.surName}</div>
                                        )}
                                    </div>
                                    <div className='form-row'>
                                        <label htmlFor="address">Address</label>
                                        <input
                                            name="address"
                                            type="text"
                                            disabled={true}
                                            value={this.state.Address1}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            style={{
                                                borderColor:
                                                    props.errors.address && props.touched.address && "tomato"
                                            }}
                                        />
                                        {props.errors.address && props.touched.address && (
                                            <div className='validation_text'>{props.errors.address}</div>
                                        )}
                                    </div>
                                    <div className='form-row'>
                                        <label htmlFor="postcode">Postcode</label>
                                        <input
                                            maxLength="8"
                                            name="postcode"
                                            type="text"
                                            disabled={true}
                                            className="supplier-postcode"
                                            value={this.state.Postcode}
                                            onBlur={props.handleBlur}
                                            style={{
                                                borderColor:
                                                    props.errors.postcode && props.touched.postcode && "tomato"
                                            }}
                                        />
                                        {props.errors.postcode && props.touched.postcode && (
                                            <div className='validation_text'>{props.errors.postcode}</div>
                                        )}
                                    </div>
                                    { !this.props.globalState.isBtJourney ? 
                                    <div className='form-row'>
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            style={{
                                                borderColor:
                                                    props.errors.email && props.touched.email && "tomato"
                                            }}
                                        />
                                        {props.errors.email && props.touched.email && (
                                            <div className='validation_text'>{props.errors.email}</div>
                                        )}
                                    </div>
                                    : ''}
                                    <div className='form-row'>
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={props.values.phone}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            style={{
                                                borderColor:
                                                    props.errors.phone && props.touched.phone && "tomato"
                                            }}
                                        />
                                        {props.errors.phone && props.touched.phone && (
                                            <div className='validation_text'>{props.errors.phone}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            { !this.props.globalState.isBtJourney ? 
                            <div className='feature-wrapper bank-details'>
                                <div className='question-wrapper'>
                                    <div className='dd-mandate-heading-wrapper'>
                                        <div className='dd-mandate-supplier-logo'><img src={this.LogoPath + '/imagesPackage/' + this.state.media_provider.ProviderLogo} alt='Logo' /></div>
                                        <h2>Instruction to your bank or<br /> building&nbsp;society to pay by Direct Debit</h2>
                                        <div className='dd-mandate-ddlogo'><img src={ddMandate} alt='Direct Debit logo' /></div>
                                    </div>
                                </div>
                                <div className='dd-mandate-two-col-wrapper'>
                                    <div className='dd-mandate-two-col'>
                                        <div className='dd-mandate-input-wrapper'>
                                            <label htmlFor='AccountName'>Name of account holder</label>
                                            <input
                                                name="accountName"
                                                type="text"
                                                className="inspectletIgnore"
                                                value={props.values.accountName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                style={{
                                                    borderColor:
                                                        props.errors.accountName && props.touched.accountName && "tomato"
                                                }}
                                            />
                                            {props.errors.accountName && props.touched.accountName && (
                                                <div className='validation_text'>{props.errors.accountName}</div>
                                            )}
                                        </div>
                                        <div className='dd-mandate-input-wrapper'>
                                            <label htmlFor='sortcode'>Bank sort code</label>
                                            <input
                                                maxLength="6"
                                                name="sortcode"
                                                type="text"
                                                className="account-number inspectletIgnore"
                                                value={props.values.sortcode}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                style={{
                                                    borderColor:
                                                        props.errors.sortcode && props.touched.sortcode && "tomato"
                                                }}
                                            />

                                            {props.errors.sortcode && props.touched.sortcode && (
                                                <div className='validation_text validate-sort-code'>{props.errors.sortcode}</div>
                                            )}
                                        </div>
                                        <div className='dd-mandate-input-wrapper'>
                                            <label htmlFor="accountNumber">Account Number</label>
                                            <input
                                                maxLength="8"
                                                name="accountNumber"
                                                type="text"
                                                className="account-number inspectletIgnore"
                                                value={props.values.accountNumber}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                style={{
                                                    borderColor:
                                                        props.errors.accountNumber && props.touched.accountNumber && "tomato"
                                                }}
                                            />
                                            {props.errors.accountNumber && props.touched.accountNumber && (
                                                <div className='validation_text validate-account-number'>{props.errors.accountNumber}</div>
                                            )}
                                        </div>
                                        {this.state.valTest ? <div className='bank-validation-message'>Account Number/Sortcode incorrect</div> : null}
                                    </div>
                                    <div className='dd-mandate-two-col'>
                                        <div className='dd-mandate-instruction-wrapper'>
                                            <div>
                                                <p>Enter your account details so {this.state.media_provider.ProviderName} can set up your Direct Debit.<br /><strong> Money Expert will never take any money from your account.</strong> </p>
                                            </div>
                                            <p>
                                                You will pay <strong> &pound;{this.state.data.MonthlyCost}</strong> monthly by Direct Debit to <strong>{this.state.media_provider.ProviderName}</strong>.
                                            </p>
                                            <p>
                                                <strong>Instruction to your bank or building society</strong><br />
                                                Please pay {this.state.media_provider.ProviderName} Direct Debits from the account detailed in this instruction subject to the safeguards assured by the Direct Debit Guarantee.
                                                I understand that this instruction may remain with {this.state.media_provider.ProviderName} and, if so, details will be passed electronically to my bank/building society.
                                            </p>
                                        </div>
                                    </div>
                                    <aside className='direct-debit-secure-message'>
                                        <p className='secure-message'>
                                            <img src={sslSecure} alt='SSL Secure' />
                                            <span><strong>Your data is safe with us</strong><br />We use SSL provided by GeoTrust to transfer your details safely and securely.</span>
                                        </p>
                                    </aside>
                                </div>
                            </div>
                            : '' }
                            <div className='feature-wrapper agreement'>
                                <div className='question-wrapper'>
                                    <h2>Your agreement</h2>
                                    {! this.props.globalState.isBtJourney ?
                                    <p className='bb-terms'>By signing below you agree to commit to switching your provider and accept Money Expert's <a className='dotted-link' href='#' rel="noopener noreferrer" onClick={(e) => openModal(e, 'modalTermsAndConds')}> terms and conditions</a></p>
                                    : <p className='bb-terms'>I confirm I understand the package explained to me today and I am happy to receive a call from BT to discuss the package further.<br/><br/><strong>I agree to the following ‘Privacy Policies’</strong><br/><br/><a className="dotted-link" href='#' rel="noopener noreferrer" onClick={(e) => openModal(e, 'btPolicy')}>BT's Privacy Policy.</a><br/><a className='dotted-link' href='#' onClick={(e) => openModal(e, 'modalTermsAndConds')}>Money Expert's Privacy Policy.</a></p>}
                                    <div className='signature-box-wrapper'>
                                        <div className='form-row'>
                                            <label htmlFor='signature'>Signature</label>
                                            <div>
                                                {props.errors.signature && (
                                                    <div className='validation_text'>{props.errors.signature}</div>
                                                )}
                                                <SignatureCanvas
                                                    penColor='black'
                                                    canvasProps={{ width: 546, height: 200, className: 'sig-canvas' }}
                                                    ref={(ref) => { this.sigPad = ref; }}
                                                />

                                                <div className='signature-button-wrapper'>
                                                    <button type='button' onClick={this.clearSig}>Clear</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type='submit'
                                    id='submit'
                                    value='Submit'
                                    disabled={this.state.isSubmitted}
                                    className='link-btn'
                                >
                                <ClipLoader
                                    loading={this.state.isSubmitted}
                                    size={1.35} sizeUnit='rem'
                                    color='#203a54'
                                /> 
                                &nbsp;Agree
                                </button>
                                {this.props.globalState.isBtJourney ?
                                <Link to='/start' disabled={this.state.isSubmitted} className='link-btn'>Disagree</Link>
                                : '' }
                            </div>
                        </Form>
                    )}
                </Formik>

                {/*modal window*/}
                <div id='modalTermsAndConds' className='modal-window'>
                    <a href='#' className='background-close' onClick={(e) => closeModal(e, 'modalTermsAndConds')} />
                    <div>
                        <a href='#' title='CloseButton' className='modal-close' onClick={(e) => closeModal(e, 'modalTermsAndConds')} />
                        <h1>Terms and conditions</h1>
                        <div>
                            <h3>By accessing MoneyExpert, it is expected that you have read and understood these terms and conditions.</h3>
                            <p>The information contained in this website is for residents of the United Kingdom and is not to be taken as an offer, accepted or otherwise, for any product mentioned. The rates and information shown are taken from sources believed to be accurate and whilst MoneyExpert takes reasonable care to ensure the accuracy of published data, this cannot be guaranteed. MoneyExpert accepts no responsibility for any direct or consequential loss incurred from the use or reliance on the information published.</p>
                            <p>Users of this website should satisfy themselves as to the accuracy and suitability of any product before entering into a contract. The information contained in this website is for reference only and does not constitute an offer or personal recommendation of any kind. If in doubt, you are strongly recommended to seek advice from a suitably qualified person.</p>
                            <p>MoneyExpert has a commitment to impartiality and takes no payment from any institution for inclusion in the selection tables. Some institutions will pay an introduction fee to MoneyExpert if a consumer purchases a listed product. This payment has no bearing whatsoever in the choice of products and institutions shown in the tables. Users can be assured that MoneyExpert strives to be an independent and impartial company.</p>
                            <p>The Website contains links, buttons and banners that redirect you to 3rd party websites. MoneyExpert has no control over these 3rd party websites and as such, can accept no responsibility for the accuracy of any content. These links should not be taken as an endorsement or enticement to buy any product and are there for information and convenience only.</p>
                            <p>&nbsp;</p>
                            <h3>Copyright</h3>
                            <p>All text, templates, images, information and layouts (other than those supplied by 3rd parties such as advertisers) are the property of MoneyExpert. You are permitted to copy or print extracts from this website for your own personal use however all rights, intellectual or otherwise, will remain with MoneyExpert and do not pass to you. Should you wish to use content of the site for any other purpose, please&nbsp;<a href='http://www.moneyexpert.com/information/contactus' target='_new'>contact us</a>.</p>
                            <h3>Accessing the Website</h3>
                            <p>The&nbsp;<a href='http://www.moneyexpert.com/' target='_new'>www.moneyexpert.com</a>&nbsp;website is designed to be accessed via its principal homepages, and not direct to individual pages. If you access individual pages directly, you may not see important information and warnings which are necessary for a full understanding of our products and services.</p>
                            <p>A number of these links refer you to important legal or regulatory information which should be read in conjunction with the text in which the link appears. MoneyExpert Limited accepts no responsibility or liability for improper use of the&nbsp;<a href='http://www.moneyexpert.com/' target='_new'>www.moneyexpert.com</a>&nbsp;website.</p>
                            <p>Unless the contrary is explicitly stated in the case of any product or service, www.moneyexpert.com internet website contains only a summary of the information relating to the products and services referred to on the website. Therefore, if you are interested in finding out all of the information in relation to any of the products or services, you should seek further information by any of the methods indicated on the pages describing the products and services. Nothing on the www.moneyexpert.com internet website is intended to constitute advice to you.</p>
                            <h3>Reliability of information</h3>
                            <p>Information provided on the&nbsp;<a href='http://www.moneyexpert.com/' target='_new'>www.moneyexpert.com</a>&nbsp;website is believed to be reliable when posted. However, MoneyExpert Limited cannot guarantee that information will be accurate, complete and current at all times. All information on the website is subject to modification from time to time without notice.</p>
                            <h3>Disclaimer – Links to Other Websites</h3>
                            <p>The provision by&nbsp;<a href='http://www.moneyexpert.com/' target='_new'>www.moneyexpert.com</a>&nbsp;of a link to another website does not constitute any authorisation to the user to access material held at that location, nor is it evidence of any endorsement by MoneyExpert Limited of the material held there.</p>
                            <p>MoneyExpert Limited accepts no responsibility or liability for the privacy of your personal information on such websites, as these are beyond our control and will accept no responsibility or liability in respect of any materials on any third party internet website which is not under its control.</p>
                            <p>Click&nbsp;<a href='http://www.moneyexpert.com/privacy-policy' target='_new'>Read our Privacy Policy</a>&nbsp;to view our privacy policy.</p>
                            <h3>About our mortgage services</h3>
                            <p>You may browse our range of products and narrow down your search to your personal requirements.</p>
                            <p>The figures shown in our mortgage comparison tables are for illustration purposes only and do not constitute advice on whether a particular mortgage is suitable for your circumstances. Before applying for a Regulated Mortgage Contract you should obtain a European Standardised Information Sheet from the lender which will give exact details.</p>
                            <p>MoneyExpert Limited does not give advice on or recommend any particular mortgage product or service or whether it is suitable for your personal circumstances. The information provided is to help you to make your own choice about how to proceed.</p>
                            <p>If you require advice, you may complete our on-line enquiry form and we will contact you to arrange for you to discuss your requirements with a qualified Mortgage Adviser. MoneyExpert Limited does not charge a fee for this service.</p>
                            <h3>About our insurance comparison services</h3>
                            <p>MoneyExpert Limited does not give advice on or recommend any particular insurance product or service or whether it is suitable for your personal circumstances. The information provided is to help you to make your own choice about how to proceed.</p>
                            <p>MoneyExpert’s comparison tables provide details of products from a number of insurance providers and brokerages. For a full list of these please write to:</p>
                            <p>Compliance Officer,<br />
                                MoneyExpert Limited,<br />
                                Huxley House,<br />
                                Weyside Park,<br />
                                Catteshall Lane,<br />
                                Godalming,<br />
                                GU7 1XE</p>
                            <p>MoneyExpert has a commitment to impartiality and takes no payment from any institution for inclusion in the comparison tables. Some institutions will pay an introduction fee to MoneyExpert if a consumer purchases a listed product. This payment has no bearing whatsoever in the choice of products and institutions shown in the tables. Users can be assured that MoneyExpert strives to be an independent and impartial company.</p>
                            <h1>Our data protection policies</h1>
                            <p>MoneyExpert uses your information and your personal data for the providing of our services and to enhance your experience on our website. Please read our policies here:</p>
                            <p><a href='/privacy-policy' target='_new'>Privacy Policy</a></p>
                            <p><a href='/cookie-policy' target='_new'>Cookie Policy</a></p>
                            <p><a href='/marketing-policy' target='_new'>Marketing Policy</a></p>
                            <h1>What to do if you have a complaint?</h1>
                            <p>If you wish to register a complaint, please contact:</p>
                            <h3>In Writing:</h3>
                            <p>Compliance Officer,<br />
                                MoneyExpert Limited,<br />
                                Huxley House,<br />
                                Weyside Park,<br />
                                Catteshall Lane,<br />
                                Godalming,<br />
                                GU7 1XE</p>
                            <h3>By Email:</h3>
                            <p><a href='mailto:complaints@moneyexpert.com'>complaints@moneyexpert.com</a></p>
                            <h3>By Phone:</h3>
                            <p>0800 011 1395</p>
                            <p>If you cannot settle your complaint with us, you may be entitled to refer it to the Financial Ombudsman Service</p>
                        </div>
                    </div>
                </div>
                { this.props.globalState.isBtJourney &&
                    <Outcome isShowQuote={true}/>
                }

                {/*modal window*/}
                <div id='btPolicy' className='modal-window'>
                    <a href='#' className='background-close' onClick={(e) => closeModal(e, 'btPolicy')} />
                    <div>
                        <a href='#' title='CloseButton' className='modal-close' onClick={(e) => closeModal(e, 'btPolicy')} />
                        <div>
                            <h1>Our Privacy policy</h1>
                            <p>This policy sets out how we handle the information we receive from customers and everyone who uses our products and services. We take this seriously and will always treat this information with the utmost respect and care.</p>
                            </div>
                            <div>
                            <h2>Welcome</h2>
                            <p>We&rsquo;ve updated our privacy policy to reflect the changes in data-protection laws.<br /> </p>
                            </div>
                            <div>
                            <h4>Why do we have a Privacy policy?</h4>
                            </div>
                            <div>
                            <p>Firstly, we are under a legal obligation to let you know what personal information we collect about you, what we use it for and on what basis. We always need a good reason and we also have to explain to you your rights in relation to that information. You have the right to know what information we hold about you and to have a copy of it, and you can ask us to change or sometimes delete it.</p>
                            <p>The reasons we collect information are set out in this privacy policy, but we are not telling you all this just because we have to. As a communications provider, most of what we do &ndash; from connecting calls to developing and promoting our services &ndash; involves using personal information. And we believe that it is very important for our customers to trust us with that information. We want you to be confident that we will keep it secure and use it both lawfully and ethically, respecting your privacy.</p>
                            <p>Our support for the right to privacy, as part of our broader commitment to human rights, is stated in our <a href="http://www.btplc.com/Thegroup/Ourcompany/Ourvalues/Privacyandfreeexpression/index.htm" target="_blank" rel="noopener noreferrer">human rights policy</a>. And our privacy policy explains in detail how we use your personal information. It describes what we do (or what we may do) from the moment you ask for a service from us, when we may use your information for credit-checking purposes, through to providing and billing for that service. It also applies to marketing other products that we think will interest you.</p>
                            <p>But whatever we do with your information, we need a legal basis for doing it. We generally rely on one of three grounds (reasons) for our business processing. Firstly, if you have ordered or take a service from us, we are entitled to process your information so that we can provide that service to you and bill you for it.</p>
                            <p>Secondly, if we want to collect and use your information for other purposes, we may need to ask for your consent (permission) and, if we do, that permission must always be indicated by a positive action from you (such as ticking a box) and be informed. You are also free to withdraw your permission at any time. We tend to need permission when what is proposed is more intrusive (for example, sharing your contact details with other organisations so they can market their own products and services to you).</p>
                            <p>But we do not always need permission. In some cases, having assessed whether our use would be fair and not override your right to privacy, we may come to the view that it falls within the third ground &ndash; our &lsquo;legitimate interests&rsquo; to use the information in a particular way without your permission (for example, to protect our network against cyber-attacks). But when we do this, we must tell you as you may have a right to object. And if you object specifically to us sending you marketing material, or to &lsquo;profiling you&rsquo; for marketing purposes, we must then stop.</p>
                            <p>This is all set out in detail in this policy, which focuses more on those items that we think are likely to be of most interest to you. As well as covering processing for business purposes, we give you information on circumstances in which we may have to, or can choose to, share your information.</p>
                            <h4><strong>Our privacy policy </strong></h4>
                            <p>Please read this policy carefully as it applies to the products and services we provide to you (such as your phone, mobile, wi-fi, TV and broadband), our apps and our websites. It applies to our consumer, sole trader and partnership customers but doesn&rsquo;t apply to the information we hold about companies or organisations.</p>
                            <p>It also applies even if you&rsquo;re not one of our customers and you interact with us as part of running our business, such as by:</p>
                            <ul>
                            <li>using one of our products or services &ndash; paid for by someone else;</li>
                            <li>taking part in a survey or trial;</li>
                            <li>entering a prize promotion;</li>
                            <li>calling our helpdesk; or</li>
                            <li>generally enquiring about our services.</li>
                            </ul>
                            <p>If you need to give us personal information about someone else in relation to our products and services, the privacy policy will also apply. And if we need the permission of the other person to use that information, we&rsquo;ll ask you to check they are OK with this.</p>
                            <p>Technology is a fast-changing area and can be complicated. We&rsquo;ve included a glossary which explains the meaning of any technical terms we use.</p>
                            </div>
                            <div>
                            <h4>What&rsquo;s not included?</h4>
                            </div>
                            <div>
                            <p>This policy doesn&rsquo;t apply to information about our employees or shareholders. It also doesn&rsquo;t cover other companies or organisations (which advertise our products and services and use cookies, tags and other technology) collecting and using your personal information to offer relevant online advertisements to you. Read our cookie policy <a href="http://home.bt.com/pages/cookies/more-about-cookies.html">here</a> for information about how we use cookies on our website.</p>
                            <p>You can link to other organisations&rsquo; websites, apps, products, services and social media from our websites. This privacy policy doesn&rsquo;t apply to how those other organisations use your personal information.</p>
                            <p>You should review their privacy policies before giving them your personal information.</p>
                            </div>
                            <div>
                            <h4>Who are we?</h4>
                            </div>
                            <div>
                            <p>At BT, we&rsquo;re part of a larger group of companies. Some other companies and parts of the BT Group have their own privacy policies. And they&rsquo;ll apply if you buy your product or service direct from them, but the EE and Plusnet policies are broadly similar to this one.</p>
                            <ul>
                            <li>EE Ltd</li>
                            <li>Plusnet plc</li>
                            <li>Openreach Ltd</li>
                            <li>BT <a href="https://www.btplc.com/mydonate/aboutmydonate/Privacypolicy/index.aspx" target="_blank" rel="noopener noreferrer">MyDonate</a></li>
                            </ul>
                            <p>All other parts of the <strong>BT Group</strong> are covered by this privacy policy.</p>
                            <p>We review our privacy policy regularly. It was last updated on 17 May 2018. And we&rsquo;ll tell you if we change the policies, as set out <a href="/privacy-policy" target="_self">here</a>.</p>
                            </div>
                            <div>
                            <h2>Accessing and updating how we use your information</h2>
                            <p>You can access and update the information we hold about you using our <a href="https://www.bt.com/consumer/edw/privacypolicy/copyform/bt/" target="_blank" rel="noopener noreferrer">online form</a>. Once we&rsquo;ve looked at your request, we&rsquo;ll let you know when you can expect to hear from us.</p>
                            <p>We&rsquo;ll always try to help you with your request but we can refuse if we believe doing so would have a negative effect on others or the law prevents us. And even though we have to complete your request free of charge, we are allowed to reject requests if:</p>
                            <ul>
                            <li>they&rsquo;re repetitive;</li>
                            <li>you don&rsquo;t have the right to ask for the information; or</li>
                            <li>the requests made are excessive.</li>
                            </ul>
                            <p>If that&rsquo;s the case, we&rsquo;ll explain why we believe we don&rsquo;t have to fulfil the request.</p>
                            </div>
                            <div>
                            <h4>Want to change your marketing preferences?</h4>
                            </div>
                            <div>
                            <p>You can opt out of receiving marketing from us at any time using the link provided in the email or SMS message (text message) we have sent you or just by telling us when we call you. Or you can use the form provided <a href="https://www.bt.com/consumer/edw/privacypolicy/marketingpermission/bt/" target="_blank" rel="noopener noreferrer">here</a>.</p>
                            <p>We are also rolling out a &lsquo;MyBT&rsquo; account for our consumer customers where you can reset your marketing or contact preferences at any time.</p>
                            <p>If you don&rsquo;t have a MyBT account, please let us know on the form whether you want to stop hearing from us by phone, email, text or post. Or, let us know whether you want us to stop using information about how you use our products and services (your <strong>call</strong>, <strong>browser </strong>and <strong>TV records</strong>) for marketing purposes or profiling you for marketing purposes. For more information about how we use your information for marketing purposes, please see below.</p>
                            </div>
                            <div>
                            <h4>Want a copy of the information we hold about you?</h4>
                            </div>
                            <div>
                            <p>If you want a copy of your <strong>billing information</strong>, log in to your MyBT account or call 0800 800150 and we&rsquo;ll send it to you. (You must be the account holder to ask for this information). If you want to see what <strong>contact information</strong> we hold about you, you can also log in to your account. It&rsquo;s quick and simple to access it this way.</p>
                            <p>You can also ask us for a copy of the information we hold about you using our <a href="https://www.bt.com/consumer/edw/privacypolicy/copyform/bt/" target="_blank" rel="noopener noreferrer">online form here</a>.</p>
                            <p>If you work for one of our corporate customers, please ask your employer &ndash; they&rsquo;ll ask for this on your behalf.</p>
                            <p>It will normally take us up to one month to get back to you but could take longer (up to a further two months) if it&rsquo;s a complicated request or you send us a lot of requests at once.</p>
                            </div>
                            <div>
                            <h4>Concerned about what we're doing with your personal information?</h4>
                            </div>
                            <div>
                            <p>You can ask us to <strong>correct, complete, delete </strong>or <strong>stop using</strong> any personal information we hold about you by using our online form <a href="https://www.bt.com/consumer/edw/privacypolicy/copyform/bt/" target="_blank" rel="noopener noreferrer">here</a>.</p>
                            <p>If you&rsquo;re worried about how we send you marketing information, have a look at the section above on how to check or change those settings.</p>
                            <p>If you want us to stop using personal information we&rsquo;ve collected via <a href="http://home.bt.com/pages/cookies/more-about-cookies.html">cookies</a> on our website or apps, you should either change your cookie settings <a href="http://home.bt.com/pages/cookies/more-about-cookies.html">here</a> or change the settings for your app. In some cases, we might decide to keep information, even if you ask us not to. This could be for legal or regulatory reasons, so that we can keep providing our products and services, or for another legitimate reason. For example, we keep certain billing information to show we have charged you correctly. But we&rsquo;ll always tell you why we keep the information.</p>
                            <p>We aim to provide our products and services in a way that protects information and respects your request. Because of this, when you delete or change (or ask us to delete or change) your information from our systems, we might not do so straight away from our back-up systems or copies on our active servers. And we may need to keep some information to fulfil your request (for example, keeping your email address to make sure it&rsquo;s not on our marketing list).</p>
                            <p>Where we can, we&rsquo;ll confirm any changes. For example, we&rsquo;ll check a change of address against the Postal Address File, or we might ask you to confirm it.</p>
                            <p>If we&rsquo;ve asked for your permission to provide a service, you can withdraw that permission at any time. It&rsquo;ll take us up to 30 days to do that. And it only applies to how we use your personal information in the future, not what we&rsquo;ve done in the past (for example, if we&rsquo;ve run a credit check at the start of your contract).</p>
                            </div>
                            <div>
                            <h4>Moving to another provider and want to take your information?</h4>
                            </div>
                            <div>
                            <p>If we provide you with our products and services, or you&rsquo;ve said we can use your information, you can ask us to move, copy or transfer the information you have given us. You can ask us to do this using our online form <a href="https://www.bt.com/consumer/edw/privacypolicy/copyform/bt/" target="_blank" rel="noopener noreferrer">here</a>.</p>
                            <p>We&rsquo;ll send your personal information electronically. And we&rsquo;ll do our best to send it in another format if needed.</p>
                            <p>We&rsquo;ll always try to help you with your request. But we can refuse if sharing the information would have a negative effect on others, for example because it includes personal information about someone else, or the law prevents us from doing so.</p>
                            <p>It will normally take us up to one month to get back to you but could take longer (up to a further two months) if it&rsquo;s a complicated request or we get a lot of requests at once.</p>
                            </div>
                            <div>
                            <h2>What information we collect and what we use it for</h2>
                            </div>
                            <div>
                            <h4>What kinds of personal information do we collect and how do we use it?</h4>
                            </div>
                            <div>
                            <p>The <strong>personal</strong> <strong>information</strong> we collect depends on the products and services you have and how you use them. We&rsquo;ve explained the different ways we use your personal information.</p>
                            </div>
                            <div>
                            <h4>To provide you with products and services</h4>
                            </div>
                            <div>
                            <p>We&rsquo;ll use your personal information to provide you with products and services. This applies when you register for or buy a product or service from us. Or if you register for an online account with us or download and register on one of our apps.</p>
                            <p>This means we&rsquo;ll</p>
                            <ul>
                            <li>record details about the products and services you use or order from us;</li>
                            <li>send you product or service-information messages (we&rsquo;ll send you messages to confirm your order and tell you about any changes that might affect your service, like when we have infrastructure work planned or need to fix something);</li>
                            <li>update you on when we&rsquo;ll deliver, connect or install your products and services;</li>
                            <li>let you create and log in to the online accounts we run;</li>
                            <li>charge you and make sure your payment reaches us;</li>
                            <li>filter any <strong>content</strong> you ask us to, through your Parental Controls settings (or any <strong>content</strong> our partners ask us to, such as for a wi-fi hotspot);</li>
                            <li>give information to someone else (if we need to for the product or service you&rsquo;ve ordered) or to another communications provider if you&rsquo;re buying some services from them and us (if we do this, we still control your personal information and we have strict controls in place to make sure it&rsquo;s properly protected); and</li>
                            <li>support you more if you are a vulnerable customer.</li>
                            </ul>
                            <p>We use the following to provide products and services and manage your account.</p>
                            <ul>
                            <li>Your contact details and other information to confirm your identity and your communications with us. This includes your name, gender, address, phone number, date of birth, email address, passwords and credentials (such as the security questions and answers we have on your account).</li>
                            <li>Your payment and financial information.</li>
                            <li>Your communications with us, including emails, webchats and phone calls. We&rsquo;ll also keep records of any settings or communication preferences you choose.</li>
                            <li>Information from cookies placed on your connected devices that we need so we can provide a service.</li>
                            </ul>
                            <p>We use this information to carry out our contract (or to prepare a contract) and provide products or services to you. If you don&rsquo;t give us the correct information or ask us to delete it, we might not be able to provide you with the product or service you ordered from us.</p>
                            <p>If you tell us you have a disability or otherwise need support, we&rsquo;ll note that you are a vulnerable customer, but only if you give your permission or if we have to for legal or regulatory reasons. For example, if you told us about a disability we need to be aware of when we deliver our services to you, we have to record that information so we don&rsquo;t repeatedly ask you about it. We will also record the details of a <strong>Power of Attorney</strong> we have been asked to log against your account.</p>
                            </div>
                            <div>
                            <h3>Because it is in our legitimate interests as a business to use your information</h3>
                            <p>We&rsquo;ll use your personal information if we consider it is in our legitimate business interests so that we can operate as an efficient and effective business. We use your information to:</p>
                            <ul>
                            <li>Identify, and let you know about, products and services that interest you;</li>
                            <li>share within the BT Group for administrative purposes;</li>
                            <li>create aggregated and anonymised information for further use;</li>
                            <li>detect and prevent fraud; and</li>
                            <li>secure and protect our network.</li>
                            </ul>
                            </div>
                            <div>
                            <h4>To market to you and to identify products and services that interest you</h4>
                            </div>
                            <div>
                            <p>We&rsquo;ll use your personal information to send you direct marketing and to better identify products and services that interest you. We do that if you&rsquo;re one of our customers or if you&rsquo;ve been in touch with us another way (such as entering a prize promotion or competition).</p>
                            <p>This means we&rsquo;ll:</p>
                            <ul>
                            <li>create a profile about you to better understand you as a customer and tailor the communications we send you (including our marketing messages);</li>
                            <li>tell you about other products and services you might be interested in;</li>
                            <li>recommend better ways to manage what you spend with us, like suggesting a more suitable product based on what you use;</li>
                            <li>try to identify products and services you&rsquo;re interested in; and</li>
                            <li>show you more relevant online advertising and work with other well-known brands to make theirs more suitable too.</li>
                            </ul>
                            <p>We use the following for marketing and to identify the products and services you&rsquo;re interested in.</p>
                            <ul>
                            <li>Your contact details. This includes your name, gender, address, phone number, date of birth and email address.</li>
                            <li>Your payment and financial information.</li>
                            <li>Information from <strong>cookies</strong> and <strong>tags</strong> placed on your connected devices.</li>
                            <li>Information from other organisations such as <strong>aggregated</strong> demographic data, data brokers (such as Acxiom and Edit), our partners and publicly available sources like the electoral roll and business directories.</li>
                            <li>Details of the products and services you&rsquo;ve bought and how you use them &ndash; including your <strong>call</strong>, <strong>browser </strong>(including <strong>IP address</strong>) and <strong>TV records.</strong></li>
                            </ul>
                            <p>We&rsquo;ll send you information (about the products and services we provide) by phone, post, email, <strong>text message</strong>, online banner advertising or a notice using our apps or on your TV set-top box. We also use the information we have about you to personalise these messages wherever we can as we believe it is important to make them relevant to you. We do this because we have a legitimate business interest in keeping you up to date with our products and services, making them relevant to you and making sure you manage your spending with us. We also check that you are happy for us to send you marketing messages by <strong>text</strong> or <strong>email</strong> before we do so. In each message we send, you also have the option to opt out.</p>
                            <p>We&rsquo;ll only use your <strong>call, browser </strong>and some <strong>TV records</strong> (such as programmes you watch on channels we provide that are produced by other organisations) to personalise our offers as long as you are happy for us to do so.</p>
                            <p>We&rsquo;ll only market other organisations&rsquo; products and services if you have said it is OK for us to do so.</p>
                            <p>You can ask us to stop sending you marketing information or withdraw your permission at any time, as set out above.</p>
                            <p>Read our <a href="http://home.bt.com/pages/cookies/more-about-cookies.html">cookie policy</a> for more details on how we use cookies.</p>
                            </div>
                            <div>
                            <h4>To create aggregated and anonymised data</h4>
                            </div>
                            <div>
                            <p>We&rsquo;ll use your personal information to create <strong>aggregated</strong> and <strong>anonymised</strong> information. Nobody can identify you from that information and we&rsquo;ll use it to:</p>
                            <ul>
                            <li>make sure our network is working properly and continuously improve and develop our network and products and services for our customers;</li>
                            <li>run management and corporate reporting, research and analytics, and to improve the business; and</li>
                            <li>provide other organisations with <strong>aggregated</strong> and <strong>anonymous</strong> reports</li>
                            </ul>
                            <p>We use the following to generate <strong>aggregated</strong> and <strong>anonymised</strong> information.</p>
                            <ul>
                            <li>Your gender, address and date of birth.</li>
                            <li>Information about what you buy from us, how you ordered it and how you pay for it, for example, broadband ordered online and paid for on a monthly basis.</li>
                            <li>Information from <strong>cookies</strong> and <strong>tags</strong> placed on your computer.</li>
                            <li>Information from other organisations who provide aggregated demographic information, data brokers (such as Acxiom and Edit), our partners and publicly available sources like the electoral roll and business directories.</li>
                            <li>Details of the products and services you&rsquo;ve bought and how you use them &ndash; including your <strong>call</strong>, <strong>browser </strong>(including <strong>IP address</strong>) and <strong>TV records</strong>.</li>
                            </ul>
                            <p>We have a legitimate interest in generating insights that will help us operate our network and business or would be useful to other organisations.</p>
                            </div>
                            <div>
                            <h4>To develop our business and build a better understanding of what our customers want</h4>
                            </div>
                            <div>
                            <p>This means we&rsquo;ll:</p>
                            <ul>
                            <li>maintain, develop and test our network (including managing the traffic on our network), products and services, to provide you with a better service;</li>
                            <li>train our people and suppliers to provide you with products and services (but we make the information anonymous beforehand wherever possible);</li>
                            <li>create a profile about you to better understand you as our customer;</li>
                            <li>share personal information within the <strong>BT Group</strong> for administrative purposes, such as sharing contact details so we can get in touch with you; and</li>
                            <li>run surveys and market research about our products.</li>
                            </ul>
                            <p>We use the following information to do this.</p>
                            <ul>
                            <li>Your contact details.</li>
                            <li>Your payment and financial information.</li>
                            <li>Your communications with us, including emails, webchats and phone calls (and any recordings made).</li>
                            <li>Information from cookies placed on your connected devices.</li>
                            <li>Make and defend claims to protect our business interests.</li>
                            <li>Details of the products and services you&rsquo;ve bought and how you use them &ndash; including your <strong>call</strong>, <strong>browser </strong>(including <strong>IP address </strong>and<strong> static IP address</strong>, if it applies) and <strong>TV records.</strong></li>
                            </ul>
                            <p>If we use this information for market research, training, testing, development purpose, defend or bring claims or to create a profile about you, we do so because it is in our legitimate business interests of running an efficient and effective business which can adapt to meet our customers&rsquo; needs.</p>
                            <p>We create a profile about you based on what you have ordered from us and how you use our products and services. This helps us tailor the offers we share with you. You can ask us to stop profiling you for marketing purposes at any time, as set out above.</p>
                            </div>
                            <div>
                            <h4>To run credit and fraud prevention checks</h4>
                            </div>
                            <div>
                            <p>Before we provide you with a product or service (including upgrades or renewals), or sometimes when you use our products and services, we&rsquo;ll use personal information you have given us together with information we have collected from <strong>credit reference agencies</strong> (such as Experian or Equifax), the Interactive Media in Retail Group (IMRG) security alert, or <strong>fraud prevention agencies</strong> (such as Cifas). We use this information to manage our credit risk, and prevent and detect fraud and money laundering. We&rsquo;ll also use these organisations to confirm your identity. When they get a search from us, a 'footprint' goes on your file which other organisations might see. We might also share the information with other organisations. We do this because it&rsquo;s in our, and the organisations&rsquo;, legitimate interests to prevent fraud and money laundering, and to check identities, to protect our business and to keep to laws that apply to us.</p>
                            <p>Details of the personal information that will be used include your name, address, date of birth, contact details, financial information, employment details and device identifiers, including <strong>IP address</strong> and vehicle details.</p>
                            <p>If you don&rsquo;t become one of our customers, we&rsquo;ll still keep the result of our credits checks about you if we have a legal obligation and it&rsquo;s in our legitimate interests to help prevent or detect fraud. Fraud prevention agencies can hold your personal information for different periods of time, and if you are considered to pose a fraud or money laundering risk, your information can be held by us and the organisations we share it with for up to six years.</p>
                            <p>If you give us false or inaccurate information which we identify as fraudulent, we&rsquo;ll pass that on to fraud prevention agencies. We might also share it with law enforcement agencies, as may the agencies we have shared the information with.</p>
                            <p>If you tell us you&rsquo;re associated with someone else financially (for example, by marriage or civil partnership), we&rsquo;ll link your records together. So you must make sure you have their agreement to share information about them. The agencies we share the information with also link your records together and these links will stay on your and their files &ndash; unless you or your partner successfully asks the agency to break that link.</p>
                            <p>If we, a credit reference or fraud prevention agency, decide that you are a credit, fraud or money laundering risk, we may refuse to provide the services or financing you have asked for, or we may stop providing existing services to you.</p>
                            <p>The credit reference and fraud prevention agencies will keep a record of any fraud or money laundering risk and this may result in other organisations refusing to provide services, financing or employment to you. If you have any questions about this, please contact us using the details <a href="https://preview.products.bt.com/privacy-policy/#contact">below</a>.</p>
                            <p>We send credit reference and fraud prevention agencies information about applications, and they keep that information. We might also give them details of your accounts and bills, including how you manage them. This includes telling them about your account balances, what you pay us and if you miss a payment (going back in the past, too). So if you don't pay your bills on time, credit reference agencies will record that. They, or a fraud prevention agency, might tell others doing similar checks &ndash; including organisations trying to trace you or recover money you owe them.</p>
                            <p>There are different credit reference agencies in the UK (for example, Callcredit, Equifax and Experian). Each one might hold different information about you. If you want to find out what information they have on you, they may charge you a small fee.</p>
                            <p>Whenever credit reference and fraud prevention agencies transfer your personal information outside of the European Economic Area, they place contractual responsibilities on the organisation receiving it to protect your information to the standard required in the European Economic Area. They may also make the organisation receiving the information subscribe to &lsquo;international frameworks&rsquo; aimed at sharing information securely.</p>
                            <p>Here are links to the information notice for each of the three main Credit Reference Agencies. <br /> <a href="http://www.callcredit.co.uk/crain" target="_blank" rel="noopener noreferrer">Callcredit</a> <br /> <a href="http://www.equifax.co.uk/crain" target="_blank" rel="noopener noreferrer">Equifax</a> <br /> <a href="http://www.experian.co.uk/crain" target="_blank" rel="noopener noreferrer">Experian</a></p>
                            </div>
                            <div>
                            <h4>To collect debt</h4>
                            </div>
                            <div>
                            <p>If you don&rsquo;t pay your bills, we might ask a debt-recovery agency to collect what you owe. We&rsquo;ll give them information about you (such as your contact details) and your account (the amount of the debt) and may choose to sell the debt to another organisation to allow us to receive the amount due.</p>
                            </div>
                            <div>
                            <h4>To prevent and detect crime</h4>
                            </div>
                            <div>
                            <p>We&rsquo;ll use your personal information to help prevent and detect crime and fraud. We&rsquo;ll also use it to prevent and detect criminal attacks on our network or against your equipment. We monitor traffic over our network, trace nuisance or malicious calls, and track malware and cyber-attacks.</p>
                            <p>To do that we use the following information, but only where strictly necessary.</p>
                            <ul>
                            <li>Your contact details and other information to confirm your identity and communications with us. This includes your name, gender, address, phone number, date of birth, email address, passwords and credentials (for example, security questions). We do not store the original copy of your password. Instead we keep it in a form that allows us to authenticate you but does not allow us to work out what your original password is.</li>
                            <li>Your payment and financial information.</li>
                            <li>Information from credit reference and fraud prevention agencies.</li>
                            <li>Details of the products and services you&rsquo;ve bought and how you use them &ndash; including your <strong>call</strong>, <strong>browser </strong>(including <strong>IP address</strong>) and <strong>TV records.</strong></li>
                            <li>CCTV footage in our shops and buildings.</li>
                            </ul>
                            <p>We use this personal information because we have a legitimate interest in protecting our network and business from attacks and to prevent and detect crime and fraud. We also share it with other organisations (such as other communications providers and banks) who have the same legitimate interests. Doing this helps make sure our network works properly and helps protect you from attacks.</p>
                            <p>If you call the emergency services, we&rsquo;ll give them information about you and where you are so they can help. We do this because it is necessary to protect you, or another person, and because it is in our interests to help the emergency services in providing help to you.</p>
                            </div>
                            <div>
                            <h3>To meet our legal and regulatory obligations</h3>
                            <p>We might have to release personal information about you to meet our legal and regulatory obligations.</p>
                            </div>
                            <div>
                            <h4>To law enforcement agencies</h4>
                            </div>
                            <div>
                            <p>Under investigatory powers legislation, we might have to share personal information about you to government and law-enforcement agencies, such as the police, to help detect and stop crime, prosecute offenders and protect national security. They might ask for the following details.</p>
                            <ul>
                            <li>Your contact details. This includes your name, gender, address, phone number, date of birth, email address, passwords and credentials (such as your security questions and answers) needed to confirm your identity and your communications with us.</li>
                            <li>Your communications with us, such as calls, emails and webchats.</li>
                            <li>Your payment and financial information.</li>
                            <li>Details of the products and services you&rsquo;ve bought and how you use them &ndash; including your <strong>call</strong>, <strong>browser </strong>(including IP address) and <strong>TV records.</strong></li>
                            </ul>
                            <p>The balance between privacy and investigatory powers is challenging. We share your personal information when the law says we have to, but we have strong oversight of what we do and get expert advice to make sure we&rsquo;re doing the right thing to protect your right to privacy. You can read more about our approach to investigatory powers in our report on <a href="http://www.btplc.com/Thegroup/Ourcompany/Ourvalues/Privacyandfreeexpression/index.htm" target="_blank" rel="noopener noreferrer">Privacy and free expression in UK communications</a>. And you can see the terms of reference for our oversight body <a href="https://www.btplc.com/Thegroup/Ourcompany/Theboard/Boardcommittees/InvestigatoryPowers/index.htm">here</a>.</p>
                            <p>We&rsquo;ll also share personal information about you where we have to legally share it with another person. That might be when a law says we have to share that information or because of a court order.</p>
                            <p>In limited circumstances, we may also share your information with other public authorities, even if we do not have to. However, we would need to be satisfied that a request for information is lawful and proportionate (in other words, appropriate to the request). And we would need appropriate assurances about security and how the information is used and how long it is kept.</p>
                            </div>
                            <div>
                            <h4>For regulatory reasons</h4>
                            </div>
                            <div>
                            <p>We&rsquo;ll also use your <strong>call</strong>, <strong>browser </strong>(including <strong>IP address</strong>) and <strong>TV records</strong> to find the best way of routing your communications through the various parts of our network, equipment and systems as required by our regulator.</p>
                            <p>If you order a phone service, we&rsquo;ll ask if you want your details included in our directory services such as our Phone Book. If you do, we&rsquo;ll publish your details and share that information with other providers of directory services. Ex-directory numbers aren&rsquo;t included and will not appear in The Phone Book.</p>
                            </div>
                            <div>
                            <h2>Sharing your information </h2>
                            <p>In this section we detail how, why and with whom we share your information. We also explain the safeguards we&rsquo;ve put in place to protect your information.</p>
                            </div>
                            <div>
                            <h4>Who do we share your personal information with, why and how?</h4>
                            </div>
                            <div>
                            <p>We share your personal information with other companies within the <strong>BT Group</strong>. We have a group-wide arrangement, known as <strong><a href="//img01.products.bt.co.uk/content/dam/bt/storefront/pdfs/BT_Binding_Corporate_Rules_V1_2.pdf">binding corporate rules</a></strong>, to make sure your personal information is protected, no matter which company in the BT Group holds that information. You can get in touch with our data protection office, <a href="#contact">contact details can be found here</a>.</p>
                            <p>We also use other service providers to process personal information on our behalf. Details of how they handle your personal information are set out below.</p>
                            </div>
                            <div>
                            <h4>Using other service providers</h4>
                            </div>
                            <div>
                            <p>We use other providers to carry out services on our behalf or to help us provide services to you. We also use them to:</p>
                            <ul>
                            <li>provide customer-service, marketing, infrastructure and information-technology services;</li>
                            <li>personalise our service and make it work better;</li>
                            <li>process payment transactions;</li>
                            <li>carry out fraud and credit checks and collect debts;</li>
                            <li>analyse and improve the information we hold (including about your interactions with our service); and</li>
                            <li>run surveys.</li>
                            </ul>
                            <p>Where we use another organisation, we still control your personal information. And we have strict controls in place to make sure it&rsquo;s properly protected. Finally, the section above describes the situations in which your personal information is shared to other organisations, government bodies and law-enforcement agencies. When we share your information with other organisations we&rsquo;ll make sure it&rsquo;s protected, as far as is reasonably possible.</p>
                            <p>If we need to transfer your personal information to another organisation for processing in countries that aren&rsquo;t listed as <a href="https://ec.europa.eu/info/strategy/justice-and-fundamental-rights/data-protection/data-transfers-outside-eu/adequacy-protection-personal-data-non-eu-countries_en" target="_blank" rel="noopener noreferrer">'adequate'</a> by the European Commission, we&rsquo;ll only do so if we have <strong>model contracts</strong> or other appropriate safeguards (protection) in place.</p>
                            <p>If there&rsquo;s a change (or expected change) in who owns us or any of our assets, we might share personal information to the new (or prospective) owner. If we do, they&rsquo;ll have to keep it confidential.</p>
                            <p>For more details, or if you&rsquo;d like a copy of our binding corporate rules or other information about a specific transfer of your personal information, get in touch with us <a href="https://preview.products.bt.com/privacy-policy/#contact" target="_blank" rel="noopener noreferrer">here</a>. The fraud prevention section above provides details on transfers fraud prevention agencies may carry out.</p>
                            </div>
                            <div>
                            <h4>The countries we share personal information to</h4>
                            </div>
                            <div>
                            <p><strong>BT Group</strong> is a large multinational organisation. Our <strong><a href="//img01.products.bt.co.uk/content/dam/bt/storefront/pdfs/BT-Binding-Corporate-Rules.pdf">binding corporate rules</a> </strong>reflect how we operate. They include a list of countries (below) which are structured to allow us to transfer personal information to the countries where we have a presence. For us, after the UK and wider EU, India and the Philippines are where most of our processing of personal information takes place. Your personal information is used for customer or IT support or operations purposes in these countries. While our binding corporate rules allow us to transfer personal information to these countries, the information won&rsquo;t always include your personal information in every case.</p>
                            <p>Algeria, Argentina, Australia, Bahrain, Bangladesh, Barbados, Bermuda, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Canada, China, Colombia, Costa Rica, Cote d'Ivoire, Dominican Republic, Ecuador, Egypt, El Salvador, Ghana, Gibraltar, Guatemala, Honduras, Hong Kong, India, Indonesia, Isle of Man, Israel, Jamaica, Japan, Jersey, Jordan, Kazakhstan, Kenya, Republic of Korea, Lebanon, Macedonia, Malawi, Malaysia, Mauritius, Mexico, Moldova, Montenegro, Morocco, Mozambique, Namibia, Nicaragua, Nigeria, Norway, Oman, Pakistan, Panama, Paraguay, Peru, Philippines, Puerto Rico, Qatar, Russian Federation, Serbia, Singapore, South Africa, Sri Lanka, Switzerland, Taiwan, Tanzania, Thailand, Trinidad and Tobago, Tunisia, Turkey, Uganda, Ukraine, United Arab Emirates, United States, Uruguay, Venezuela, Vietnam, British Virgin Islands, Zambia and Zimbabwe.</p>
                            </div>
                            <div>
                            <h2>Protecting your information and how long we keep it</h2>
                            <p>This section is about how we keep your information secure and how long we keep hold of it for. We always follow the law and delete your information when we no longer need to keep it. </p>
                            </div>
                            <div>
                            <h4>How do we protect your personal information?</h4>
                            </div>
                            <div>
                            <p>We have strict security measures to protect your personal information. We check your identity when you get in touch with us, and we follow our security procedures and apply suitable technical measures, such as encryption, to protect your information.</p>
                            </div>
                            <div>
                            <h4>How long do we keep your personal information?</h4>
                            </div>
                            <div>
                            <p>We&rsquo;ll keep:</p>
                            <ul>
                            <li>a summary copy of your bills for six years from the date of the bill;</li>
                            <li>your contact details on file while you&rsquo;re one of our customers, and for six years after; and</li>
                            <li>details relating to any dispute for six years after it was closed.</li>
                            </ul>
                            <p>In other cases we&rsquo;ll store personal information for the periods needed for the purposes for which the information was collected or for which it is to be further processed. And sometimes we&rsquo;ll keep it for longer if we need to by law. Otherwise we delete it.</p>
                            </div>
                            <div>
                            <h2>How to contact us and further details</h2>
                            <p>We&rsquo;re always interested in hearing your questions and commen<a></a>ts about our Privacy policy. Here&rsquo;s where you can find out how to contact us if you need to.</p>
                            </div>
                            <div>
                            <h4>Got a question about how we use your information?</h4>
                            </div>
                            <div>
                            <p>You can get in touch with our data-protection officer by email <a href="mailto:cpo@bt.com">cpo@bt.com</a> or write to the address above and mark it for their attention.</p>
                            <p>If you&rsquo;d like any more details, or you have comments or questions about our privacy policy, write to us at:</p>
                            <p>PO Box 2681 <br /> BT Centre <br /> 81 Newgate Street <br /> London <br /> EC1A 7AJ</p>
                            <p>If you want to make a complaint on how we have handled your personal information, please contact our data protection officer who will investigate the matter and report back to you. If you are still not satisfied after our response or believe we are not using your personal information in line with the law, you also have the right to complain to the data-protection regulator in the country where you live or work. For the UK, that&rsquo;s the Information Commissioner - <a href="https://ico.org.uk/">https://ico.org.uk/</a>.</p>
                            </div>
                            <div>
                            <h4>How will we tell you about changes to the policy?</h4>
                            </div>
                            <div>
                            <p>Our privacy policy might change from time to time. We&rsquo;ll post any changes on this page for at least 30 days. And if the changes are significant, we&rsquo;ll tell you by email, text message or on your bill.</p>
                            </div>
                            <div>
                            <h4>Where can we find previous versions of the policy?</h4>
                            </div>
                            <div>
                            <p><a href="https://img01.products.bt.co.uk/content/dam/bt/storefront/pdfs/BT.com%20previous%20privacy%20policy_until%2018052018.pdf" target="_blank" rel="noopener noreferrer">BT.com previous policy until 18 May 2018</a></p>
                            <p><a href="https://img01.products.bt.co.uk/content/dam/bt/storefront/pdfs/BTplc%20previous%20privacy%20policy_until%2018052018.pdf" target="_blank" rel="noopener noreferrer">BT.plc previous policy until 18 May 2018</a></p>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withGlobalState(ApplicationForm)