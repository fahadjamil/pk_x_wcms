import React from 'react';
import { FinancialDataComponent } from './FinancialDataComponent';

export const BalanceSheetNew = (props) => (
    <FinancialDataComponent
        SID="BAL"
        lang={props.lang}
        name="Balance Sheet"
    ></FinancialDataComponent>
);

export const CashFlowStatementNew = (props) => (
    <FinancialDataComponent
        SID="CAS"
        lang={props.lang}
        name="Cash Flow Statement"
    ></FinancialDataComponent>
);

export const DailyRatiosNew = (props) => (
    <FinancialDataComponent
        SID="CSR_D"
        isSingleYear
        lang={props.lang}
        name="Daily Ratios"
    ></FinancialDataComponent>
);

export const IncomeStatementNew = (props) => (
    <FinancialDataComponent
        SID="INC"
        lang={props.lang}
        name="Income Statement"
    ></FinancialDataComponent>
);
export const PriceAndVolumeDataNew = (props) => (
    <FinancialDataComponent
        SID="CSR_P"
        isSingleYear
        lang={props.lang}
        name="Price and Volume Data"
    ></FinancialDataComponent>
);

export const RatiosAndIndicatorsNew = (props) => (
    <FinancialDataComponent
        SID="CSR_R"
        isSingleYear
        lang={props.lang}
        name="Ratios and Indicators"
    ></FinancialDataComponent>
);
