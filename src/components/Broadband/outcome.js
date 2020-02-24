import React, { Component } from 'react';
import { withGlobalState } from 'react-globally';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader'
import db from "./broadbandDatabase";

class Outcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outcome: '',
            outcomeList: [],
            isSubmitted: false,
            Address1: '',
            Address2: '',
            Address3: '',
            Town: '',
            County: '',
            Postcode: '',
            LeadOutcomeId: '',
            LeadOutcome: '',
            SalesAgentId: ''
        };
    }

    componentDidMount() {
        if (!this.props.globalState.outcomeList) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.get(process.env.REACT_APP_API + 'LeadOutcome/GetAll')
            .then(response => {
                this.props.setGlobalState(() => ({
                    outcomeList: response.data
                }))
            })
        }
        let customer, agent
        db.open().then(async function(){
            customer = await db.customer.toArray()
            customer = customer[0]
            agent = await db.userAgent.toArray()
            agent = agent[0]
        }).then(() => {
          this.setState({
            Address1: customer.Address1,
            Address2: customer.Address2,
            Address3: customer.Address3,
            Town: customer.Town,
            County: customer.County,
            Postcode: customer.Postcode,
            SalesAgentId: agent.SalesAgentId
          })
        })
    }

    handleClick() {
        console.log(this.state.Address1, this.state.Postcode)
        if (this.state.outcome && !this.state.isSubmitted) {
            this.setState({ isSubmitted: true })
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
            axios.post(process.env.REACT_APP_API + 'AgentLeadOutcome/Post', {
                "Address1": this.state.Address1,
                "Address2": this.state.Address2,
                "Address3": this.state.Address3,
                "Town": this.state.Town,
                "County": this.state.County,
                "Postcode": this.state.Postcode,
                "LeadOutcomeId": this.state.outcome,
                "LeadOutcome": this.state.outcome,
                "SalesAgentId": this.state.SalesAgentId,
                "Source": 'BT'
            })
            .then(response => { 
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