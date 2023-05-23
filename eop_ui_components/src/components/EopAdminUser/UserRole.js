import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopUserRoles } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const UserRole = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [rolesuccess, setRoleSuccess] = useState('');
    const [error, setError] = useState('');
    const [data, setdata] = useState({
        role_name: '',
        role_desc: '',
        is_deleted: 'N',
    });
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
    }, []);
    const role = (e) => {
        if (e.target.id === 'role_name') {
            setdata({ ...data, role_name: e.target.value });
        }
        if (e.target.id === 'role_desc') {
            setdata({ ...data, role_desc: e.target.value });
        }
    };
    const role_submit = (e) => {
        e.preventDefault();
        console.log(data);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    eopUserRoles(),
                    {
                        item_data: data,
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
                        setRoleSuccess(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        toast.error(res.data.message);
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    }
                });
            }
        });
    };

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
                    <form onSubmit={role_submit}>
                        <div className="col-md-6 p-2">
                            <label htmlFor="role_name" className="form-label">
                                Role Name
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                title="Please enter the Role Name..."
                                className="form-control"
                                onChange={role}
                                id="role_name"
                                required
                            />
                        </div>
                        <div className="col-md-6 p-2">
                            <label htmlFor="role_desc" className="form-label">
                                Role Description
                                <span className="text-danger">*</span>
                            </label>
                            <textarea
                                rows="5"
                                cols="60"
                                type="text"
                                title="Please enter the Role Description..."
                                className="form-control"
                                onChange={role}
                                id="role_desc"
                                required
                            />
                        </div>
                        <input type="submit" className="btn btn-primary my-5 mx-1" value="submit" />
                    </form>
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
