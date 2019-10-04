import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AppProvider} from '@shopify/polaris';
const theme = {
    colors: {
      topBar: {
        background: '#ff6771',
      },
    },
    logo: {
      width: 124,
      topBarSource:
        'https://cdn.shopify.com/s/files/1/0015/4478/1896/t/22/assets/Nixit_Logo_TM.svg?6215648040070010999',
      url: 'http://letsnixit.com',
      accessibilityLabel: 'Nixit Ltd.',
    },
  };
ReactDOM.render(<AppProvider theme={theme} i18n={{
    Polaris: {
      Avatar: {
        label: 'Avatar',
        labelWithInitials: 'Avatar with initials {initials}',
      },
      Frame: {skipToContent: 'Skip to content'},
      TopBar: {
        toggleMenuLabel: 'Toggle menu',
        SearchField: {
          clearButtonLabel: 'Clear',
          search: 'Search',
        },
      },
    }
  }}><App /></AppProvider>, document.getElementById('root'));

 
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
