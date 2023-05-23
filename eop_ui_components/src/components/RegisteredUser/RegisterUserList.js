import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopUsers } from '../../config/path';
import { BsChevronRight } from 'react-icons/bs';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
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
                className="btn btn-sm btn-primary"
                onClick={onClear}
                type="button"
            >
                <MdClear size={25} />
            </button>
        </div>
    </div>
);

export const RegisterUserList = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [userData, setUserData] = useState([]);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        Axios.get('/api/auth/eop_registered_user', {}).then((res) => {
            let ary = [];
            if (res.data.user_data.RegisteredUsers) {
                res.data.user_data.RegisteredUsers.forEach((row) => {
                    ary.push(row);
                });
                console.log('--ary--');
                console.log(ary);
                setUserData(ary);
            } else {
                console.log('--empty--');
                setUserData([]);
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

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.first_name + ' ' + row.last_name,
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'CNIC',
            selector: (row) => row.cnic,
            sortable: true,
        },
        {
            cell: (row) => (
                <div>
                    {
                        rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '625bc32ac8f16c489871a4c9'
                        ) ? (

                            <a href={'/' + lang.langKey + '/details-user#' + row._id}>
                                <button type="button" class="btn btn-sm btn-primary">
                                    Details&nbsp;<BsChevronRight size={15} />
                                </button>
                            </a>
                        ) : ''
                    }
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const filteredItems = userData.filter(
        (item) =>
            (item.first_name && item.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
            item.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.email.toLowerCase().includes(filterText.toLowerCase()) ||
            item.mobile.toLowerCase().includes(filterText.toLowerCase()) ||
            item.cnic.toLowerCase().includes(filterText.toLowerCase())
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
            {authorize ? (
                <div>
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
