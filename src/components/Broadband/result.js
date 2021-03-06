import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withGlobalState } from 'react-globally';
import SecondaryHeader from './secondary_header';
import Outcome from './outcome';
import db from "./broadbandDatabase";
import { insertLog } from "../../monitor";

import { openModal, closeModal } from './helper';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fulldata: [],
            data: [],
            Postcode: '',
            CurrentProviderId: '',
            CurrentProviderMonths: 0,
            Broadband: 0,
            Phone: 0,
            TV: '',
            Entertainment: '',
            Sports: '',
            Movies: '',
            Netflix: '',
            Prime: '',
            NowTV: '',
            CurrentMonthlyPay: 0,
            HighUse: '',
            MediumUse: '',
            LowUse: '',
            showResults: false,
            bestPackage: [],
            bestPackageProvider: [],
            fullPackage: [],
            fullPackageProvider: [],
            fullyLoadedPackageId:'',
            bestPackageId: '',
            Aerial: null,
            CanHaveVirgin: null,
            toggleFeatures: '0',
            suitablePackages: true,
            LoadingPackages: true,
            resetClicked: true,
            withoutTv: true,
            withTv: true,
        };
        this.LogoPath = process.env.PUBLIC_URL;
    }

    componentDidMount() {
        let customer, customerServices, usage, devices
        db.open().then(async function(){
            customer = await db.customer.toArray()
            customer = customer[0]
            customerServices = await db.customerServices.toArray()
            customerServices = customerServices[0]
            usage = await db.usage.toArray()
            usage = usage[0]
            devices = await db.devices.toArray()
            devices = devices[0]
        }).then(() => {
          this.setState({
            Postcode: customer.Postcode,
            CurrentMonthlyPay: customer.currentMonthlyPayment,
            CurrentProviderId: customerServices.provider,
            CurrentProviderMonths: customerServices.total,
            Broadband: usage.broadbandCheck,
            Phone: usage.phoneCheck,
            TV: usage.smartCheck,
            Movies: usage.moviesCheck,
            Sports: usage.sportsCheck,
            Entertainment: usage.entertainmentCheck,
            Netflix: usage.netflixCheck,
            Prime: usage.primeCheck,
            NowTV: usage.nowTvCheck,
            HighUse: devices.numDevicesHighUse,
            MediumUse: devices.numDevicesMediumUse,
            LowUse: devices.numDevicesLowUse,
            Aerial: customerServices.hasAerial,
            CanHaveVirgin: customerServices.canHaveVirgin
          })
          db.package.clear()
          this.getQuote()
        })
      

    }
    
    getQuote() {
      let thisSource = ''
      if(this.props.globalState.isBtJourney) {
        this.setState({
          Aerial: false,
          CanHaveVirgin: false
        })
        thisSource = 'BT'
      } else if (this.props.globalState.isWeb) {
        thisSource = 'WS'
      } else {
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
        "source": thisSource,
        "speed": 0
      })
      .then(response => {
          var dataArray = response.data.reverse();
          insertLog(1, "Result Quote", "");
          this.setState({ fulldata: response.data });
          this.setState({ data: dataArray });
          this.setState({ bestPackage: response.data.slice(-1)[0] });
          if(this.state.bestPackage !== undefined){
            this.setState({ bestPackageProvider: this.state.bestPackage.MediaProvider });
            this.setState({ bestPackageId: this.state.bestPackage.Id });
          }
          this.setState({ fullPackage: response.data[0] });
          if(this.state.fullPackage !== undefined){
            this.setState({ fullPackageProvider: this.state.fullPackage.MediaProvider });
            this.setState({ fullyLoadedPackageId: this.state.fullPackage.Id });
          }
          this.setState({ LoadingPackages: false });
      })
      .catch(err => {
          insertLog(3, "Result Quote Failed", err);
          this.setState({ LoadingPackages: false });
      });
    }

    toogleAllPackages(e) {
        e.preventDefault();
        this.setState({ showResults: !this.state.showResults });
    }

    featuresMarketing(feature) {
        return feature.FeatureTypeId === 1;
    }

    featuresAddons(feature) {
        return feature.FeatureTypeId === 2;
    }

    showHideFeature(id) {
        if (this.state.toggleFeatures === id) {
            this.setState({ toggleFeatures: "0" });
        }
        else {
            this.setState({ toggleFeatures: id });
        }
    }

    selectPackage(e, packageId, bestPackage) {
      e.preventDefault();
      db.open().then(async () => {
        await db.package.put({ 
          SelectedPackageId: packageId,
          PerfectPackage: bestPackage,
        },0)
        this.props.history.push('/package_summary');
      })
      
    }

    reset = () => {
        this.setState({ resetClicked: true,
          withoutTv: true,
          withTv: true
        });
          
        let thisSource = ''
        if(this.props.globalState.isBt) {
            thisSource = 'BT'
        } else if (this.props.globalState.isWeb) {
            thisSource = 'WS'
        } else {
            thisSource = 'CC'
        }

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
        axios.post(process.env.REACT_APP_API + 'Media/Quote',
          {
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
            "HasAerial": this.props.globalState.isMultiJourney ? true : this.state.Aerial,
            "CanHaveVirgin": this.props.globalState.isMultiJourney ? true : this.state.CanHaveVirgin,
            "source": thisSource
          })
          .then(response => {
            this.setState({ fulldata: response.data });
            var dataArray = response.data.reverse();
            this.setState({ data: dataArray,
              bestPackage: response.data.slice(-1)[0],
              fullPackage: response.data[0],
              bestPackageProvider: this.state.bestPackage.MediaProvider,
              bestPackageId: this.state.bestPackage.Id,
              fullPackageProvider: this.state.fullPackage.MediaProvider,
              fullyLoadedPackageId: this.state.fullPackage.Id,
              LoadingPackages: false });
          })
          .catch(err => {
            insertLog(3, "Media/Quote Failed", err);
            this.setState({ LoadingPackages: false });
          });
    }

    withTV = () => {
        let promise = new Promise((resolve, reject) => {
            this.setState({ withTv: false,
              withoutTv: true,
              resetClicked: false
            });
            let fulldata = this.state.fulldata;
            if (fulldata) {
                resolve(fulldata);
            } else {
                reject();
            }
        }, 500);

        promise.then(fulldata => {
            var newArray = fulldata.filter(function (el) {
                return el.MediaPackageType.TV === true;
            })

            this.setState({ 'data': newArray });
        })

        return promise;
    }

    withoutTV = () => {
        let promise = new Promise((resolve, reject) => {
            this.setState({ withoutTv: false,
              withTv: true,
              resetClicked: false
            });
            let fulldata = this.state.fulldata;
            if (fulldata) {
                resolve(fulldata);
            } else {
                reject();
            }
        }, 500);
        promise.then(fulldata => {
            var newArray = fulldata.filter(function (el) {
                return el.MediaPackageType.TV === false;
            })

            this.setState({ 'data': newArray });
        })
        return promise;
    }

    getUpfrontCostMessage = item => {
        if (item.SetupFeeDescription !== null) {
            return item.SetupFeeDescription;
        } else if (item.SetupFee === null || item.SetupFee === "") {
            return " ";
        } else {
            return "Upfront fees: £" + item.SetupFee;
        }
    };

    render() {
        if (this.state.data.length === 0) {
            return (
                <div>
                    <SecondaryHeader />
                    <div className='breadcrumb-wrapper'>
                    { this.props.globalState.isMultiJourney ? 
                        <ul>
                            <li><Link to='/availability_checker'><span>Current provider</span></Link></li>
                            <li className='current'><a href='#/'><span>Quote</span></a></li>
                            <li className='future'><a href='#/'><span>Package summary</span></a></li>
                            <li className='future'><a href='#/'><span>Apply</span></a></li>
                        </ul>
                        :
                        <ul>
                            <li><Link to='/availability_checker'><span>Current provider</span></Link></li>
                            <li><Link to='/usage_checker'><span>Package Type</span></Link></li>
                            <li><Link to='/device_checker'><span>Your Devices</span></Link></li>
                            <li><Link to='/payment_checker'><span>Current cost</span></Link></li>
                            <li className='current'><a href='#/'><span>Quote</span></a></li>
                            <li className='future'><a href='#/'><span>Package summary</span></a></li>
                            <li className='future'><a href='#/'><span>Apply</span></a></li>
                        </ul>
                    }
                    </div>
                    <div className='feature-wrapper' style={this.state.LoadingPackages === true ? { display: 'block' } : { display: 'none' }} >
                        <div>
                            <h2>Loading packages...</h2>
                            <img alt="logo" style={{ display: 'block', width: '140px', height: '140px', margin: '1.5rem auto 0.5rem' }}
                                src={this.LogoPath + '/imagesPackage/app-spinner.gif'} width='140' height='140' />
                            <p>Please wait a moment for the packages to be displayed.</p>
                        </div>
                    </div>
                    <div className='feature-wrapper' style={this.state.LoadingPackages === false ? { display: 'block' } : { display: 'none' }} >
                        <div>
                            <h2>No packages found</h2>
                            <p>Sorry, we couldn't find your perfect package. Please check that you have correctly completed the proceeding steps.</p>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            this.packageList = this.state.data.map((item, index) => {
              return (
                <div
                  className="other-result-inner-wrapper"
                  key={"key_" + index + "_" + item.Id}
                >
                  <div className="logo-wrapper">
                    <img
                      src={
                        this.LogoPath +
                        "/imagesPackage/" +
                        item.MediaProvider.ProviderLogo
                      }
                      alt="Logo"
                    />
                    <a
                      href="#"
                      className="modal-open-icon"
                      onClick={e => openModal(e, item.MediaProvider.ProviderName)}
                    >
                      &nbsp;
                    </a>
                  </div>
                  <div className="package-name">
                    {item.PackageName}
                    <br />
                    <span>
                      {item.ContractLengthMonths}&nbsp;month contract
                      <br />
                      {this.getUpfrontCostMessage(item)}
                    </span>
                  </div>
                  <div className="package-speed">
                    <span>Up to</span>
                    <br />
                    {item.MaxSpeed}&nbsp;Mb
                    <br />
                    <span>per second</span>
                    <br />
                    <div className="package-bandwidth">{item.DataAllowanceDesc}</div>
                  </div>
                  <div className="package-price">
                    &pound;{item.MonthlyCost.toFixed(2)}
                    <br />
                    <span>a month</span>
                    <div
                      className="package-saving"
                      style={
                        item.TotalSavings > 0
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <span>You will save</span>
                      <br />
                      &pound;{parseFloat(item.TotalSavings).toFixed(2)}
                    </div>
                    <br/>
                    <a
                      href="#"
                      onClick={e => this.selectPackage(e, item.Id, false)}
                      className="link-btn"
                    >
                      Order
                    </a>
                  </div>
      
      
                  <div className="provider-info">
                    {item.MediaProvider.ProviderName === "Virgin Media"
                      ? item.MediaProvider.ProviderInfo
                      : ""}
                  </div>
                  <div className="result-additional-features">
                    {item.MediaFeatures.length > 0 && (
                      <button
                        className="dotted-link"
                        onClick={() => this.showHideFeature(item.Id)}
                      >
                        Additional&nbsp;features&nbsp;+
                      </button>
                    )}
                    <div
                      className={
                        this.state.toggleFeatures === item.Id ? "showMe" : "hideMe"
                      }
                    >
                      <div
                        className="additional-feature-wrapper"
                        style={
                          item.MediaFeatures.filter(this.featuresMarketing).length > 0
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <h3>
                          <strong>Package Features</strong>
                        </h3>
                        <div className="perfect-package-featured additional-features">
                          {item.MediaFeatures.filter(this.featuresMarketing).map(
                            (feature, index) => {
                              return (
                                <div key={index}>
                                  <ul>
                                    <li>
                                      <span>{feature.Description}</span>
                                    </li>
                                  </ul>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
            return (
                <div>
                    <SecondaryHeader />
                    <div className='breadcrumb-wrapper'>
                    { this.props.globalState.isMultiJourney ? 
                        <ul>
                            <li><Link to='/availability_checker'><span>Current provider</span></Link></li>
                            <li className='current'><a href='#/'><span>Quote</span></a></li>
                            <li className='future'><a href='#/'><span>Package summary</span></a></li>
                            <li className='future'><a href='#/'><span>Apply</span></a></li>
                        </ul>
                        :
                        <ul>
                            <li><Link to='/availability_checker'><span>Current provider</span></Link></li>
                            <li><Link to='/usage_checker'><span>Package Type</span></Link></li>
                            <li><Link to='/device_checker'><span>Your Devices</span></Link></li>
                            <li><Link to='/payment_checker'><span>Current cost</span></Link></li>
                            <li className='current'><a href='#/'><span>Quote</span></a></li>
                            <li className='future'><a href='#/'><span>Package summary</span></a></li>
                            <li className='future'><a href='#/'><span>Apply</span></a></li>
                        </ul>
                    }
                    </div>

                    <div className='feature-wrapper top-result'>
                        <div className='perfect-package-outer-wrapper'>

                            {/* top box - value */}
                            <div className='perfect-package-wrapper'>
                                <div className='perfect-package-inner-wrapper'>
                                    <div className='card-header-wrapper'>MEX value recommendation</div>
                                    <div className='logo-wrapper'>
                                        <img src={this.LogoPath + '/imagesPackage/' + this.state.bestPackageProvider.ProviderLogo} alt='Logo' />
                                        <a href='#' className='modal-open-icon' onClick={(e) => openModal(e, this.state.bestPackageProvider.ProviderName)}>&nbsp;</a>
                                    </div>
                                    <div className='perfect-package-inner'>
                                        <div className='perfect-package-name'>{this.state.bestPackage.PackageName}</div>
                                        <div className='perfect-package-bandwidth'>{this.state.bestPackage.DataAllowanceDesc} Bandwidth</div>
                                        <div className='perfect-package-speed'><strong>{this.state.bestPackage.MaxSpeed} Mb/s </strong>maximum download speed</div>
                                    </div>
                                    <div className='perfect-package-price'>
                                        from <strong>&pound;{parseFloat(this.state.bestPackage.MonthlyCost).toFixed(2)}</strong> a month<br />
                                        <span>({this.state.bestPackage.FixedPriceMonths} month contract)</span>
                                    </div>
                                    <div className='perfect-package-saving' style={this.state.bestPackage.TotalSavings > 0 ? { display: 'block' } : { display: 'none' }}>
                                        You will save <strong>&pound;{parseFloat(this.state.bestPackage.TotalSavings).toFixed(2)}</strong>
                                    </div>

                                    <div className='topbox-button-wrapper'>
                                        <a href="#" onClick={(e) => this.selectPackage(e, this.state.bestPackageId, true)} className='link-btn'>Order value package</a>
                                    </div>

                                </div>
                            </div>
                            {/* end top box - value */}

                            {/* top box - fully loaded */}
              <div className="perfect-package-wrapper">
                <div className="perfect-package-inner-wrapper">
                  <div className="card-header-wrapper">
                    MEX fully loaded recommendation
                  </div>
                  <div className="logo-wrapper">
                    <img
                      src={
                        this.LogoPath +
                        "/imagesPackage/" +
                        this.state.fullPackageProvider.ProviderLogo
                      }
                      alt="Logo"
                    />
                    <a
                      href="#"
                      className="modal-open-icon"
                      onClick={e =>
                        openModal(
                          e,
                          this.state.fullPackageProvider.ProviderName
                        )
                      }
                    >
                      &nbsp;
                    </a>
                  </div>
                  <div className="perfect-package-inner">
                    <div className="perfect-package-name">
                      {this.state.fullPackage.PackageName}
                    </div>
                    <div className="perfect-package-bandwidth">
                      {this.state.fullPackage.DataAllowanceDesc} Bandwidth
                    </div>
                    <div className="perfect-package-speed">
                      <strong>{this.state.fullPackage.MaxSpeed} Mb/s </strong>
                      maximum download speed
                    </div>
                  </div>
                  <div className="perfect-package-price">
                    from{" "}
                    <strong>
                      &pound;
                      {parseFloat(this.state.fullPackage.MonthlyCost).toFixed(
                        2
                      )}
                    </strong>{" "}
                    a month
                    <br />
                    <span>
                      ({this.state.fullPackage.PriceMonths} month contract)
                    </span>
                  </div>
                  <div
                    className="perfect-package-saving"
                    style={
                      this.state.fullPackage.TotalSavings > 0
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    You will save{" "}
                    <strong>
                      &pound;
                      {parseFloat(this.state.fullPackage.TotalSavings).toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  

                  <div className="topbox-button-wrapper">
                    <a
                      href="#"
                      onClick={e =>
                        this.selectPackage(
                          e,
                          this.state.fullyLoadedPackageId,
                          true
                        )
                      }
                      className="link-btn"
                    >
                      Order fully loaded package
                    </a>
                  </div>
                </div>
              </div>
              {/* end top box - fully loaded */}
            </div>
            <div className="results-button-wrapper">
              <a
                className="all-packages-toggle"
                href="#"
                onClick={e => this.toogleAllPackages(e)}
                style={
                  this.state.showResults === false 
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                View all suitable packages
              </a>
            </div>
          </div>
          {/*
                    Tom altered this line to remove isweb condition
                    <div className='other-result-wrapper' style={this.state.showResults && this.props.globalState.isWeb ? { display: 'block' } : { display: 'none' }} >
                    */}
          <div
            className="other-result-wrapper"
            style={
              this.state.showResults
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div className="filter-wrapper">
              <div className="filter-label">
                <div>
                  <strong>Filter&nbsp;</strong>
                </div>
                <div className="filter-count">
                  {this.state.data.length}&nbsp;results
                </div>
              </div>
              {/* New filter by supplier */}


              <div
                className={
                  this.state.withoutTv
                    ? "filter-button"
                    : "filter-button active"
                }
                onClick={this.withoutTV}
              >
                Without&nbsp;TV
              </div>
              <div
                className={
                  this.state.withTv ? "filter-button" : "filter-button active"
                }
                onClick={this.withTV}
              >
                With&nbsp;TV
              </div>
              <div
                className={
                  this.state.resetClicked
                    ? "filter-button outline"
                    : "filter-button outline"
                }
                onClick={this.reset}
              >
                <span>Clear&nbsp;filters</span>
              </div>
            </div>
            {this.packageList}
          </div>

                    {/*modal window*/}
                    <div id='TalkTalk' className='modal-window'>
                        <a href='#' className='background-close' onClick={(e) => closeModal(e, 'TalkTalk')} />
                        <div>
                            <a href='#' title='CloseButton' className='modal-close' onClick={(e) => closeModal(e, 'TalkTalk')} />
                            <div className=''>
                                <div className='talktalk-wrapper'>
                                    <div className='page-wrapper'>
                                        <div className='inner-wrapper'>
                                            <div className='bb-presenter-heading with-logo talktalk-logo'>7 reasons to switch to</div>
                                            <div className='item'><i className='with-icon price-lock'></i>Fixed prices during the contract</div>
                                            <div className='item'><i className='with-icon free-new-line'></i>Free New Line installation -The standard connection charge is normally &pound;140</div>
                                            <div className='item'><i className='with-icon which-best-routers'></i>Talktalk Wireless hub - 60 square meters - 7 Antenna voted best router for 2018 by which? </div>
                                            <div className='item'><i className='with-icon f-secure'></i>Free Virus protection F-secure </div>
                                            <div className='item'><i className='with-icon free-voicemail'></i>Free Voicemail, caller display, anonymous call reject and last call barring </div>
                                            <div className='item'><i className='with-icon totally-unlimited'></i>Totally unlimited </div>
                                            <div className='item'><i className='with-icon free-calls'></i>Free calls to Talktalk homes</div>
                                            <div className='item'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end modal window*/}

                    {/*modal window*/}
                    <div id='EE' className='modal-window'>
                        <a href='#' className='background-close' onClick={(e) => closeModal(e, 'EE')} />
                        <div>
                            <a href='#' title='CloseButton' className='modal-close' onClick={(e) => closeModal(e, 'EE')} />
                            <div className=''>
                                <div className='ee-wrapper'>
                                    <div className='page-wrapper'>
                                        <div className='inner-wrapper'>
                                            <div className='bb-presenter-heading with-logo ee-logo'>6 reasons to switch to</div>
                                            <div className='item'><i className='with-icon boost'></i>Data Boost - A 5G or 20G Data Boost for EE Mobile Customers</div>
                                            <div className='item'><i className='with-icon fastest'></i>Enhancing our Fibre To The Cabinet (FTTC) technology means we can deliver much faster speeds (Fibre Max)</div>
                                            <div className='item'><i className='with-icon ee-smart-hub'></i>EE Smart Hub - Twice as Powerful - Our EE Smart Hub is twice as powerful than our previous router, specifically designed to handle lots of devices</div>
                                            <div className='item'><i className='with-icon norton-security'></i>FREE NORTON SECURITY (Save £79.99) Up To 10 Devices </div>
                                            <div className='item'><i className='with-icon uk-customer-service'></i>UK and Ireland Customer services - 5 stars rating</div>
                                            <div className='item'><i className='with-icon totally-unlimited'></i>Totally unlimited</div>
                                            <div className='item'></div>
                                            <div className='item'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end modal window*/}

                    {/*modal window*/}
                    <div id='BT Broadband' className='modal-window'>
                        <a href='#' className='background-close' onClick={(e) => closeModal(e, 'BT Broadband')} />
                        <div>
                            <a href='#' title='CloseButton' className='modal-close' onClick={(e) => closeModal(e, 'BT Broadband')} />
                            <div className=''>
                                <div className='ee-wrapper'>
                                    <div className='page-wrapper'>
                                        <div className='inner-wrapper'>
                                            <div className='bb-presenter-heading with-logo bt-logo'>Why BT Broadband?</div>
                                            <div className='item'><i className='with-icon f-secure'></i>Powerful security features to keep your family safe online and protect you from threats like viruses.</div>
                                            <div className='item'><i className='with-icon fastest'></i>You get loads of other extras too –like free, unlimited access to 5 million BT Wi-Fi hotspots, and BT Cloud online storage.</div>
                                            <div className='item'><i className='with-icon totally-unlimited'></i>With one of our Unlimited Broadband packages you can stream, browse and download to your heart’s content, and we’ll never slow you down or charge you extra. You can get unlimited packages with both our Standard Broadband and our Superfast Fibre Broadband.</div>
                                            <div className='item'><i className='with-icon which-best-routers'></i>Our hubs are more powerful than other big broadband providers</div>
                                        </div>
                                        <br/>
                                        <strong>Complete Wi-Fi: </strong>
                                        <ul>                                        
                                            <li>Intelligent design: Our Smart Hub has 7 antennae, specially positioned to maximise wi-fi performance</li>
                                            <li>Smart channel selection: All your devices auto connect to the fastest wi-fi channel and frequency available</li>
                                            <li>Smart scan: Continually scans to check your hub and network performance, and reboots if there's a problem</li>
                                        </ul>
                                        <br/>
                                        <strong>Plus, you get all this…</strong>
                                        <br/><br/>
                                        <u><strong>Manage your services on the My BT app</strong></u>
                                        <br/>
                                        Our smartphone app makes it quick and easy to manage your BT account wherever you are.  You can check your usage, pay a bill, get help and more.
                                        <br/><br/>
                                        <u><strong>Stay in touch with BT Mail</strong></u>
                                        <br/>
                                        When you’re with BT, you can sign up for free email with BT Mail.  You can create up to 11 email addresses –each one with unlimited storage and built-in anti-virus protection.
                                        <br/><br/>
                                        <u><strong>Wi-fi hotspots around the UK</strong></u>
                                        <br/>
                                        With BT, you get free access to the UK’s largest wi-fi network – that means more than 5 million BT Wi-Fi hotspots.  Connect for as long as you like and save your mobile data for when you really need it.
                                        <br/><br/>
                                        <u><strong>Your calls, your way with our Calling Plans</strong></u>
                                        <br/>
                                        Your broadband comes with a BT phone line, and thanks to our new simple calling plans, you’ll only pay for the calls you need. You’ll get Call Protect too, to help stop nuisance calls
                                        <br/><br/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end modal window*/}

                    {/*modal window*/}
                    <div id='Virgin Media' className='modal-window'>
                        <a href='#' className='background-close' onClick={(e) => closeModal(e, 'Virgin Media')} />
                        <div>
                            <a href='#' title='CloseButton' className='modal-close' onClick={(e) => closeModal(e, 'Virgin Media')} />
                            <div className=''>
                                <div className='virgin-wrapper'>
                                    <div className='page-wrapper'>
                                        <div className='inner-wrapper'>
                                            <div className='bb-presenter-heading with-logo virgin-media-logo'>7 reasons to switch to</div>
                                            <div className='item'><i className='with-icon guarantee'></i>Lifetime guarantee - Free call engineer or free replacement if faulty</div>
                                            <div className='item'><i className=' with-icon fastest'></i>Virgin’s network is the fastest internet (FTTP)</div>
                                            <div className='item with-icon'><i className='with-icon virgin-hub'></i>Wireless Hub with Intelligent wifi </div>
                                            <div className='item with-icon'><i className='with-icon virgin-v6'></i>Free Virgin V6 box with all virgin media bigger bundles as standard </div>
                                            <div className='item with-icon'><i className='with-icon ultra-hd-4k'></i>V6 Box- 4K Ultra HD (Netflix, UHD Channel, Youtube &amp; Entertainment)</div>
                                            <div className='item with-icon'><i className='with-icon uswitch-bb-award'></i>Voted fastest provider by U-Switch 6 year in a row</div>
                                            <div className='item'><i className='with-icon bt-sport'></i>All Virgin media Customers on bigger  bundles now get BT Sport at no extra cost, making Virgin Media the only place to get the sports channels free of charge when you're not with BT for your home broadband</div>
                                            <div className='item'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end modal window*/}


                    { this.props.globalState.isBtJourney &&
                        <Outcome />
                    }

                </div>
            );
        }
    }
}

export default withGlobalState(Result)