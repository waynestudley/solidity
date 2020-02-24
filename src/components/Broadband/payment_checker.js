import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SecondaryHeader from "./secondary_header";
import { withGlobalState } from "react-globally";
import { Formik } from "formik";
import Outcome from "./outcome";
import db from "./broadbandDatabase";

class Payment_Checker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      CurrentMediaPackageBroadband: "",
      CurrentMediaPackagePhone: "",
      CurrentMediaPackageTV: "",
      CurrentMediaPackagesMovies: "",
      CurrentMediaPackageSports: "",
      CurrentMediaPackageEntertainment: "",
      CurrentStreamServicesNetflix: "",
      CurrentStreamServicesPrime: "",
      CurrentStreamServicesNowTV: "",
      NumDevicesHighUse: "",
      NumDevicesMediumUse: "",
      NumDevicesLowUse: "",
      currentPay: null,
      data: []
    };
  }
  
  componentWillMount() {
    let customerServices, usage, devices
    db.open().then(async function(){
        customerServices = await db.customerServices.toArray()
        customerServices = customerServices[0]
        usage = await db.usage.toArray()
        usage = usage[0]
        devices = await db.devices.toArray()
        devices = devices[0]
    }).then(() => {
      this.setState({
        CurrentMediaPackageBroadband: usage.broadbandCheck,
        CurrentMediaPackagePhone: usage.phoneCheck,
        CurrentMediaPackageSmartTV: usage.smartCheck,
        CurrentMediaPackageMovies: usage.moviesCheck,
        CurrentMediaPackageSports: usage.sportsCheck,
        CurrentMediaPackageEntertainment: usage.entertainmentCheck,
        CurrentStreamServicesNetflix: usage.netflixCheck,
        CurrentStreamServicesPrime: usage.primeCheck,
        CurrentStreamServicesNowTV: usage.nowTvCheck,
        NumDevicesHighUse: devices.numDevicesHighUse,
        NumDevicesMediumUse: devices.numDevicesMediumUse,
        NumDevicesLowUse: devices.numDevicesLowUse,
      })
      if (!this.props.globalState.isBtJourney) {
        this.getOfcom();
      }
    })
  }

  getOfcom() {
    if (!this.props.globalState.isBtJourney) {
      axios.post(process.env.REACT_APP_API + "Media/GetOfcomBand", {
        CurrentMediaPackageBroadband: this.state.CurrentMediaPackageBroadband,
        CurrentMediaPackagePhone: this.state.CurrentMediaPackagePhone,
        CurrentMediaPackageTV: this.state.CurrentMediaPackageTV,

        CurrentMediaPackageMovies: this.state.CurrentMediaPackagesMovies,
        CurrentMediaPackageSports: this.state.CurrentMediaPackageSports,
        CurrentMediaPackageEntertainment: this.state.CurrentMediaPackageEntertainment,

        CurrentStreamServicesNetflix: this.state.CurrentStreamServicesNetflix,
        CurrentStreamServicesPrime: this.state.CurrentStreamServicesPrime,
        CurrentStreamServicesNowTV: this.state.CurrentStreamServicesNowTV,

        NumDevicesHighUse: this.state.NumDevicesHighUse,
        NumDevicesMediumUse: this.NumDevicesMediumUse,
        NumDevicesLowUse: this.state.NumDevicesLowUse
      })
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  getSpeedDescription(min, max) {
    if (max < 1000) {
      return "using between " + min + " and " + max + " Gb a month";
    } else {
      return "using more than " + min + " Gb a month";
    }
  }

  render() {
    return (
      <div>
        {this.props.globalState.isMultiJourney === false && (
          <>
            <SecondaryHeader />
            <div className="breadcrumb-wrapper">
              <ul>
                <li>
                  <Link to="/availability_checker">
                    <span>Current provider</span>
                  </Link>
                </li>
                <li>
                  <Link to="/usage_checker">
                    <span>Package Type</span>
                  </Link>
                </li>
                <li>
                  <Link to="/device_checker">
                    <span>Your Devices</span>
                  </Link>
                </li>
                <li className="current">
                  <a href="#/">
                    <span>Current cost</span>
                  </a>
                </li>
                <li className="future">
                  <a href="#/">
                    <span>Quote</span>
                  </a>
                </li>
                <li className="future">
                  <a href="#/">
                    <span>Package summary</span>
                  </a>
                </li>
                <li className="future">
                  <a href="#/">
                    <span>Apply</span>
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
        <div className="feature-wrapper payment">
          {!this.props.globalState.isBtJourney ? (
            <div>
              <h2>Ofcom suggests you are:</h2>
              <h3>
                A <b>{this.state.data.Name}</b> user
              </h3>
              <p className="bandwidth-use">
                (
                {this.getSpeedDescription(
                  this.state.data.MinValueOfcom,
                  this.state.data.MaxValueOfcom
                )}
                )
              </p>
            </div>
          ) : (
            ""
          )}

          <div className="question-wrapper">
            <h2>Finally, tell us what you currently pay...</h2>

            <Formik
              initialValues={{
                payment: this.state.currentPay
              }}
              onSubmit={(values) => {
                db.open().then(async () => {
                  await db.currentPay.put({ 
                    currentMonthlyPayment: values.payment
                  }).then(() => {
                    this.props.history.push("/result");
                  })
                })
                return true;
              }}
              validate={values => {
                const errors = {};
                if (!values.payment && values.payment !== "0")
                  errors.payment = "Required";
                return errors;
              }}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <label>How much do you currently spend per month?</label>
                      <div className="payment-input-wrapper">
                        <input
                          id="payment"
                          type="number"
                          min="0"
                          value={values.payment || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{
                            borderColor:
                              props.errors.payment &&
                              props.touched.payment &&
                              "tomato"
                          }}
                        />
                        <span className="pound-sign">&pound;</span>
                      </div>
                      {errors.payment && touched.payment && (
                        <div className="validation_text">{errors.payment}</div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="link-btn tight-right"
                      disabled={isSubmitting}
                    >
                      Continue
                    </button>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
        {this.props.globalState.isBtJourney && <Outcome />}
      </div>
    );
  }
}

export default withGlobalState(Payment_Checker);
