import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopShowUserDepartment } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { FaEdit } from 'react-icons/fa';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AiFillDelete } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const DepartmentListing = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [userDepartments, setUserDepartments] = useState('');
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
        Axios.get(eopShowUserDepartment(), {}).then((res) => {
            console.log(res);
            setUserDepartments(res.data.user_data);
        });
    };
    const deleteRecord = (value) => {
        console.log('deleted value id');
        console.log(value);
        Axios.get('/getCSRFToken').then((response) => {

            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_delete_department',
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
    console.log(userDepartments);

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
                <div className="col-md-12 pl-0">
                    {rolePermissions.find(
                        (x) => x.role_permissions.resource_id === '625bbfaac8f16c48987198e6'
                    ) ? (
                        <a
                            className="input-group-btn btn btn-primary float-right mb-2"
                            href={'/' + lang.langKey + '/add-department'}
                        >
                            Add Department
                        </a>
                    ) : (
                        ''
                    )}
                    <table className="table table-striped">
                        <thead className="table-primary">
                            <tr>
                                <td style={{ backgroundColor: '#ccc', color: '#000' }} scope="col">No.</td>
                                <td style={{ backgroundColor: '#ccc', color: '#000' }} scope="col">Name</td>
                                <td style={{ backgroundColor: '#ccc', color: '#000' }} scope="col">Description</td>
                                <td style={{ backgroundColor: '#ccc', color: '#000' }} scope="col"></td>
                            </tr>
                        </thead>
                        <tbody>
                            {userDepartments &&
                                userDepartments.map((userDepartments, index) => {
                                    let data =
                                        userDepartments.department_name ||
                                        userDepartments.department_desc;
                                    return data ? (
                                        <tr>
                                            <td scope="row">{index + 1}</td>
                                            <td>{userDepartments.department_name}</td>
                                            <td>{userDepartments.department_desc}</td>
                                            <td>
                                                {rolePermissions.find(
                                                    (x) =>
                                                        x.role_permissions.resource_id ===
                                                        '625bc1cfc8f16c489871a030'
                                                ) ? (
                                                    <a
                                                        title='Edit'
                                                        className="btn btn-primary"
                                                        href={
                                                            '/' +
                                                            lang.langKey +
                                                            '/update-department#' +
                                                            userDepartments._id
                                                        }
                                                    >
                                                        <FaEdit size={25} />
                                                    </a>
                                                ) : (
                                                    ''
                                                )}
                                                {rolePermissions.find(
                                                    (x) =>
                                                        x.role_permissions.resource_id ===
                                                        '625d4365c8f16c4898729cef'
                                                ) ? (
                                                    <button
                                                        title='Delete'
                                                        type="button"
                                                        className="btn btn-danger ml-4"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    'Are you sure you wish to delete this?'
                                                                )
                                                            ) {
                                                                deleteRecord(userDepartments._id);
                                                            }
                                                        }}
                                                    >
                                                        <AiFillDelete size={25} />
                                                    </button>
                                                ) : (
                                                    ''
                                                )}
                                            </td>
                                        </tr>

                                    ) : (
                                        ''
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
