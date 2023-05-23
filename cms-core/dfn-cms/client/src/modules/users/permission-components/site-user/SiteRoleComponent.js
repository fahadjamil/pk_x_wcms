import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import './SiteRoleComponent.css';
import EditRole from './EditSiteRoleComponent';
import AddRole from './AddSiteRoleComponent';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import PESectionSettings from '../../../shared/resources/PageEditor-Section-Settings';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import { ExportExcelJS, ExportToPdf } from '../../../shared/utils/ExportHelper';

export default function AddRoleComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();
    const [showRoleEdit, setShowRoleEdit] = useState(false);
    const [showRoleAdd, setShowRoleAdd] = useState(false);
    const [roles, setRole] = useState([]);

    useEffect(() => {
        getAllRole();
    }, [props.website]);

    async function getAllRole() {
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

        Axios.get('/api/sites/roles', httpHeaders)
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
        // const jwt = localStorage.getItem('jwt-token');

        // const payload = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     data: {
        //         dbName: props.website,
        //         role: role,
        //     },
        // };

        const headerParameter = { role: role };
        const payload = getAuthorizationHeaderForDelete(headerParameter);

        await Axios.delete('/api/sites/roles/delete', payload)
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
        ExportToPdf('site-user-roles', {
            title: 'Site User Roles',
            saveName: 'SiteUserRoles',
            pageFormat: { orientation: 'l', format: 'a4', lang: 'en' },
            removeColumns: ['Actions']
        });
    };

    const handleExcelExport = () => {
        ExportExcelJS('site-user-roles', 'Site User Roles', 'SiteUserRoles', 'en', [4]);
    };

    return (
        <>
            <div
                className="modal fade"
                id="addRole"
                role="dialog"
                aria-labelledby="exampleModalCenterTitle"
                aria-hidden="false"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title" id="exampleModalLongTitle">
                                Add Role
                            </span>
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
            <div className="row p-3 justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-toggle="modal"
                    data-target="#addRole"
                    disabled={isEnable('/api/sites/roles/create')}
                    onClick={(e) => {
                        setShowRoleAdd(true);
                    }}
                >
                    Add Role
                </button>
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
            <div className={('container', 'table')} key="0" id="site-user-roles">
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <thead>
                        <tr>
                            <th>Role Id</th>
                            <th>Role Name</th>
                            <th>Role Description</th>
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
                                                <span>{role.id || " "}</span>
                                            </td>
                                            <td scope="col">
                                                <span>{role.name || " "}</span>
                                            </td>
                                            <td scope="col">
                                                <span>{role.description || " "}</span>
                                            </td>
                                            <td scope="col" className="text-right">
                                                <a
                                                    type="button"
                                                    data-toggle="modal"
                                                    className="mr-3"
                                                    data-target={'#roleEdit' + roleIndex}
                                                    disabled={isEnable('/api/sites/roles/update')}
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
                                                        removeRole(role);
                                                        getAllRole();
                                                    }}
                                                >
                                                    <PESectionDelete width="20px" height="20px" />
                                                </a>

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
                                                                    {'Edit ' + role.name}
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
        </>
    );
}
