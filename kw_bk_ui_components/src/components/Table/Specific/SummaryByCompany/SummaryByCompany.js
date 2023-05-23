import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TableGroupByCategory } from './TableGroupByCategory';
import { getUrlDate } from '../../../../helper/date';
import { marketBackEndProxyPass } from '../../../../config/path';

export const SummaryByCompany = (props) => {
    const { lang } = props;
    const [tableData, setTableData] = useState({});

    const { year, month, reportMode } = getUrlDate(lang);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3578,
                T: reportMode,
                M: month,
                Y: year,
                L: convertByLang('A', 'E'),
            },
        }).then((res) => {
            let groupedBySymbolStatus =
                res &&
                res.data &&
                Array.isArray(res.data) &&
                res.data.reduce((r, a) => {
                    if (!r[a.SymbolStatus]) {
                        r[a.SymbolStatus] = {};
                    }
                    if (!r[a.SymbolStatus][a.MarketDesc]) {
                        r[a.SymbolStatus][a.MarketDesc] = {};
                    }
                    r[a.SymbolStatus][a.MarketDesc][a.Sector] = [
                        ...(r[a.SymbolStatus][a.MarketDesc][a.Sector] || []),
                        a,
                    ];
                    return r;
                }, {});

            setTableData(groupedBySymbolStatus);
        });
    }, []);

    const config = {
        columns: [
            {
                columnName: convertByLang('حالة الورقة المالية', 'Security Status'),
                dataType: 'text',
                mappingField: 'SymbolStatus',
                disableSorting: true,
            },
            {
                columnName: convertByLang('السوق', 'Market'),
                dataType: 'text',
                mappingField: 'MarketDesc',
                disableSorting: true,
            },
            {
                columnName: convertByLang('القطاع', 'Sector'),
                mappingField: 'Sector',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: convertByLang('الورقة المالية', 'Security'),
                dataType: 'text',
                mappingField: 'NameDesc',
                disableSorting: true,
            },
            {
                columnName: convertByLang('رقم الورقة المالية', 'Sec Code'),
                dataType: 'text',
                mappingField: 'Stk',
                disableSorting: true,
            },
            {
                columnName: convertByLang('حجم التداول', 'Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('القيمة المتداولة', 'Value Traded'),
                dataType: 'figure_3decimals',
                mappingField: 'Turnover',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('عدد الصفقات', 'Number of Trades'),
                dataType: 'figure_0decimals',
                mappingField: 'NoOfTrades',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('عدد الصفقات', 'Close'),
                dataType: 'price',
                mappingField: 'TodaysClosed',
                showSum: false,
                disableSorting: true,
            },
            {
                columnName: convertByLang('أدنى', 'Low'),
                dataType: 'price',
                mappingField: 'Low',
                showSum: false,
                disableSorting: true,
            },
            {
                columnName: convertByLang('أعلى', 'High'),
                dataType: 'price',
                mappingField: 'High',
                showSum: false,
                disableSorting: true,
            },
            {
                columnName: convertByLang('الأسهم القائمة', 'Shares Outstanding'),
                dataType: 'figure_0decimals',
                mappingField: 'SharesOutstanding',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('القيمة السوقية (د.ك.)', 'Market Capitalization (KD)'),
                dataType: 'figure',
                mappingField: 'MarketCap',
                showSum: true,
                disableSorting: true,
            },
        ],
        rawData: tableData,
        lang: lang,
    };
    return <TableGroupByCategory componentSettings={config} />;
};
