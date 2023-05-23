import Axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { IconResourcesMap } from 'ui-components';
import masterRepositoryInstance from '../repository/MasterRepository';
import UserProfileIcon from '../resources/UserProfileIcon';
import LogoutIcon from '../resources/LogoutIcon';
import { getAuthorizationHeader } from '../utils/AuthorizationUtils';

function TopPanel(props) {
    let UserIcon: any = IconResourcesMap['userIcon'];

    const page = props.page;

    const history = useHistory();

    function logout() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const httpHeaders = {
        //     params: {},
        // };
        Axios.get('/api/users/logout', httpHeaders)
            .then((response) => {
                sessionStorage.clear();
                history.push('/');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="toppanel">
                <div className="row">
                    <div className="col-md-6 text-left">
                        <div className="toppanel__breadcrumb"></div>
                        <span>{page}</span>
                    </div>

                    <div className="col-md-6 text-right">
                        
                        <span className="user-profile-name mr-3">{masterRepositoryInstance.getCurrentUser().userName}</span>
                        <span className="user-profile mr-3 clickable-01">
                            <UserProfileIcon width="24" height="24" />
                        </span>
                        <span className="logout-cms mr-3 clickable-01" onClick={() => logout()} >
                            <LogoutIcon width="24" height="24" />
                        </span>

                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        page: state.pageName.page,
    };
};

export default connect(mapStateToProps)(TopPanel);
