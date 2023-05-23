import { getAuthorizationHeader, isEnable } from '../../../shared/utils/AuthorizationUtils';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import MasterRepository from '../../../shared/repository/MasterRepository';

export default function EditUserComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [websites, setWebsites] = useState([]);
    const statusChangedByUserID = MasterRepository.getCurrentUser().docId;

    useEffect(() => {
        setUserName(props.userObj.userName);
        setPassword(props.userObj.password);
        setRoles(props.userObj.roles);
        setWebsites(props.userObj.websites);
    }, []);

    function saveUser() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        let updatedUser = props.userObj;

        updatedUser.userName = userName;
        updatedUser.password = password;
        updatedUser.roles = roles;
        updatedUser.websites = websites;
        updatedUser.status = 'Pending';
        updatedUser.statusChangedBy = statusChangedByUserID;

        Axios.put('/api/cms/users/update', updatedUser, httpHeaders)
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

    const handleUserNameInputChange = (event) => {
        setUserName(event.target.value);
    };

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <>
            <form>
                <div className="form-group">
                    <label className="col-form-label">User Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="user-name"
                        value={userName}
                        onChange={(event) => handleUserNameInputChange(event)}
                    ></input>
                </div>
                <div className="form-group">
                    <label className="col-form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="user-password"
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
                                                checked={
                                                    typeof roles !== 'undefined' &&
                                                    roles !== null &&
                                                    roles.length > 0 &&
                                                    roles.includes(role._id)
                                                }
                                                onChange={(event) => {
                                                    let newRoles = [...roles];

                                                    let indexOfRole = newRoles
                                                        .map(function (e) {
                                                            return e;
                                                        })
                                                        .indexOf(role._id);

                                                    if (indexOfRole !== -1) {
                                                        newRoles.splice(indexOfRole, 1);
                                                    } else {
                                                        newRoles.push(role._id);
                                                    }
                                                    console.log(newRoles);
                                                    setRoles(newRoles);
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
                                                checked={
                                                    typeof websites !== 'undefined' &&
                                                    websites !== null &&
                                                    websites.length > 0 &&
                                                    websites.includes(website.databaseName)
                                                }
                                                onChange={(event) => {
                                                    let newWebsites = [...websites];

                                                    let indexOfWebsite = newWebsites
                                                        .map(function (e) {
                                                            return e;
                                                        })
                                                        .indexOf(website.databaseName);

                                                    if (indexOfWebsite !== -1) {
                                                        newWebsites.splice(indexOfWebsite, 1);
                                                    } else {
                                                        newWebsites.push(website.databaseName);
                                                    }
                                                    console.log(newWebsites);
                                                    setWebsites(newWebsites);
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
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    disabled={isEnable('/api/cms/users/update')}
                    onClick={(e) => saveUser()}
                >
                    Save changes
                </button>
            </div>
        </>
    );
}
