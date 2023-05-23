import React from 'react';
import { FinancialDataComponent } from './FinancialDataComponent';

export const IncomeStatement = (props) => (
    <FinancialDataComponent
        SID="INC"
        lang={props.lang}
        name="Income Statement"
    ></FinancialDataComponent>
);
