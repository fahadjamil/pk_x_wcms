import React, { useRef, useState, useEffect } from 'react';
import Chartjs from 'chart.js';

// const randomInt = () => Math.floor(Math.random() * (10 - 1 + 1)) + 1;

function BarChartComponent(props: any) {
    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState<any>(null);
    const { data, options } = props;

    const chartConfig = {
        type: 'bar',
        data: data,
        options: options,
    };

    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, [chartContainer]);

    // Bar chart data update functions goes here
    // const updateDataset = (datasetIndex, newData) => {
    //     chartInstance.data.datasets[datasetIndex].data = newData;
    //     chartInstance.update();
    // };

    // const onButtonClick = () => {
    //     const data = [randomInt(), randomInt(), randomInt(), randomInt(), randomInt(), randomInt()];
    //     updateDataset(0, data);
    // };

    return (
        <div>
            {/* <button onClick={onButtonClick}>Randomize!</button> */}
            <canvas ref={chartContainer} />
        </div>
    );
}

export default BarChartComponent;
