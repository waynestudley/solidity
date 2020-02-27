import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { withGlobalState } from "react-globally";
import SecondaryHeader from "./secondary_header";
import Outcome from "./outcome";
import ClipLoader from "react-spinners/ClipLoader";
import db from "./broadbandDatabase";
import { insertLog } from "../../monitor";

class PackageSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      firstName: "",
      lastName: "",
      telNo: "",
      passed_id: "",
      data: "",
      media_provider: "",
      media_features: [],
      Postcode: "",
      CurrentProviderId: "",
      CurrentProviderMonths: "",
      Broadband: "",
      Phone: "",
      TV: "",
      Entertainment: "",
      Sports: "",
      Movies: "",
      Netflix: "",
      Prime: "",
      NowTV: "",
      CurrentMonthlyPay: "",
      HighUse: "",
      MediumUse: "",
      LowUse: "",
      showResults: false,
      bestPackage: [],
      bestPackageProvider: [],
      bestPackageId: "",
      Aerial: "",
      CanHaveVirgin: "",
      toggleFeatures: "0",
      suitablePackages: true,
      perfect: "",
      exitFee: "",
      checker_url: "",
      summaryLoaded: false
    };
    this.LogoPath = process.env.PUBLIC_URL;
  }

  componentWillMount() {
    db.packageName.clear();
    let customer, customerServices, packages;
    db.open()
      .then(async function() {
        customer = await db.customer.toArray();
        customer = customer[0];
        customerServices = await db.customerServices.toArray();
        customerServices = customerServices[0];
        packages = await db.package.toArray();
        packages = packages[0];
      })
      .then(() => {
        this.setState({
          title: customer.Title,
          firstName: customer.Firstname,
          lastName: customer.Lastname,
          telNo: customer.TelephoneNumber,
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
          CurrentMonthlyPay: customerServices.currentMonthlyPay,
          passed_id: packages.SelectedPackageId,
          perfect: packages.PerfectPackage,
          CanHaveVirgin: this.props.globalState.isWeb
            ? true
            : customerServices.canHaveVirgin,
          Aerial: this.props.globalState.isWeb
            ? true
            : customerServices.hasAerial
        });
        this.getQuote();
      });
  }

  getQuote() {
    let thisSource = "";
    if (this.props.globalState.isBtJourney) {
      thisSource = "BT";
    } else if (this.props.globalState.isWeb) {
      thisSource = "WS";
    } else {
      this.setState({
        Aerial: true,
        CanHaveVirgin: true
      });
      thisSource = "CC";
    }
    
    insertLog(1, "Package_summary getQuote", JSON.stringify(this.state));
    axios
      .post(process.env.REACT_APP_API + "Media/Quote", {
        Postcode: this.state.Postcode,
        CurrentProviderId: this.state.CurrentProviderId,
        CurrentProviderMonths: this.state.CurrentProviderMonths,
        CurrentMediaPackageBroadband: this.state.Broadband,
        CurrentMediaPackagePhone: this.state.Phone,
        CurrentMediaPackageTV: this.state.TV,
        CurrentTVPackagesMovies: this.state.Movies,
        CurrentTVPackagesSports: this.state.Sports,
        CurrentTVPackagesEntertainment: this.state.Entertainment,
        CurrentStreamServicesNetflix: this.state.Netflix,
        CurrentStreamServicesPrime: this.state.Prime,
        CurrentStreamServicesNowTV: this.state.NowTV,
        NumDevicesHighUse: this.state.HighUse,
        NumDevicesMediumUse: this.state.MediumUse,
        NumDevicesLowUse: this.state.LowUse,
        CurrentMonthlyPay: this.state.CurrentMonthlyPay,
        HasAerial: this.state.Aerial,
        CanHaveVirgin: this.state.CanHaveVirgin,
        SelectedPackageId: this.state.passed_id,
        source: thisSource
      })
      .then(response => {
        this.setState({
          data: response.data[0],
          exitFee: response.data[0].CoversCurrentExitFeeAmount,
          media_provider: response.data[0].MediaProvider,
          checker_url: response.data[0].MediaProvider.AvailabilityCheckerURL,
          media_features: response.data[0].MediaFeatures,
          summaryLoaded: true
        });
        alert(this.state.data.PackageName)
        db.open().then(async () => {
          await db.packageName.put({ 
            packageName: this.state.data.PackageName
          })
        })
      });
      
  }

  featuresMarketing(feature) {
    return feature.FeatureTypeId === 1;
  }

  featuresAddons(feature) {
    return feature.FeatureTypeId === 2;
  }

  render() {
    this.media_featuresMarketing = this.state.media_features
      .filter(this.featuresMarketing)
      .map((item, index) => {
        return (
          <div key={index}>
            <ul>
              <li>
                <span data-fieldname="Description">{item.Description}</span>
              </li>
            </ul>
          </div>
        );
      });

    this.media_featuresAddons = this.state.media_features
      .filter(this.featuresAddons)
      .map((item, index) => {
        return (
          <div key={index}>
            <ul>
              <li>
                <span data-fieldname="Description">{item.Description}</span>
                <span data-fieldname="Price">
                  <strong>
                    {item.Price !== null ? "£" + item.Price.toFixed(2) : ""}
                  </strong>
                </span>
              </li>
            </ul>
          </div>
        );
      });

    var contButtonText;
    var contLink;
    if (this.props.globalState.isMultiJourney) {
      contButtonText = "Submit Application";
      contLink = "/thank_you";
    } else {
      contButtonText = "Continue";
      contLink = "/application_form";
    }

    return (
      <div>
        <SecondaryHeader />
        <div className="breadcrumb-wrapper">
          {this.props.globalState.isMultiJourney ? (
            <ul>
              <li>
                <Link to="/availability_checker">
                  <span>Current provider</span>
                </Link>
              </li>
              <li>
                <Link to="/result">
                  <span>Quote</span>
                </Link>
              </li>
              <li className="current">
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
              <li>
                <Link to="/payment_checker">
                  <span>Current cost</span>
                </Link>
              </li>
              <li>
                <Link to="/result">
                  <span>Quote</span>
                </Link>
              </li>
              <li className="current">
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
        {this.state.data !== "" && (
            
          <div className="feature-wrapper">
            {this.props.globalState.isMultiJourney && (
              <div>
                <div className="userDetails">
                  <strong>
                    {this.state.title} {this.state.firstName}{" "}
                    {this.state.lastName}
                  </strong>
                </div>
                <div className="userDetails">
                  <strong>
                    Tel: {this.state.telNo}, Postcode: {this.state.Postcode}
                  </strong>
                </div>
              </div>
            )}
            <div className="perfect-package-wrapper summary">
              <div className="card-header-wrapper">
                Your perfect package - summary
              </div>
              <div className="logo-wrapper">
                <img
                  src={
                    this.LogoPath +
                    "/imagesPackage/" +
                    this.state.media_provider.ProviderLogo
                  }
                  alt="Logo"
                />
              </div>
              <div className="perfect-package-inner">
                <div className="perfect-package-name">
                  {this.state.media_provider.ProviderName}
                  <br />
                  {this.state.data.PackageName}
                </div>
                <div className="perfect-package-speed">
                  <strong>{this.state.data.MaxSpeed} Mb/s </strong>maximum
                  download speed
                </div>
              </div>

              <div className="perfect-package-summary">
                <div className="perfect-package-inner-summary">
                  <p>
                    <span>Monthly cost:&nbsp;</span>
                    <span>
                      &pound;
                      {parseFloat(this.state.data.MonthlyCost).toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span>Data Allowance:&nbsp;</span>
                    <span>{this.state.data.DataAllowanceDesc}</span>
                  </p>
                  <p>
                    <span>Contract Length:&nbsp;</span>
                    <span>{this.state.data.ContractLengthMonths} months</span>
                  </p>
                  <p>
                    <span>Fixed Price Months:&nbsp;</span>
                    <span>{this.state.data.FixedPriceMonths} months</span>
                  </p>
                  <p>
                    <span>Setup Fee:&nbsp;</span>
                    <span>
                      &pound;{" "}
                      {this.state.data.SetupFee ? this.state.data.SetupFee : 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="perfect-package-wrapper features"
              style={
                this.state.media_features.filter(this.featuresMarketing)
                  .length > 0
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              <div className="card-header-wrapper">Package features</div>
              <div className="perfect-package-featured">
                {this.media_featuresMarketing}
              </div>
            </div>

            <div className="multi-button-wrapper">
              {!this.props.globalState.isBtJourney &&
                this.state.checker_url.length > 0 && (
                  <a
                    className="url-checker"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.checker_url}
                  >
                    {this.state.media_provider.ProviderName} Check for
                    availability
                  </a>
                )}

              {!this.state.summaryLoaded &&
              this.props.globalState.isMultiJourney ? (
                <ClipLoader
                  loading={this.state.isSubmitted}
                  size={1.35}
                  sizeUnit="rem"
                  color="#203a54"
                />
              ) : (
                <Link to={contLink} className="link-btn">
                  {contButtonText}
                </Link>
              )}
            </div>
          </div>
        
        )}
        {this.props.globalState.isBtJourney && <Outcome />}
      </div>
    );
  }
}

export default withGlobalState(PackageSummary);
