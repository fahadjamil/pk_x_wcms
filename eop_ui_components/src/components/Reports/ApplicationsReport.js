import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import { BsDownload } from 'react-icons/bs';

let now = new Date();
let day = ('0' + now.getDate()).slice(-2);
let month = ('0' + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + '-' + month + '-' + day;

const convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = [
        'reference_number',
        'submitted_by',
        'cnic',
        'category',
        'submit_time',
        'status',
        'workflow',
        'assigned_user',
    ];

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
        let ctr = 0;
        keys.forEach((key) => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
};

const downloadCSV = (array) => {
    console.log('filteredItems');
    console.log(array);
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'ApplicationsReport.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
};

const Export = ({ onExport }) => (
    <button className="btn btn-dark mr-4" onClick={(e) => onExport(e.target.value)}>
        Export&nbsp;<BsDownload size={10} />
    </button>
);

export const ApplicationsReport = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [filteredItems, setfilteredItems] = useState([]);
    const [data, setdata] = useState({
        from_date: today,
        to_date: today,
        category: '',
        status: '',
    });

    const actionsMemo = React.useMemo(
        () => <Export onExport={() => downloadCSV(filteredItems)} />,
        [filteredItems]
    );

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
                    '/api/applications_report',
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
                    console.log(res);
                    setfilteredItems(res.data.find_data);
                });
            }
        });
    };

    const columns = [
        {
            name: 'Ref. No.',
            selector: (row) => (row.reference_number != undefined ? row.reference_number : ''),
            sortable: true,
        },
        {
            name: 'Submitted By',
            selector: (row) => (row.submitted_by != undefined ? row.submitted_by : ''),
            sortable: true,
        },
        {
            name: 'CNIC',
            selector: (row) => (row.cnic != undefined ? row.cnic : ''),
            sortable: true,
        },
        {
            name: 'Category',
            selector: (row) => (row.category != undefined ? row.category : ''),
            sortable: true,
        },
        {
            name: 'Submission Time',
            selector: (row) =>
                row.submit_time != undefined
                    ? moment(row.submit_time).format('DD-MM-YYYY hh:mm A')
                    : '',
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
        },
        {
            name: 'Workflow Step',
            selector: (row) => (row.workflow != undefined ? row.workflow : ''),
            sortable: true,
        },
        {
            name: 'Assigned User',
            selector: (row) => (row.assigned_user != undefined ? row.assigned_user : ''),
            sortable: true,
        },
    ];

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <form
                        onSubmit={fetch}
                        style={{ borderRadius: '10px' }}
                        className="row border col-md-12 m-2 p-3"
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
                        data={filteredItems}
                        actions={actionsMemo}
                    />
                </div>
            ) : (
                <AdminAuthorizationText langKey={lang.langKey} />
            )}
        </div>
    );
};
