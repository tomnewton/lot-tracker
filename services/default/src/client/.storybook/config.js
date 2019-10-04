import { configure, addDecorator } from '@storybook/react';
import React from 'react';
import {AppProvider} from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';

import './polaris.css';  // this sucks but I can't workout how to make it work with scss/preprocessing 

addDecorator(function StrictModeDecorator(story) {
    return <React.StrictMode>{story()}</React.StrictMode>;
});
  
addDecorator(function AppProviderDecorator(story) {
    return (
        <div style={{padding: '8px'}}>
        <AppProvider i18n={en}>{story()}</AppProvider>
        </div>
    );
});

configure(require.context('../src', true, /\.stories\.tsx$/), module);
