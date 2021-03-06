import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';
import { SnackbarProvider } from 'notistack';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    console.log(process.env.NODE_ENV);
} else {    
    // production code
    console.log(process.env.NODE_ENV)
    Sentry.init({dsn: "https://cd5ce2da28be4dcfaea42bfa2f637fba@sentry.io/1827293"});
}

ReactDOM.render(<SnackbarProvider><App /></SnackbarProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
