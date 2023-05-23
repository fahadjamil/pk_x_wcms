import React, {Fragment, useEffect, useState} from 'react';
import {TableUiComponent} from "../../TableComponent";
import {SpecificPreviewComponent} from "../../../SpecificPreviewComponent";
import { MarketReportData} from "./MarketReportData";

export const MarketReportTradedCompanies = (props) => {
    const { lang, commonConfigs } = props;
    const tradedCompaniesData =  MarketReportData(props, 'List of Traded Companies');

    const tradedCompaniesColumnConfig = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'اسم الشركة' : 'Company Name',
                dataType: 'text',
                mappingField: 'CompanyName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'إفتتاح' : 'Open',
                dataType: 'custom2',
                mappingField: 'Open',
            },
            {
                columnName: lang.langKey === 'AR' ? 'أعلى' : 'High',
                dataType: 'custom2',
                mappingField: 'High',
            },
            {
                columnName: lang.langKey === 'AR' ? 'أدنى' : 'Low',
                dataType: 'custom2',
                mappingField: 'Low',
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإغلاق' : 'Close',
                dataType: 'custom2',
                mappingField: 'Last',
            },
            {
                columnName: lang.langKey === 'AR' ? 'تغير' : 'Change',
                dataType: 'custom2',
                mappingField: 'Change',
            },
            {
                columnName: lang.langKey === 'AR' ? 'التغير %' : 'Change %',
                dataType: 'figure',
                mappingField: 'ChangePerc',
            },
            {
                columnName: lang.langKey === 'AR' ? 'حجم التداول' : 'Volume',
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
            },
            {
                columnName: lang.langKey === 'AR' ? 'القيمة' : 'Value',
                dataType: 'figure_0decimals',
                mappingField: 'Turnover',
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد الصفقات' : 'No of Trades',
                dataType: 'figure_0decimals',
                mappingField: 'NoOfTrades',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tradedCompaniesData,
        id: 'market-report-traded-companies',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Report Traded Companies" />
    ) : (
        <Fragment>
            <TableUiComponent componentSettings={tradedCompaniesColumnConfig}></TableUiComponent>
        </Fragment>
    );
};
