import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import EditRole from './EditRoleComponent';
import AddRole from './AddRoleComponent';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import PESectionSettings from '../../../shared/resources/PageEditor-Section-Settings';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import UserApproval from '../../../shared/resources/UserApproval';
import { ExportExcelJS, ExportToPdf } from '../../../shared/utils/ExportHelper';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import MasterRepository from '../../../shared/repository/MasterRepository';

export default function RoleComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();
    const [showRoleEdit, setShowRoleEdit] = useState(false);
    const [showRoleAdd, setShowRoleAdd] = useState(false);
    const [roles, setRole] = useState([]);
    const [isRoleDeleteConfirmationModalOpen, setRoleDeleteConfirmationModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState({});
    const currentUserID = MasterRepository.getCurrentUser().docId;

    useEffect(() => {
        getAllRole();
    }, [props.website]);

    useEffect(() => {
        getAllRole();
    }, [isRoleDeleteConfirmationModalOpen]);

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

        Axios.get('/api/cms/roles', httpHeaders)
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

    async function removeRole(role) {
        const headerParameter = { role: role };
        const payload = getAuthorizationHeaderForDelete(headerParameter);

        await Axios.delete('/api/cms/roles/delete', payload)
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
        ExportToPdf('cms-user-roles', {
            title: 'CMS User Roles',
            saveName: 'CMSUserRoles',
            pageFormat: { orientation: 'l', format: 'a4', lang: 'en' },
            removeColumns: ['Actions'],
        });
    };

    const handleExcelExport = () => {
        ExportExcelJS('cms-user-roles', 'CMS User Roles', 'CMSUserRoles', 'en', [4]);
    };

    function approveRole(approvedRole) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        approvedRole.status = 'Approved';

        Axios.put('/api/cms/roles/update', approvedRole, httpHeaders)
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

    function handleRoleDeteleConfimation() {
        removeRole(currentRole);
        setRoleDeleteConfirmationModalOpen(false);
        setCurrentRole({});
        getAllRole();
    }

    return (
        <>
            <div className="row p-3 justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-toggle="modal"
                    data-target="#addRole"
                    onClick={(e) => {
                        setShowRoleAdd(true);
                    }}
                >
                    Add Role
                </button>
                <div
                    className="modal fade text-left"
                    id="addRole"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="false"
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">
                                    Add Role
                                </h5>
                            </div>
                            <div className="modal-body">
                                {showRoleAdd && (
                                    <AddRole
                                        updateRoles={() => {
                                            getAllRole();
                                        }}
                                        website={props.website}
                                    ></AddRole>
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
            <div className={('container', 'table')} key="0" id="cms-user-roles">
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <thead>
                        <tr>
                            <th>Role Name</th>
                            <th>Status</th>
                            <th>Role Description </th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(roles) &&
                            roles.map((role, roleIndex) => {
                                return (
                                    <React.Fragment key={roleIndex + 'header'}>
                                        <tr>
                                            <td scope="col">
                                                <span>{role.name}</span>
                                            </td>
                                            <td scope="col">
                                                {role.status === 'Pending' && (
                                                    <span className="badge badge-info">
                                                        {role.status}
                                                    </span>
                                                )}
                                                {(!role.status || role.status === 'Approved') && (
                                                    <span className="badge badge-success">
                                                        Approved
                                                    </span>
                                                )}
                                            </td>
                                            <td scope="col">
                                                <span>{role.description}</span>
                                            </td>
                                            <td scope="col" className="text-right">
                                                <a
                                                    type="button"
                                                    className="mr-3"
                                                    data-toggle="modal"
                                                    data-target={'#roleEdit' + roleIndex}
                                                    disabled={isEnable('/api/cms/roles/update')}
                                                    onClick={(e) => {
                                                        setShowRoleEdit(true);
                                                    }}
                                                >
                                                    <PESectionEdit width="20px" height="20px" />
                                                </a>

                                                <a
                                                    type="button"
                                                    className="mr-3"
                                                    onClick={(e) => {
                                                        setCurrentRole(role);
                                                        setRoleDeleteConfirmationModalOpen(true);
                                                    }}
                                                >
                                                    <PESectionDelete width="20px" height="20px" />
                                                </a>
                                                <button
                                                    type="button"
                                                    className="btn mr-3"
                                                    onClick={(e) => {
                                                        approveRole(role);
                                                    }}
                                                    disabled={
                                                        currentUserID === role.statusChangedBy ||
                                                        role.status === 'Approved'
                                                    }
                                                >
                                                    <UserApproval width="20px" height="20px" />
                                                </button>

                                                <div
                                                    className="modal fade text-left"
                                                    id={'roleEdit' + roleIndex}
                                                    role="dialog"
                                                    aria-labelledby="exampleModalCenterTitle"
                                                    aria-hidden="false"
                                                >
                                                    <div
                                                        className="modal-dialog modal-dialog-centered"
                                                        role="document"
                                                    >
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <span
                                                                    className="modal-title"
                                                                    id="exampleModalLongTitle"
                                                                >
                                                                    {'Edit Role : ' + role.name}
                                                                </span>
                                                            </div>
                                                            <div className="modal-body">
                                                                {showRoleEdit && (
                                                                    <EditRole
                                                                        updateRoles={() => {
                                                                            getAllRole();
                                                                        }}
                                                                        roleObj={role}
                                                                        website={props.website}
                                                                    ></EditRole>
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
                modalTitle={`Delete Role : ${currentRole?.name}`}
                show={isRoleDeleteConfirmationModalOpen}
                handleClose={() => {
                    setRoleDeleteConfirmationModalOpen(false);
                }}
                handleConfirme={handleRoleDeteleConfimation}
            >
                <p>"Are you sure you want to delete this role?"</p>
            </ConfirmationModal>
        </>
    );
}
