import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

export const ReactGraph = (props) => {
    return (
        <LineChart
            width={70}
            height={70}
            data={props.data}
            margin={{ top: 0, right: 0, bottom: -30, left: -60 }}
        >
            {/* <CartesianGrid strokeDasharray="3 3" width={70} height={70}/> */}
            <XAxis dataKey={props.xAxis} tick={false} stroke="#000000" domain={['auto', 'auto']} />
            <YAxis tick={false} stroke="#000000" domain={[props.minimumY, props.maximumY]} />
            <Tooltip />
            {/* <Legend /> */}
            <Line type="monotone" dataKey={props.dataKey} stroke="#8884d8" dot={false} />
        </LineChart>
    );
};
