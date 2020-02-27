import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { withGlobalState } from "react-globally";
import SecondaryHeader from "./secondary_header";
import ClipLoader from "react-spinners/ClipLoader";
import Outcome from "./outcome";
import { Formik } from "formik";
import db from "./broadbandDatabase";
import { insertLog } from "../../monitor";

class Availability_Checker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: 0,
      years: 0,
      months: 0,
      postcode: "",
      hasAerial: false,
      canHaveVirgin: false,
      providerList: [],
      wasBtJourney: this.props.globalState.isBtJourney,
      formStep1: false,
      formStep2: false,
      formStep3: false,
      payment: null,
      totalMonths: 0,

      broadbandCheck: false,
      phoneCheck: false,
      smartCheck: false,
      entertainmentCheck: false,
      sportsCheck: false,
      moviesCheck: false,
      netflixCheck: false,
      primeCheck: false,
      nowCheck: false,
      errorMessage1: "",

      mobile: 0,
      tablets: 0,
      laptops: 0,
      tvs: 0,
      consoles: 0,
      watches: 0,
      hubs: 0,
      speakers: 0,
      meters: 0,
      errorMessage2: "",

      CurrentMediaPackageBroadband: 0,
      CurrentMediaPackagePhone: 0,
      CurrentMediaPackageTV: 0,
      CurrentMediaPackagesMovies: 0,
      CurrentMediaPackageSports: 0,
      CurrentMediaPackageEntertainment: 0,
      CurrentStreamServicesNetflix: 0,
      CurrentStreamServicesPrime: 0,
      CurrentStreamServicesNowTV: 0,
      NumDevicesHighUse: 0,
      NumDevicesMediumUse: 0,
      NumDevicesLowUse: 0,
      data: [],
      providersLoaded: false
    };
  }



  componentDidMount() {
    db.customerServices.clear();
    db.usage.clear();
    db.currentPay.clear();
    db.devices.clear();

    if (this.props.globalState.isMultiJourney) {
      window.history.replaceState({}, null, "/index.html");
    }

    this.setState({
      provider: 0,
      years: 0,
      months: 0,
      hasAerial: false,
      canHaveVirgin: false,
      broadbandCheck: false,
      phoneCheck: false,
      smartCheck: false,
      moviesCheck: false,
      sportsCheck: false,
      entertainmentCheck: false,
      netflixCheck: false,
      primeCheck: false,
      nowCheck: false,
      mobile: false,
      tvs: false,
      laptops: false,
      tablets: false,
      consoles: false,
      speakers: false,
      watches: false,
      meters: false,
      hubs: false
    });

    axios.defaults.headers.common["Authorization"] =
      "Bearer " + this.props.globalState.jwtAuth;
    axios
      .post(process.env.REACT_APP_API + "Media/GetProviderList")
      .then(response => {
        this.setState({
          providerList: response.data,
          providersLoaded: true
        });
      })
      .catch(err => {
        console.error(":::::" + err);
      });
  }

  onChange = e => {
    var value = e.target.value;
    this.setState({ provider: value });
  };

  usageYearChange = e => {
    this.setState({ years: e.target.value });
  };

  usageMonthChange = e => {
    this.setState({ months: e.target.value });
  };

  supplierPostcode = e => {
    this.setState({ postcode: e.target.value });
  };

  // **********************************

  broadbandCheck = () => {
    this.setState(prevState => ({ broadbandCheck: !prevState.broadbandCheck }));
  };

  phoneCheck = () => {
    this.setState(prevState => ({ phoneCheck: !prevState.phoneCheck }));
  };

  smartCheck = () => {
    this.setState(prevState => ({ smartCheck: !prevState.smartCheck }));
  };

  entertainmentCheck = () => {
    this.setState(prevState => ({
      entertainmentCheck: !prevState.entertainmentCheck
    }));
  };

  sportsCheck = () => {
    this.setState(prevState => ({ sportsCheck: !prevState.sportsCheck }));
  };

  moviesCheck = () => {
    this.setState(prevState => ({ moviesCheck: !prevState.moviesCheck }));
  };

  netflixCheck = () => {
    this.setState(prevState => ({ netflixCheck: !prevState.netflixCheck }));
  };

  primeCheck = () => {
    this.setState(prevState => ({ primeCheck: !prevState.primeCheck }));
  };
  nowCheck = () => {
    this.setState(prevState => ({ nowCheck: !prevState.nowCheck }));
  };

  validateUsage = e => {
    //console.log(this.state.errorMessage1);
    e.preventDefault();
    if (
      this.state.broadbandCheck === false &&
      this.state.phoneCheck === false &&
      this.state.smartCheck === false
    ) {
      this.setState({ errorMessage1: "Select at least one package" });
    } else {
      this.setState({ errorMessage1: "" });
      this.setState(
        {
          formStep2: true
        },
        () => {
          document
            .getElementById("step3")
            .scrollIntoView({ behavior: "smooth" });
        }
      );
    }
  };

  // **********************************

  changeMobile = e => {
    this.setState({ mobile: e.target.value });
    this.updateDeviceTotals();
  };

  changeTablets = e => {
    this.setState({ tablets: e.target.value });
    this.updateDeviceTotals();
  };

  changeLaptops = e => {
    this.setState({ laptops: e.target.value });
    this.updateDeviceTotals();
  };

  changeTvs = e => {
    this.setState({ tvs: e.target.value });
    this.updateDeviceTotals();
  };

  changeConsoles = e => {
    this.setState({ consoles: e.target.value });
    this.updateDeviceTotals();
  };

  changeWatches = e => {
    this.setState({ watches: e.target.value });
    this.updateDeviceTotals();
  };

  changeHubs = e => {
    this.setState({ hubs: e.target.value });
    this.updateDeviceTotals();
  };

  changeSpeakers = e => {
    this.setState({ speakers: e.target.value });
    this.updateDeviceTotals();
  };

  changeMeters = e => {
    this.setState({ meters: e.target.value });
    this.updateDeviceTotals();
  };

  updateDeviceTotals = () => {

    let HighUse = 0;
    if (isNaN(this.state.mobile) === false) HighUse += +this.state.mobile;
    if (isNaN(this.state.tvs) === false) HighUse += +this.state.tvs;
    if (isNaN(this.state.laptops) === false) HighUse += +this.state.laptops;
    if (isNaN(this.state.tablets) === false) HighUse += +this.state.tablets;

    let MediumUse = 0;
    if (isNaN(this.state.consoles) === false) MediumUse += +this.state.consoles;
    if (isNaN(this.state.speakers) === false) MediumUse += +this.state.speakers;

    let LowUse = 0;
    if (isNaN(this.state.watches) === false) LowUse += +this.state.watches;
    if (isNaN(this.state.meters) === false) LowUse += +this.state.meters;
    if (isNaN(this.state.hubs) === false) LowUse += +this.state.hubs;

    this.setState({
      NumDevicesHighUse: HighUse,
      NumDevicesMediumUse: MediumUse,
      NumDevicesLowUse: LowUse
    });

  }

  validateStep = e => {
    e.preventDefault();

    var HighUse = 0;
    if (isNaN(this.state.mobile) === false) HighUse += +this.state.mobile;
    if (isNaN(this.state.tvs) === false) HighUse += +this.state.tvs;
    if (isNaN(this.state.laptops) === false) HighUse += +this.state.laptops;
    if (isNaN(this.state.tablets) === false) HighUse += +this.state.tablets;

    var MediumUse = 0;
    if (isNaN(this.state.consoles) === false) MediumUse += +this.state.consoles;
    if (isNaN(this.state.speakers) === false) MediumUse += +this.state.speakers;

    var LowUse = 0;
    if (isNaN(this.state.watches) === false) LowUse += +this.state.watches;
    if (isNaN(this.state.meters) === false) LowUse += +this.state.meters;
    if (isNaN(this.state.hubs) === false) LowUse += +this.state.hubs;

    this.setState({
      NumDevicesHighUse: HighUse,
      NumDevicesMediumUse: MediumUse,
      NumDevicesLowUse: LowUse
    });

    if (HighUse === 0 && MediumUse === 0 && LowUse === 0) {
      this.setState({ errorMessage2: "Select at least one device" });
    } else {
      this.setState(
        {
          formStep3: true
        },
        () => {
          document
            .getElementById("step4")
            .scrollIntoView({ behavior: "smooth" });
        }
      );
    }
  };

  getOptionList = () => {
    return (
      <>
        <option defaultValue value="0">
          0
        </option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6+</option>
      </>
    );
  };

  render() {
    this.providerList = this.state.providerList.map(item => {
      return (
        <option key={item.Id} value={item.Id}>
          {item.ProviderName}
        </option>
      );
    });
    return (
      <div className="integrated-broadband-wrapper">
        <SecondaryHeader />
        <div className="breadcrumb-wrapper integrated-broadband-wrapper">
          {this.props.globalState.isMultiJourney ? (
            <ul>
              <li className="current">
                <Link to="/availability_checker">
                  <span>Current provider</span>
                </Link>
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
          ) : (
            <ul>
              <li className="current">
                <Link to="/availability_checker">
                  <span>Current provider</span>
                </Link>
              </li>
              <li className="future">
                <a href="#/">
                  <span>Package Type</span>
                </a>
              </li>
              <li className="future">
                <a href="#/">
                  <span>Your Devices</span>
                </a>
              </li>
              <li className="future">
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
          )}
        </div>

        <div className="feature-wrapper">
          <div className="availability-wrapper">
            <h2>Broadband availability</h2>
          </div>
          <div className="question-wrapper">
            <h2>
              Just a few questions to help us find the most suitable broadband
              package for you...
            </h2>

            <Formik
              initialValues={{
                providerId: this.state.provider,
                years: this.state.years,
                months: this.state.months,
                aerial: this.state.hasAerial,
                canHaveVirgin: this.state.canHaveVirgin
              }}
              onSubmit={values => {
                
                insertLog(1, "Availability_checker Submit", JSON.stringify(values));
                const conversion = values.years * 12;
                this.setState({
                  years: values.years,
                  months: values.months,
                  totalMonths: conversion + values.months,
                  hasAerial: values.aerial,
                  canHaveVirgin: values.canHaveVirgin,
                  providerId: values.providerId
                });

                // REMOVE FROM BT JOURNEY IF CURRENTLY A BT USER
                if (parseInt(values.providerId) === 1110) {
                  this.props.setGlobalState(() => ({
                    isBtJourney: false
                  }));
                }
                if (this.props.globalState.isMultiJourney) {
                  this.setState({ formStep1: true });
                } else {
                  db.open().then(async () => {
                    await db.customerServices
                      .put({
                        years: this.state.years,
                        months: this.state.months,
                        total: this.state.totalMonths,
                        provider: this.state.providerId,
                        hasAerial: this.props.globalState.isBtJourney
                          ? false
                          : this.state.hasAerial,
                        canHaveVirgin: this.props.globalState.isBtJourney
                          ? false
                          : this.state.canHaveVirgin
                      })
                      .then(() => {
                        this.props.history.push("/usage_checker");
                      });
                  });
                }
                return true;
              }}
              validate={values => {
                // REMOVE FROM BT JOURNEY IF CURRENTLY A BT USER
                if (parseInt(values.providerId) === 1110) {
                  this.props.setGlobalState(() => ({
                    isBtJourney: false
                  }));
                } else {
                  if (this.state.wasBtJourney) {
                    this.props.setGlobalState(() => ({
                      isBtJourney: true
                    }));
                  }
                }
                const errors = {};
                if (!values.providerId) {
                  errors.providerId = "Required";
                }
                if (
                  parseInt(values.years) === 0 &&
                  parseInt(values.months) === 0 &&
                  parseInt(values.providerId) > 0
                ) {
                  errors.totalMonths = "Required";
                }
                if (
                  !Number.isInteger(values.years) &&
                  !Number.isInteger(values.months) &&
                  parseInt(values.providerId) > 0
                ) {
                  errors.totalMonths = "Required";
                }
                if (!this.props.globalState.isBtJourney) {
                  if (!values.aerial) {
                    errors.aerial = "Required";
                  }
                  if (!values.canHaveVirgin) {
                    errors.canHaveVirgin = "Required";
                  }
                }
                return errors;
              }}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleSubmit,
                  setFieldValue
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <label>Who is your current provider?</label>
                      {!this.state.providersLoaded ? (
                        <ClipLoader
                          size={1.35}
                          sizeUnit="rem"
                          color="#203a54"
                        />
                      ) : (
                        <select
                          id="providerId"
                          name="providerId"
                          value={props.values.providerId || ""}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        >
                          <option value="" defaultValue>
                            Please select
                          </option>
                          <option value="-1">I don't have Broadband</option>
                          {this.providerList}
                        </select>
                      )}
                      {errors.providerId && touched.providerId && (
                        <div className="validation_text">
                          {errors.providerId}
                        </div>
                      )}
                    </div>
                    {values.providerId > 0 && (
                      <div className="form-row multi">
                        <label>
                          How long have you been with this provider?
                        </label>
                        <div className="multi-field-row">
                          <input
                            id="years"
                            name="years"
                            type="number"
                            min="0"
                            value={props.values.years || ""}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            style={{
                              borderColor: props.errors.totalMonths && "tomato"
                            }}
                          />
                          <label>&nbsp;Years&nbsp;&nbsp;</label>

                          <input
                            id="months"
                            name="months"
                            type="number"
                            min="0"
                            value={props.values.months || ""}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            style={{
                              borderColor: props.errors.totalMonths && "tomato"
                            }}
                          />
                          <label>&nbsp;Months</label>

                          {errors.totalMonths && (
                            <div className="validation_text">
                              {errors.totalMonths}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!this.props.globalState.isBtJourney && (
                      <div className="form-row multi radio">
                        <label>Do you have an aerial?</label>
                        <div className="multi-field-row">
                          <label htmlFor="aerialYes" className="radio-label">
                            <input
                              id="aerialYes"
                              name="aerial"
                              type="radio"
                              value="true"
                              onChange={() => setFieldValue("aerial", "true")}
                              checked={values.aerial === "true"}
                            />
                            Yes
                          </label>
                          <label htmlFor="aerialNo" className="radio-label">
                            <input
                              id="aerialNo"
                              name="aerial"
                              type="radio"
                              value="false"
                              onChange={() => setFieldValue("aerial", "false")}
                              checked={values.aerial === "false"}
                            />
                            No
                          </label>
                          {errors.aerial && (
                            <label className="validation_text">
                              {errors.aerial}
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                    {!this.props.globalState.isBtJourney && (
                      <div className="form-row multi radio">
                        <label>Can you have Virgin Media?</label>
                        <div className="multi-field-row">
                          <label
                            htmlFor="canHaveVirginYes"
                            className="radio-label"
                          >
                            <input
                              id="canHaveVirginYes"
                              name="canHaveVirgin"
                              type="radio"
                              value="true"
                              onChange={() =>
                                setFieldValue("canHaveVirgin", "true")
                              }
                              checked={values.canHaveVirgin === "true"}
                            />
                            Yes
                          </label>
                          <label
                            htmlFor="canHaveVirginNo"
                            className="radio-label"
                          >
                            <input
                              id="canHaveVirginNo"
                              name="canHaveVirgin"
                              type="radio"
                              value="false"
                              onChange={() =>
                                setFieldValue("canHaveVirgin", "false")
                              }
                              checked={values.canHaveVirgin === "false"}
                            />
                            No
                          </label>
                          {errors.canHaveVirgin && (
                            <label className="validation_text">
                              {errors.canHaveVirgin}
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    {!this.state.formStep1 && (
                      <button
                        type="submit"
                        className="link-btn"
                        disabled={isSubmitting}
                      >
                        Continue
                      </button>
                    )}
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>

        {this.props.globalState.isMultiJourney && this.state.formStep1 && (
          <div className="feature-wrapper">
            <div className=" question-wrapper checkboxes">
              <h3>
                What media would you like in your perfect package?
                <span
                  className="validation_text"
                  style={
                    this.state.errorMessage1 !== ""
                      ? { display: "inline-block" }
                      : { display: "none" }
                  }
                >
                  {this.state.errorMessage1}
                </span>
              </h3>

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="broadbandCheck"
                  name="broadbandCheck"
                  onChange={this.broadbandCheck}
                  checked={this.state.broadbandCheck === true}
                />
                <label htmlFor="broadbandCheck" className="icon icon-broadband">
                  <span className="slider">Broadband</span>
                </label>
              </div>

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="phoneCheck"
                  name="phoneCheck"
                  onChange={this.phoneCheck}
                  checked={this.state.phoneCheck === true}
                />
                <label htmlFor="phoneCheck" className="icon icon-phone">
                  <span className="slider">Phone</span>
                </label>
              </div>

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="smartCheck"
                  name="smartCheck"
                  onChange={this.smartCheck}
                  checked={this.state.smartCheck === true}
                />
                <label htmlFor="smartCheck" className="icon icon-tv">
                  <span className="slider">Smart TV</span>
                </label>
              </div>
            </div>

            <div className="question-wrapper checkboxes">
              <h3>What would you like in your TV package?</h3>

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="moviesCheck"
                  name="moviesCheck"
                  onChange={this.moviesCheck}
                  checked={this.state.moviesCheck === true}
                />
                <label htmlFor="moviesCheck" className="icon icon-movies">
                  <span className="slider">Movies</span>
                </label>
              </div>

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="sportsCheck"
                  name="sportsCheck"
                  onChange={this.sportsCheck}
                  checked={this.state.sportsCheck === true}
                />
                <label htmlFor="sportsCheck" className="icon icon-sports">
                  <span className="slider">Sports</span>
                </label>
              </div>

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="entertainmentCheck"
                  name="entertainmentCheck"
                  onChange={this.entertainmentCheck}
                  checked={this.state.entertainmentCheck === true}
                />
                <label
                  htmlFor="entertainmentCheck"
                  className="icon icon-entertainment"
                >
                  <span className="slider">Entertainment</span>
                </label>
              </div>
            </div>
            {!this.props.globalState.isBtJourney && (
              <div className="question-wrapper checkboxes">
                <h3>Which on-demand TV services do you use?</h3>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="netflixCheck"
                    name="netflixCheck"
                    onChange={this.netflixCheck}
                    checked={this.state.netflixCheck === true}
                  />
                  <label
                    htmlFor="netflixCheck"
                    className="icon logo icon-netflix"
                  >
                    <span className="slider">Netflix</span>
                  </label>
                </div>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="primeCheck"
                    name="primeCheck"
                    onChange={this.primeCheck}
                    checked={this.state.primeCheck === true}
                  />
                  <label
                    htmlFor="primeCheck"
                    className="icon logo icon-amazon-prime"
                  >
                    <span className="slider">Prime Video</span>
                  </label>
                </div>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="nowCheck"
                    name="nowCheck"
                    onChange={this.nowCheck}
                    checked={this.state.nowCheck === true}
                  />
                  <label htmlFor="nowCheck" className="icon logo icon-now-tv">
                    <span className="slider">Now TV</span>
                  </label>
                </div>
              </div>
            )}
            {!this.state.formStep2 && (
              <button
                type="submit"
                onClick={this.validateUsage}
                className="link-btn"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {this.props.globalState.isMultiJourney && this.state.formStep2 && (
          <div className="feature-wrapper" id="step3">
            <div className="question-wrapper">
              <h2>Now tell us about your connected devices...</h2>
            </div>

            <div className="question-wrapper numbered-boxes">
              <h3>
                <span
                  className="validation_text"
                  style={
                    this.state.errorMessage2 !== ""
                      ? { display: "inline-block" }
                      : { display: "none" }
                  }
                >
                  {this.state.errorMessage2}
                </span>
              </h3>

              <div
                className={
                  this.state.mobile > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Mobile phones</label>
                  <div className="icon-wrapper icon-mobile-phone">
                    <select
                      className="with-icon"
                      onChange={this.changeMobile}
                      value={this.state.mobile || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className={
                  this.state.tablets > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Tablets</label>
                  <div className="icon-wrapper icon-tablet">
                    <select
                      className="with-icon"
                      onChange={this.changeTablets}
                      value={this.state.tablets || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className={
                  this.state.laptops > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Laptops</label>
                  <div className="icon-wrapper icon-laptop">
                    <select
                      className="with-icon"
                      onChange={this.changeLaptops}
                      value={this.state.laptops || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="question-wrapper numbered-boxes">
              <div
                className={
                  this.state.tvs > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Smart TVs</label>
                  <div className="icon-wrapper icon-smart-tv">
                    <select
                      className="with-icon"
                      onChange={this.changeTvs}
                      value={this.state.tvs || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className={
                  this.state.consoles > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Game consoles</label>
                  <div className="icon-wrapper icon-game-console">
                    <select
                      className="with-icon"
                      onChange={this.changeConsoles}
                      value={this.state.consoles || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className={
                  this.state.watches > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Smart watches</label>
                  <div className="icon-wrapper icon-smart-watch">
                    <select
                      className="with-icon"
                      onChange={this.changeWatches}
                      value={this.state.watches || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="question-wrapper numbered-boxes">
              <div
                className={
                  this.state.hubs > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Home hubs</label>
                  <div className="icon-wrapper icon-home-hub">
                    <select
                      className="with-icon"
                      onChange={this.changeHubs}
                      value={this.state.hubs || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className={
                  this.state.speakers > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Streaming speakers</label>
                  <div className="icon-wrapper icon-streaming">
                    <select
                      className="with-icon"
                      onChange={this.changeSpeakers}
                      value={this.state.speakers || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className={
                  this.state.meters > 0
                    ? "icon-select-wrapper selected"
                    : "icon-select-wrapper"
                }
              >
                <div className="icon-select-inner-wrapper">
                  <label>Smart meters</label>
                  <div className="icon-wrapper icon-smart-meter">
                    <select
                      className="with-icon"
                      onChange={this.changeMeters}
                      value={this.state.meters || ""}
                    >
                      {this.getOptionList()}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {!this.state.formStep3 && (
              <button
                type="submit"
                onClick={this.validateStep}
                className="link-btn"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {this.props.globalState.isMultiJourney && this.state.formStep3 && (
          <div className="feature-wrapper" id="step4">
            <div className="question-wrapper">
              <h2>Finally, tell us what you currently pay...</h2>

              <Formik
                initialValues={{
                  payment: this.state.payment
                }}
                onSubmit={values => {
                  //availability checker

                  db.open()
                    .then(async () => {
                      await db.customerServices.put({
                        years: this.state.years,
                        months: this.state.months,
                        total: this.state.totalMonths,
                        provider: this.state.providerId,
                        hasAerial: this.props.globalState.isBtJourney
                          ? false
                          : this.state.hasAerial,
                        canHaveVirgin: this.props.globalState.isBtJourney
                          ? false
                          : this.state.canHaveVirgin
                      });
                    })
                    .then(async () => {
                      await db.usage.put({
                        broadbandCheck: this.state.broadbandCheck,
                        phoneCheck: this.state.phoneCheck,
                        smartCheck: this.state.smartCheck,
                        entertainmentCheck: this.state.entertainmentCheck,
                        sportsCheck: this.state.sportsCheck,
                        moviesCheck: this.state.moviesCheck,
                        netflixCheck: this.state.netflixCheck,
                        primeCheck: this.state.primeCheck,
                        nowCheck: this.state.nowCheck
                      });
                    })
                    .then(async () => {
                      await db.devices.put({
                        numDevicesHighUse: this.state.NumDevicesHighUse,
                        numDevicesMediumUse: this.state.NumDevicesMediumUse,
                        numDevicesLowUse: this.state.NumDevicesLowUse
                      });
                    })
                    .then(async () => {
                      await db.currentPay.put({
                        currentMonthlyPayment: values.payment
                      });
                    });

                  this.setState({ payment: values.payment });
                  if(this.state.payment) {
                    this.props.history.push("/result");
                  }
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
                        <label>
                          How much do you currently spend per month?
                        </label>
                        <span className="pound-sign">&pound;&nbsp;</span>
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
                        </div>
                        {errors.payment && touched.payment && (
                          <div className="validation_text">
                            {errors.payment}
                          </div>
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
        )}

        {this.props.globalState.isBt && this.props.globalState.isBtJourney && (
          <Outcome />
        )}
      </div>
    );
  }
}

export default withGlobalState(Availability_Checker);
