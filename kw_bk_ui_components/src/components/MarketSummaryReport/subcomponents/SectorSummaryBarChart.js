import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, Tooltip, BarChart, Legend, CartesianGrid, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../../config/path';
import { getUrlDate } from '../../../helper/date';
import { formatYAxisValues, formatToolTipValues } from '../helper/common';

import {
    VALUE_NAME,
    VOLUME_NAME,
    NOOFTRADES_NAME,
    VOLUME_DATAKEY,
    VALUE_DATAKEY,
    NOOFTRADES_DATAKEY,
    VOLUME_COLOR,
    VALUE_COLOR,
    NOOFTRADES_COLOR,
    sectorSummaryChartWidth,
    sectorSummaryChartHeight,
    VALUE_AR_NAME,
    VOLUME_AR_NAME,
    NOOFTRADES_AR_NAME,
} from './IndexChartConfig';

const BarChartWrapper = styled.div`
    width: 100%;
    height: 600px;
    background: #faf9f7;
    border-bottom-right-radius: 50px;
    border-top-left-radius: 50px;
    direction: ltr !important;
`;

const TitleWrapper = styled.div`
    text-align: center;
    width: 100%;
    padding-top: 10px;
    color: rgb(141, 143, 142);
    font-size: 0.8em;
`;

export const SectorSummaryBarChart = (props) => {
    const { lang } = props;
    const [sectorData, setSectorData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const { year, month } = getUrlDate(lang);
    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3563,
                Y: year,
                M: month,
                L: convertByLang('A', 'E'),
                CT: 2,
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                setSectorData(res.data);
            }
        });
    }, []);

    const dataForBarChart = sectorData.map((sector) => ({
        ...sector,
        Volume: sector.Volume / 1000,
        Value: sector.Value / 1000,
    }));
    const setAlternateBackgrounds = (e) =>
        e.index % 2 ? (
            <path
                x={e.x}
                y={e.y}
                width={e.width}
                height={e.height}
                fill="#FFFFFF"
                class="recharts-rectangle recharts-bar-background-rectangle"
                radius="0"
                d={`M ${e.x},${e.y} h ${e.width * 3 + 8} v ${e.height} h -${e.width * 3 + 8} Z`}
            ></path>
        ) : (
            false
        );

    const legendFormatter = (value, entry, index) => {
        let threeZeros = '(000)';
        switch (value) {
            case 'Value':
                return convertByLang(
                    `${VALUE_AR_NAME} ${threeZeros}`,
                    `${VALUE_NAME} ${threeZeros}`
                );
            case 'Volume':
                return convertByLang(
                    `${VOLUME_AR_NAME}${threeZeros}`,
                    `${VOLUME_NAME} ${threeZeros}`
                );
            case 'NoOfTrades':
                return convertByLang(NOOFTRADES_AR_NAME, NOOFTRADES_NAME);
            default:
                return value;
        }
    };

    const tickFormatter = (tickValue) => formatYAxisValues(tickValue, lang);

    const toolTipFormatter = (value, name, props) => {
        const nativeSectorObject = sectorData.find(
            (sector) => sector.SectorName === props.payload.SectorName
        );
        switch (name) {
            case 'Volume':
                return [
                    formatToolTipValues(nativeSectorObject.Volume),
                    convertByLang(VOLUME_AR_NAME, VOLUME_NAME),
                ];
            case 'Value':
                return [
                    formatToolTipValues(nativeSectorObject.Value),
                    convertByLang(VALUE_AR_NAME, VALUE_NAME),
                ];
            case 'NoOfTrades':
                return [
                    formatToolTipValues(value),
                    convertByLang(NOOFTRADES_AR_NAME, NOOFTRADES_NAME),
                ];
            default:
                break;
        }
    };

    const TITLE = () => convertByLang('تفصيل مؤشرات القطاعات', 'Sector Indices breakdown');

    return sectorData.length == 0 ? (
        <React.Fragment></React.Fragment>
    ) : (
        <BarChartWrapper>
            <TitleWrapper>
                <h3>{TITLE()}</h3>
            </TitleWrapper>
            <BarChart
                width={sectorSummaryChartWidth}
                height={sectorSummaryChartHeight}
                data={dataForBarChart}
                margin={{ top: 20, right: 0, bottom: 50, left: 30 }}
            >
                <CartesianGrid strokeDasharray="3" vertical={false} />
                <XAxis
                    type="category"
                    dataKey="SectorName"
                    tick={{ angle: -35, fontSize: '0.7em' }}
                    interval={0}
                    tickSize={40}
                    tickLine={false}
                />
                <YAxis tickFormatter={tickFormatter} />
                <Tooltip
                    formatter={toolTipFormatter}
                    contentStyle={{ textAlign: 'end' }}
                    labelStyle={{
                        textAlign: 'center',
                        marginBottom: '5px',
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
                <Bar
                    dataKey={VOLUME_DATAKEY}
                    fill={VOLUME_COLOR}
                    background={setAlternateBackgrounds}
                />
                <Bar dataKey={VALUE_DATAKEY} fill={VALUE_COLOR} />
                <Bar dataKey={NOOFTRADES_DATAKEY} fill={NOOFTRADES_COLOR} />
            </BarChart>
        </BarChartWrapper>
    );
};
