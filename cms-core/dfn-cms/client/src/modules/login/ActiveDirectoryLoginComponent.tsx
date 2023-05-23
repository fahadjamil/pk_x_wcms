import Axios from 'axios';
import React, {useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserModel from '../shared/models/UserModel';
import MasterRepository from '../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';

export default function ActiveDirectoryLoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHiddenError, setHiddenError] = useState(true);
    const history = useHistory();
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);


    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            processAdAuthentication();
        }
        return () => {
            isMounted = false;
        };
    }, [isLoaded]);

    function processAdAuthentication() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/users/adLogin', httpHeaders)
            .then((result) => {
                
                console.log('AD-response', result.data);
                setIsLoaded(true);

                if (typeof window !== 'undefined') {
                    window.location = result.data;
                }
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }


    return (
        <div>{error}</div>
    );
}