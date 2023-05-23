import Axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserModel from '../shared/models/UserModel';
import MasterRepository from '../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';

export default function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHiddenError, setHiddenError] = useState(true);
    const history = useHistory();
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function getPermissions() {
        const headerParameter = { username: MasterRepository.getCurrentUser().userName };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/cms/permission', httpHeaders)
            .then((result) => {
                const response = JSON.parse(result.data);

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

    function handleSubmit(event) {
        event.preventDefault();

        // To set the initial website to the MasterRepository
        getWebsites();

        const httpHeaders = {
            params: {
                user: email,
                password: password,
            },
        };

        Axios.get('/api/users/login', httpHeaders)
            .then((response) => {
                /*  const { data } = response;
                const { token } = data;
                localStorage.setItem('jwt-token', token);
                history.push('/home'); */
                if (response.data) {
                    if (response.data.error) {
                        setError(response.data.error);
                        setHiddenError(false);
                    } else {
                        const user: UserModel = {
                            docId: response.data.docId,
                            userName: response.data.userName,
                        };
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

    function getWebsites() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/websites', httpHeaders)
            .then((result) => {
                MasterRepository.setCurrentDBName(result.data[0].databaseName);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="login__container">
            <div className="login">
                <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '35px' }}>
                    <h1>Login</h1>
                </div>
                {isInvalidLogin && (
                    <div className="alert alert-danger">Login Credentials Invalid</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div hidden={isHiddenError}>
                        <p>{error}</p>
                    </div>
                    <div className="form-group">
                        <input
                            type="input"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter user"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            //disabled={!validateForm()}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
