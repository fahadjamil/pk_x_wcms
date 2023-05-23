import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Bar, Tooltip, BarChart, Legend, CartesianGrid, XAxis, YAxis } from 'recharts';

import { displayShortFormat, getMonthText, getUrlDate } from '../../../helper/date';
import styled from 'styled-components';
import {
    ALL_AR_NAME,
    ALL_COLOR,
    ALL_NAME,
    MAIN50_AR_NAME,
    MAIN50_COLOR,
    MAIN50_NAME,
    MAIN_AR_NAME,
    MAIN_COLOR,
    MAIN_NAME,
    PREMIER_AR_NAME,
    PREMIER_COLOR,
    PREMIER_NAME,
} from './IndexChartConfig';
import { formatYAxisValues, formatToolTipValues } from '../helper/common';
import { marketBackEndProxyPass } from '../../../config/path';

const BarChartWrapper = styled.div`
    width: 100%;
    height: 550px;
    background: #faf9f7;
    border-bottom-right-radius: 50px;
    border-top-left-radius: 50px;
    margin-top: 20px;
    direction: ltr !important;
`;

const BarChartTitleWrapper = styled.div`
    text-align: center;
    width: 100%;
    padding-top: 10px;
    color: rgb(141, 143, 142);
    font-size: 0.8em;
`;

export const IndicesBarChart = (props) => {
    const { lang, data } = props;
    const { year, month, reportMode } = getUrlDate();
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const chartType = (data.settings && data.settings.type && data.settings.type.value) || 'volume';

    const [chartData, setChartData] = useState([]);

    const VOLUME_000 = convertByLang(`القيمة(000)`, `Volume (000)`);
    const VALUE_000 = convertByLang(` (000)السعر`, `Value (000)`);
    const NO_OF_TRADES = convertByLang(`عدد الصفقات`, `Number of Trades`);

    const getValue = (obj) => {
        switch (chartType) {
            case 'volume':
                return obj.Volume;
            case 'value':
                return obj.Turnover;
            case 'nooftrades':
                return obj.Nooftrades;
            case 'symbolsTraded':
                return obj.SymbolsTraded;

            default:
                break;
        }
    };

    const setTitle = () => {
        switch (chartType) {
            case 'volume':
                return VOLUME_000;
            case 'value':
                return VALUE_000;
            case 'nooftrades':
                return NO_OF_TRADES;
            default:
                break;
        }
    };

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3579,
                Y: year,
                M: month,
                T: reportMode,
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                let tempChartData = res.data.reduce((r, a) => {
                    let tempObj = {
                        [a.MarketId]: getValue(a),
                    };
                    let index = r.findIndex((val) => val.TransactionDate == a.TransactionDate);

                    if (index != -1) {
                        let newObject = { ...r[index], ...tempObj };
                        let tempR = r;
                        tempR[index] = newObject;
                        return tempR;
                    } else {
                        return [
                            ...r,
                            {
                                ...tempObj,
                                TransactionDate: a.TransactionDate,
                                label: generateLabel(a),
                            },
                        ];
                    }
                }, []);
                setChartData(tempChartData);
            }
        });
    }, []);

    // Display months on Yearly mode
    const isYearly = reportMode == 6;
    const generateLabel = (tradeDateObj) =>
        isYearly
            ? getMonthText(tradeDateObj.TransactionDate.toString())
            : displayShortFormat(lang, tradeDateObj.TransactionDate);

    const legendFormatter = (value, entry, index) => {
        switch (value) {
            case 'P':
                return convertByLang(PREMIER_AR_NAME, PREMIER_NAME);
            case 'M':
                return convertByLang(MAIN_AR_NAME, MAIN_NAME);
            case '50':
                return convertByLang(MAIN50_AR_NAME, MAIN50_NAME);
            case '03':
                return convertByLang(ALL_AR_NAME, ALL_NAME);
            default:
                return value;
        }
    };
    const tickFormatter = (tickValue) => formatYAxisValues(tickValue, lang);
    const divideByThousand = (value) => (value && value / 1000) || undefined;

    const dataForBarChart = chartData.map((tradeDate) => ({
        ...tradeDate,
        P: divideByThousand(tradeDate.P),
        M: divideByThousand(tradeDate.M),
        50: divideByThousand(tradeDate['50']),
        '03': divideByThousand(tradeDate['03']),
    }));

    const toolTipFormatter = (value, name, props) => {
        const tradeDateObject = chartData.find(
            (tradeDate) => tradeDate.TransactionDate === props.payload.TransactionDate
        );

        switch (name) {
            case 'P':
                return [
                    formatToolTipValues(tradeDateObject.P),
                    convertByLang(PREMIER_AR_NAME, PREMIER_NAME),
                ];
            case 'M':
                return [
                    formatToolTipValues(tradeDateObject.M),
                    convertByLang(MAIN_AR_NAME, MAIN_NAME),
                ];
            case '50':
                return [
                    formatToolTipValues(tradeDateObject['50']),
                    convertByLang(MAIN50_AR_NAME, MAIN50_NAME),
                ];
            case '03':
                return [
                    formatToolTipValues(tradeDateObject['03']),
                    convertByLang(ALL_AR_NAME, ALL_NAME),
                ];

            default:
                break;
        }
    };

    return (
        <div>
            <BarChartWrapper>
                <BarChartTitleWrapper>
                    <h3>{setTitle()}</h3>
                </BarChartTitleWrapper>
                <BarChart
                    width={1200}
                    height={500}
                    data={dataForBarChart}
                    margin={{ top: 10, right: 0, bottom: 50, left: 50 }}
                    // barCategoryGap={50}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ angle: -25 }}
                        tickSize={30}
                        tickLine={false}
                        interval={0}
                    />
                    <YAxis tickFormatter={tickFormatter} />
                    <Tooltip
                        formatter={toolTipFormatter}
                        contentStyle={{ textAlign: 'end' }}
                        labelStyle={{
                            textAlign: 'center',
                            marginBottom: '10px',
                            fontSize: '1.2em',
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={50}
                        iconType="rect"
                        iconSize={25}
                        formatter={legendFormatter}
                    />
                    <Bar dataKey={'P'} fill={PREMIER_COLOR} />
                    <Bar dataKey={'M'} fill={MAIN_COLOR} />
                    <Bar dataKey={'50'} fill={MAIN50_COLOR} />
                    <Bar dataKey={'03'} fill={ALL_COLOR} />
                </BarChart>
            </BarChartWrapper>
        </div>
    );
};
