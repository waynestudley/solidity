import React, { Component } from "react";
import { Link } from "react-router-dom";
import SecondaryHeader from "./secondary_header";
import { withGlobalState } from "react-globally";
import Outcome from "./outcome";
import db from "./broadbandDatabase";

class Devices_Checker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: 0,
      tablets: 0,
      laptops: 0,
      tvs: 0,
      consoles: 0,
      watches: 0,
      hubs: 0,
      speakers: 0,
      meters: 0,
      errorMessage: ""
    };
  }

  changeMobile = e => {
    this.setState({ mobile: e.target.value });
  };

  changeTablets = e => {
    this.setState({ tablets: e.target.value });
  };

  changeLaptops = e => {
    this.setState({ laptops: e.target.value });
  };

  changeTvs = e => {
    this.setState({ tvs: e.target.value });
  };

  changeConsoles = e => {
    this.setState({ consoles: e.target.value });
  };

  changeWatches = e => {
    this.setState({ watches: e.target.value });
  };

  changeHubs = e => {
    this.setState({ hubs: e.target.value });
  };

  changeSpeakers = e => {
    this.setState({ speakers: e.target.value });
  };

  changeMeters = e => {
    this.setState({ meters: e.target.value });
  };

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

    if (HighUse === 0 && MediumUse === 0 && LowUse === 0) {
      this.setState({ errorMessage: "Select at least one device" });
    } else {
      db.open().then(async () => {
        await db.devices
          .put({
            numDevicesHighUse: HighUse,
            numDevicesMediumUse: MediumUse,
            numDevicesLowUse: LowUse
          })
          .then(() => {
            this.props.history.push("/payment_checker");
          });
      });
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
                <li className="current">
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
            </div>
          </>
        )}

        <div className="feature-wrapper">
          <div className="question-wrapper">
            <h2>Now tell us about your connected devices...</h2>
          </div>

          <div className="question-wrapper numbered-boxes">
            <h3>
              How many devices do you have connected to your wi-fi?&nbsp;
              <span
                className="validation_text"
                style={
                  this.state.errorMessage !== ""
                    ? { display: "inline-block" }
                    : { display: "none" }
                }
              >
                {this.state.errorMessage}
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

          <Link
            to="/payment_checker"
            className="link-btn"
            onClick={this.validateStep}
          >
            Continue
          </Link>
        </div>
        {this.props.globalState.isBtJourney && <Outcome />}
      </div>
    );
  }
}
export default withGlobalState(Devices_Checker);
