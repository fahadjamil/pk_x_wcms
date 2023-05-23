import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import Axios from 'axios';
import { cssBarChart } from '../../config/path';

export const BarChart = (props) => {
    const { lang } = props;
    const [graphData, setGraphData] = useState([]);
    let categories = [];
    let new_applications = [];
    let open_applications = [];
    let review_applications = [];
    let approved_applications = [];
    let rejected_applications = [];

    useEffect(() => {
        Axios.get(cssBarChart(), {}).then((res) => {
            // console.log('--res--');
            // console.log(res);
            // console.log('--res.data--');
            // console.log(res.data);
            setGraphData(res.data.find_data);
        });
    }, []);
    if (graphData) {
        graphData.forEach((element) => {
            console.log(element);
            categories.push(element._id.category ? element._id.category.category_name : '');
            new_applications.push(element.new);
            open_applications.push(element.open);
            review_applications.push(element.review);
            approved_applications.push(element.approved);
            rejected_applications.push(element.rejected);
        });
    }
    console.log(categories);

    const dataBar = {
        labels: categories,
        datasets: [
            {
                label: 'New',
                data: new_applications,
                backgroundColor: '#7cb5ec',
            },
            {
                label: 'Open',
                data: open_applications,
                backgroundColor: '#434348',
            },
            {
                label: 'Review',
                data: review_applications,
                backgroundColor: '#90ed7d',
            },
            {
                label: 'Approved',
                data: approved_applications,
                backgroundColor: '#f7a35c',
            },
            {
                label: 'Rejected',
                data: rejected_applications,
                backgroundColor: '#8085e9',
            },
        ],
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            datalabels: {
                formatter: (value, ctx) => {
                    return value;
                    // let datasets = ctx.chart.data.datasets;

                    // if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                    //     let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                    //     let percentage = Math.round((value / sum) * 100) + "%";
                    //     return percentage;
                    // } else {
                    //     return percentage;
                    // }
                },
                color: 'red',
            },
        },
    };

    return (
        <div className="card shadow" style={{ height: '400px', padding: '0 0 20px 0' }}>
            <div class="card-body">
                <h5 class="card-title">Category Distribution</h5>
                <Bar data={dataBar} options={options} />
            </div>
        </div>
    );
};
