import Axios from 'axios';
import React, {useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserModel from '../shared/models/UserModel';
import MasterRepository from '../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';

export default function ActiveDirectoryLogoutComponent() {
    

    return (


        <div className="ad-login__container">
            <div className="ad-login">
                <div className="alert alert-success border-0 p-4" role="alert">
                    <h4 className="alert-heading">Logged Out Successfully </h4>
                    <p>Succefully Logout from Content Management System</p>
                    <hr/>
                    <div className="text-right">
                        <a href="/"
                           className="btn btn-primary mr-2"
                           role="button"
                           data-bs-toggle="button">
                            Login
                        </a>
                        {/* <a href="/login-ad"
                           className="btn btn-primary"
                           role="button"
                           data-bs-toggle="button">
                            Login-AD
                        </a> */}
                    </div>
                    {/* <div className="text-right">
                        
                    </div> */}
                </div>
            </div>
        </div>

        
    );
}