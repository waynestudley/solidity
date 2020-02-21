import React, { Component } from "react"
import { HashRouter as Router, Route } from "react-router-dom"
import Address_Checker from "./components/Broadband/address_checker"
import AvailabilityChecker from "./components/Broadband/availability_checker"
import UsageChecker from "./components/Broadband/usage_checker"
import DeviceChecker from "./components/Broadband/device_checker"
import PaymentChecker from "./components/Broadband/payment_checker"
import Result from "./components/Broadband/result"
import Login from "./components/Broadband/login"
import ApplicationForm from "./components/Broadband/application_form"
import PackageSummary from "./components/Broadband/package_summary"
import ThankYou from "./components/Broadband/thank_you"
import ApplicationList from "./components/Broadband/application_list"
import Signature from "./components/Broadband/signature"
import FormikForm from "./components/Broadband/formikForm"
import Homepage from "./components/Broadband/homepage"
import { withGlobalState } from "react-globally"
import db from "./components/Broadband/broadbandDatabase"
import axios from "axios"
import "./css/login.css"


// NEED TO SWAP BETWEEN THESE TWO CSS FILES DEPENDING ON WHERE IT'S BEING HOSTED...
import './css/Multi_Broadband.css' // -- Multi Journey / BT / MEx
// import './css/web_broadband.css' // -- Simply Switch

class AppBroadband extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMultiJourney: null,
      theme: ''
    }
  }

  componentDidMount() {
    //console.log('componentDidMount Broadband')
    //return ;
    let apiEndpointLogin = process.env.REACT_APP_API
    const urlParams = new URLSearchParams(window.location.search)
    const myParam = urlParams.get('theme')
    const energyAppId = urlParams.get('energyAppId')
    const token = urlParams.get('token')
    
    // Will need to remove the next line when we start saving offline leads
    db.delete()

    if (energyAppId && token )  { // Is a mixed journey 
      // First get loginSecurityGroup value from GetAgentDetails API using JWT
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      axios.post(process.env.REACT_APP_API + 'UserAccount/GetAgentDetails')
        .then(response => { 
            if(response.data && !response.status === 401) {
                this.setState({ 'sales_agent_id': response.data.SalesAgentId })
            }
            if (response.data === null || response.status === 401) {
                this.setState({ errorMessage: 'Invalid login or password' })
            } else if (
                this.props.platform === 'broadband_bt' &&
                response.data.CallCentre !== null &&
                response.data.CallCentre.ShowBroadbandWizard === true
            ) {
                this.setState({ isSubmitted: false })
                db.open().then(async () => {
                    await db.userAgent.put({
                      SalesAgentId: response.data.SalesAgentId,
                      CallcentreId: response.data.CallCentreId,
                      Name: response.data.Name,
                      loginData: JSON.stringify(response.data)
                    })
                })
                let userType = response.data.LoginSecurityGroup.split(",")
                // CHECK FOR MULTI USER ROLE
                //console.log(userType)
                for (var i = 0; i < userType.length; ++i) {
                    if (parseInt(userType[i]) === 8) {
                        this.props.setGlobalState(() => ({
                            isBt: true,
                        }))
                    }
                }
                this.setState({ isSubmitted: false })
                this.props.history.push('/start')
            } else {
                this.setState({ errorMessage: 'Office/User doesn\'t have permission' })
                this.setState({ isSubmitted: false })
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                this.setState({ errorMessage: 'An error has occured, please try again in a few miniutes' })
                this.setState({ isSubmitted: false })
            } else {
                this.setState({ errorMessage: 'Office/User doesn\'t have permission' })
                this.setState({ isSubmitted: false })
            }
        }
        );
      // Check that this agent has the role to perform a multi-journey - if not send them to the login page with no auth message

      this.setState({ isMultiJourney: true })
      this.props.setGlobalState(() => ({
          isMultiJourney: true,
          jwtAuth: token
      }))
      //axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      apiEndpointLogin += 'Energy/GetApplicationDetail?appId=' + energyAppId
      axios.post(apiEndpointLogin)
      .then(response => {
        let Address1, Address2, Address3, postcode, town, county
          for (var i = 0; i < response.data.Addresses.length; i++) {
            if(response.data.Addresses[i].Type === 'SUPPLY') {
                Address1 = response.data.Addresses[i].Address1
                Address2 = response.data.Addresses[i].Address2
                Address3 = response.data.Addresses[i].Address3
                postcode = response.data.Addresses[i].Postcode
                town = response.data.Addresses[i].City
                county = response.data.Addresses[i].County
                if(response.data.Addresses[i].Address2 !== 'null') {
                  Address2 = response.data.Addresses[i].Address2
                }
            }
          }
          //console.log("*** ", response.data)
          db.open().then(async () => {
          await db.userAgent.put({
            SalesAgentId: response.data.AgentNumber,
            CallcentreId: response.data.CallCentreId,
            Name: response.data.AgentName
          })
          await db.customer.put({
            Title: response.data.Title,
            Firstname: response.data.Firstname,
            Lastname: response.data.Lastname,
            Address1: Address1,
            Address2: Address2,
            Address3: Address3,
            Postcode: postcode,
            Town: town,
            County: county,
            SortCode: response.data.SortCode,
            AccountNumber: response.data.AccountNumber,
            AccountName: response.data.AccountName,
            BankName: response.data.BankName,
            TelephoneNumber: response.data.TelephoneNumber,
            EmailAddress: response.data.EmailAddress,
            energyAppId: energyAppId
          })
        })
        window.location.hash = "/availability_checker"
      })
      .catch(err => {
          console.log(err)
      })
    } else if (myParam === 'ss' || myParam === 'mex') {
      this.props.setGlobalState(() => ({
          isWeb: true,
          journeyTheme: myParam
      }))
      this.setState({ theme: myParam })
      
      apiEndpointLogin += 'auth/createtoken?username=bbwebuser&password=l0nd0n'
      axios.post(apiEndpointLogin)
      .then(response => {
          this.props.setGlobalState(() => ({
              jwtAuth: response.data
          }))
          window.location.hash = "/start"
      })
      .catch(err => {
          console.log(err)
      })
    }
  }

  getAppClassList = () =>{
    let returnValue = 'App'
    if(this.myParam === "multi"){
        returnValue += ' intergrated-broadband-wrapper'
    }
    return returnValue
  }

  render() {
    //console.log('Broadband render')
    const platform = { platform: "broadband_bt" }
    return (
      <Router>
        <div className={this.getAppClassList()}>
          {!this.state.isMultiJourney === true && this.state.theme === '' &&
            <Route exact path="/" render={routeProps => <Login {...routeProps} {...platform} />} />
          }
          {this.state.isMultiJourney &&
            <Route exact path="/" render={routeProps => <AvailabilityChecker {...routeProps} {...platform} />} />
          }
          <Route path="/start" component={Homepage} />
          <Route path="/address_checker" component={Address_Checker} />

          <Route
            path="/availability_checker"
            component={AvailabilityChecker}
          />
          <Route path="/usage_checker" component={UsageChecker} />
          <Route path="/device_checker" component={DeviceChecker} />
          <Route path="/payment_checker" component={PaymentChecker} />
            
          <Route path="/result" component={Result} />
          <Route path="/application_form" component={ApplicationForm} />
          <Route path="/package_summary" component={PackageSummary} />
          <Route path="/thank_you" component={ThankYou} />
          <Route path="/application_list" component={ApplicationList} />
          <Route path="/signature" component={Signature} />
          <Route path="/formik_form" component={FormikForm} />
        </div>
      </Router>
    )
  }
}

export default withGlobalState(AppBroadband)
