import React, { Component } from 'react';
import { withGlobalState } from 'react-globally';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader'

class Outcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outcome: '',
            outcomeList: [],
            isSubmitted: false
        };
    }

    componentWillLoad() {
        if (!this.props.globalState.outcomeList) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.get(process.env.REACT_APP_API + 'LeadOutcome/GetAll')
            .then(response => {
                this.props.setGlobalState(() => ({
                    outcomeList: response.data
                }))
            })
        }
    }

    handleClick() {
        if (this.state.outcome && !this.state.isSubmitted) {
            this.setState({ isSubmitted: true })
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.post(process.env.REACT_APP_API + 'AgentLeadOutcome/Post', {
                "Address1": localStorage.getItem('Quote.Address1'),
                "Address2": localStorage.getItem('Quote.Address2'),
                "Address3": localStorage.getItem('Quote.Address3'),
                "Town": localStorage.getItem('Quote.Town'),
                "County": localStorage.getItem('Quote.County'),
                "Postcode": localStorage.getItem('Quote.Postcode'),
                "LeadOutcomeId": this.state.outcome,
                "LeadOutcome": this.state.outcome,
                "SalesAgentId": localStorage.getItem('sales_agent_id'),
                "Source": 'BT'
            })
            .then(response => { 
                console.log(":= ", response.data, localStorage.getItem('sales_agent_id'))
                this.setState({ isSubmitted: false })
                window.location.hash = "/start"
            })
        }
    }

    onChange = (e) => {
        this.setState({ outcome: e.target.value })
    }

    render() {
        this.outcomeList = this.props.globalState.outcomeList.map((item) => {
            return (<option key={item.Id} value={item.Id}>{item.Description}</option>)
        })
        return (
            <div>
                <div className='question-wrapper select wide' >
                    <select
                        className='postcode-lookup'
                        name="outcome"
                        style={{width: '27%'}}
                        onChange={this.onChange}
                    >
                        <option value="" defaultValue>Outcome</option>
                        {this.outcomeList}
                    </select>
                    <button
                        type="submit"
                        onClick={() => this.handleClick()}
                        className='link-btn w-20'
                    >
                    <ClipLoader
                        loading={this.state.isSubmitted}
                        size={1.35} sizeUnit='rem'
                        color='#203a54'
                    />
                        &nbsp;Submit outcome
                    </button>
                </div>
            </div>
        );
    }
}

export default withGlobalState(Outcome);