import React from 'react';
import { TableUiComponent } from '../Table/TableComponent';

export const Results = ({ tableData, lang, activeManageColumns }) => {
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    let componentSettings = {
        tableName: 'stockScreenerResults',
        columns: [
            {
                columnName: convertByLang('الرمز', 'Symbol'),
                dataType: 'link',
                mappingField: 'symbol',
                disableSorting: true,
                required: true,
            },
            {
                columnName: convertByLang('رقم الشركة', 'Stock Number'),
                dataType: 'highlightText',
                mappingField: 'stockID',
                disableSorting: true,
                required: true,
            },
            {
                columnName: convertByLang('القطاع', 'Sector'),
                dataType: 'text',
                mappingField: 'sector',
                disableSorting: true,
            },

            {
                columnName: convertByLang('% منذ بداية العام', 'YTD%'),
                dataType: 'figure',
                mappingField: 'pricePctChg52Wk',
                disableSorting: true,
            },
            {
                columnName: convertByLang('(مليون) رسملة السوق', 'Market Cap (Miilions)'),
                dataType: 'figure_3decimals',
                mappingField: 'mktCap',
                disableSorting: true,
            },
            {
                columnName: convertByLang('مضاعف ربحية السهم', 'P/E Ratio'),
                dataType: 'figure',
                mappingField: 'per',
                disableSorting: true,
            },
            {
                columnName: convertByLang('العائد', 'Yield'),
                dataType: 'figure',
                mappingField: 'yield',
                disableSorting: true,
            },
            {
                columnName: convertByLang('% تغيير السعر لـ4 أسابيع', '4-wk Price Change %'),
                dataType: 'figure',
                mappingField: 'pricePctChgMTD',
                disableSorting: true,
            },
            {
                columnName: convertByLang('% تغيير السعر لـ13 أسبوع', '13-wk Price Change %'),
                dataType: 'figure',
                mappingField: 'pricePctChg13Wk',
                disableSorting: true,
            },
            {
                columnName: convertByLang('% تغيير السعر لـ26 أسبوع', '26-wk Price Change %'),
                dataType: 'figure',
                mappingField: 'pricePctChg26Wk',
                disableSorting: true,
            },
            {
                columnName: convertByLang('هامش صافي الربح', 'Net Profit %'),
                dataType: 'figure',
                mappingField: 'netProfPct',
                disableSorting: true,
            },
            {
                columnName: convertByLang('مضاعف القيمة الدفترية', 'P/B Ratio'),
                dataType: 'figure',
                mappingField: 'priceBookValue',
                disableSorting: true,
            },
            {
                columnName: convertByLang('% تغيير الإيرادات لسنة', '1 yr Revenue Change %'),
                dataType: 'figure',
                mappingField: 'revPctChg1Yr',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        enableColumnManager: activeManageColumns,
        lang: lang
    };
    return <TableUiComponent componentSettings={componentSettings} />;
};
