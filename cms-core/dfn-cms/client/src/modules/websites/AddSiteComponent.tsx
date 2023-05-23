import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DarkTheme, LightTheme } from 'themes';
import { selectWebsite } from '../redux/action';
// import cmsContentOperations from '../shared/config/CmsContentOperations.json';
// import cmsRoleCounter from '../shared/config/CmsRoleCounter.json';
// import cmsUserFeature from '../shared/config/CmsUserFeature.json';
// import cmsUserRole from '../shared/config/CmsUserRole.json';
import footerMenu from '../shared/config/FooterMenu.json';
import mainMenu from '../shared/config/MainMenu.json';
import roleCounter from '../shared/config/RoleCounter.json';
import workflowConfig from '../shared/config/WorkflowConfig.json';
import MasterRepository from '../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';

export default function AddSiteComponent(props) {
    const [siteName, setSiteName] = useState('');
    const history = useHistory();
    const dispatch = useDispatch();
    const inputElement = useRef<any>(null);

    useEffect(() => {
        if (inputElement.current) {
            inputElement.current.focus();
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        // const jwt = localStorage.getItem('jwt-token');
        const databaseName = generateDbName(siteName);
        //this one have to remove after implement authentication
        const userId = MasterRepository.getCurrentUser();
        console.log("================="+JSON.stringify(userId));
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/websites/create',
            {
                website: {
                    name: siteName,
                    databaseName: databaseName,
                },
                themes: [LightTheme],
                workflows: workflowConfig,
                mainMenu: mainMenu,
                footerMenu: footerMenu,
                roleCounter: roleCounter,
                languages: [{ language: 'English', langKey: 'en', direction: 'ltr' }],
                username: userId.userName,
                homePage: {
                    id: '',
                    pageName: '',
                },
                version: 1,
            },
            httpHeaders
        )
            .then((response) => {
                console.log('ops conn' + JSON.stringify(response.data.data.ops));
                if (
                    response &&
                    response.data &&
                    response.data.data &&
                    response.data.data.ops &&
                    response.data.data.ops.length > 0
                ) {
                    dispatch(selectWebsite(response.data.data.ops[0]));
                }
                props.onSubmit();
                history.push('/pages');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function generateDbName(name) {
        return name.replace(/ /g, '-').toLowerCase();
    }

    return (
        <>
            <div
                style={{
                    width: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '50px',
                }}
            >
                {/* <form onSubmit={handleSubmit}> */}
                <form>
                    <div className="form-group">
                        <label htmlFor="website">Create new website &nbsp;</label>
                        <br />
                        <input
                            type="text"
                            className="form-control"
                            id="website"
                            placeholder="Enter Website name"
                            value={siteName}
                            ref={inputElement}
                            onChange={(e) => setSiteName(e.target.value)}
                        />
                    </div>
                    <br />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        data-dismiss="modal"
                        onClick={handleSubmit}
                    >
                        Create
                    </button>
                </form>
            </div>
        </>
    );
}
