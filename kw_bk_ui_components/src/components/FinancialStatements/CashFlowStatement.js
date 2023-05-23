import React from 'react';
import { FinancialDataComponent } from './FinancialDataComponent';

export const CashFlowStatement = (props) => (
    <FinancialDataComponent
        SID="CAS"
        lang={props.lang}
        name="Cash Flow Statement"
    ></FinancialDataComponent>
);
