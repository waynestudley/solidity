import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-globally'
import App from './App'

import './fonts/web-us-fonts/josefinsans-bold-webfont.ttf';
import './fonts/web-us-fonts/josefinsans-bold-webfont.woff';
import './fonts/web-us-fonts/josefinsans-bold-webfont.woff2';

import './fonts/web-us-fonts/josefinsans-regular-webfont.ttf';
import './fonts/web-us-fonts/josefinsans-regular-webfont.woff';
import './fonts/web-us-fonts/josefinsans-regular-webfont.woff2';

import './fonts/web-us-fonts/opensans-bold-webfont.ttf';
import './fonts/web-us-fonts/opensans-bold-webfont.woff';
import './fonts/web-us-fonts/opensans-bold-webfont.woff2';

import './fonts/web-us-fonts/opensans-regular-webfont.woff';
import './fonts/web-us-fonts/opensans-regular-webfont.woff2';

import './fonts/web-us-fonts/opensans-semibold-webfont.woff';
import './fonts/web-us-fonts/opensans-semibold-webfont.woff2';

const initialState = {
    isWeb: false,
    journeyTheme: '',
    isBt: false,
    isBtJourney: false,
    jwtAuth: null,
    outcomeList: null,
    btSpeed: null,
    isMultiJourney: false,
    isSupercard: false
}

ReactDOM.render((
    <Provider globalState={initialState}>
        <App />
    </Provider>
), document.getElementById('root'));
