import React, { useEffect, useState } from 'react';

import { cssBarChart } from '../../config/path';

import Axios from 'axios';

export const ChartTable = (props) => {
    const { lang } = props;
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        Axios.get(cssBarChart(), {}).then((res) => {
            setTableData(res.data.find_data);
        });
    }, []);

    return (
        <div className="card shadow" style={{ minHeight: '300px' }}>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Category</th>
                        <th scope="col">New</th>
                        <th scope="col">Open</th>
                        <th scope="col">Review</th>
                        <th scope="col">Approved</th>
                        <th scope="col">Rejected</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                {tableData.map((row, index) => {
                    var total = row.new + row.open + row.review + row.approved + row.rejected;

                    return (
                        <tbody>
                            <tr>
                                <td>{row._id.category ? row._id.category.category_name : ''}</td>
                                <td>{row.new}</td>
                                <td>{row.open}</td>
                                <td>{row.review}</td>
                                <td>{row.approved}</td>
                                <td>{row.rejected}</td>
                                <td>{total}</td>
                            </tr>
                        </tbody>
                    );
                })}
            </table>
        </div>
    );
};
