import React, {Fragment} from 'react';
import {TableUiComponent} from "../../TableComponent";
import {SpecificPreviewComponent} from "../../../SpecificPreviewComponent";
import { MarketReportData} from "./MarketReportData";

export const MarketReportSummaryBySector = (props) => {
    const { commonConfigs, lang } = props;
    const summaryBySectorData =  MarketReportData(props, 'Summary by Sector');

    const summaryBySectorColumnConfig = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'القطاع' : 'Sector',
                dataType: 'text',
                mappingField: 'SectorName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'حجم التداول' : 'Volume',
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
            },
            {
                columnName: lang.langKey === 'AR' ? '% للسوق' : '% to Market',
                dataType: 'figure_3decimals',
                mappingField: 'VolumePerc',
            },
            {
                columnName: lang.langKey === 'AR' ? 'القيمة' : 'Value',
                dataType: 'figure_0decimals',
                mappingField: 'Turnover',
            },
            {
                columnName: lang.langKey === 'AR' ? '% للسوق' : '% to Market',
                dataType: 'figure_3decimals',
                mappingField: 'TurnoverPerc',
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد الصفقات' : 'No of Trades',
                dataType: 'figure_0decimals',
                mappingField: 'NoOfTrades',
            },
            {
                columnName: lang.langKey === 'AR' ? '% للسوق' : '% to Market',
                dataType: 'figure_3decimals',
                mappingField: 'NoOfTradesPerc',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: summaryBySectorData,
        id: 'market-report-summary-by-sector',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Report Summary By Sector" />
    ) : (
        <Fragment>
            <TableUiComponent componentSettings={summaryBySectorColumnConfig}></TableUiComponent>
        </Fragment>
    );
};
