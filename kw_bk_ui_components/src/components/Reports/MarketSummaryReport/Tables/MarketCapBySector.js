import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { marketBackEndProxyPass } from '../../../../config/path';
import { getUrlDate } from '../../../../helper/date';
import { TableGroupBySector } from './Common/TableGroupBySector';

export const MarketCapBySector = (props) => {
    const [tableData, setTableData] = useState([]);
    const { lang } = props;
    const { year, month, reportMode } = getUrlDate(lang);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3569,
                Y: year,
                M: month,
                L: convertByLang('A', 'E'),
                T: reportMode,
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
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
                columnName: convertByLang('سعر الاغلاق', 'Close Price'),
                dataType: 'price',
                mappingField: 'ClosedPrice',
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
                columnName: convertByLang('رأس المال ', 'Market Cap'),
                dataType: 'figure',
                mappingField: 'MarketCap',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('نسبة الى السوق', '% to Market'),
                dataType: 'figure',
                mappingField: 'MktCapPerc',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('% to relavant market', '% to Relavant Market'),
                dataType: 'figure',
                mappingField: 'SubMarketPerc',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('نسبة الى القطاع', '% to Sector'),
                dataType: 'figure',
                mappingField: 'SectorPerc',
                showSum: true,
                disableSorting: true,
            },
            {
                columnName: convertByLang('مؤشر السوق', 'Market'),
                dataType: 'text',
                mappingField: 'MarketDesc',
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
                    'القيمة السوقية حسب القطاع',
                    'Market Capitalization by Sector Breakdown'
                )}
            </h2>
            <TableGroupBySector
                componentSettings={CompanyTradeInfobySectorConfig}
            ></TableGroupBySector>
        </div>
    );
};
