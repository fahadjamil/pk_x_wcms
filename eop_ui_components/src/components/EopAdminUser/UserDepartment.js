import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopUserDepartment } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const UserDepartment = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [departmentsuccess, setDepartmentSuccess] = useState('');
    const [error, setError] = useState('');
    const [data, setdata] = useState({
        department_name: '',
        department_desc: '',
        is_deleted: 'N',
    });
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
    }, []);
    const department = (e) => {
        if (e.target.id === 'department_name') {
            setdata({ ...data, department_name: e.target.value });
        }
        if (e.target.id === 'department_desc') {
            setdata({ ...data, department_desc: e.target.value });
        }
    };
    const department_submit = (e) => {
        e.preventDefault();
        console.log(data);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    eopUserDepartment(),
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
                        setDepartmentSuccess(convertByLang(res.data.message_ar, res.data.message));
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
            />{' '}
            {authorize ? (
                <form onSubmit={department_submit}>
                    <div className="col-md-6 p-2">
                        <label htmlFor="department_name" className="form-label">
                            Department Name
                            <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            title="Please enter the Department Name..."
                            className="form-control"
                            onChange={department}
                            id="department_name"
                            required
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label htmlFor="department_desc" className="form-label">
                            Department Description
                            <span className="text-danger">*</span>
                        </label>
                        <textarea
                            rows="5"
                            cols="60"
                            type="text"
                            title="Please enter the Department Description..."
                            className="form-control"
                            onChange={department}
                            id="department_desc"
                            required
                        />
                    </div>
                    <input type="submit" className="btn btn-primary my-5 mx-1" value="submit" />
                </form>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
