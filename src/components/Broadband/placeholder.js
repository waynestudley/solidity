import React, { Component } from 'react';
import axios from 'axios';

export default class Availability_Checker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            mediaProvider: [],
            mediaMarketingCategory:[]
        }

        this.LogoPath = "../images/";
    }

    componentWillMount() {
        axios.post(process.env.REACT_APP_API + 'Media/GetPromotionalPackageList')
            .then(response => {
                this.setState({ data: response.data })
            })
            .catch(err => {
                console.log(err);
            })
    }

    componentDidMount() { }


    render() {

        this.featurePackage = this.state.data.map((item, key) =>

            <div className='card-wrapper' key={item.Id}>
                <div className="card-header-wrapper">{item.MediaMarketingCategory.MarketingCategory}</div>
                <div className="featured-package-details">
                    <div className="logo-wrapper"><img src={`${this.LogoPath}${item.MediaProvider.ProviderLogo}`} alt='Best Package Logo' /></div>
                    <div className="featured-package-name">{item.PackageName}</div>
                </div>
                <div className="featured-contract-details">
                    <strong>&pound;{item.MonthlyCost}</strong> a month for {item.FixedPriceMonths}&nbsp;months<br />
                    <span>Average download speeds of {item.MaxSpeed}&nbsp;Mb/s</span>
                </div>
            </div>
        );






        return (
            <div className="feature-wrapper">
                <div className='homepage-cards-wrapper'>

                    {this.featurePackage}

                </div>
            </div>
        )
    }
}