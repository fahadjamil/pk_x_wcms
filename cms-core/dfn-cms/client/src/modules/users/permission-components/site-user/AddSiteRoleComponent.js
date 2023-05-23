import {getAuthorizationHeader, isEnable} from '../../../shared/utils/AuthorizationUtils';
import React, { useState } from 'react';
import Axios from 'axios';

export default function AddSiteRoleComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');

    function saveRole() {
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

        let role = {
            name: roleName,
            description: roleDescription,
        };

        Axios.post('/api/sites/roles/create', role, httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                props.updateRoles();
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
                    disabled={
                        isEnable('/api/sites/roles/create')
                    }
                    onClick={(e) => saveRole()}
                >
                    Save changes
                </button>
            </div>
        </>
    );
}
