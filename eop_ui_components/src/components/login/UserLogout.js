import React from 'react';
import { USER_FUNCTION_LOGOUT, LOGIN_ID_COOKIE, NAME_COOKIE } from '../../config/constants';
import Cookies from 'universal-cookie/es6';
import { ImExit } from 'react-icons/im';

export const UserLogout = (props) => {
    const { lang } = props;
    const cookies = new Cookies();
    let login_cookie = cookies.get(LOGIN_ID_COOKIE);
    let userName = cookies.get(NAME_COOKIE);

    return (
        login_cookie ? (
            <div className='text-right align-bottom'>
                <span>{userName}</span>&nbsp;&nbsp;<button className="btn btn-danger" onClick={() => { USER_FUNCTION_LOGOUT(props) }}><ImExit />&nbsp;Logout</button>
            </div>
        ) : ('')
    );
}