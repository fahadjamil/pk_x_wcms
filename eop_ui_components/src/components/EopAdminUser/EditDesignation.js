import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillDelete, AiFillSave } from 'react-icons/ai';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const EditDesignation = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [previousData, setPreviousData] = useState('');
    const [id, setID] = useState('');
    let [data, setdata] = useState({
        designation_name: '',
        designation_desc: '',
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
        Axios.get('/api/eop_show_single_designation/' + tempID, {}).then((res) => {
            console.log(res);
            setPreviousData(res.data.find_data);
        });
    }, []);
    const designations = (e) => {
        console.log(e);

        if (e.target.id === 'designation_name') {
            setdata({ ...data, designation_name: e.target.value });
        }
        if (e.target.id === 'designation_desc') {
            setdata({ ...data, designation_desc: e.target.value });
        }
    };
    const DesignationsUpdate = (e) => {
        e.preventDefault();
        console.log(data);
        let na, ds;
        if (!data.designation_name) {
            na = previousData.designation_name;
        } else {
            na = data.designation_name;
        }
        if (!data.designation_desc) {
            ds = previousData.designation_desc;
        } else {
            ds = data.designation_desc;
        }
        Axios.get('/getCSRFToken').then((response) => {

            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_update_designation',
                    {
                        id: id,
                        designation_name: na,
                        designation_desc: ds,
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
                        toast.success(res.data.message);
                    } else {
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
                                <label>Designation Name</label>
                                <input
                                    defaultValue={previousData.designation_name}
                                    type="text"
                                    className="form-control"
                                    onChange={designations}
                                    id="designation_name"
                                />
                            </div>
                            <div className="form-group mt-4">
                                <label>Description</label>
                                <textarea
                                    rows="5"
                                    cols="60"
                                    defaultValue={previousData.designation_desc}
                                    type="text"
                                    className="form-control"
                                    onChange={designations}
                                    id="designation_desc"
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
                                onClick={DesignationsUpdate}
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
