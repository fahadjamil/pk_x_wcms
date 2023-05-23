import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopShowUserDesignation } from '../../config/path';
import { eopShowUserRoles } from '../../config/path';
import { eopUpdateUserRole } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { ADMIN_FUNCTION_LOGOUT } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillEdit, AiFillDelete, AiFillSave, AiFillLeftCircle } from 'react-icons/ai';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const EditUserRole = (props) => {
    const { lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [id, setID] = useState('');
    const [userSuccess, setUserSuccess] = useState('');
    const [error, setError] = useState('');
    const [userDesignation, setUserDesignation] = useState('');
    const [userData, setUserData] = useState('');
    const [userRoles, setUserRoles] = useState('');
    const [Role, setRole] = useState('');
    let Arr = [];
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [updatePassword, setUpdatePassword] = useState('');
    const [userDepartments, setUserDepartments] = useState('');

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        API();
    }, []);

    const API = () => {
        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        setID(tempID);
        console.log('Param id value');
        console.log(tempID);
        Axios.get('/api/eop_single_user_listing/' + tempID, {}).then((res) => {
            console.log('--Users res--');
            console.log(res);
            setUserData(res.data.find_data[0]);
            console.log('user data');
            console.log(res.data.find_data[0]);
            setRole(res.data.find_data[0].user_roles.role_id);
            let assign = res.data.find_data[0].user_roles.role_id;
            console.log('role data');
            console.log(res.data.find_data[0].user_roles.role_id);

            Axios.get(eopShowUserRoles(), {}).then((res) => {
                console.log(res);
                setUserRoles(res.data.user_data);
                let Arr = [];

                res.data.user_data.forEach((item) => {
                    console.log('find loop');
                    console.log(item);
                    console.log(item._id);
                    console.log(assign);
                    let check = assign.find((r) => {
                        return item._id == r._id;
                    });

                    console.log('check');
                    console.log(check);

                    Arr.push({
                        role_id: item._id,
                        role_name: item.role_name,
                        user_id: tempID,
                        item_enabled: check ? true : false,
                    });
                });
                console.log(Arr);

                setUserRoles(Arr);
            });
        });

        Axios.get(eopShowUserDesignation(), {}).then((res) => {
            console.log(res);
            setUserDesignation(res.data.user_data);
        });
        Axios.get('/api/eop_show_user_department', {}).then((res) => {
            console.log(res);
            setUserDepartments(res.data.user_data);
        });
    };
    const [data, setdata] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        email: '',
        password: '',
        confirm_password: '',
        designation: '',
        department: '',
    });
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
        let fn, ln, mn, em, de, dp;

        if (!data.first_name) {
            fn = userData.first_name;
        } else {
            fn = data.first_name;
        }
        if (!data.last_name) {
            ln = userData.last_name;
        } else {
            ln = data.last_name;
        }
        if (!data.mobile_number) {
            mn = userData.mobile_number;
        } else {
            mn = data.mobile_number;
        }
        if (!data.email) {
            em = userData.email;
        } else {
            em = data.email;
        }
        if (!data.designation) {
            de = userData.designation._id;
        } else {
            de = data.designation;
        }
        if (!data.department) {
            dp = userData.department._id;
        } else {
            dp = data.department;
        }
        let Role = JSON.stringify(userRoles);
        let finaldata = { fn, ln, mn, em, de, dp, Role };
        console.log(finaldata);
        if (data.password != data.confirm_password) {
            setError('Password & Confirm Password mismatch');
            toast.error('Password & Confirm Password mismatch');
        } else {
            Axios.get('/getCSRFToken').then((response) => {

                if (response.data.csrfToken) {
                    Axios.post(
                        eopUpdateUserRole(),
                        {
                            id: userData._id,
                            designation: de,
                            department: dp,
                            email: em,
                            first_name: fn,
                            last_name: ln,
                            mobile_number: mn,
                            password: data.password,
                            confirm_password: data.confirm_password,
                            role_data: Role
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
        console.log('--changeItemChecked--');
        console.log(index);
        console.log(val);
        let ary = userRoles;
        let _item = ary[index];
        _item.item_enabled = val;
        userRoles[index] = _item;
        console.log(userRoles);
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
                    } else {
                        toast.error(res.data.message);
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
                <div className="col-md-12">
                    <form className="row" onSubmit={user_data_submit}>
                        <div className="col-md-4 p-2">
                            <label htmlFor="first_name" className="form-label">
                                First Name
                            </label>
                            {userData && userData.first_name ? (
                                <input
                                    defaultValue={userData.first_name}
                                    type="text"
                                    title="Please enter the first name..."
                                    className="form-control"
                                    onChange={user_data}
                                    id="first_name"
                                    required
                                />
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="last_name" className="form-label">
                                Last Name
                            </label>
                            {userData && userData.last_name ? (
                                <input
                                    defaultValue={userData.last_name}
                                    type="text"
                                    title="Please enter the last name..."
                                    className="form-control"
                                    onChange={user_data}
                                    id="last_name"
                                    required
                                />
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="mobile_number" className="form-label">
                                Mobile Number
                            </label>
                            {userData && userData.mobile_number ? (
                                <input
                                    defaultValue={userData.mobile_number}
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
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            {userData && userData.email ? (
                                <input
                                    defaultValue={userData.email}
                                    type="email"
                                    title="Please enter the email address..."
                                    className="form-control"
                                    placeholder="example@domain.com"
                                    onChange={user_data}
                                    id="email"
                                    required
                                />
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-md-4 p-2">
                            <label htmlFor="department" className="form-label">
                                Department
                            </label>
                            <select className="form-control" id="department" onChange={user_data}>
                                <option value="">Open this to select</option>
                                {userDepartments &&
                                    userDepartments.map((item, index) => {
                                        let data = item.department_name;
                                        return data ? (
                                            <option key={item._id} value={item._id} selected={userData && userData.department ? userData.department._id == item._id : false}>
                                                {item.department_name}
                                            </option>
                                        ) : (
                                            ''
                                        );
                                    })}
                            </select>
                        </div>

                        <div className="col-md-4 p-2">
                            <label htmlFor="designation" className="form-label">
                                Designation
                            </label>
                            <select className="form-control" id="designation" onChange={user_data}>
                                <option value="">Open this to select</option>
                                {userDesignation &&
                                    userDesignation.map((item, index) => {
                                        let data = item.designation_name;
                                        return data ? (
                                            <option key={item._id} value={item._id} selected={userData && userData.designation ? userData.designation._id == item._id : false}>
                                                {item.designation_name}
                                            </option>
                                        ) : (
                                            ''
                                        );
                                    })}
                            </select>
                        </div>
                        {updatePassword === 1 ? (
                            <div className='row col-md-12 p-4 m-2 border'>
                                <div className="row col-md-8 p-2">
                                    <div className="col-md-6 p-2">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                            className="form-control"
                                            onChange={user_data}
                                            id="password"
                                        />
                                        <small className='form-text text-muted'>Enter new password</small>
                                    </div>
                                    <div className="col-md-6 p-2">
                                        <label htmlFor="confirm_password" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                            className="form-control"
                                            onChange={user_data}
                                            id="confirm_password"
                                        />
                                        <small className='form-text text-muted'>Re-enter new password</small>
                                    </div>
                                </div>
                                <div className="col-md-4 p-4 mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger mr-2"
                                        onClick={() => {
                                            setUpdatePassword('');
                                            setdata({ ...data, password: '' });
                                            setdata({ ...data, confirm_password: '' });
                                        }
                                        }
                                    >
                                        Cancel (Keep Current Password)
                                    </button>
                                </div>
                            </div>

                        )
                            :
                            (
                                <div className="col-md-12 p-2 my-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary mr-2"
                                        onClick={() => setUpdatePassword(1)}
                                    >
                                        Change Password
                                    </button>
                                </div>
                            )
                        }
                        <div className="col-md-12 p-4 m-2 border">
                            <div className="row">
                                {userRoles
                                    ? userRoles.map((item, index) => {
                                        return (
                                            <div key={index} className="col-md-3 p-3">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        value={item._id}
                                                        defaultChecked={item.item_enabled}
                                                        onClick={(e) =>
                                                            changeItemChecked(e.target.checked, index)
                                                        }
                                                    />
                                                    &nbsp;{item.role_name}
                                                </label>
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        </div>
                        <div className='col-md-12 mt-5'>
                            {/* <button
                            type="button"
                            className="btn btn-danger mr-2"
                            onClick={() => {
                                if (window.confirm('Are you sure you wish to delete this?')) {
                                    deleteRecord(id);
                                }
                            }}
                        >
                            <AiFillDelete size={20} /> Delete
                        </button> */}
                            <a href={'/' + lang.langKey + '/admin-user-listing'} className="btn btn-secondary float-left">
                                <AiFillLeftCircle size={20} />&nbsp;Go Back
                            </a>
                            <button type="submit" className="btn btn-primary float-right"><AiFillSave size={20} /> Save Changes</button>
                        </div>
                    </form>
                </div >
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div >
    );
};
