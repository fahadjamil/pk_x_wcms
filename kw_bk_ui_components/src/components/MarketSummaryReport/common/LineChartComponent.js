import React from 'react';
import { Label, LineChart, Line, Legend, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import styled from 'styled-components';
import { formatAsCurrency } from '../helper/common';
import { findMax, findMin } from '../helper/helper';
import {
    chartHeight,
    chartWidth,
    domainMargin,
    strokeDashSize,
    strokeWidthSize,
} from '../subcomponents/IndexChartConfig';

const LineChartWrapper = styled.div`
    direction: ltr !important;
`;

const TitleWrapper = styled.div`
    text-align: center;
`;

export const LineChartComponent = (props) => {
    const { data, dataKey, strokeFill, chartName } = props;

    const chartDomainRange = () => {
        // find the the range min & max for the Y Axis

        let rangeMin = findMin(data, dataKey);
        let rangeMax = findMax(data, dataKey);
        return [
            Math.round((rangeMin - domainMargin) / 100) * 100,
            Math.round((rangeMax + domainMargin) / 100) * 100,
        ];
    };

    const tickFormatter = (tick) => formatAsCurrency(tick);
    const toolTipFormatter = (value, name, props) => formatAsCurrency(value);

    return data && data.length == 0 ? (
        <React.Fragment></React.Fragment>
    ) : (
        <LineChartWrapper>
            <TitleWrapper>
                <h3 style={{ color: strokeFill }}>{chartName}</h3>
            </TitleWrapper>
            <LineChart width={chartWidth} height={chartHeight} data={data} margin={{ bottom: 20 }}>
                {/* <Legend verticalAlign="bottom" height={36} /> */}
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={strokeFill}
                    strokeWidth={strokeWidthSize}
                    name={chartName}
                    dot={false}
                />

                <CartesianGrid strokeDasharray={strokeDashSize} vertical={false} />
                <Tooltip
                    contentStyle={{ textAlign: 'end' }}
                    labelStyle={{
                        textAlign: 'center',
                        marginBottom: '10px',
                        fontSize: '1.2em',
                    }}
                    formatter={toolTipFormatter}
                />
                <XAxis
                    dataKey="date"
                    tick={{ angle: -45, fontSize: '0.85em' }}
                    tickSize={14}
                    tickLine={false}
                ></XAxis>
                <YAxis domain={chartDomainRange()} tickFormatter={tickFormatter} />
            </LineChart>
        </LineChartWrapper>
    );
};
