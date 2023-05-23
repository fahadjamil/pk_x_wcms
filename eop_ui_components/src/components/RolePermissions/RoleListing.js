import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopShowUserRoles } from '../../config/path';
import { BsChevronRight } from 'react-icons/bs';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AiFillDelete } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const RoleListing = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [userRoles, setUserRoles] = useState('');
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
        Axios.get(eopShowUserRoles(), {}).then((res) => {
            console.log(res);
            setUserRoles(res.data.user_data);
        });
    };
    const deleteRecord = (value) => {
        console.log('deleted value id');
        console.log(value);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_delete_role',
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
    console.log(userRoles);
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
                        (x) => x.role_permissions.resource_id === '625bbef0c8f16c4898719666'
                    ) ? (
                        <div className="col-md-12 pb-5">
                            <a
                                className="input-group-btn btn btn-primary float-right mb-2"
                                href={'/' + lang.langKey + '/add-role'}
                            >
                                Add Role
                            </a>
                        </div>
                    ) : (
                        ''
                    )}

                    {userRoles &&
                        userRoles.map((userRoles, index) => {
                            console.log('--userRoles--');
                            console.log(userRoles);
                            let data = userRoles.role_name || userRoles.role_desc;
                            return data ? (
                                <div class="alert alert-success pb-5" role="alert">
                                    <h4 class="alert-heading">{userRoles.role_name}</h4>
                                    <hr />
                                    <p>{userRoles.role_desc}</p>
                                    {rolePermissions.find(
                                        (x) =>
                                            x.role_permissions.resource_id ===
                                            '625bc0fec8f16c4898719d6f'
                                    ) ? (
                                        <a
                                            className="float-right"
                                            href={
                                                '/' +
                                                lang.langKey +
                                                '/role-permission#' +
                                                userRoles._id
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="input-group-btn btn btn-primary"
                                            >
                                                Edit Permissions
                                                <BsChevronRight size={20} />
                                            </button>
                                        </a>
                                    ) : (
                                        ''
                                    )}
                                    {rolePermissions.find(
                                        (x) =>
                                            x.role_permissions.resource_id ===
                                            '625d4391c8f16c4898729d5c'
                                    ) ? (
                                        <button
                                            type="button"
                                            className="btn btn-danger mr-2 float-right"
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        'Are you sure you wish to delete this?'
                                                    )
                                                ) {
                                                    deleteRecord(userRoles._id);
                                                }
                                            }}
                                        >
                                            <AiFillDelete size={25} />
                                            Delete
                                        </button>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            ) : (
                                ''
                            );
                        })}
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
