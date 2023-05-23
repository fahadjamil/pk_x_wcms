import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';

export const BulletinCompanyStats = (props) => {
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
                columnName: convertByLang('الشركة', 'Stock'),
                dataType: 'custom',
                mappingField: 'Stk',
            },
            {
                columnName: convertByLang('اسم السهم', 'Ticker'),
                dataType: 'ticker',
                mappingField: 'DisplayTicker',
            },
            {
                columnName: convertByLang('الإغلاق السابق', 'Previous Close'),
                dataType: 'figure_1decimal',
                mappingField: 'PrevWeekClose',
            },
            {
                columnName: convertByLang('سعر الإفتتاح', 'Opening Price'),
                dataType: 'figure_1decimal',
                mappingField: 'OpenPrice',
            },
            {
                columnName: convertByLang('أعلى', 'High'),
                dataType: 'figure_1decimal',
                mappingField: 'High',
            },
            {
                columnName: convertByLang('أدنى', 'Low'),
                dataType: 'figure_1decimal',
                mappingField: 'Low',
            },
            {
                columnName: convertByLang('الإغلاق', 'Close'),
                dataType: 'figure_1decimal',
                mappingField: 'Close',
            },
            {
                columnName: convertByLang('التغير من آخر إغلاق', 'Change to Previous Close'),
                dataType: 'figure_1decimal',
                mappingField: 'ChngPrevCloseValue',
            },
            {
                columnName: convertByLang('تغير من آخر إغلاق %', 'Change to Previous Close %'),
                dataType: 'figure',
                mappingField: 'ChngPrevClosePChg',
            },
            {
                columnName: convertByLang('أفضل سعر شراء متبقي', 'Remaining Best Bid Price'),
                dataType: 'figure_1decimal',
                mappingField: 'BestBidPrice',
            },
            {
                columnName: convertByLang('أفضل كمية شراء متبقية', 'Remaining Best Bid Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'BestBidVolume',
            },
            {
                columnName: convertByLang('أفضل سعر بيع متبقي', 'Remaining Best Ask Price'),
                dataType: 'figure_1decimal',
                mappingField: 'BestAskPrice',
            },
            {
                columnName: convertByLang('أفضل كمية بيع متبقية', 'Remaining Best Ask Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'BestAskVolume',
            },
            {
                columnName: convertByLang('معدل السعر المرجح','VWAP'),
                dataType: 'figure_3decimals',
                mappingField: 'VWAP',
            },
            {
                columnName: convertByLang('الكمية', 'Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
            },
            {
                columnName: convertByLang('مجموع الصفقات', 'Total Trades'),
                dataType: 'figure_0decimals',
                mappingField: 'TotalTrades',
            },
            {
                columnName: convertByLang('القيمة', 'Value'),
                dataType: 'figure_3decimals',
                mappingField: 'Value',
            },
            {
                columnName: lang.langKey == 'EN' ? '52 Week High' : 'أعلى 52',
                dataType: 'figure_3decimals',
                mappingField: 'High52Week',
            },
            {
                columnName: lang.langKey == 'EN' ? '52 Week Low' : 'أدنى 52',
                dataType: 'figure_3decimals',
                mappingField: 'Low52Week',
            },
            {
                columnName: convertByLang('تاريخ صفقة السابق', 'Previous Trade Date'),
                dataType: 'date',
                mappingField: 'PrevTradeDate',
            },
            {
                columnName: convertByLang('السوق', 'Market Segment'),
                dataType: 'text',
                mappingField: 'MarketSegment',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: marketBackEndProxyPass(),
            header: { params: { ...reqParams } },
        },
        id: 'companyStat'
    };

    return <TableUiComponent componentSettings={componentSettings}></TableUiComponent>;
};
