import React, { Component } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default class Signature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trimmedDataURL:null
        }
    }

    sigPad = {};

    clearSig = () => {
        this.sigPad.clear();
    }

    trim = () => {
        this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') })
    }

    render() {
        return (
            <div>
                <div>
                    <SignatureCanvas penColor='black' canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} ref={(ref) => { this.sigPad = ref }} />
                    <button onClick={this.clearSig}>Clear</button>
                    <button onClick={this.trim}>Trim</button>
                </div>
                <div className='signature-container'>
                    {this.state.trimmedDataURL ? <img src={this.state.trimmedDataURL} alt='signature' /> : null }
                </div>
            </div>
            )
    }
}