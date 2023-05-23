import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopShowUserDesignation } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { FaEdit } from 'react-icons/fa';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AiFillDelete } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const DesignationListing = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [userDesignation, setuserDesignation] = useState('');
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
        Axios.get(eopShowUserDesignation(), {}).then((res) => {
            console.log(res);
            setuserDesignation(res.data.user_data);
        });
    };
    const deleteRecord = (value) => {
        console.log('deleted value id');
        console.log(value);
        Axios.get('/getCSRFToken').then((response) => {

            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_delete_designation',
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
    console.log(userDesignation);

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
                        (x) => x.role_permissions.resource_id === '625bbf43c8f16c4898719785'
                    ) ? (
                        <a
                            className="input-group-btn btn btn-primary float-right mb-2"
                            href={'/' + lang.langKey + '/add-designation'}
                        >
                            Add Designation
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
                        {userDesignation &&
                            userDesignation.map((userDesignation, index) => {
                                let data =
                                    userDesignation.designation_name ||
                                    userDesignation.designation_desc;
                                return data ? (
                                    <tbody>
                                        <tr>
                                            <td scope="row">{index + 1}</td>
                                            <td>{userDesignation.designation_name}</td>
                                            <td>{userDesignation.designation_desc}</td>
                                            <td>
                                                {rolePermissions.find(
                                                    (x) =>
                                                        x.role_permissions.resource_id ===
                                                        '625bc290c8f16c489871a2bd'
                                                ) ? (
                                                    <a
                                                        title='Edit'
                                                        className="btn btn-primary"
                                                        href={
                                                            '/' +
                                                            lang.langKey +
                                                            '/update-designation#' +
                                                            userDesignation._id
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
                                                        '625d4338c8f16c4898729c7a'
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
                                                                deleteRecord(userDesignation._id);
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
                                        <tr></tr>
                                    </tbody>
                                ) : (
                                    ''
                                );
                            })}
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
