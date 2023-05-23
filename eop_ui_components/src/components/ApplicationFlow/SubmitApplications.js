import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { BsChevronRight } from 'react-icons/bs';
import moment from 'moment';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import DataTable from 'react-data-table-component';

let now = new Date();
let day = ('0' + now.getDate()).slice(-2);
let month = ('0' + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + '-' + month + '-' + day;

export const SubmitApplications = (props) => {

    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [applicationData, setApplicationData] = useState('');
    const cookies = new Cookies();
    const [data, setdata] = useState({
        from_date: today,
        to_date: today,
        category: '',
        status: '',
        name: '',
        aqama_no: '',
        passport_no: '',
        cnic: '',
    });

    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);

    useEffect(() => {
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
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/submited_applications',
                    {
                        from_date: today,
                        to_date: today,
                        category: 'all',
                        status: 'all',
                        name: 'all',
                        aqama_no: 'all',
                        passport_no: 'all',
                        cnic: '',
                        login_user:login_cookie,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    let ary = [];
                    if (res.data.find_data) {
                        res.data.find_data.forEach((row) => {
                            ary.push(row);
                        });
                        console.log('--applications data--');
                        console.log(ary);
                        setApplicationData(ary);
                    } else {
                        setApplicationData([]);
                    }
                });
            }
        });

        Axios.get('/api/eop_check_role_permission/' + login_cookie, {}).then((res) => {
            let ary = [];
            if (res.data.permission_data) {
                res.data.permission_data.forEach((row) => {
                    ary.push(row);
                });
                setRolePermissions(ary);
            } else {
                setRolePermissions([]);
            }
        });
    }, []);

    const clearInputs = () => {
        setdata({
            from_date: today,
            to_date: today,
            category: '',
            status: '',
            name: '',
            aqama_no: '',
            passport_no: '',
            cnic: '',
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
        if (e.target.id === 'name') {
            setdata({ ...data, name: e.target.value });
        }
        if (e.target.id === 'aqama_no') {
            setdata({ ...data, aqama_no: e.target.value });
        }
        if (e.target.id === 'passport_no') {
            setdata({ ...data, passport_no: e.target.value });
        }
        if (e.target.id === 'cnic') {
            setdata({ ...data, cnic: e.target.value });
        }
    };

    const fetch = (e) => {
        e.preventDefault();
        console.log(data);
        let FD, TD, CAT, ST, NA, AQ, PA, CN;
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
        if (!data.name) {
            NA = 'all';
        } else {
            NA = data.name;
        }
        if (!data.aqama_no) {
            AQ = 'all';
        } else {
            AQ = data.aqama_no;
        }
        if (!data.passport_no) {
            PA = 'all';
        } else {
            PA = data.passport_no;
        }
        if (!data.cnic) {
            CN = '';
        } else {
            CN = data.cnic;
        }
        console.log('Axios Data');
        console.log(FD, TD, CAT, ST, NA, AQ, PA, CN);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/submited_applications',
                    {
                        from_date: FD,
                        to_date: TD,
                        category: CAT,
                        status: ST,
                        name: NA,
                        aqama_no: AQ,
                        passport_no: PA,
                        cnic: CN,
                        login_user:login_cookie,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    let ary = [];
                    if (res.data.find_data) {
                        res.data.find_data.forEach((row) => {
                            ary.push(row);
                        });
                        console.log('--applications data--');
                        console.log(ary);
                        setApplicationData(ary);
                    } else {
                        setApplicationData([]);
                    }
                });
            }
        });
    };

    const columns = [
        {
            name: 'Ref. No.',
            cell: (row) => row.reference_number,
            sortable: true,
        },
        {
            name: 'Submitted By',
            cell: (row) =>
                row.submit_user ? row.submit_user.first_name + ' ' + row.submit_user.last_name : '',
            sortable: true,
        },
        {
            name: 'CNIC',
            cell: (row) => (row.submit_user ? row.submit_user.cnic : ''),
            sortable: true,
        },
        {
            name: 'Category',
            cell: (row) =>
                row.category[0] && row.category[0].category_name
                    ? row.category[0].category_name
                    : '',

            sortable: true,
        },
        {
            name: 'Submission Time',
            cell: (row) => moment(row.submit_time).format('DD-MM-YYYY hh:mm A'),
            sortable: true,
        },
        {
            name: 'Status',
            cell: (row) => row.status ? row.status : '',
            sortable: true,
        },
        {
            cell: (row) => (
                <div>
                    {
                        rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '625bf406c8f16c4898722775'
                        ) ? (
                            <a
                                className="mx-1 btn btn-sm btn-primary"
                                href={
                                    '/' +
                                    (lang !== undefined ? lang.langKey : 'en') +
                                    '/application-workflow#' +
                                    row._id
                                }
                            >
                                Review&nbsp;<BsChevronRight size={15} />
                            </a>
                        ) : ''
                    }
                    {
                        rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '62498f5ac8f16c48984a2753'
                        ) ? (
                            <a
                                className="mx-1 btn btn-sm btn-primary"
                                href={'/' + lang.langKey + '/submitted-application#' + row._id}
                            >
                                Details&nbsp;<BsChevronRight size={15} />
                            </a>
                        ) : ''
                    }
                    {
                        rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '62f749e343a25b37e9fce445'
                        ) ? (
                            <a
                                className="mx-1 btn btn-sm btn-success"
                                href={'/' + lang.langKey + '/edit-submitted-application#' + row._id}
                            >
                                Edit&nbsp;<BsChevronRight size={15} />
                            </a>
                        ) : ''
                    }
                </div>
            ),
            width: '250px',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                {authorize ? (
                    <div>
                        <form
                            onSubmit={fetch}
                            style={{ borderRadius: '10px' }}
                            className="row border col-md-12 m-2 p-3"
                        >
                            <div className="input-group mb-3 col-md-4">
                                <label className="col-sm-5 col-form-label text-right">Submission From</label>
                                <div className='col-sm-7'>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="from_date"
                                        value={data.from_date}
                                        onChange={collectData}
                                    />
                                </div>
                            </div>
                            <div className="input-group mb-3 col-md-4">
                                <label className="col-sm-5 col-form-label text-right">Submission To</label>
                                <div className='col-sm-7'>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="to_date"
                                        value={data.to_date}
                                        onChange={collectData}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4"></div>

                            <div className="input-group mb-3 col-md-4">
                                <label className="col-sm-5 col-form-label text-right">
                                    Category
                                </label>
                                <div className='col-sm-7'>
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
                            </div>
                            <div className="input-group mb-3 col-md-4">
                                <label className="col-sm-5 col-form-label text-right">
                                    Status
                                </label>
                                <div className='col-sm-7'>
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
                            </div>
                            <div className="input-group mb-3 col-md-4">
                                <label className="col-sm-5 col-form-label text-right">
                                    CNIC
                                </label>
                                <div className='col-sm-7'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cnic"
                                        value={data.cnic}
                                        onChange={collectData}
                                    />
                                </div>
                            </div>
                            <div className="input-group mb-3 col-md-4">
                                <label htmlFor="name" className="col-sm-5 col-form-label text-right">
                                    Name
                                </label>
                                <div className='col-sm-7'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={data.name}
                                        onChange={collectData}
                                    />
                                </div>
                            </div>
                            <div className="input-group mb-3 col-md-4">
                                <label htmlFor="aqama_no" className="col-sm-5 col-form-label text-right">
                                    Iqama No.
                                </label>
                                <div className='col-sm-7'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="aqama_no"
                                        value={data.aqama_no}
                                        onChange={collectData}
                                    />
                                </div>
                            </div>
                            <div className="input-group mb-3 col-md-4">
                                <label htmlFor="passport_no" className="col-sm-5 col-form-label text-right">
                                    Passport No.
                                </label>
                                <div className='col-sm-7'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="passport_no"
                                        value={data.passport_no}
                                        onChange={collectData}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
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
                        <DataTable striped pagination columns={columns} data={applicationData} />
                    </div>
                ) : (
                    <div>
                        <AdminAuthorizationText langKey={lang.langKey} />
                    </div>
                )}
            </div>
            <div style={{ display: loading ? 'flex' : 'none' }} className="justify-content-center">
                <div
                    className="spinner-border"
                    style={{ width: '3rem', height: '3rem' }}
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
};
