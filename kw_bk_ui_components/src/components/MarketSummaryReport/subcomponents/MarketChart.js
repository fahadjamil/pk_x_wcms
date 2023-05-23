import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { oldMarketBackEndProxyPass } from '../../../config/path';
import { getFirstAndLastDay, getStartDateAndEndDate, getUrlDate } from '../../../helper/date';
import { LineChartComponent } from '../common/LineChartComponent';
import { epochToShortDate, getHeaderIndex } from '../helper/helper';
import { charts, CLOSE_KEY, DATE_KEY } from './IndexChartConfig';

export const MarketChart = (props) => {
    const { lang, data } = props;
    const [chartData, setChartData] = useState([]);

    const { year, month, quarter, reportMode } = getUrlDate(lang);
    // const { firstDayOfMonth, lastDayOfMonth } = getFirstAndLastDay(year, month);

    const { SD, ED } = getStartDateAndEndDate(reportMode, year, month, quarter);

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const marketType = (data.settings && data.settings.type && data.settings.type.value) || '01';

    useEffect(() => {
        let marketData = [];

        const getHED = (res) => res && res.data && res.data.HED && res.data.HED.HIS;
        const getDAT = (res) => res && res.data && res.data.DAT && res.data.DAT.HIS;

        const getValuesFromResponse = (res) => {
            let HED = getHED(res);
            return {
                DAT: getDAT(res),
                HED: HED,
                closeIndex: getHeaderIndex(HED, CLOSE_KEY),
                dateIndex: getHeaderIndex(HED, DATE_KEY),
            };
        };
        Axios.get(oldMarketBackEndProxyPass(), {
            params: {
                SID: 'sid',
                UID: 123,
                RT: 37,
                S: marketType,
                INS: 0,
                E: 'KSE',
                CT: 3,
                CM: 3,
                PGS: 1800,
                M: 1,
                H: 1,
                UNC: 0,
                SD: SD,
                ED: ED,
            },
        }).then((res) => {
            const { DAT, closeIndex, dateIndex } = getValuesFromResponse(res);

            marketData = DAT.map((data) => ({
                date: data[dateIndex],
                tradeClose: data[closeIndex],
            }));

            setChartData(
                marketData.map((data) => ({
                    ...data,
                    date: epochToShortDate(data.date, lang),
                }))
            );
        });
    }, []);

    const chart = charts.find((chart) => chart.type === marketType);
    return chart && chartData.length != 0 ? (
        <LineChartComponent
            data={chartData}
            dataKey={'tradeClose'}
            strokeFill={chart.color}
            chartName={convertByLang(chart.arName, chart.name)}
            key={chart.id}
        ></LineChartComponent>
    ) : (
        <React.Fragment></React.Fragment>
    );
};
