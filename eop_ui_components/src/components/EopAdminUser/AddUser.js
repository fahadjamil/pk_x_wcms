import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopShowUserDesignation } from '../../config/path';
import { eopShowUserRoles } from '../../config/path';
import { eopAddUser } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { eopShowUserDepartment } from '../../config/path';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const AddUser = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [userSuccess, setUserSuccess] = useState('');
    const [userDesignation, setUserDesignation] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userRoles, setUserRoles] = useState('');
    const [error, setError] = useState('');
    const [data, setdata] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        email: '',
        password: '',
        confirm_password: '',
        designation: '',
        department: '',
        is_deleted: 'N',
    });

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        Axios.get(eopShowUserDesignation(), {}).then((res) => {
            console.log(res);
            setUserDesignation(res.data.user_data);
        });
        Axios.get(eopShowUserDepartment(), {}).then((res) => {
            console.log(res);
            setUserDepartment(res.data.user_data);
        });
        Axios.get(eopShowUserRoles(), {}).then((res) => {
            console.log(res);
            setUserRoles(res.data.user_data);
        });
    }, []);

    const user_data = (e) => {
        if (e.target.id === 'first_name') {
            setdata({ ...data, first_name: e.target.value });
        }
        if (e.target.id === 'last_name') {
            setdata({ ...data, last_name: e.target.value });
        }
        if (e.target.id === 'mobile_number') {
            setdata({ ...data, mobile_number: e.target.value });
        }
        if (e.target.id === 'email') {
            setdata({ ...data, email: e.target.value });
        }
        if (e.target.id === 'password') {
            setdata({ ...data, password: e.target.value });
        }
        if (e.target.id === 'confirm_password') {
            setdata({ ...data, confirm_password: e.target.value });
        }
        if (e.target.id === 'designation') {
            setdata({ ...data, designation: e.target.value });
        }
        if (e.target.id === 'department') {
            setdata({ ...data, department: e.target.value });
        }
    };
    const user_data_submit = (e) => {
        e.preventDefault();
        console.log(data);
        if (data.password != data.confirm_password) {
            setError('Password & Confirm Password mismatch');
            toast.error('Password & Confirm Password mismatch');
        } else {
            Axios.get('/getCSRFToken').then((response) => {

                if (response.data.csrfToken) {
                    Axios.post(
                        eopAddUser(),
                        {
                            designation: data.designation,
                            department: data.department,
                            email: data.email,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            mobile_number: data.mobile_number,
                            password: data.password,
                            confirm_password: data.confirm_password,
                            is_deleted: data.is_deleted,
                            role_data: JSON.stringify(userRoles),
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
                            setUserSuccess(convertByLang(res.data.message_ar, res.data.message));
                        } else {
                            toast.error(res.data.message);
                            setError(convertByLang(res.data.message_ar, res.data.message));
                        }
                    });
                }
            });
        }
    };
    const changeItemChecked = function (val, index) {
        let ary = userRoles;
        let _item = ary[index];
        _item.item_enabled = val;
        userRoles[index] = _item;
        console.log(userRoles);
    };

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div className="col-md-12">
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            duration: 5000,
                        }}
                    />

                    <form className="row" onSubmit={user_data_submit}>
                        <div className="col-md-4 p-2">
                            <label htmlFor="first_name" className="form-label">
                                First Name
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                title="Please enter the first name..."
                                className="form-control"
                                onChange={user_data}
                                id="first_name"
                                required
                            />
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="last_name" className="form-label">
                                Last Name
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                title="Please enter the last name..."
                                className="form-control"
                                onChange={user_data}
                                id="last_name"
                                required
                            />
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="mobile_number" className="form-label">
                                Mobile Number
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                pattern="^(\d{1,3}[- ]?)?\d{10}$"
                                placeholder="92123-1234567"
                                title="Mobile number with 7-9 and remaing 9 digit with 0-9"
                                maxLength="13"
                                onChange={user_data}
                                id="mobile_number"
                                required
                            />
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="email" className="form-label">
                                Email
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                title="Please enter the email address..."
                                className="form-control"
                                placeholder="example@domain.com"
                                onChange={user_data}
                                id="email"
                                required
                            />
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="password" className="form-label">
                                Password
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                className="form-control"
                                onChange={user_data}
                                id="password"
                                required
                            />
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="confirm_password" className="form-label">
                                Confirm Password
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                className="form-control"
                                onChange={user_data}
                                id="confirm_password"
                                required
                            />
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="designation" className="form-label">
                                Designation
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-control"
                                id="designation"
                                onChange={user_data}
                                required
                            >
                                <option value="">Open this to select</option>
                                {userDesignation &&
                                    userDesignation.map((item, index) => {
                                        let data = item.designation_name;
                                        return data ? (
                                            <option key={item._id} value={item._id}>
                                                {item.designation_name}
                                            </option>
                                        ) : (
                                            ''
                                        );
                                    })}
                            </select>
                        </div>

                        <div className="col-md-4 p-2">
                            <label htmlFor="department" className="form-label">
                                Department
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-control"
                                id="department"
                                onChange={user_data}
                                required
                            >
                                <option value="">Open this to select</option>
                                {userDepartment &&
                                    userDepartment.map((item, index) => {
                                        let data = item.department_name;
                                        return data ? (
                                            <option key={item._id} value={item._id}>
                                                {item.department_name}
                                            </option>
                                        ) : (
                                            ''
                                        );
                                    })}
                            </select>
                        </div>

                        <div className="col-md-9">
                            <label className="form-label">Roles</label>
                        </div>

                        <div
                            className="col-md-12 p-2 m-1"
                            style={{ borderWidth: 1, borderStyle: 'solid' }}
                        >
                            <div className="row">
                                {userRoles
                                    ? userRoles.map((item, index) => {
                                        return (
                                            <div key={index} className="col-md-3 p-3">
                                                <input
                                                    type="checkbox"
                                                    value={item._id}
                                                    onChange={(e) =>
                                                        changeItemChecked(e.target.checked, index)
                                                    }
                                                />
                                                <label>{item.role_name}</label>
                                                <br></br>
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        </div>

                        <input type="submit" className="btn btn-primary my-2 mx-1" value="submit" />
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
