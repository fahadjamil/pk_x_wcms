import Axios from 'axios';
import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import BannersPageComponent from '../../banners/BannersPageComponent';
import FormsPageComponent from '../../forms/FormsPageComponent';
import DocumentsPageComponent from '../../custom-collections/DocumentsPageComponent';
import DashboardPageComponent from '../../dashboard/DashboardPageComponent';
import MenuPageComponent from '../../menus/MenuPageComponent';
import SitePageComponent from '../../pages';
import PublishPageComponent from '../../releases/PublishPageComponent';
import SettingsPageComponent from '../../settings/SettingsPageComponent';
import TemplatesPageComponent from '../../templates/TemplatesPageComponent';
import UserPermissionPageComponent from '../../users/UserPermissionPageComponent';
import AddSiteComponent from '../../websites/AddSiteComponent';
import WorkflowPageComponent from '../../workflows/WorkflowPageComponent';
import UserModel from '../models/UserModel';
import MasterRepository from '../repository/MasterRepository';
import SideNavComponent from './SideNavComponent';
import { connect } from 'react-redux';
import { isEnable } from '../utils/AuthorizationUtils';

function MasterTemplate(props) {
    const history = useHistory();

    useEffect(() => {
        getAllMasterData();
        getCmsUsers();
    }, []);

    function getAllMasterData() {
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
        };

        Axios.get('/api/master-data', httpHeaders)
            .then((result) => {
                if (result && result.data && result.data[0].workflows) {
                    MasterRepository.setWorkFlowList(result.data[0].workflows);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getCmsUsers() {
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
        };

        Axios.get('/api/users', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    const allUsers: UserModel[] = result.data.map((userItem) => {
                        const user: UserModel = {
                            docId: userItem._id,
                            userName: userItem.userName,
                        };

                        return user;
                    });

                    MasterRepository.setallCmsUsers(allUsers);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="">
                <SideNavComponent />
                <div className="root__container">
                    <Switch>
                        <Route
                            exact
                            path="/add"
                            render={() => {
                                if (!isEnable('Add') && MasterRepository.getCurrentUser()) {
                                    return <AddSiteComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/pages"
                            render={() => {
                                if (!isEnable('Pages') && MasterRepository.getCurrentUser()) {
                                    return <SitePageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route exact path="/dashboard">
                            {' '}
                            <DashboardPageComponent />
                        </Route>
                        {/* <Route
                            exact
                            path="/dashboard"
                            render={() => {
                                if (!isEnable('Dashboard') && MasterRepository.getCurrentUser()) {
                                    return <DashboardPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route> */}
                        <Route
                            exact
                            path="/templates"
                            render={() => {
                                if (!isEnable('Templates') && MasterRepository.getCurrentUser()) {
                                    return <TemplatesPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/menu"
                            render={() => {
                                if (!isEnable('Menu') && MasterRepository.getCurrentUser()) {
                                    return <MenuPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/documents"
                            render={() => {
                                if (!isEnable('Documents') && MasterRepository.getCurrentUser()) {
                                    return <DocumentsPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/settings"
                            render={() => {
                                if (!isEnable('Settings') && MasterRepository.getCurrentUser()) {
                                    return <SettingsPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/users"
                            render={() => {
                                if (!isEnable('Users') && MasterRepository.getCurrentUser()) {
                                    return <UserPermissionPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/workflow"
                            render={() => {
                                if (!isEnable('Workflow') && MasterRepository.getCurrentUser()) {
                                    return <WorkflowPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/publish"
                            render={() => {
                                if (!isEnable('Publish') && MasterRepository.getCurrentUser()) {
                                    return <PublishPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/banners"
                            render={() => {
                                if (!isEnable('Banners') && MasterRepository.getCurrentUser()) {
                                    return <BannersPageComponent />;
                                } else {
                                    history.push('/');
                                }
                            }}
                        ></Route>
                        <Route
                            exact
                            path="/forms"
                            render={() => {
                                //TODO: Permissions handling
                                return <FormsPageComponent />;
                                // if (!isEnable('Forms') && MasterRepository.getCurrentUser()) {
                                //     return <FormsPageComponent />;
                                // } else {
                                //     history.push('/');
                                // }
                            }}
                        ></Route>
                    </Switch>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(MasterTemplate);
