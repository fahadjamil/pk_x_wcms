import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { ADMIN_LOGIN_ID_COOKIE, ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { GrDocumentPdf } from 'react-icons/gr';
import moment from 'moment';
import Cookies from 'universal-cookie/es6';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const ApplicationWorkflow = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [commentData, setCommentData] = useState('');
    const [applicationData, setApplicationData] = useState([]);
    const [previousComment, setPreviousComment] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [applicationId, setApplicationId] = useState('');
    const [userRoles, setUserRoles] = useState('');
    const [UserData, setUserData] = useState('');
    const [UserDropdownData, setUserDropdownData] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [workflowData, setWorkflowData] = useState([]);
    const [nextStep, setNextStep] = useState('');
    let workflow_next_step;
    let nextStepId;
    let next_step;
    let Workflow_step;

    const loadPreviousComments = (appId) => {
        Axios.get('/api/eop_application_comments/' + appId, {}).then((res) => {
            let ary = [];
            if (res.data.comment_data) {
                res.data.comment_data.forEach((row) => {
                    ary.push(row);
                });
                setPreviousComment(ary);
            } else {
                setPreviousComment([]);
            }
        });
    };
    const loadRolePermissions = () => {
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
    };

    const onRoleSelection = (e) => {
        var arrUserData = [];
        setSelectedRole(e.target.value);
        if (e.target.value) {
            UserData &&
                UserData.map((item, index) => {
                    item.user_roles.role_id &&
                        item.user_roles.role_id.map((role, index) => {
                            if (role._id === e.target.value) {
                                arrUserData.push(item);
                            }
                        });
                });
            setUserDropdownData(arrUserData);
        }
    };

    useEffect(() => {
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;
        let appId = hashValue.substring(1);
        setApplicationId(appId);
        Axios.get('/api/submited_application/' + appId, {}).then((res) => {
            Workflow_step = res.data.find_data[0].workflow_step;
            let ary = [];
            if (res.data.find_data) {
                res.data.find_data.forEach((row) => {
                    ary.push(row);
                });
                setApplicationData(ary);
            } else {
                setApplicationData([]);
            }
            Axios.get(
                '/api/eop_approval_workflow/' + res.data.find_data[0].category[0]._id,
                {}
            ).then((res) => {
                setWorkflowData(res.data.approval_data);
                if (res.data.approval_data) {
                    console.log('workflow_step');
                    console.log(Workflow_step);
                    console.log(res.data.approval_data);
                    res.data.approval_data.map((item, index) => {
                        console.log('step_number');
                        console.log(item.step_number);
                        if (item._id === Workflow_step) {
                            workflow_next_step = item.step_number + 1;
                        }
                    });
                    console.log('Workflow_next_step');
                    console.log(workflow_next_step);
                    next_step = res.data.approval_data.find(
                        (x) => x.step_number === workflow_next_step
                    );
                    setNextStep(next_step);
                    console.log('next_step');
                    console.log(next_step);
                    if (next_step) {
                        nextStepId = next_step._id;
                    }
                    console.log('nextStepId');
                    console.log(nextStepId);
                }
            });
        });
        loadPreviousComments(appId);
        loadRolePermissions();
        Axios.get('/api/eop_show_role', {}).then((res) => {
            setUserRoles(res.data.user_data);
        });
        Axios.get('/api/eop_role_listing', {}).then((res) => {
            let ary = [];
            if (res.data.find_data) {
                res.data.find_data.forEach((row) => {
                    ary.push(row);
                });
                setUserData(ary);
            } else {
                setUserData([]);
            }
        });
    }, []); //useEffect
    const pick_function = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to pick this application?')) {
            console.log('comment Data');
            console.log(commentData);
            console.log(login_cookie);
            console.log(applicationId);
            Axios.get('/getCSRFToken').then((response) => {

                if (response.data.csrfToken) {
                    Axios.post(
                        '/api/eop_application_pick',
                        {
                            id: applicationId,
                            comments: 'self picked',
                            modified_by: login_cookie,
                            assigned_user: login_cookie,
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
        }
    };
    const reject_function = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to Reject this application?')) {
            console.log('comment Data');
            console.log(commentData);
            console.log(login_cookie);
            console.log(applicationId);
            if (commentData && login_cookie && applicationId) {
                Axios.get('/getCSRFToken').then((response) => {

                    if (response.data.csrfToken) {
                        Axios.post(
                            '/api/eop_application_reject',
                            {
                                id: applicationId,
                                comments: commentData,
                                modified_by: login_cookie,
                            },
                            {
                                headers: {
                                    'x-xsrf-token': response.data.csrfToken,
                                },
                            }
                        ).then((res) => {
                            console.log(res);
                            if (res.data.status == 'success') {

                                applicationData[0].status = 'rejected';
                                setApplicationData(applicationData);

                                toast.success(res.data.message);
                            } else {
                                toast.error(res.data.message);
                            }
                        });
                    }
                });
            } else {
                toast.error('Comments are mandatory, please enter your comments...');
            }
        }
    };

    const approve_function = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to Approve this application?')) {
            // console.log(commentData);
            // console.log(login_cookie);
            // console.log(applicationId);
            if (commentData && login_cookie && applicationId) {
                Axios.get('/getCSRFToken').then((response) => {

                    if (response.data.csrfToken) {
                        Axios.post(
                            '/api/eop_application_approved',
                            {
                                id: applicationId,
                                comments: commentData,
                                modified_by: login_cookie,
                            },
                            {
                                headers: {
                                    'x-xsrf-token': response.data.csrfToken,
                                },
                            }
                        ).then((res) => {
                            console.log(res);
                            if (res.data.status == 'success') {

                                applicationData[0].status = 'approved';
                                setApplicationData(applicationData);

                                toast.success(res.data.message);
                            } else {
                                toast.error(res.data.message);
                            }
                        });
                    }
                });
            } else {
                toast.error('Comments are mandatory, please enter your comments...');
            }
        }
    };

    const review_function = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to send this application back to user for review/additional information?')) {
            // console.log(commentData);
            // console.log(login_cookie);
            // console.log(applicationId);
            if (commentData && login_cookie && applicationId) {
                Axios.get('/getCSRFToken').then((response) => {

                    if (response.data.csrfToken) {
                        Axios.post(
                            '/api/eop_application_askinfo',
                            {
                                id: applicationId,
                                comments: commentData,
                                modified_by: login_cookie,
                            },
                            {
                                headers: {
                                    'x-xsrf-token': response.data.csrfToken,
                                },
                            }
                        ).then((res) => {
                            console.log(res);
                            if (res.data.status == 'success') {

                                applicationData[0].status = 'review';
                                setApplicationData(applicationData);

                                toast.success(res.data.message);
                            } else {
                                toast.error(res.data.message);
                            }
                        });
                    }
                });
            } else {
                toast.error('Comments are mandatory, please enter your comments...');
            }
        }
    };

    const assign_function = (e) => {
        e.preventDefault();
        // console.log('Selected Role');
        // console.log(selectedRole);
        // console.log('Selected User');
        // console.log(selectedUser);
        if (commentData && login_cookie && applicationId) {
            if (selectedRole && selectedUser) {
                Axios.get('/getCSRFToken').then((response) => {

                    if (response.data.csrfToken) {
                        Axios.post(
                            '/api/eop_application_review_update',
                            {
                                id: applicationId,
                                updatesObject: {
                                    assigned_role: selectedRole,
                                    assigned_user: selectedUser,
                                    status: 'open',
                                },
                                comments: commentData,
                                action: 'assign role + user',
                                modified_by: login_cookie,
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
            } else {
                Axios.get('/getCSRFToken').then((response) => {

                    if (response.data.csrfToken) {
                        Axios.post(
                            '/api/eop_application_review_update',
                            {
                                id: applicationId,
                                updatesObject: {
                                    assigned_role: selectedRole,
                                    status: 'open',
                                },
                                comments: commentData,
                                action: 'assign role',
                                modified_by: login_cookie,
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
            }
        } else {
            toast.error('Comments are mandatory, please enter your comments...');
        }
    };

    const process_function = (e) => {
        e.preventDefault();

        if (commentData && login_cookie && applicationId) {
            Axios.get('/getCSRFToken').then((response) => {

                if (response.data.csrfToken) {
                    Axios.post(
                        '/api/eop_application_review_update',
                        {
                            id: applicationId,
                            updatesObject: {
                                workflow_step: nextStep._id,
                                assigned_role: nextStep.role,
                                assigned_user: '',
                            },
                            comments: commentData,
                            action: 'process application',
                            modified_by: login_cookie,
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
        } else {
            toast.error('Comments are mandatory, please enter your comments...');
        }
    };

    const comments_function = (e) => {
        e.preventDefault();
        if (commentData && login_cookie && applicationId) {
            Axios.get('/getCSRFToken').then((response) => {

                if (response.data.csrfToken) {
                    Axios.post(
                        '/api/eop_application_review_update',
                        {
                            id: applicationId,
                            updatesObject: {},
                            action: 'comments added',
                            comments: commentData,
                            modified_by: login_cookie,
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
                            //refresh previous comments list
                            loadPreviousComments(applicationId);
                        } else {
                            toast.error(res.data.message);
                        }
                    });
                }
            });
        } else {
            toast.error('Comments are mandatory, please enter your comments...');
        }
    };

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            duration: 5000,
                        }}
                    />
                    {applicationData && applicationData.length > 0 && applicationData[0] ? (
                        <div>
                            {/* Modal Dialog */}
                            <div
                                className="modal fade"
                                id="assignModal"
                                tabindex="-1"
                                aria-labelledby="assignModalTitle"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="assignModalTitle">
                                                Select Role/User for assignment
                                            </h5>
                                            <button
                                                type="button"
                                                className="close"
                                                data-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row col-md-12">
                                                <label>Select Role</label>
                                                <select
                                                    className="form-control"
                                                    id="Role"
                                                    onChange={(e) => onRoleSelection(e)}
                                                    required
                                                >
                                                    <option value="">Select Role</option>
                                                    {userRoles &&
                                                        userRoles.map((item, index) => {
                                                            return (
                                                                <option
                                                                    key={item._id}
                                                                    value={item._id}
                                                                >
                                                                    {item.role_name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                            <div className="row col-md-12 mt-4">
                                                <label>Select User (optional)</label>
                                                <select
                                                    className="form-control"
                                                    id="User"
                                                    onChange={(e) =>
                                                        setSelectedUser(e.target.value)
                                                    }
                                                    required
                                                >
                                                    <option value="">Select User</option>
                                                    {UserDropdownData &&
                                                        UserDropdownData.map((role, index) => {
                                                            return (
                                                                <option
                                                                    key={role._id}
                                                                    value={role._id}
                                                                >
                                                                    {role.first_name}

                                                                    {role.last_name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                            <div className="row col-md-12 mt-4">
                                                <label>Comments</label>
                                                <textarea
                                                    rows="5"
                                                    type="text"
                                                    title="Your comments..."
                                                    className="form-control"
                                                    id="comment"
                                                    onChange={(e) => setCommentData(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-dismiss="modal"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={assign_function}
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form>
                                <div className="row col-md-12">
                                    <div className="col-md-6 my-3 text-left">
                                        <h4>{applicationData[0].category[0].category_name}</h4>
                                    </div>
                                    <div className="col-md-6 my-3 text-right">
                                        <strong>Submission Time:</strong>&nbsp;&nbsp;
                                        {moment(applicationData[0].submit_time).format(
                                            'DD-MM-YYYY hh:mm A'
                                        )}
                                    </div>
                                    <div className="col-md-6 my-3">
                                        <strong>Applicant Name:</strong>
                                        {applicationData[0].submit_user[0]
                                            ? applicationData[0].submit_user[0].first_name +
                                            ' ' +
                                            applicationData[0].submit_user[0].last_name
                                            : ''}
                                    </div>
                                    <div className="col-md-12">
                                        <h5>Application Details</h5>

                                        {applicationData[0].documents &&
                                            applicationData[0].documents.map((data, index) => {
                                                let submitdata = data.item_type;
                                                let document = applicationData[0].items.find(
                                                    (x) => x.item_id === data._id
                                                );
                                                return submitdata == 'text' ? (
                                                    <div className="col-md-6 my-3">
                                                        <strong>{data.item_name}</strong>:
                                                        {document
                                                            ? document.data.en
                                                                ? document.data.en
                                                                : document.data
                                                                    ? document.data
                                                                    : ''
                                                            : ''}
                                                    </div>
                                                ) : (
                                                    ''
                                                );
                                            })}
                                    </div>
                                    <div className="col-md-12">
                                        <h5>Attached Documents</h5>

                                        {applicationData[0].documents &&
                                            applicationData[0].documents.map((data, index) => {
                                                let submitdata = data.item_type;
                                                let document = applicationData[0].items.find(
                                                    (x) => x.item_id === data._id
                                                );
                                                return submitdata == 'file' ? (
                                                    <div className="col-md-4 mb-3">
                                                        <strong className="mb-2">
                                                            {data.item_name}
                                                        </strong>{' '}
                                                        :&nbsp;
                                                        <br />
                                                        <a
                                                            href={`/api/eop_application_document/${document
                                                                ? document.data.file_name
                                                                : ''
                                                                }`}
                                                            target="_blank"
                                                        >
                                                            {document.data.file_name
                                                                .split('.')
                                                                .pop() == 'pdf' ? (
                                                                <GrDocumentPdf size={100} />
                                                            ) : (
                                                                <img
                                                                    src={`/api/eop_application_document/${document
                                                                        ? document.data
                                                                            .file_name
                                                                        : ''
                                                                        }`}
                                                                    alt="Image"
                                                                    height="100"
                                                                />
                                                            )}
                                                        </a>
                                                    </div>
                                                ) : (
                                                    ''
                                                );
                                            })}
                                    </div>
                                    <div className="col-md-12">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <h5 className="card-header">
                                                    Application Review History
                                                </h5>
                                                <div className="card-body">
                                                    {previousComment &&
                                                        previousComment.map((data, index) => {
                                                            return (
                                                                <div className="card d-flex mb-3">
                                                                    <div
                                                                        className="card-body"
                                                                        key={data._id}
                                                                    >
                                                                        {data.comments}
                                                                    </div>
                                                                    <div className="card-footer text-muted small">
                                                                        <div className="float-left">
                                                                            {data.modified_by &&
                                                                                data.modified_by[0]
                                                                                ? data
                                                                                    .modified_by[0]
                                                                                    .first_name +
                                                                                ' ' +
                                                                                data
                                                                                    .modified_by[0]
                                                                                    .last_name
                                                                                : ''}
                                                                        </div>
                                                                        <div className="float-right">
                                                                            {moment(
                                                                                data.update_time
                                                                            ).format(
                                                                                'DD-MM-YYYY HH:mm A'
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12 mt-5">
                                            <div className="card">
                                                <div className="card-header">
                                                    {applicationData[0].assigned_user[0] ? (
                                                        // Reassign
                                                        <div>
                                                            <div className="mt-3 float-left">
                                                                <strong>Assigned To: </strong>
                                                                &nbsp;
                                                                {applicationData[0].assigned_user[0]
                                                                    .first_name +
                                                                    ' ' +
                                                                    applicationData[0]
                                                                        .assigned_user[0].last_name}
                                                            </div>
                                                            {applicationData[0].status === 'open' &&
                                                                rolePermissions.find(
                                                                    (x) =>
                                                                        x.role_permissions
                                                                            .resource_id ===
                                                                        '6253f32ac8f16c48985d543c'
                                                                ) ? (
                                                                <div className="float-right">
                                                                    <button
                                                                        className="btn btn-primary m-2"
                                                                        data-toggle="modal"
                                                                        data-target="#assignModal"
                                                                    >
                                                                        Reassign
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                    ) : (
                                                        // Unassigned
                                                        <div>
                                                            <div className="float-left">
                                                                <strong>Unassigned</strong>
                                                            </div>
                                                            {rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions
                                                                        .resource_id ===
                                                                    '6253f150c8f16c48985d50b7'
                                                            ) ? (
                                                                <div className="float-right">
                                                                    <button
                                                                        className="btn btn-primary m-2"
                                                                        data-toggle="modal"
                                                                        data-target="#assignModal"
                                                                    >
                                                                        Assign
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {rolePermissions.find(
                                            (x) =>
                                                x.role_permissions.resource_id ===
                                                '62541d77c8f16c48985d99d0'
                                        ) ? (
                                            <div>
                                                <div className="col-md-12 mt-5">
                                                    <label htmlFor="comment" className="form-label">
                                                        Add Your Comments
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <textarea
                                                        rows="5"
                                                        type="text"
                                                        title="Your comments..."
                                                        className="form-control"
                                                        id="comment"
                                                        onChange={(e) =>
                                                            setCommentData(e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-12 mt-0">
                                                    <button
                                                        className="btn btn-info mt-3"
                                                        type="button"
                                                        onClick={(e) => comments_function(e)}
                                                    >
                                                        Add Comments
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div className="col-md-12 p-2 mt-5">
                                            {/* Already Approved */}
                                            {applicationData[0].status === 'approved' ? (
                                                <div className="alert alert-success" role="alert">
                                                    <h4 className="alert-heading">
                                                        Application Approved
                                                    </h4>
                                                    <hr />
                                                    <p className="mb-0 text-right">
                                                        {applicationData[0].assigned_user[0]
                                                            ? applicationData[0].assigned_user[0]
                                                                .first_name +
                                                            ' ' +
                                                            applicationData[0].assigned_user[0]
                                                                .last_name
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-right mt-3"></div>
                                                    <hr />
                                                    <div className="text-left mt-3">
                                                        {/* New - Pick*/}
                                                        {applicationData[0].status === 'new' &&
                                                            rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions.resource_id ===
                                                                    '6253d225c8f16c48985d1748'
                                                            ) ? (
                                                            <button
                                                                className="btn btn-lg btn-success m-2 float-left"
                                                                type="button"
                                                                onClick={(e) => pick_function(e)}
                                                            >
                                                                Pick
                                                            </button>
                                                        )
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }

                                                        {/* New - Assign */}
                                                        {applicationData[0].status === 'new' &&
                                                            rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions.resource_id ===
                                                                    '6253f150c8f16c48985d50b7'
                                                            ) ? (
                                                            <button
                                                                className="btn btn-lg btn-primary m-2 float-left"
                                                                type="button"
                                                                data-toggle="modal"
                                                                data-target="#assignModal"
                                                            >
                                                                Assign
                                                            </button>
                                                        )
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }

                                                        {/*  Reassign */}
                                                        {applicationData[0].status === 'open' &&
                                                            rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions.resource_id ===
                                                                    '6253f32ac8f16c48985d543c'
                                                            ) ? (
                                                            <button
                                                                className="btn btn-lg btn-primary m-2 float-left"
                                                                type="button"
                                                                data-toggle="modal"
                                                                data-target="#assignModal"
                                                            >
                                                                Reassign
                                                            </button>
                                                        )
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }

                                                        {/* Reject */}
                                                        {(applicationData[0].status === 'new' || applicationData[0].status === 'open') && applicationData[0].assigned_user[0] && applicationData[0].assigned_user[0]._id === login_cookie && rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions.resource_id ===
                                                                    '6253f35cc8f16c48985d54a3'
                                                            ) ? (
                                                            <button
                                                                type="button"
                                                                className="btn btn-lg btn-danger m-2 float-right"
                                                                onClick={(e) => reject_function(e)}
                                                            >
                                                                Reject Application
                                                            </button>
                                                        )
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }

                                                        {/* Save & Proceed */}
                                                        {applicationData[0].status === 'open' && applicationData[0].assigned_user[0] && applicationData[0].assigned_user[0]._id === login_cookie && nextStep && rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions.resource_id ===
                                                                    '6256b873c8f16c489863b014'
                                                            ) ? (
                                                            <button
                                                                type="button"
                                                                className="btn btn-lg btn-primary m-2 float-right"
                                                                onClick={process_function}
                                                            >
                                                                Process Application (Next Step: {nextStep.step_name})
                                                            </button>
                                                        )
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }


                                                        {/* Approve */}
                                                        {applicationData[0].status === 'open' && applicationData[0].assigned_user[0] && applicationData[0].assigned_user[0]._id === login_cookie && !nextStep && rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions
                                                                        .resource_id ===
                                                                    '6253f384c8f16c48985d54f2'
                                                            ) ? (
                                                            <button
                                                                className="btn btn-lg btn-success m-2 float-right"
                                                                onClick={(e) =>
                                                                    approve_function(e)
                                                                }
                                                            >
                                                                Approve Application
                                                            </button>
                                                        )
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }

                                                        {/* Review */}
                                                        {applicationData[0].status === 'open' && applicationData[0].assigned_user[0] && applicationData[0].assigned_user[0]._id === login_cookie && rolePermissions.find(
                                                                (x) =>
                                                                    x.role_permissions
                                                                        .resource_id ===
                                                                    '62fdea3938720939db0f18a8'
                                                            ) ? (
                                                            <button
                                                                className="btn btn-lg btn-warning m-2 float-right"
                                                                onClick={(e) =>
                                                                    review_function(e)
                                                                }
                                                            >
                                                                Ask to Review
                                                            </button>
                                                        )
                                                            :
                                                            (
                                                                ''
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
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
