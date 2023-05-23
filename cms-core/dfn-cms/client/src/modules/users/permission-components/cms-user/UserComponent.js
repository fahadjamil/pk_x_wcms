import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import EditUser from './EditUserComponent';
import AddUser from './AddUserComponent';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import PESectionSettings from '../../../shared/resources/PageEditor-Section-Settings';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import UserApproval from '../../../shared/resources/UserApproval';
import { ExportExcelJS, ExportToPdf } from '../../../shared/utils/ExportHelper';
import MasterRepository from '../../../shared/repository/MasterRepository';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';

export default function UserComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();
    const [showUserEdit, setShowUserEdit] = useState(false);
    const [showUserAdd, setShowUserAdd] = useState(false);
    const [users, setUser] = useState([]);
    const [roles, setRole] = useState([]);
    const [websites, setWebsites] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [isUserDeleteConfirmationModalOpen, setUserDeleteConfirmationModalOpen] = useState(false);
    const currentUserID = MasterRepository.getCurrentUser().docId;

    useEffect(() => {
        getAllUser();
        getAllRole();
        getAllSites();
    }, [props.website]);

    useEffect(() => {
        getAllUser();
    }, [isUserDeleteConfirmationModalOpen]);

    function getAllUser() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.get('/api/cms/users', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setUser(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function getAllRole() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.get('/api/cms/roles/approved', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setRole(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function getAllSites() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.get('/api/websites', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setWebsites(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    async function removeUser(user) {
        // const jwt = localStorage.getItem('jwt-token');

        // const payload = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     data: {
        //         dbName: props.website,
        //         user: user,
        //     },
        // };

        const headerParameter = { user: user };
        const payload = getAuthorizationHeaderForDelete(headerParameter);

        await Axios.delete('/api/cms/users/delete', payload)
            .then((result) => {
                setIsLoaded(true);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    const handlePdfExport = () => {
        ExportToPdf('cms-users', {
            title: 'CMS Users',
            saveName: 'CMSUsers',
            pageFormat: { orientation: 'l', format: 'a4', lang: 'en' },
            removeColumns: ['Password', 'Actions'],
        });
    };

    const handleExcelExport = () => {
        ExportExcelJS('cms-users', 'CMS Users', 'CMSUsers', 'en', [3, 4]);
    };

    function approveUser(approvedUser) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        approvedUser.status = 'Approved';

        Axios.put('/api/cms/users/update', approvedUser, httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                props.updateUsers();
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function handleUserDeteleConfimation() {
        removeUser(currentUser);
        getAllUser();
        setUserDeleteConfirmationModalOpen(false);
        setCurrentUser({});
    }

    return (
        <>
            <div className="row p-3 justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-toggle="modal"
                    data-target="#addUser"
                    onClick={(e) => {
                        setShowUserAdd(true);
                    }}
                >
                    Add User
                </button>
                <div
                    className="modal fade text-left"
                    id="addUser"
                    user="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="false"
                >
                    <div className="modal-dialog modal-dialog-centered" user="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">
                                    Add User
                                </h5>
                            </div>
                            <div className="modal-body">
                                {showUserAdd && (
                                    <AddUser
                                        updateUsers={() => {
                                            getAllUser();
                                        }}
                                        website={props.website}
                                        roles={roles}
                                        websites={websites}
                                        setShowUserAdd={setShowUserAdd}
                                    ></AddUser>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row p-3 justify-content-end">
                <div>
                    <button
                        className="btn btn-sm btn-outline-secondary mr-1"
                        onClick={handlePdfExport}
                    >
                        <i className="btn-icon btn-icon-sm pdf-icon"></i>
                        Export To PDF
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleExcelExport}
                    >
                        <i className="btn-icon btn-icon-sm xls-icon"></i>
                        Export To Excel
                    </button>
                </div>
            </div>
            <div className={('container', 'table')} key="0" id="cms-users">
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Status</th>
                            <th>Password</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) &&
                            users.map((user, userIndex) => {
                                return (
                                    <React.Fragment key={userIndex + 'header'}>
                                        <tr>
                                            <td scope="col">
                                                <span>{user.userName || ' '}</span>
                                            </td>
                                            <td scope="col">
                                                {user.status === 'Pending' && (
                                                    <span className="badge badge-info">
                                                        {user.status}
                                                    </span>
                                                )}
                                                {(!user.status || user.status === 'Approved') && (
                                                    <span className="badge badge-success">
                                                        Approved
                                                    </span>
                                                )}
                                            </td>
                                            <td scope="col">
                                                {/* <span>{user.password || " "}</span> */}
                                                <span>******</span>
                                            </td>

                                            <td scope="col" className="text-right">
                                                <a
                                                    type="button"
                                                    className="mr-3"
                                                    data-toggle="modal"
                                                    data-target={'#userEdit' + userIndex}
                                                    disabled={isEnable('/api/cms/users/update')}
                                                    onClick={(e) => {
                                                        setShowUserEdit(true);
                                                    }}
                                                >
                                                    <PESectionEdit width="20px" height="20px" />
                                                </a>
                                                <a
                                                    type="button"
                                                    className="mr-3"
                                                    onClick={(e) => {
                                                        setUserDeleteConfirmationModalOpen(true);
                                                        setCurrentUser(user);
                                                    }}
                                                >
                                                    <PESectionDelete width="20px" height="20px" />
                                                </a>
                                                <button
                                                    type="button"
                                                    className="btn mr-3"
                                                    onClick={() => {
                                                        approveUser(user);
                                                    }}
                                                    disabled={
                                                        currentUserID === user.statusChangedBy ||
                                                        user.status === 'Approved'
                                                    }
                                                >
                                                    <UserApproval width="20px" height="20px" />
                                                </button>

                                                <div
                                                    className="modal fade text-left"
                                                    id={'userEdit' + userIndex}
                                                    user="dialog"
                                                    aria-labelledby="exampleModalCenterTitle"
                                                    aria-hidden="false"
                                                >
                                                    <div
                                                        className="modal-dialog modal-dialog-centered"
                                                        user="document"
                                                    >
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <span
                                                                    className="modal-title"
                                                                    id="exampleModalLongTitle"
                                                                >
                                                                    {'Edit User : ' + user.userName}
                                                                </span>
                                                            </div>
                                                            <div className="modal-body">
                                                                {showUserEdit && (
                                                                    <EditUser
                                                                        updateUsers={() => {
                                                                            getAllUser();
                                                                        }}
                                                                        userObj={user}
                                                                        website={props.website}
                                                                        roles={roles}
                                                                        websites={websites}
                                                                    ></EditUser>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                modalTitle={`Delete User : ${currentUser?.userName}`}
                show={isUserDeleteConfirmationModalOpen}
                handleClose={() => {
                    setUserDeleteConfirmationModalOpen(false);
                }}
                handleConfirme={handleUserDeteleConfimation}
            >
                <p>"Are you sure you want to delete this User?"</p>
            </ConfirmationModal>
        </>
    );
}
