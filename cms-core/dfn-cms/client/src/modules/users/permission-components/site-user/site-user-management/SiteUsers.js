import React, { useState } from 'react';
import SearchUser from './SearchUser';
import SearchUserDate from './SearchUserDate';
import UserDetail from './UserDetail';
import Axios from 'axios';
import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../../../../shared/utils/AuthorizationUtils';
import { getFormattedDateTimeString } from '../../../../shared/utils/DateTimeUtil';
import { DatePickerComponent } from '../../../../shared/ui-components/input-fields/date-picker-component';
import MultiSelect from 'react-multi-select-component';

const loginStatus = [
    { label: 'active', value: 1 },
    { label: 'suspended', value: 2 },
    { label: 'pending', value: 3 },
    { label: 'expired', value: 4 },
];

function SiteUser(props) {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [selectedLoginStatus, setSelectedLoginStatus] = useState([]);
    const [isLoginNameActive, setIsLoginNameActive] = useState(false);
    const [isRegisterdDateActive, setIsRegisterdDateActive] = useState(false);
    const [isFirstNameActive, setIsFirstNameActive] = useState(false);
    const [isStatusActive, setIsStatusActive] = useState(false);
    const [responseData, setResponseData] = useState(undefined);

    const getUsers = () => {
        const headerParameter = { email: email.trim() };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/websites/user-management/userDetailsByEmail', httpHeaders)
            .then((result) => {
                const { code } = result.data;

                setUsers(result.data.data);

                if (code && code === -2) {
                    const resStatus = {
                        status: 'empty',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getUsersByDate = () => {
        const headerParameter = {
            fromDate: getFormattedSelectedDate(fromDate),
            toDate: getFormattedSelectedDate(toDate),
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/websites/user-management/userDetailsByRegDate', httpHeaders)
            .then((result) => {
                const { code } = result.data;

                setUsers(result.data.data);

                if (code && code === -2) {
                    const resStatus = {
                        status: 'empty',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getUsresByFirstName = () => {
        const headerParameter = { name: firstName.trim() };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/websites/user-management/userDetailsByName', httpHeaders)
            .then((result) => {
                const { code } = result.data;

                setUsers(result.data.data);

                if (code && code === -2) {
                    const resStatus = {
                        status: 'empty',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getUsresByStatus = () => {
        const selectedStatus = selectedLoginStatus.map((option) => option.value);
        const headerParameter = { status: selectedStatus };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/websites/user-management/userDetailsByStatus', httpHeaders)
            .then((result) => {
                const { code } = result.data;

                setUsers(result.data.data);

                if (code && code === -2) {
                    const resStatus = {
                        status: 'empty',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const activateUser = (index, email) => {
        const headerParameter = { email: email || '' };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/websites/user-management/activateUser', httpHeaders)
            .then((result) => {
                const { code } = result.data;

                if (code && code === 1) {
                    const resStatus = {
                        status: 'success',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);

                    if (users) {
                        users[index].S02_TYPE_BIT = 1;
                    }
                }

                if (code && code === -2) {
                    const resStatus = {
                        status: 'notChanged',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);
                }
                //update user
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const resetUser = (index, email) => {
        console.log('resetUser-email', email);

        const headerParameter = { email: email || '' };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/websites/user-management/resendActivationLink', httpHeaders)
            .then((result) => {
                const { code } = result.data;

                console.log('resetUser-result', result.data);
                console.log('resetUser-code', code);

                if (code && code === 1) {
                    const resStatus = {
                        status: 'success',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);
                }

                if (code && code === -2) {
                    const resStatus = {
                        status: 'notChanged',
                        msg: result.data.message,
                    };
                    setResponseData(resStatus);

                    setTimeout(function () {
                        setResponseData(undefined);
                    }, 3000);
                }
                //update user
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function getLoginStatusById(statusId) {
        let authStatus;

        switch (statusId) {
            case 1:
                authStatus = 'active';
                break;
            case 2:
                authStatus = 'suspended';
                break;
            case 3:
                authStatus = 'pending';
                break;
            case 4:
                authStatus = 'expired';
                break;
            default:
                authStatus = 'unknown';
        }

        return authStatus;
    }

    function getUserDetails() {
        let itemCount = 0;
        return (
            <>
                {users &&
                    users.map((user, index) => {
                        itemCount++;
                        return (
                            <tr key={index}>
                                <td>{itemCount} &nbsp;</td>
                                <td>{user.S02_LOGIN_ID} &nbsp;</td>
                                <td>{user.S02_LOGINNAME} &nbsp;</td>
                                <td>{user.S02_USER_ID} &nbsp;</td>
                                <td>{user.S01_FIRSTNAME} &nbsp;</td>
                                {/* <td>{user.S02_OTP} &nbsp;</td> */}
                                <td>{user.S02_FAILED_ATTEMPTS} &nbsp;</td>
                                <td>{getFormattedDateTimeString(user.S02_START_DATE)} &nbsp;</td>
                                <td>{getFormattedDateTimeString(user.S02_LAST_UPDATED)} &nbsp;</td>
                                <td>{getLoginStatusById(user.S02_TYPE_BIT)} &nbsp;</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-success btn-sm"
                                        onClick={() => activateUser(index, user.S02_LOGINNAME)}
                                    >
                                        Activate
                                    </button>
                                    &nbsp;
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-info btn-sm"
                                        onClick={() => {
                                            console.log(
                                                'resetUser-email-onClick',
                                                user.S02_LOGINNAME
                                            );
                                            resetUser(index, user.S02_LOGINNAME);
                                        }}
                                    >
                                        Resend Link
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
            </>
        );
    }

    function getFormattedSelectedDate(date) {
        let year;
        let month;
        let dt;

        if (date && date.getFullYear && date.getMonth && date.getDate) {
            year = date.getFullYear();
            month = date.getMonth() + 1;
            dt = date.getDate();

            if (dt < 10) {
                dt = '0' + dt;
            }

            if (month < 10) {
                month = '0' + month;
            }

            return year + '-' + month + '-' + dt;
        }

        return null;
    }

    return (
        <>
            <h5>Website User Management</h5>
            <br />
            {/* Activity Logs Tab content*/}
            <div>
                {/* Filter for activity logs*/}
                <div className="row align-items-center">
                    <div className="input-group mb-3 col-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Login Name"
                            aria-label="Login Name"
                            aria-describedby="basic-addon2"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            onFocus={(e) => {
                                setIsRegisterdDateActive(false);
                                setIsFirstNameActive(false);
                                setIsStatusActive(false);
                                setIsLoginNameActive(true);
                                setFirstName('');
                                setSelectedLoginStatus([]);
                                setFromDate(null);
                                setToDate(null);
                            }}
                            onBlur={(e) => {
                                setIsFirstNameActive(false);
                                setIsRegisterdDateActive(false);
                                setIsStatusActive(false);
                            }}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                type="button"
                                onClick={getUsers}
                                disabled={!isLoginNameActive}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="input-group mb-3 col-3">
                        <div className="d-flex form-control p-0">
                            <DatePickerComponent
                                className="form-control"
                                handleValueChange={(date) => {
                                    setFromDate(date);
                                }}
                                onFocus={(e) => {
                                    setIsStatusActive(false);
                                    setIsFirstNameActive(false);
                                    setIsRegisterdDateActive(true);
                                    setIsLoginNameActive(false);
                                    setEmail('');
                                    setFirstName('');
                                    setSelectedLoginStatus([]);
                                }}
                                onBlur={(e) => {
                                    setIsFirstNameActive(false);
                                    setIsLoginNameActive(false);
                                    setIsStatusActive(false);
                                }}
                                selected={fromDate}
                                placeholderText="Select From Date"
                                isClearable={true}
                                maxDate={new Date()}
                            />
                            <DatePickerComponent
                                className="form-control"
                                handleValueChange={(date) => {
                                    setToDate(date);
                                }}
                                onFocus={(e) => {
                                    setIsStatusActive(false);
                                    setIsFirstNameActive(false);
                                    setIsRegisterdDateActive(true);
                                    setIsLoginNameActive(false);
                                    setEmail('');
                                    setFirstName('');
                                    setSelectedLoginStatus([]);
                                }}
                                onBlur={(e) => {
                                    setIsFirstNameActive(false);
                                    setIsLoginNameActive(false);
                                    setIsStatusActive(false);
                                }}
                                selected={toDate}
                                placeholderText="Select To Date"
                                isClearable={true}
                                minDate={fromDate}
                                maxDate={new Date()}
                            />
                        </div>

                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                type="button"
                                onClick={getUsersByDate}
                                disabled={!isRegisterdDateActive}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="input-group mb-3 col-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter First Name"
                            aria-label="firstName"
                            aria-describedby="basic-addon3"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            onFocus={(e) => {
                                setIsRegisterdDateActive(false);
                                setIsLoginNameActive(false);
                                setIsStatusActive(false);
                                setIsFirstNameActive(true);
                                setEmail('');
                                setFromDate(null);
                                setToDate(null);
                                setSelectedLoginStatus([]);
                            }}
                            onBlur={(e) => {
                                setIsRegisterdDateActive(false);
                                setIsLoginNameActive(false);
                                setIsStatusActive(false);
                            }}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                type="button"
                                onClick={getUsresByFirstName}
                                disabled={!isFirstNameActive}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="input-group mb-3 col-3">
                        <MultiSelect
                            className="multi-select form-control p-0"
                            options={loginStatus}
                            value={selectedLoginStatus}
                            onChange={setSelectedLoginStatus}
                            labelledBy="basic-addon4"
                            onMenuToggle={() => {
                                setIsRegisterdDateActive(false);
                                setIsLoginNameActive(false);
                                setIsFirstNameActive(false);
                                setIsStatusActive(true);
                                setEmail('');
                                setFromDate(null);
                                setToDate(null);
                                setFirstName('');
                            }}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                type="button"
                                onClick={getUsresByStatus}
                                disabled={!isStatusActive}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                {responseData && responseData.status === 'success' && (
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                className="alert alert-success alert-dismissible fade show mt-2"
                                role="alert"
                            >
                                <strong>Success</strong> {responseData.msg}
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {responseData && responseData.status === 'notChanged' && (
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                className="alert alert-warning alert-dismissible fade show mt-2"
                                role="alert"
                            >
                                <strong>Data Not Changed</strong> {responseData.msg}
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Login ID</th>
                            <th>Login Name</th>
                            <th>User ID</th>
                            <th>First Name</th>
                            {/* <th>OTP</th> */}
                            <th>Failed Attemps</th>
                            <th>Start Date</th>
                            <th>Last Updated Date</th>
                            <th>Status</th>
                            <th>Activate</th>
                            <th>Resend</th>
                        </tr>
                    </thead>
                    <tbody style={{}}>{getUserDetails()}</tbody>
                </table>
                {responseData && responseData.status === 'empty' && (
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                className="alert alert-warning alert-dismissible fade show mt-2"
                                role="alert"
                            >
                                <strong>Data Not Found</strong>
                                <p>{responseData.msg}</p>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SiteUser;
