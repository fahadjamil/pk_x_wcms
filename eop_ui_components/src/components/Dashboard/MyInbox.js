import React, { useEffect, useState } from 'react';
import { ADMIN_LOGIN_ID_COOKIE, ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import Cookies from 'universal-cookie/es6';
import Axios from 'axios';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { BsChevronRight, BsDownload } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';
import DataTable from 'react-data-table-component';

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <div className="input-group col-md-3">
        <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={filterText}
            onChange={onFilter}
        />
        <div className="input-group-append">
            <button className="btn btn-sm btn-primary" onClick={onClear} type="button">
                <MdClear size={25} />
            </button>
        </div>
    </div>
);

export const MyInbox = (props) => {
    const [rolePermissions, setRolePermissions] = useState([]);
    const { lang } = props;
    const cookies = new Cookies();
    const [tableData, setTableData] = useState([]);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);

    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setAuthorized(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);

        if (login_cookie) {
            Axios.get(
                '/api/eop_myInbox/' + login_cookie,

                {}
            ).then((res) => {
                console.log(res);
                setTableData(res.data.myInbox_data);
            });
        }
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

    const mark_read = (e, value) => {
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_mark_read',
                    {
                        application_id: value,
                        user_id: login_cookie,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                });
            }
        });
    }

    const pick_function = (e, value) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to pick this Application?')) {
            Axios.get('/getCSRFToken').then((response) => {
                if (response.data.csrfToken) {
                    Axios.post(
                        '/api/eop_application_pick',
                        {
                            id: value,
                            comments: 'self picked',
                            modified_by: login_cookie,
                            assigned_user: login_cookie,
                        },
                        {
                            headers: {
                                'x-xsrf-token': response.data.csrfToken,
                            },
                        }
                    ).then((res) => {
                        console.log(res);
                        if (res.data.status == 'success') {
                            toast.success(res.data.message);
                        } else {
                            toast.error(res.data.message);
                        }
                    });
                }
            });
        }
    };

    const columns = [
        {
            name: 'Ref No.',
            selector: (row) => row.reference_number,
            sortable: true,
        },
        {
            name: 'Category',
            cell: (row) =>
                row.category_detail.category_name ? row.category_detail.category_name : '',
            sortable: true,
        },
        {
            name: 'Assigned Role',
            cell: (row) =>
                row.assigned_role_detail.role_name ? row.assigned_role_detail.role_name : '',
            sortable: true,
        },
        {
            name: 'Workflow Step',
            selector: (row) =>
                row.workflow_step_detail.step_name ? row.workflow_step_detail.step_name : '',
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => (row.status ? row.status : ''),
            sortable: true,
        },
        {
            name: 'Submitted By',

            cell: (row) =>
                (row.submit_user_detail ? row.submit_user_detail.first_name : '') +
                ' ' +
                (row.submit_user_detail ? row.submit_user_detail.last_name : ''),
            sortable: true,
        },
        {
            name: 'Submission Time',
            selector: (row) =>
                row.submit_time ? moment(row.submit_time).format('YYYY-MM-DD') : '',
            sortable: true,
        },
        {
            name: 'Assigned User',
            cell: (row) =>
                (row.assigned_user_detail ? row.assigned_user_detail.first_name : '') +
                ' ' +
                (row.assigned_user_detail ? row.assigned_user_detail.last_name : ''),
            sortable: true,
        },
        {
            cell: (row) =>
                rolePermissions.find(
                    (x) => x.role_permissions.resource_id === '625bf406c8f16c4898722775'
                ) ? (
                    <a
                        href={'/' + (lang !== undefined ? lang.langKey : 'en') + '/application-workflow#' + row._id}
                        className="btn btn-sm btn-primary"
                        onClick={row.inbox_status ? '' : (e) => { mark_read(e, row._id) }}
                    >
                        Review&nbsp;<BsChevronRight size={15} />
                    </a>
                ) : (
                    ''
                ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            cell: (row) =>
                row.assigned_user == '' &&
                    rolePermissions.find(
                        (x) => x.role_permissions.resource_id === '6253d225c8f16c48985d1748'
                    ) ? (
                    <button
                        className="btn btn-sm btn-success ml-2"
                        onClick={(e) => {
                            pick_function(e, row._id);
                        }}
                    >
                        Pick&nbsp;<BsDownload size={15} />
                    </button>
                ) : (
                    ''
                ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const filteredItems = tableData.filter(
        (item) =>
            (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.reference_number && item.reference_number.toString().includes(filterText.toString())) ||
            (item.submit_user_detail && item.submit_user_detail.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.submit_user_detail && item.submit_user_detail.last_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.category_detail && item.category_detail.category_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.workflow_step_detail && item.workflow_step_detail.step_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.assigned_role_detail && item.assigned_role_detail.role_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.assigned_user_detail && item.assigned_user_detail.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.assigned_user_detail && item.assigned_user_detail.last_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.submit_time && item.submit_time.toLowerCase().includes(filterText.toLowerCase()))
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent
                onFilter={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    const conditionalRowStyles = [
        {
            when: row => !row.inbox_status,
            style: {
                fontWeight: "bold"
            },
        },
    ];

    return (
        <div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                {authorized ? (
                    <div style={{ minHeight: '300px' }}>
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            toastOptions={{
                                duration: 5000,
                            }}
                        />
                        <DataTable
                            striped
                            pagination
                            columns={columns}
                            data={filteredItems}
                            conditionalRowStyles={conditionalRowStyles}
                            paginationResetDefaultPage={resetPaginationToggle}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                        />
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
