import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BiErrorAlt } from 'react-icons/bi';
import { BsFillHandThumbsUpFill } from 'react-icons/bs';
import { eopUserLogIn } from '../../config/path';
import Cookies from 'universal-cookie/es6';
import { EMAIL_COOKIE, LOGIN_ID_COOKIE, NAME_COOKIE, SESSION_COOKIE, ADMIN_EMAIL_COOKIE, ADMIN_LOGIN_ID_COOKIE, ADMIN_NAME_COOKIE, ADMIN_SESSION_COOKIE } from '../../config/constants';

import toast, { Toaster } from 'react-hot-toast';

export const Login = (props) => {
    const { lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const login = (e) => {
        e.preventDefault();

        var user_email = e.target.elements.email.value;
        var user_password = e.target.elements.password.value;

        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/auth/eop_user_login',
                    {
                        email: user_email,
                        password: user_password,
                        //_csrf: response.data.csrfToken,
                    },
                    {
                        headers: {
                            // 'csrf-token': response.data.csrfToken,
                            // 'xsrf-token': response.data.csrfToken,
                            // 'x-csrf-token': response.data.csrfToken,
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        const cookies = new Cookies();

                        cookies.remove(ADMIN_EMAIL_COOKIE, { path: '/' });
                        cookies.remove(ADMIN_LOGIN_ID_COOKIE, { path: '/' });
                        cookies.remove(ADMIN_NAME_COOKIE, { path: '/' });
                        cookies.remove(ADMIN_SESSION_COOKIE, { path: '/' });

                        cookies.set(SESSION_COOKIE, res.data.sessionId, {
                            path: '/',
                            maxAge: 86400,
                        });
                        cookies.set(LOGIN_ID_COOKIE, res.data.user_data.formsResults._id, {
                            path: '/',
                            maxAge: 86400,
                        });
                        cookies.set(EMAIL_COOKIE, res.data.user_data.formsResults.email, {
                            path: '/',
                            maxAge: 86400,
                        });
                        cookies.set(
                            NAME_COOKIE,
                            `${res.data.user_data.formsResults.first_name} ${res.data.user_data.formsResults.last_name}`,
                            { path: '/', maxAge: 86400 }
                        );
                        toast.success(res.data.message);
                        window.location = `/${lang.langKey}/`;
                    } else {
                        toast.error(res.data.message);
                    }
                });
            }
        });
    };

    return (
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <form method='post' onSubmit={login}>
                        <div className="card shadow" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5 text-center">
                                <h3 className="mb-5">Sign in</h3>

                                <div className="form-group mb-4 text-left">
                                    <label for="email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Email"
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group mb-4 text-left">
                                    <label for="password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <button className="btn btn-primary btn-lg btn-block" type="submit">
                                    Login
                                </button>
                                <br />
                                <a
                                    className="btn btn-lg btn-block btn-outline-secondary"
                                    href={'/' + lang.langKey + '/registration'}
                                >
                                    New user? Register Now
                                </a>
                                <br/>
                                <a
                                    className="btn btn-lg btn-block btn-outline-secondary"
                                    href={'/' + lang.langKey + '/forgot_password'}
                                >
                                    Forgot Password
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
