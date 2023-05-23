import Axios from 'axios';
import React, {useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserModel from '../shared/models/UserModel';
import MasterRepository from '../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';

export default function ADSuccessResponseComponent(props) {
    const { match } = props;
    const { params } = match;

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHiddenError, setHiddenError] = useState(true);
    const history = useHistory();
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (params.username && params.sessionid) {
            processADAuthenticationResponse(params.username, params.sessionid);
        }
    }, [params.username, params.sessionid]);

    function getPermissions() {
        const headerParameter = { username: MasterRepository.getCurrentUser().userName };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/cms/permission', httpHeaders)
            .then((result) => {
                const response = JSON.parse(result.data);
                console.log('Permission Data : ' + typeof response);

                for (let i = 0; i < response.length; i++) {
                    if (response[i].name === 'websites') {
                        MasterRepository.setAccessibleWebsites(response[i].value);
                    } else if (response[i].name === 'permissions') {
                        MasterRepository.setRolePermissions(response[i].value);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function processADAuthenticationResponse(username, sessionid) {
        const httpHeaders = {
            params: {
                encryptedUsername: username,
                sessionId: sessionid,
                errorCode: '',
            },
        };

        Axios.get('/api/users/adRedirect', httpHeaders)
            .then((response) => {
                console.log('AD-response', response.data);
                if (response.data) {
                    if (response.data.error) {
                        setError(response.data.error);
                        setHiddenError(false);
                    } else {
                        const user: UserModel = {
                            docId: response.data.docId,
                            userName: response.data.userName,
                        };
                        console.log('response data ' + response.data);
                        MasterRepository.setCurrentUser(user);
                        MasterRepository.setCurrentSessionId(response.data.sessionId);
                        localStorage.setItem('sessionId', response.data.sessionId);
                        getPermissions();
                        history.push('/dashboard');
                    }
                } else {
                    setIsInvalidLogin(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if (error) {
        return (
            <div className="ad-login__container">
                <div className="ad-login">
                    <div className="alert alert-danger border-0 p-4" role="alert">
                        <h4 className="alert-heading">Login failed!</h4>
                        <p>{error}</p>
                        <hr />
                        <div className="text-right">
                            <a
                                href="/"
                                className="btn btn-primary"
                                role="button"
                                data-bs-toggle="button"
                            >
                                Login Again
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else{
        return (
            <></>
        );
    }



    // return (
    //     <></>
    // );
}