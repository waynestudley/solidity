import React, { Component } from 'react';
import { withGlobalState } from 'react-globally'
import axios from 'axios';
import MainHeader from './header';
import ClipLoader from 'react-spinners/ClipLoader'
import db from "./broadbandDatabase";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            username: '',
            errorMessage: '',
            sales_agent_id:'',
            chosenAddress:{},
            isSubmitted: false
        };  
    }

    handleUsername = (e) => {
        this.setState({ username: e.target.value });
    }

    handlePassword = (e) => {
        this.setState({ password: e.target.value });
    }

    validateLogin = (e) => {
        this.setState({ isSubmitted: true,
            errorMessage: ''
        })
        e.preventDefault();
        var apiEndpointLogin = "";
        if (this.props.platform === 'broadband_bt') {
            apiEndpointLogin = process.env.REACT_APP_API + 'auth/createtoken?username='
        } else {
            console.log("Error")
            this.setState({ isSubmitted: false });
        }

        axios
        .post(apiEndpointLogin + this.state.username + '&password=' + this.state.password)
        .then(response => {
            this.props.setGlobalState(() => ({
                jwtAuth: response.data
            }))
            this.doLogin()
        })
        .catch(error => {
            console.log(error.response)
            this.setState({ isSubmitted: false,
                errorMessage: 'Invalid login or password'
            })
        });
    }

    doLogin() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.globalState.jwtAuth
        axios.post(process.env.REACT_APP_API + 'UserAccount/GetAgentDetails')
        .then(response => { 
            if(response.data && !response.status === 401) {
                this.setState({ 'sales_agent_id': response.data.SalesAgentId })
            }
            if (response.data === null || response.status === 401) {
                this.setState({ errorMessage: 'Invalid login or password' })
            } else if (
                this.props.platform === 'broadband_bt' &&
                response.data.CallCentre !== null &&
                response.data.CallCentre.ShowBroadbandWizard === true
            ) {
                this.setState({ isSubmitted: false })
                db.open().then(async () => {
                    await db.userAgent.put({
                      SalesAgentId: response.data.SalesAgentId,
                      CallcentreId: response.data.CallCentreId,
                      Name: response.data.Name,
                      loginData: JSON.stringify(response.data)
                    })
                })
                
                let userType = response.data.LoginSecurityGroup.split(",")

                // CHECK FOR BT USER
                for (var i = 0; i < userType.length; ++i) {
                    if (parseInt(userType[i]) === 8) {
                        this.props.setGlobalState(() => ({
                            isBt: true,
                        }))
                    }
                }
                this.setState({ isSubmitted: false })
                this.props.history.push('/start')
            } else {
                this.setState({ errorMessage: 'Office/User doesn\'t have permission',
                isSubmitted: false
            })
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                this.setState({ errorMessage: 'An error has occured, please try again in a few miniutes',
                isSubmitted: false
            })
            } else {
                this.setState({ errorMessage: 'Office/User doesn\'t have permission',
                isSubmitted: false
            })
            }
        }
        );
    }

    render() {
        return (
            <div>
                <MainHeader />
                <div className='login-wrapper'>
                    <div className='login-inner-wrapper'>
                        <h2>Login</h2>
                        <form>
                            <div style={this.state.errorMessage !== "" ? { color: '#D8000C', backgroundColor: '#FFD2D2', padding: '5px' } : { display: 'none' }} >
                                {this.state.errorMessage}
                            </div>
                            <p>
                                <label htmlFor='UserName'>Username</label>
                                <input type='email' id='UserName' name='UserName' value={this.state.username} onChange={this.handleUsername} />
                            </p>
                            <div className='password-container'>
                                <label htmlFor='Password'>Password</label>
                                <br />
                                <input type='password' id='Password' name='Password' value={this.state.password} onChange={this.handlePassword} />
                            </div>
                            <button
                                to='/start'
                                ref="btnSubmit"
                                className='link-btn w-100'
                                disabled={this.state.isSubmitted}
                                onClick={this.validateLogin}
                            >
                            <ClipLoader
                                loading={this.state.isSubmitted}
                                size={1.35} sizeUnit='rem'
                                color='#203a54'
                            />
                                &nbsp;Get started
                            </button>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default withGlobalState(Login);