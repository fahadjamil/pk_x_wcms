import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { marketBackEndProxyPass } from '../../../../config/path';
import { getUrlDate } from '../../../../helper/date';
import { TableGroupBySector } from './Common/TableGroupBySector';

export const CompanyTradeInfoBySector = (props) => {
    const { lang } = props;
    const [tableData, setTableData] = useState([]);
    const { year, month, reportMode } = getUrlDate(lang);

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3569,
                Y: year,
                M: month,
                L: convertByLang('A', 'E'),
                T: reportMode
            },
        }).then((res) => {
            let group =
                res &&
                res.data &&
                res.data.reduce((r, a) => {
                    r[a.SectorDesc] = [...(r[a.SectorDesc] || []), a];
                    return r;
                }, {});

            if (group) {
                setTableData(group);
            }
        });
    }, []);
    const CompanyTradeInfobySectorConfig = {
        columns: [
            {
                columnName: convertByLang('القطاع', 'Sector'),
                mappingField: 'DisplayTicker',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: convertByLang('السعر', 'Value'),
                dataType: 'figure',
                mappingField: 'Turnover',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('القيمة', 'Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('عدد الصفقات', 'Number of Transactions'),
                dataType: 'figure_0decimals',
                mappingField: 'NoOfTrades',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('القطاع', 'Sector'),
                dataType: 'text',
                mappingField: 'SectorDesc',
                showSum: true,
                disableSorting: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        lang: lang,
    };
    return (
        <div>
            <h2>
                {convertByLang(
                    'بيانات التداول للشركات حسب القطاع',
                    'Company Trade Information By Sector Breakdown'
                )}
            </h2>
            <TableGroupBySector
                componentSettings={CompanyTradeInfobySectorConfig}
            ></TableGroupBySector>
        </div>
    );
};
