import React, { useState } from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie/es6';
import md5 from 'md5';
import Axios from 'axios';
import { ForgotPassword } from './ForgotPassword';
import { loginService } from '../../config/path';
import {
    changeDefaultPassowrdLink,
    getLangKey,
    EMAIL_COOKIE,
    LOGIN_ID_COOKIE,
    SUBSCRIPTIONS_COOKIE,
    SESSION_COOKIE,
    NAME_COOKIE,
    productID,
} from '../../config/constants';

const LoginWrapper = styled.div``;
const CredentialInput = styled.input``;
const CredentialLabel = styled.label``;
const LoginCredentialsWrapper = styled.form``;
const LoginButtonWrapper = styled.div``;
const Loginbutton = styled.button`
    padding: 5px 10px 5px 5px;
    width: 100px;
    background: #c5964a;
    color: white;
    text-align: center;
    border-style: none;
    border-radius: 2px;
`;
const ForgotPasswordWrapper = styled.div`
    a {
    }
`;

const CredentialError = styled.p`
    color: #a31621;
    background: #a3162111;
    border: 1px solid #a31621;
    padding: 0.4rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;

export const Login = (props) => {
    const { commonConfigs, lang } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleEmailChange = (newValue) => setEmail(newValue);
    const handlePasswordChange = (newValue) => setPassword(newValue);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const validatate = () => {
        if (!email) {
            return false;
        }
        if (!password) {
            return false;
        }
        return true;
    };

    const authFunction = (event) => {
        event.preventDefault();
        if (validatate()) {
            let md5Hash = md5(password);
            Axios.post(loginService(), {
                email: email,
                password: md5Hash.toString(),
                prodId: productID,
            }).then((res) => {
                if (res.data.code == 1) {
                    const cookies = new Cookies();
                    cookies.set(SESSION_COOKIE, res.data.session, { path: '/', maxAge: 86400 });
                    cookies.set(EMAIL_COOKIE, email, { path: '/', maxAge: 86400 });
                    cookies.set(SUBSCRIPTIONS_COOKIE, res.data.subscriptions, {
                        path: '/',
                        maxAge: 86400,
                    });
                    cookies.set(LOGIN_ID_COOKIE, res.data.login, { path: '/', maxAge: 86400 });
                    cookies.set(NAME_COOKIE, res.data.name, { path: '/', maxAge: 86400 });

                    // redirect to home or change default password if init login
                    if (typeof window !== 'undefined') {
                        if (res.data.reset && res.data.reset == 1) {
                            window.location = changeDefaultPassowrdLink(lang);
                        } else {
                            window.location = `/${getLangKey(lang)}`;
                        }
                    }
                } else if (res.data.code == -2) {
                    setError(convertByLang(res.data.message_ar, res.data.message));
                } else {
                    setError(convertByLang('فشل تسجيل الدخول', 'Error'));
                }
            });
        }
    };

    return (
        <div>
            <LoginWrapper>
                <LoginCredentialsWrapper onSubmit={authFunction}>
                    <div className="form-group">
                        <CredentialLabel for="name" className="mandatory">
                            {convertByLang('البريد الإلكتروني', 'Email address')}
                        </CredentialLabel>
                        <CredentialInput
                            name="name"
                            className="form-control"
                            type="text"
                            onChange={(event) => handleEmailChange(event.target.value)}
                            required
                            placeholder={convertByLang('البريد الإلكتروني', 'Email address')}
                        ></CredentialInput>
                    </div>

                    <div className="form-group">
                        <CredentialLabel for="password" className="mandatory">
                            {convertByLang('كلمة السر', 'Password')}
                        </CredentialLabel>
                        <CredentialInput
                            name="password"
                            className="form-control"
                            type="password"
                            onChange={(event) => handlePasswordChange(event.target.value)}
                            required
                            placeholder={convertByLang('كلمة السر', 'Password')}
                        ></CredentialInput>
                    </div>

                    {error ? (
                        <CredentialError>{error} </CredentialError>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                    <LoginButtonWrapper className="mb-5">
                        <Loginbutton type="submit" className="btn btn-login">
                            {convertByLang('دخول', 'Login')}
                        </Loginbutton>
                    </LoginButtonWrapper>

                    <ForgotPasswordWrapper
                        onClick={() => setShowForgotPassword(!showForgotPassword)}
                    >
                        <a className="forgot-password-link">
                            {convertByLang('نسيت كلمة السر؟', 'Forgot your password?')}
                        </a>
                    </ForgotPasswordWrapper>
                </LoginCredentialsWrapper>
            </LoginWrapper>
            <br />
            {showForgotPassword ? (
                <ForgotPassword lang={lang}></ForgotPassword>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </div>
    );
};
