import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withGlobalState } from "react-globally";
import Outcome from "./outcome";
import SecondaryHeader from "./secondary_header";
import db from "./broadbandDatabase";
import { insertLog } from "../../monitor";

class Usage_Checker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      broadbandCheck: false,
      phoneCheck: false,
      smartCheck: false,
      entertainmentCheck: false,
      sportsCheck: false,
      moviesCheck: false,
      netflixCheck: false,
      primeCheck: false,
      nowCheck: false,
      errorMessage: ""
    };
  }

  broadbandCheck = e => {
    this.setState(prevState => ({ broadbandCheck: !prevState.broadbandCheck }));
  };

  phoneCheck = e => {
    this.setState(prevState => ({ phoneCheck: !prevState.phoneCheck }));
  };

  smartCheck = e => {
    this.setState(prevState => ({ smartCheck: !prevState.smartCheck }));
  };

  entertainmentCheck = e => {

    this.setState(prevState => ({ entertainmentCheck: !prevState.entertainmentCheck }));
  };

  sportsCheck = e => {
    this.setState(prevState => ({ sportsCheck: !prevState.sportsCheck }));
  };

  moviesCheck = e => {
    this.setState(prevState => ({ moviesCheck: !prevState.moviesCheck }));
  };

  netflixCheck = e => {
    this.setState(prevState => ({ netflixCheck: !prevState.netflixCheck }));
  };

  primeCheck = e => {
    this.setState(prevState => ({ primeCheck: !prevState.primeCheck }));
  };

  nowCheck = e => {

    this.setState(prevState => ({ nowCheck: !prevState.nowCheck }));
  };

  validateStep = e => {
    e.preventDefault();

    if (
      this.state.broadbandCheck === false &&
      this.state.phoneCheck === false &&
      this.state.smartCheck === false
    ) {
      this.setState({ errorMessage: "Select at least one package" });
    } else {
      db.open().then(async () => {
        await db.usage.put({ 
          broadbandCheck: this.state.broadbandCheck,
          phoneCheck: this.state.phoneCheck,
          smartCheck: this.state.smartCheck,
          entertainmentCheck: this.state.entertainmentCheck,
          sportsCheck: this.state.sportsCheck,
          moviesCheck: this.state.moviesCheck,
          netflixCheck: this.state.netflixCheck,
          primeCheck: this.state.primeCheck,
          nowCheck: this.state.nowCheck,
        }).then(() => {
          //console.log(">>> BB ",this.state.broadbandCheck + " - phone" + this.state.phoneCheck + " - smart" + this.state.smartCheck + " - ent" + this.state.entertainmentCheck  + " - sports" + this.state.sportsCheck + " - movies" + this.state.moviesCheck + " - netflix" + this.state.netflixCheck + " - now" + this.state.nowCheck + " - prime" + this.state.primeCheck)
          insertLog(1, "Usage_checker Submit", JSON.stringify(this.state));
          this.props.history.push("/device_checker");
        })
      })
    }
  };

  render() {
    //console.log('usage_checker render');
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
                <li className="current">
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
            </div>
          </>
        )}
        <div className="feature-wrapper">
          <div className="question-wrapper">
            <h2>Now tell us what you would like in your perfect package...</h2>
          </div>

          <div className="question-wrapper checkboxes">
            <h3>
              What media would you like in your perfect package?&nbsp;
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
          <button
            onClick={this.validateStep}
            className="link-btn"
          >
            Continue
          </button>
        </div>
        {this.props.globalState.isBtJourney && <Outcome />}
      </div>
    );
  }
}

export default withGlobalState(Usage_Checker);
