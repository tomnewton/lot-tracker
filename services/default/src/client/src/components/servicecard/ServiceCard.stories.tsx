
//import { action } from '@storybook/addon-actions';
import React from 'react';
import ServiceCard from './ServiceCard';
import { storiesOf } from '@storybook/react';

export default {
  component: ServiceCard,
  title: 'ServiceCard',
};

storiesOf('ServiceCard', module)
.add('default', () => (
    <ServiceCard currentLot="222"/>
))
.add('active', () => (
    <ServiceCard currentLot="a" disabled={true}/>
));
