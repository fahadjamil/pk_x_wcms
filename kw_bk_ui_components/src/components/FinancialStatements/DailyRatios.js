import React from 'react';
import { FinancialDataComponent } from './FinancialDataComponent';

export const DailyRatios = (props) => (
    <FinancialDataComponent
        SID="CSR_R"
        isSingleYear
        lang={props.lang}
        name="Daily Ratios"
    ></FinancialDataComponent>
);
