import React, { Fragment } from 'react';
import { TableUiComponent } from '../../TableComponent';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { MarketReportData} from "./MarketReportData";

export const MarketReportTopStocks = (props) => {
    const { lang, commonConfigs } = props;
    const topStockTableData =  MarketReportData(props, 'Tops Stocks');

    const marketReportTopStocksColumnConfig = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'الشركة' : 'Stock',
                dataType: 'text',
                mappingField: 'CompanyName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'آخر تنفيذ' : 'Last',
                dataType: 'figure_0decimals',
                mappingField: 'Last',
            },
            {
                columnName: lang.langKey === 'AR' ? 'التغير%' : 'Change %',
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
                dataType: 'figure_3decimals',
                mappingField: 'Turnover',
            },
            {
                columnName: lang.langKey === 'AR' ? 'الصفقات' : 'Trades',
                dataType: 'figure_0decimals',
                mappingField: 'NoOfTrades',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: topStockTableData,
        id: 'market-report-top-stocks',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Report Top Stock" />
    ) : (
        <Fragment>
            <TableUiComponent componentSettings={marketReportTopStocksColumnConfig}></TableUiComponent>
        </Fragment>
    );
}