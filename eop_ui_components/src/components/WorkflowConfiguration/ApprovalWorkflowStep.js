import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { eopShowUserRoles } from '../../config/path';
import { eopApprovalWorkflow } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { MdDelete } from 'react-icons/md';
import { GrFormAdd } from 'react-icons/gr';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

let row_index = 0;

export const ApprovalWorkflowStep = (props) => {
    const { lang } = props;
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [step_value, setStepValue] = useState([
        {
            step_number: '',
            step_name: '',
            step_desc: '',
            role: '',
            category: '',
        },
    ]);
    const [category_data, setcategory] = useState('');
    const [roledata, setRoleData] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setAuthorized(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);

        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        setcategory(tempID);
        Axios.get(eopShowUserRoles(), {}).then((res) => {
            // console.log('--res--');
            // console.log(res);
            setRoleData(res.data.user_data);
        });
        Axios.get('/api/eop_approval_workflow/' + tempID, {}).then((res) => {
            console.log('--eop_approval_workflow--');
            console.log(res.data.approval_data);
            if (res.data.approval_data.length > 0) {
                setStepValue(res.data.approval_data);
            }
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

    const AddStep = () => {
        debugger;
        // console.log('add row');

        // console.log('step_value--before');
        // console.log(step_value);

        setStepValue([
            ...step_value,
            {
                step_number: '',
                step_name: '',
                step_desc: '',
                role: '',
                category: '',
            },
        ]);

        // console.log('step_value--after');
        // console.log(step_value);
    };
    const DeleteStep = (index) => {
        // console.log(index);
        setStepValue([...step_value.slice(0, index), ...step_value.slice(index + 1)]);
    };
    const StepData = (value, index, propName) => {
        let stepAry = step_value;
        let stepData = stepAry[index];
        if (!stepData) {
            stepData = {
                step_number: '',
                step_name: '',
                step_desc: '',
                role: '',
                category: '',
            };
        }

        if (propName === 'step_number') {
            stepData.step_number = value;
        }

        if (propName === 'step_name') {
            stepData.step_name = value;
        }

        if (propName === 'step_desc') {
            stepData.step_desc = value;
        }
        if (propName === 'step_role') {
            stepData.role = value;
        }
        stepData.category = category_data;

        stepAry[index] = stepData;
        setStepValue(stepAry);
    };
    const submitData = (e) => {
        e.preventDefault();
        // console.log('Input data');
        // console.log(step_value);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    eopApprovalWorkflow(),
                    {
                        step_data: JSON.stringify(step_value),
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    // console.log(res);
                    if (res.data.status == 'success') {
                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                    }
                });
            }
        });
    };

    // console.log('Previous Data');
    // console.log(step_value);

    return (
        <div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                {authorized ? (
                    <form onSubmit={submitData}>
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            toastOptions={{
                                duration: 5000,
                            }}
                        />
                        <div className="col-md-12 mt-3 pl-0">
                            <h5>{step_value[0].category.category_name}</h5>
                            <div className="col-md-12 p-3 border">
                                {step_value
                                    ? step_value.map((item, index) => {
                                        return (
                                            <div className="row align-items-end my-2" key={index}>
                                                <div className="col-md-1">
                                                    <label
                                                        htmlFor="step_number"
                                                        className="form-label"
                                                    >
                                                        Step No
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        defaultValue={
                                                            item.step_number
                                                                ? item.step_number
                                                                : index + 1
                                                        }
                                                        readOnly
                                                        className="form-control"
                                                        id="step_number"
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="step_name" className="form-label">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue={
                                                            item.step_name ? item.step_name : ''
                                                        }
                                                        onChange={(e) => {
                                                            StepData(
                                                                e.target.value,
                                                                index,
                                                                'step_name'
                                                            );
                                                        }}
                                                        id="step_name"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3 ">
                                                    <label htmlFor="step_desc" className="form-label">
                                                        Description
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue={
                                                            item.step_desc ? item.step_desc : ''
                                                        }
                                                        onChange={(e) => {
                                                            StepData(
                                                                e.target.value,
                                                                index,
                                                                'step_desc'
                                                            );
                                                        }}
                                                        id="step_desc"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3 ">
                                                    <label htmlFor="step_role" className="form-label">
                                                        Assigned Role
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        id="step_role"
                                                        defaultValue={
                                                            item.role[0] ? item.role[0]._id : ''
                                                        }
                                                        onChange={(e) => {
                                                            StepData(
                                                                e.target.value,
                                                                index,
                                                                'step_role'
                                                            );
                                                        }}
                                                        required
                                                    >
                                                        <option value="">Open this to select</option>
                                                        {roledata &&
                                                            roledata.map((role, index) => {
                                                                let data = role._id || role.role_name;
                                                                // console.log('--Role comparison--');
                                                                // console.log(item.role);
                                                                // console.log(role._id);
                                                                return data ? (
                                                                    <option
                                                                        key={role._id}
                                                                        value={role._id}
                                                                        selected={
                                                                            role._id == item.role
                                                                        }
                                                                    >
                                                                        {role.role_name}
                                                                    </option>
                                                                ) : (
                                                                    ''
                                                                );
                                                            })}
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    {rolePermissions.find(
                                                        (x) =>
                                                            x.role_permissions.resource_id ===
                                                            '625bc3bdc8f16c489871a6b9'
                                                    ) ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={(e) => DeleteStep(index)}
                                                        >
                                                            <MdDelete size={20} />
                                                        </button>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                    : ''}
                                <div className="col-md-4 mt-4 p-0">
                                    {rolePermissions.find(
                                        (x) =>
                                            x.role_permissions.resource_id ===
                                            '625bc39dc8f16c489871a64f'
                                    ) ? (
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={(e) => AddStep()}
                                        >
                                            <GrFormAdd size={25} /> Add New Step
                                        </button>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                        {rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '625bc3efc8f16c489871a764'
                        ) ? (
                            <input
                                type="submit"
                                className="btn btn-lg btn-success mt-4 float-right"
                                value="Save Workflow"
                            />
                        ) : (
                            ''
                        )}
                    </form>
                ) : (
                    <div>
                        <AdminAuthorizationText langKey={lang.langKey} />
                    </div>
                )}
            </div>
            <div style={{ display: loading ? 'flex' : 'none' }} className="justify-content-center">
                <div
                    className="spinner-border"
                    style={{ width: '3rem', height: '3rem' }}
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
};
