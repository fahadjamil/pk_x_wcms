import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';

export const ForgotPassword = (props) => {
    const { lang } = props;

    const Forgot = (e) => {
        e.preventDefault();

        var user_email = e.target.elements.email.value;

        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/auth/eop_forgot_password',
                    {
                        email: user_email,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        toast.success(res.data.message);
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
                    <form onSubmit={Forgot}>
                        <div className="card shadow" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5 text-center">
                                <h3 className="mb-5">Forgot Password</h3>

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

                                <button className="btn btn-primary btn-lg btn-block" type="submit">
                                    Send Password
                                </button>
                                <br />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
