import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';

export const BulletinMarketOverview = (props) => {
    const { reqParams, lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    let componentSettings = {
        columns: [
            {
                columnName: convertByLang('التاريخ', 'Date'),
                mappingField: 'TransactionDate',
                dataType: 'date',
            },
            {
                columnName: convertByLang('السوق', 'Market Type'),
                dataType: 'text',
                mappingField: 'MarketType',
            },
            {
                columnName: convertByLang('الكمية', 'Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
                showSum : true
            },

            {
                columnName: convertByLang('القيمة (د.ك)', 'Value (KD)'),
                dataType: 'figure_3decimals',
                mappingField: 'Value',
                showSum : true
            },
            {
                columnName: convertByLang('مجموع الصفقات', 'Total Trades'),
                dataType: 'figure_0decimals',
                mappingField: 'TotalTrades',
                showSum : true
            },
            {
                columnName: convertByLang('عدد الشركات المتداولة', 'No. of companies Traded'),
                dataType: 'figure_0decimals',
                mappingField: 'NoofCompanyTrades',
                showSum : true
            },
            {
                columnName: convertByLang('القيمة السوقية (د.ك)', 'Market Cap (KD)'),
                dataType: 'figure_3decimals',
                mappingField: 'MarketCap',
                showSum : true
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: marketBackEndProxyPass(),
            header: { params: { ...reqParams } },
        },
        showSumRow: true,
        id: 'marketOverView'
    };

    return <TableUiComponent componentSettings={componentSettings}></TableUiComponent>;
};
