import React from 'react';
import { ADMIN_FUNCTION_LOGOUT, ADMIN_LOGIN_ID_COOKIE, ADMIN_NAME_COOKIE } from '../../config/constants';
import Cookies from 'universal-cookie/es6';
import {ImExit} from 'react-icons/im';

export const AdminLogout = (props) => {
    const { lang } = props;
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    let userName = cookies.get(ADMIN_NAME_COOKIE);

    return (
        login_cookie ? (
            <div className='text-right align-bottom'>
                <span>{userName}</span>&nbsp;&nbsp;<button className="btn btn-danger" onClick={() => { ADMIN_FUNCTION_LOGOUT(props) }}><ImExit/>&nbsp;Logout</button>
            </div>
        ) : ('')
    );
};
