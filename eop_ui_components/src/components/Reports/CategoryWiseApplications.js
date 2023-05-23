import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

let now = new Date();
let day = ('0' + now.getDate()).slice(-2);
let month = ('0' + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + '-' + month + '-' + day;

export const CategoryWiseApplications = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [ApplicationsData, setApplicationsData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [data, setdata] = useState({
        from_date: today,
        to_date: today,
        category: '',
        status: '',
    });
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        Axios.get('/api/eop_show_categories_admin', {}).then((res) => {
            console.log('--res categories--');
            console.log(res);
            let ary = [];
            if (res.data.user_data.showCategories) {
                res.data.user_data.showCategories.forEach((row) => {
                    ary.push(row);
                });
                console.log('--ary--setCategoriesData');
                console.log(ary);

                setCategoriesData(ary);
            } else {
                console.log('--empty--');
                setCategoriesData([]);
            }
        });
    }, []);
    const ExpandedComponent = ({ data }) => (
        <pre>
            {
                <table
                    className="table  table-striped"
                    style={{
                        'font-family': 'Arial, Helvetica, sans-serif',
                    }}
                >
                    <thead className="table-primary">
                        <tr>
                            <td style={{ backgroundColor: '#006622', color: '#fff', }} scope="col"> Ref.No </td>
                            <td style={{ backgroundColor: '#006622', color: '#fff', }} scope="col"> Submitted By </td>
                            <td style={{ backgroundColor: '#006622', color: '#fff', }} scope="col"> CNIC </td>
                            <td style={{ backgroundColor: '#006622', color: '#fff', }} scope="col"> Submission Time </td>
                            <td style={{ backgroundColor: '#006622', color: '#fff', }} scope="col"> Status </td>
                            <td style={{ backgroundColor: '#006622', color: '#fff', }} scope="col"> Workflow Step </td>
                            <td style={{ backgroundColor: '#006622', color: '#fff', }} scope="col"> Assigned User </td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.applications &&
                            data.applications.map((item, index) => {
                                return (
                                    <tr key={item._id}>
                                        <td>
                                            {item.reference_number ? item.reference_number : ''}
                                        </td>
                                        <td>
                                            {item.submit_user && item.submit_user[0]
                                                ? item.submit_user[0].first_name +
                                                ' ' +
                                                item.submit_user[0].last_name
                                                : ''}
                                        </td>
                                        <td>
                                            {item.submit_user && item.submit_user[0]
                                                ? item.submit_user[0].cnic
                                                : ''}
                                        </td>
                                        <td>
                                            {item.submit_time
                                                ? moment(item.submit_time).format(
                                                    'DD-MM-YYYY hh:mm A'
                                                )
                                                : ''}
                                        </td>
                                        <td>{item.status ? item.status : ''}</td>
                                        <td>
                                            {item.workflow_step ? item.workflow_step.step_name : ''}
                                        </td>
                                        <td>
                                            {item.assigned_user && item.assigned_user[0]
                                                ? item.assigned_user[0].first_name +
                                                ' ' +
                                                item.assigned_user[0].last_name
                                                : ''}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            }
        </pre>
    );

    const columns = [
        {
            name: '',
            selector: (row) => (row._id != undefined ? row._id : ''),
            style: { 'font-weight': '900' },
        },
    ];

    const clearInputs = () => {
        setdata({
            from_date: today,
            to_date: today,
            category: '',
            status: '',
        });
    };
    const collectData = (e) => {
        if (e.target.id === 'from_date') {
            setdata({ ...data, from_date: e.target.value });
        }
        if (e.target.id === 'to_date') {
            setdata({ ...data, to_date: e.target.value });
        }
        if (e.target.id === 'category') {
            setdata({ ...data, category: e.target.value });
        }
        if (e.target.id === 'status') {
            setdata({ ...data, status: e.target.value });
        }
    };
    const fetch = (e) => {
        e.preventDefault();
        console.log(data);
        let FD, TD, CAT, ST;
        if (!data.from_date) {
            FD = today;
        } else {
            FD = data.from_date;
        }
        if (!data.to_date) {
            TD = today;
        } else {
            TD = data.to_date;
        }
        if (!data.category) {
            CAT = 'all';
        } else {
            CAT = data.category;
        }
        if (!data.status) {
            ST = 'all';
        } else {
            ST = data.status;
        }
        console.log('Axios Data');
        console.log(FD, TD, CAT, ST);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/categories_applications_report',
                    {
                        from_date: FD,
                        to_date: TD,
                        category: CAT,
                        status: ST,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res.data.find_data);
                    res.data.find_data.map((item, index) => {
                        item.defaultExpanded = true;
                    });
                    console.log(res.data.find_data);
                    setApplicationsData(res.data.find_data);
                });
            }
        });
    };

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <form
                        onSubmit={fetch}
                        className="row border col-md-12 m-2 p-3"
                        style={{ borderRadius: '10px' }}
                    >
                        <div className="input-group mb-3 col-md-4">
                            <label className="form-label mt-1 mr-2">Submitted Date From</label>
                            <input
                                type="date"
                                className="form-control"
                                id="from_date"
                                value={data.from_date}
                                onChange={collectData}
                            />
                        </div>
                        <div className="input-group mb-3 col-md-4">
                            <label className="form-label mt-1 mr-2">Submitted Date To</label>
                            <input
                                type="date"
                                className="form-control"
                                id="to_date"
                                value={data.to_date}
                                onChange={collectData}
                            />
                        </div>
                        <div className="col-md-4"></div>

                        <div className="input-group mb-3 col-md-4">
                            <label htmlFor="category" className="form-label mt-1 mr-2">
                                Category
                            </label>
                            <select
                                className="form-control"
                                id="category"
                                onChange={collectData}
                                value={data.category}
                            >
                                {' '}
                                <option value="all">All</option>
                                {categoriesData &&
                                    categoriesData.map((item, index) => {
                                        let data = item._id || item.category_name;
                                        return data ? (
                                            <option key={item._id} value={item._id}>
                                                {item.category_name}
                                            </option>
                                        ) : (
                                            ''
                                        );
                                    })}
                            </select>
                        </div>
                        <div className="input-group mb-3 col-md-4">
                            <label htmlFor="status" className="form-label mt-1 mr-2">
                                Status
                            </label>
                            <select
                                className="form-control"
                                id="status"
                                onChange={collectData}
                                value={data.status}
                            >
                                <option value="all">All</option>
                                <option value="new">New</option>
                                <option value="open">Open</option>
                                <option value="review">Review</option>
                                <option value="rejected">Rejected</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                        <div className="col-md-4"></div>
                        <div className="col-md-8">
                            <button
                                type="submit"
                                className="btn btn-success float-right"
                            >
                                Fetch Report
                            </button>
                            <button
                                className="btn btn-outline-secondary mr-4 float-right"
                                onClick={clearInputs}
                                type="button"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </form>
                    <DataTable
                        striped
                        pagination
                        columns={columns}
                        data={ApplicationsData}
                        expandableRows
                        expandableRowExpanded={(row) => row.defaultExpanded}
                        expandableRowsComponent={ExpandedComponent}
                    />
                </div>
            ) : (
                <AdminAuthorizationText langKey={lang.langKey} />
            )}
        </div>
    );
};
