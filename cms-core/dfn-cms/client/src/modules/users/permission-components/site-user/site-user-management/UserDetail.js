import React from 'react';
import Axios from 'axios';
import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../../../../shared/utils/AuthorizationUtils';

function UserDetail(props) {
    const activateUser = (index) => {
        const headerParameter = { email: props.user.S02_LOGINNAME };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        Axios.get('/api/websites/user-management/activateUser', httpHeaders)
            .then((result) => {
                //update user
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const resetUser = (index) => {
        //pass user details to back end
    };

    return (
        <div className="search-user">
            {props.user.S02_USER_ID}
            {props.user.S02_USER_ID}
            {props.user.S02_LOGINNAME}
            {props.user.S01_FIRSTNAME}
            <button onClick={() => activateUser(props.index)}>Activate</button>
            <button onClick={() => resetUser(props.index)}>Reset</button>
        </div>
    );
}

export default UserDetail;
