import React, { Component } from 'react'
import SecondaryHeader from './secondary_header'
import { withGlobalState } from 'react-globally'
import axios from 'axios'
import db from "./broadbandDatabase"
import { insertLog } from "../../monitor";

class ThankYou extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Reference: '',
            Title: '',
            Firstname: '',
            Lastname: '',
            Address1: '',
            Address2: '',
            Postcode: '',
            Town: '',
            County: '',
            HomePhone: '',
            Email: '',
            SalesAgentId: '',
            CallcentreId: '',
            MediaPackageId: '',
            PackageName: '',
            energyAppId: ''
        };
    }

    componentDidMount() {
        let customer, packages, userAgent, application, packageName
        db.open().then(async function(){
            customer = await db.customer.toArray()
            customer = customer[0]
            userAgent = await db.userAgent.toArray()
            userAgent = userAgent[0]
            packages = await db.package.toArray()
            packages = packages[0]
        }).then(() => {
          this.setState({
            Reference: customer.resultKey,
            Firstname: customer.firstName,
            Lastname: customer.lastName,
            HomePhone: customer.telephone,
            Title: customer.Title,
            energyAppId: customer.energyAppId,
            Address1: customer.Address1,
            Address2: customer.Address2,
            Postcode: customer.Postcode,
            Town: customer.Town,
            County: customer.County,
            Email: customer.EmailAddress,
            SalesAgentId: userAgent.SalesAgentId,
            CallcentreId: userAgent.CallcentreId,
            MediaPackageId: packages.packageName,
            PackageName: packages.packageName
          })
          this.doSubmit()
        })  
    }

    doSubmit() {
        // If a multi journey - submit the application
        if (this.props.globalState.isMultiJourney) {
            insertLog(1, "Thank_you Multi Submit", JSON.stringify(this.state));
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.post(process.env.REACT_APP_API + 'Media/SubmitApplication', {
                "Title": this.state.Title,
                "Firstname": this.state.Firstname,
                "Surname": this.state.Lastname,
                "Address1": this.state.Address1,
                "Address2": this.state.Address2,
                "Postcode": this.state.Postcode,
                "HomePhone": this.state.HomePhone,
                "Email": this.state.Email,
                "SalesAgentId": this.state.SalesAgentId,
                "CallcentreId": this.state.CallcentreId,
                "MediaPackageId": this.state.MediaPackageId,
                "EnergyApplicationId": this.state.energyAppId,
                "LeadLogId": this.state.Reference,
                "Source": 'CC'
            })
            .then(response => {
                this.setState({ Reference: response.data.Result });
            })
            .catch(error => {                                               
                insertLog(3, "Media/SubmitApplication", error );                                               
            })
        }
        // If a BT journey - auto submit the outcome
        if (this.props.globalState.isBtJourney ) {
            insertLog(1, "Thank_you BT Submit", JSON.stringify(this.state));
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.post(process.env.REACT_APP_API + 'AgentLeadOutcome/Post', {
                "Address1": this.state.Address1,
                "Address2": this.state.Address2,
                "Town": this.state.Town,
                "County": this.state.County,
                "Postcode": this.state.Postcode,
                "LeadOutcomeId": 7,
                "LeadOutcome": 7,
                "SalesAgentId": this.state.SalesAgentId,
                "LeadLogId": this.state.Reference
            })
            .then(response => {
                console.log(":: ", response.data, this.state.SalesAgentId)
            })
            .catch(error => {                                               
                insertLog(3, "AgentLeadOutcome/Post", error );                                               
            })
        }
    }
    
    render() {
        return (
            <div>
                <SecondaryHeader isShowNewQuote={true}/>
                <div className='feature-wrapper thank-you'>
                    <div className=''>
                        <h2>Thank you</h2>
                        { this.props.globalState.isBtJourney
                            ? <p>A BT member will be in touch with you shortly to arrange your perfect package.</p>
                            : <p>A member of our team will contact you soon to confirm your application for your perfect package.</p>
                        }
                        { this.props.globalState.isMultiJourney &&
                            <div>
                                <p>Your Utilities application reference is: <strong>{this.state.energyAppId}</strong></p>
                                <p>Your Broadband application reference is: <strong>{this.state.Reference}</strong></p>
                            </div>
                        }
                        { !this.props.globalState.isWeb && !this.props.globalState.isMultiJourney && 
                            <div>
                                <p>Your Broadband application reference is: <strong>{this.state.Reference}</strong></p>
                            </div>
                        }
                        <p/>
                        { this.props.globalState.isBtJourney &&
                        <div>
                            <p>Name: <strong>{this.state.Firstname + " " + this.state.Lastname}</strong></p>
                            <p>Phone: <strong>{this.state.HomePhone}</strong></p>
                            <p>Package: <strong>{this.state.PackageName}</strong></p>
                            <p>Address: <strong>{this.state.Address1 + " " + this.state.Address2 + ", " + this.state.Town + ", " + this.state.County + ", " + this.state.Postcode}</strong></p>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withGlobalState(ThankYou);