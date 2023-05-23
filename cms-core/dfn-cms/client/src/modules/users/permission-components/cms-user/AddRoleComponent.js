import { getAuthorizationHeader, isEnable } from '../../../shared/utils/AuthorizationUtils';
import React, { useState } from 'react';
import Axios from 'axios';
import MasterRepository from '../../../shared/repository/MasterRepository';

export default function AddRoleComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const statusChangedByUserID = MasterRepository.getCurrentUser().docId;

    function saveRole() {
        let role = {
            name: roleName,
            description: roleDescription,
            statusChangedBy: statusChangedByUserID,
            status: 'Pending',
        };

        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = getAuthorizationHeader();

        // {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.post('/api/cms/roles/create', role, httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                props.updateRoles();
                setRoleName('');
                setRoleDescription('');
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    const handleRoleNameInputChange = (event) => {
        setRoleName(event.target.value);
    };

    const handleRoleDescriptionInputChange = (event) => {
        setRoleDescription(event.target.value);
    };

    return (
        <>
            <form>
                <div className="form-group">
                    <label className="col-form-label">Role Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="role-name"
                        value={roleName}
                        onChange={(event) => handleRoleNameInputChange(event)}
                    ></input>
                </div>
                <div className="form-group">
                    <label className="col-form-label">Role Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="role-description"
                        value={roleDescription}
                        onChange={(event) => handleRoleDescriptionInputChange(event)}
                    ></input>
                </div>
            </form>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    disabled={isEnable('/api/cms/roles/create')}
                    onClick={(e) => saveRole()}
                >
                    Save changes
                </button>
            </div>
        </>
    );
}
