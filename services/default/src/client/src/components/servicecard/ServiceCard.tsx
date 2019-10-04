import React from "react";
import {Card, TextField} from "@shopify/polaris";

export interface ServiceCardProps {
    currentLot: string;
    disabled?: boolean;
}

const ServiceCard = ( {currentLot, disabled}: ServiceCardProps ) => (
    <Card sectioned>
        <Card.Section title="eShipper">
            <TextField value={currentLot} label="Current Lot" disabled={disabled} helpText={
            <span>
                We are currently using this lot number.
            </span>
            } onChange={()=>{}}></TextField>
        </Card.Section>
    </Card>
);

export default ServiceCard;