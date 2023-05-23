import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';

export const BulletinIndices = (props) => {
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
                columnName: convertByLang('الإسم', 'Name'),
                dataType: 'text',
                mappingField: 'DisplayTicker',
            },

            {
                columnName: convertByLang('آخر', 'Last'),
                dataType: 'figure',
                mappingField: 'Last',
            },
            {
                columnName: convertByLang('تغير', 'Change'),
                dataType: 'figure',
                mappingField: 'Change',
            },
            {
                columnName: convertByLang('التغير %', 'Change %'),
                dataType: 'figure',
                mappingField: 'PChange',
            },
            {
                columnName: convertByLang('الافتتاح', 'Open'),
                dataType: 'figure',
                mappingField: 'Open',
            },
            {
                columnName: convertByLang('أعلى', 'High'),
                dataType: 'figure',
                mappingField: 'High',
            },
            {
                columnName: convertByLang('أدنى', 'Low'),
                dataType: 'figure',
                mappingField: 'Low',
            },
            {
                columnName: convertByLang('الكمية', 'Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
            },
            {
                columnName: convertByLang('عدد الصفقات', 'Trades'),
                dataType: 'figure_0decimals',
                mappingField: 'TotalTrades',
            },
            {
                columnName: convertByLang('القيمة', 'Value'),
                dataType: 'figure_3decimals',
                mappingField: 'Value',
            },
            {
                columnName: convertByLang('السابق', 'Prev'),
                dataType: 'figure',
                mappingField: 'PreviousClosed',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: marketBackEndProxyPass(),
            header: { params: { ...reqParams } },
        },
        id: 'indices'
    };

    return <TableUiComponent componentSettings={componentSettings}></TableUiComponent>;
};
