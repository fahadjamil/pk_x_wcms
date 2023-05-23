import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopRoleListing } from '../../config/path';
import { FaEdit } from 'react-icons/fa';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AiFillDelete } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import DataTable from 'react-data-table-component';
import { MdClear } from 'react-icons/md';

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
            <button
                className="btn btn-primary"
                onClick={onClear}
                type="button"
            >
                <MdClear size={25} />
            </button>
        </div>
    </div>
);

export const UserListing = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [roleData, setRoleData] = useState([]);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        show();
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
    const show = () => {
        Axios.get('/api/eop_role_listing', {}).then((res) => {
            let ary = [];
            if (res.data.find_data) {
                res.data.find_data.forEach((row) => {
                    ary.push(row);
                });
                console.log('--ary--');
                console.log(ary);
                setRoleData(ary);
            } else {
                console.log('--empty--');
                setRoleData([]);
            }
        });
    };
    const deleteRecord = (value) => {
        console.log('deleted value id');
        console.log(value);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_delete_eopUser',
                    {
                        id: value,
                        is_deleted: 'Y',
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
                        show();
                    } else {
                        toast.error(res.data.message);
                    }
                });
            }
        });
    };

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.first_name + ' ' + row.last_name,
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: (row) => row.mobile_number,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'Designation',
            selector: (row) => row.designation.designation_name,
            sortable: true,
        },
        {
            cell: (row) => (
                <a
                    className="btn btn-primary"
                    href={'/' + lang.langKey + '/update-admin-user#' + row._id}
                >
                    <span className="input-group-btn">
                        <FaEdit size={25} />
                    </span>
                </a>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-danger ml-2"
                    onClick={() => {
                        if (window.confirm('Are you sure you wish to delete this?')) {
                            deleteRecord(row._id);
                        }
                    }}
                >
                    <AiFillDelete size={25} />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const filteredItems = roleData.filter(
        (item) =>
            (item.first_name && item.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
            item.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.email.toLowerCase().includes(filterText.toLowerCase()) ||
            item.mobile_number.toLowerCase().includes(filterText.toLowerCase()) ||
            item.designation.designation_name.toLowerCase().includes(filterText.toLowerCase())
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

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />
            {authorize ? (
                <div>
                    {rolePermissions.find(
                        (x) => x.role_permissions.resource_id === '625bbeaac8f16c4898719580'
                    ) ? (
                        <a
                            className="input-group-btn btn btn-primary float-right mb-2"
                            href={'/' + lang.langKey + '/add-admin-user'}
                        >
                            Add User
                        </a>
                    ) : (
                        ''
                    )}
                    <DataTable
                        striped
                        pagination
                        columns={columns}
                        data={filteredItems}
                        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
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
    );
};
