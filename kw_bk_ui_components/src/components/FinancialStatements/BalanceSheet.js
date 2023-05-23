import React from 'react';
import { FinancialDataComponent } from './FinancialDataComponent';

export const BalanceSheet = (props) => {
    return (
        <div>
            <FinancialDataComponent SID="BAL" lang={props.lang} name="Balance Sheet"></FinancialDataComponent>
        </div>
    );
};
