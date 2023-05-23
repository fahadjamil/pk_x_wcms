import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserModel from '../shared/models/UserModel';
import MasterRepository from '../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';

export default function ADFailResponseComponent(props) {
    const { match } = props;
    const { params } = match;

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHiddenError, setHiddenError] = useState(true);
    const history = useHistory();
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (params.errorcode) {
            processADAuthenticationResponse(params.errorcode);
        }
    }, [params.username, params.sessionid]);

    function processADAuthenticationResponse(errorcode) {
        const httpHeaders = {
            params: {
                encryptedUsername: '',
                sessionId: '',
                errorCode: errorcode,
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
                        // const user: UserModel = {
                        //     docId: response.data.docId,
                        //     userName: response.data.userName,
                        // };
                        console.log('response data ' + response.data);
                    }
                } else {
                    setIsInvalidLogin(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

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
}
