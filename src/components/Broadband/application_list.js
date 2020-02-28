import React, { Component } from 'react';
import SecondaryHeader from './secondary_header';

import axios from 'axios';
import { withGlobalState } from 'react-globally';

class ApplicationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            status: ''
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
        axios.post(process.env.REACT_APP_API + 'Media/GetApplicationList')
            .then(response => {
                this.setState({ data: response.data });
            })
            .catch(err => {
                insertLog(3, "Media/GetApplicationList failed", err );
            });
    }

    formatDate(dateUTC) {
        var date = new Date(dateUTC);
        return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
    }

    getStatusDesc(value) {
        if (value === 0) {
           return "Pending"
        } else if (value === 1) {
            return "Complete";
        } else if (value === 2) {
            return 'Rejected - Do not come back';
        } else if (value === 3) {
            return 'Rejected - Do not come back';
        } else if (value === 4) {
            return 'Complete';
        } else if (value === 5) {
            return 'Rejected - Do not come back';
        } else if (value === 6) {
            return 'Rejected - Do not come back';
        } else if (value === 7) {
            return 'Complete';
        }
    }

    render() {
        return (
            <div>
                <SecondaryHeader isShowNewQuote={true}/>
                <div className="perfect-package-wrapper features" style={{ maxWidth: '1050px' }}>
                    <div className="card-header-wrapper">Applications List - (Week)</div>
                    <div className="perfect-package-featured">
                        <div>
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ fontWeight: "bolder" }}>
                                        <td>Application Id</td>
                                        <td>First Name</td>
                                        <td>Surname</td>
                                        <td>Postcode</td>
                                        <td>Date Time</td>
                                        <td>Application Status</td>
                                        <td>Notes</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map((item) => {
                                        return (
                                            <tr key={item.LeadId}>
                                                <td>{item.LeadId}</td>
                                                <td>{item.FirstName}</td>
                                                <td>{item.Surname}</td>
                                                <td>{item.Postcode === 'null' ? '' : item.Postcode}</td>
                                                <td>{this.formatDate(item.LeadCreated)}</td>
                                                <td>{this.getStatusDesc(item.LeadStatusId)}</td>
                                                <td>{item.LeadBuyerExternalId}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withGlobalState(ApplicationList)