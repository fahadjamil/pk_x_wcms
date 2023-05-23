import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { eopAdminUserLogIn } from '../../config/path';
import Cookies from 'universal-cookie/es6';
import {
    ADMIN_EMAIL_COOKIE,
    ADMIN_LOGIN_ID_COOKIE,
    ADMIN_NAME_COOKIE,
    ADMIN_SESSION_COOKIE,
    EMAIL_COOKIE,
    LOGIN_ID_COOKIE,
    NAME_COOKIE,
    SESSION_COOKIE,
} from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';

export const AdminLogin = (props) => {
    const { lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);

    useEffect(() => {
        //check for existing login session/cookie and redirect
        if (login_cookie) {
            window.location = `/${lang.langKey}/dashboard`;
        }
    }, []);

    const login = (e) => {

        e.preventDefault();
        
        var user_email = e.target.elements.email.value;
        var user_password = e.target.elements.password.value;

        Axios.get('/getCSRFToken').then((response) => {
            
            if (response.data.csrfToken) {
                
                Axios.post(eopAdminUserLogIn(), {
                    email: user_email,
                    password: user_password,
                }, {
                    headers: {
                        'x-xsrf-token': response.data.csrfToken,
                    },
                }).then((res) => {
                    // console.log(res);
                    if (res.data.status == 'success') {

                        cookies.remove(EMAIL_COOKIE, { path: '/' });
                        cookies.remove(LOGIN_ID_COOKIE, { path: '/' });
                        cookies.remove(NAME_COOKIE, { path: '/' });
                        cookies.remove(SESSION_COOKIE, { path: '/' });

                        cookies.set(ADMIN_SESSION_COOKIE, res.data.sessionId, {
                            path: '/',
                            maxAge: 86400,
                        });
                        cookies.set(ADMIN_LOGIN_ID_COOKIE, res.data.user_data._id, {
                            path: '/',
                            maxAge: 86400,
                        });
                        cookies.set(ADMIN_EMAIL_COOKIE, res.data.user_data.email, {
                            path: '/',
                            maxAge: 86400,
                        });
                        cookies.set(
                            ADMIN_NAME_COOKIE,
                            `${res.data.user_data.first_name} ${res.data.user_data.last_name}`,
                            { path: '/', maxAge: 86400 }
                        );

                        toast.success(res.data.message);
                        window.location = `/${lang.langKey}/dashboard`;
                    } else {
                        toast.error(res.data.message);
                    }

                });
            }
            else {
                toast.error(res.data.message);
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
                                <h3 className="mb-5">Admin Login</h3>

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
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};