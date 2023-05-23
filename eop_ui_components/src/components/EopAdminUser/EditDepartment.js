import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopShowUserDepartment, eopUpdateDepartment } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillDelete, AiFillSave } from 'react-icons/ai';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const EditDepartment = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [previousData, setPreviousData] = useState('');
    const [id, setID] = useState('');
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    let [data, setdata] = useState({
        department_name: '',
        department_desc: '',
    });

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;

        let tempID = hashValue.substring(1);
        setID(tempID);
        console.log('Param id value');
        console.log(tempID);
        Axios.get('/api/eop_show_departments/' + tempID, {}).then((res) => {
            console.log(res);
            setPreviousData(res.data.find_data);
        });
    }, []);
    const departments = (e) => {
        console.log(e);

        if (e.target.id === 'department_name') {
            setdata({ ...data, department_name: e.target.value });
        }
        if (e.target.id === 'department_desc') {
            setdata({ ...data, department_desc: e.target.value });
        }
    };
    const DepartmentsUpdate = (e) => {
        e.preventDefault();
        console.log(data);
        let na, ds;
        if (!data.department_name) {
            na = previousData.department_name;
        } else {
            na = data.department_name;
        }
        if (!data.department_desc) {
            ds = previousData.department_desc;
        } else {
            ds = data.department_desc;
        }
        Axios.get('/getCSRFToken').then((response) => {

            if (response.data.csrfToken) {
                Axios.post(
                    eopUpdateDepartment(),
                    {
                        id: id,
                        department_name: na,
                        department_desc: ds,
                        is_deleted: previousData.is_deleted,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        setSuccess(convertByLang(res.data.message_ar, res.data.message));
                        toast.success(res.data.message);
                    } else {
                        setError(convertByLang(res.data.message_ar, res.data.message));
                        toast.error(res.data.message);
                    }
                });
            }
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

    return (
        <div className="row " style={{ display: loading ? 'none' : 'block' }}>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />
            {authorize ? (
                <div className="col-md-8 col-10 col-md-offset-3 mb-2">
                    {previousData ? (
                        <div>
                            <div className="form-group mt-4">
                                <label>Department Name</label>
                                <input
                                    defaultValue={previousData.department_name}
                                    type="text"
                                    className="form-control"
                                    onChange={departments}
                                    id="department_name"
                                />
                            </div>
                            <div className="form-group mt-4">
                                <label>Description</label>
                                <textarea
                                    rows="5"
                                    cols="60"
                                    defaultValue={previousData.department_desc}
                                    type="text"
                                    className="form-control"
                                    onChange={departments}
                                    id="department_desc"
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger mt-4 mr-2"
                                onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this?')) {
                                        deleteRecord(id);
                                    }
                                }}
                            >
                                <AiFillDelete size={25} />&nbsp;Delete
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary mt-4 float-right"
                                onClick={DepartmentsUpdate}
                            >
                                <AiFillSave size={25} />&nbsp;Save Changes
                            </button>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
