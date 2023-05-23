import React, { useEffect, useState } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import Axios from 'axios';
import { cssPieChart } from '../../config/path';

export const PieChart = (props) => {
    const { lang } = props;
    const [graphData, setGraphData] = useState([]);
    useEffect(() => {
        show();
    }, []);
    const show = () => {
        Axios.get(
            cssPieChart(), {}).then((res) => {
                setGraphData({ labels: res.data.countData.map((m) => m._id), values: res.data.countData.map((m) => m.count) });
            });
    };
    const dataPieChart = {
        labels: graphData.labels,
        datasets: [
            {
                label: 'Submitted Applications',
                backgroundColor: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                borderWidth: 1,
                data: graphData.values,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            datalabels: { display: true },
        }
    };
    return (
        <div className="card shadow" style={{ height: '400px', padding: '0 0 20px 0' }}>
            <div class="card-body">
                <h5 class="card-title">Submitted Applications</h5>
                <Doughnut
                    data={dataPieChart}
                    options={options}
                />
            </div>
        </div>
    );
};
