import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopUpdateCategory } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { ADMIN_FUNCTION_LOGOUT } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { BsStack } from 'react-icons/bs';
import { BsBarChartSteps } from 'react-icons/bs';
import { AiFillEdit, AiFillDelete, AiFillSave } from 'react-icons/ai';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const EditCategory = (props) => {
    const { lang } = props;
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [previousData, setPreviousData] = useState('');
    const [id, setID] = useState('');
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [categorysuccess, setCategorySuccess] = useState('');
    const [error, setError] = useState('');
    const [appWorkflow, setAppWorkflow] = useState('');
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [userDepartments, setUserDepartments] = useState('');
    let [data, setdata] = useState({
        category_name: '',
        category_fee: '',
        department: '',
        category_description: '',
        prerequisites: '',
        terms: '',
        is_enabled: '',
    });

    const deleteRecord = (value) => {
        console.log('deleted value id');
        console.log(value);
        const deleteID = value;
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    eopUpdateCategory(),
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
                        toast.success(convertByLang(res.data.message_ar, res.data.message));
                        setCategorySuccess(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        toast.error(convertByLang(res.data.message_ar, res.data.message));
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    }
                });
            }
        });
    };

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;

        let tempID = hashValue.substring(1);
        setID(tempID);
        console.log('Param id value');
        console.log(tempID);
        Axios.get('/api/eop_show_categories/' + tempID, {}).then((res) => {
            console.log(res);
            setPreviousData(res.data.find_data[0]);
        });
        Axios.get('/api/eop_show_category/' + tempID, {}).then((res) => {
            console.log('--Users res--');
            console.log(res);
            setAppWorkflow(res.data.find_data);
        });
        Axios.get('/api/eop_show_user_department', {}).then((res) => {
            console.log(res);
            setUserDepartments(res.data.user_data);
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

    const categories = (e) => {
        console.log(e);

        if (e.target.id === 'category_name') {
            setdata({ ...data, category_name: e.target.value });
        }
        if (e.target.id === 'category_fee') {
            setdata({ ...data, category_fee: e.target.value });
        }
        if (e.target.id === 'department') {
            setdata({ ...data, department: e.target.value });
        }
        if (e.target.id === 'category_description') {
            setdata({ ...data, category_description: e.target.value });
        }
        if (e.target.id === 'terms') {
            setdata({ ...data, terms: e.target.value });
        }
        if (e.target.id === 'prerequisites') {
            setdata({ ...data, prerequisites: e.target.value });
        }
        if (e.target.id === 'is_enabled') {
            setdata({ ...data, is_enabled: e.target.checked ? 'Y' : 'N' });
        }
    };

    const CategoriesUpdate = (e) => {
        e.preventDefault();
        console.log(data);
        let en, na, ds, tr, pre, fee, dep;
        if (!data.is_enabled) {
            en = previousData.is_enabled;
        } else {
            en = data.is_enabled;
        }
        if (!data.category_fee) {
            fee = previousData.category_fee;
        } else {
            fee = data.category_fee;
        }
        if (!data.department) {
            dep = previousData.department._id;
        } else {
            dep = data.department;
        }
        if (!data.category_name) {
            na = previousData.category_name;
        } else {
            na = data.category_name;
        }
        if (!data.category_description) {
            ds = previousData.category_description;
        } else {
            ds = data.category_description;
        }
        if (!data.terms) {
            tr = previousData.terms;
        } else {
            tr = data.terms;
        }
        if (!data.prerequisites) {
            pre = previousData.prerequisites;
        } else {
            pre = data.prerequisites;
        }
        console.log('axios data');
        console.log(na, ds, en, tr, pre, fee, dep);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    eopUpdateCategory(),
                    {
                        id: id,
                        category_name: na,
                        category_description: ds,
                        terms: tr,
                        prerequisites: pre,
                        is_enabled: en,
                        category_fee: fee,
                        department: dep,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log('--res--');
                    console.log(res);
                    console.log('--lang.langKey--');
                    console.log(lang.langKey);
                    if (res.data.status == 'success') {
                        toast.success(convertByLang(res.data.message_ar, res.data.message));
                        setCategorySuccess(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        toast.error(convertByLang(res.data.message_ar, res.data.message));
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
                <div className="row">
                    <div className="col-md-8">
                            {previousData ? (
                                <div className="row mt-4">
                                    <div className="col-md-6 col-sm-12">
                                        <label htmlFor="category_name" className="form-label">
                                            Category Name
                                        </label>
                                        <input
                                            defaultValue={previousData.category_name}
                                            type="text"
                                            className="form-control"
                                            onChange={categories}
                                            id="category_name"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <label htmlFor="category_fee" className="form-label">
                                            Category Fee
                                        </label>
                                        <input
                                            defaultValue={previousData.category_fee}
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            onChange={categories}
                                            id="category_fee"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="department" className="form-label">
                                            Department
                                        </label>
                                        <select
                                            className="form-control"
                                            id="department"
                                            onChange={categories}
                                            required
                                        >
                                            <option value="">Open this to select</option>
                                            {userDepartments &&
                                                userDepartments.map((item, index) => {
                                                    let data = item.department_name;
                                                    return data ? (
                                                        <option key={item._id} value={item._id} selected={previousData && previousData.department ? previousData.department._id == item._id : false}>
                                                            {item.department_name}
                                                        </option>
                                                    ) : (
                                                        ''
                                                    );
                                                })}
                                        </select>
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <label
                                            htmlFor="category_description"
                                            className="form-label"
                                        >
                                            Category Description
                                        </label>
                                        <textarea
                                            rows="5"
                                            cols="60"
                                            defaultValue={previousData.category_description}
                                            type="text"
                                            className="form-control"
                                            onChange={categories}
                                            id="category_description"
                                        />
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <label htmlFor="prerequisites" className="form-label">
                                            Prerequisites
                                        </label>
                                        <textarea
                                            rows="5"
                                            cols="60"
                                            defaultValue={previousData.prerequisites}
                                            type="text"
                                            className="form-control"
                                            onChange={categories}
                                            id="prerequisites"
                                        />
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <label htmlFor="terms" className="form-label">
                                            Terms &amp; Conditions
                                        </label>
                                        <textarea
                                            rows="5"
                                            cols="60"
                                            defaultValue={previousData.terms}
                                            type="text"
                                            className="form-control"
                                            onChange={categories}
                                            id="terms"
                                        />
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <input
                                            type="checkbox"
                                            id="is_enabled"
                                            checked={previousData.is_enabled == 'Y' ? true : false}
                                            onChange={categories}
                                        />
                                        &nbsp;<label htmlFor="is_enabled">Enabled</label>
                                        <small className="form-text text-muted">
                                            Only enabled categories are visible on front-end portal, uncheck to disable &amp; hide a category from applicants.
                                        </small>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                    </div>
                    <div className="col-md-12 mt-5">
                        {rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '62499059c8f16c48984a297c'
                        ) ? (
                            <button
                                type="button"
                                className="btn btn-danger mr-3"
                                onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this?')) {
                                        deleteRecord(previousData._id);
                                    }
                                }}
                            >
                                <AiFillDelete size={25} />&nbsp;Delete
                            </button>
                        ) : ''}
                        {rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '62498ff9c8f16c48984a28ac'
                        ) ? (

                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={CategoriesUpdate}
                            >
                                <AiFillSave size={25} />&nbsp;Save Changes
                            </button>
                        ) : ''}
                        {rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '624991fbc8f16c48984a2ceb'
                        ) ? (
                            <a
                                className="btn btn-success mr-2 float-right"
                                href={
                                    appWorkflow
                                        ? '/' +
                                        lang.langKey +
                                        '/workflow-step-listing#' +
                                        previousData._id
                                        : '/' +
                                        lang.langKey +
                                        '/add-workflow-step#' +
                                        previousData._id
                                }
                            >
                                <BsStack size={25} /> Application Workflow
                            </a>
                        ) : (
                            ''
                        )}
                        {rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '6249909ec8f16c48984a2a10'
                        ) ? (
                            <a
                                className="btn btn-primary mr-2 float-right"
                                href={'/' + lang.langKey + '/approval_workflow#' + previousData._id}
                            >
                                <BsBarChartSteps size={25} /> Approval Workflow
                            </a>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
