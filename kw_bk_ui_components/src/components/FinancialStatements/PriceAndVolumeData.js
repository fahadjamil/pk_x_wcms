import React from 'react';
import { FinancialDataComponent } from './FinancialDataComponent';

export const PriceAndVolumeData = (props) => (
    <FinancialDataComponent
        SID="CSR_P"
        isSingleYear
        lang={props.lang}
        name="Price and Volume Data"
    ></FinancialDataComponent>
);
