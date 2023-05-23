import { getAuthorizationHeader, isEnable } from '../../../shared/utils/AuthorizationUtils';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import MasterRepository from '../../../shared/repository/MasterRepository';

export default function AddUserComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let selectedRole = [];
    let selectedWebsite = [];
    const statusChangedByUserID = MasterRepository.getCurrentUser().docId;

    function saveUser() {
        let user = {
            userName: userName,
            password: password,
            roles: [],
            websites: [],
            statusChangedBy: statusChangedByUserID,
            status: 'Pending',
        };

        user['roles'] = selectedRole;
        user['websites'] = selectedWebsite;

        let headerParameter;
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post('/api/cms/users/create', user, httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                props.updateUsers();
                setUsername('');
                setPassword('');
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        props.setShowUserAdd(false);
    }

    const handleUsernameInputChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <>
            <form>
                <div className="form-group">
                    <label className="col-form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={userName}
                        onChange={(event) => handleUsernameInputChange(event)}
                    ></input>
                </div>
                <div className="form-group">
                    <label className="col-form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(event) => handlePasswordInputChange(event)}
                    ></input>
                </div>
                <div>role</div>
                <div>
                    <div>
                        <ul className="list-group-cms list-group-flush">
                            {props.roles.map((role, index) => {
                                return (
                                    <li key={role._id} className="list-group-item ml-3">
                                        <label className="form-check-label">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="exampleCheck1"
                                                onChange={(event) => {
                                                    let indexOfRole = selectedRole
                                                        .map(function (e) {
                                                            return e;
                                                        })
                                                        .indexOf(role._id);

                                                    if (indexOfRole !== -1) {
                                                        selectedRole.splice(indexOfRole, 1);
                                                    } else {
                                                        selectedRole.push(role._id);
                                                    }
                                                }}
                                            ></input>
                                            {role.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div></div>
                <div>website</div>
                <div>
                    <div>
                        <ul className="list-group-cms list-group-flush">
                            {props.websites.map((website, index) => {
                                return (
                                    <li key={website._id} className="list-group-item ml-3">
                                        <label className="form-check-label">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="exampleCheck1"
                                                onChange={(event) => {
                                                    let indexOfWebsite = selectedWebsite
                                                        .map(function (e) {
                                                            return e;
                                                        })
                                                        .indexOf(website.databaseName);

                                                    if (indexOfWebsite !== -1) {
                                                        selectedWebsite.splice(indexOfWebsite, 1);
                                                    } else {
                                                        selectedWebsite.push(website.databaseName);
                                                    }
                                                    console.log(selectedWebsite);
                                                }}
                                            ></input>
                                            {website.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </form>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={() => {
                        props.setShowUserAdd(false);
                    }}
                >
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    disabled={isEnable('/api/cms/users/create')}
                    onClick={(e) => saveUser()}
                >
                    Save changes
                </button>
            </div>
        </>
    );
}
