import React, { useEffect, useState } from 'react';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { ChartTable } from './ChartTable';
import { MyInbox } from './MyInbox';
import Axios from 'axios';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const AdminPortalDashboard = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        Axios.get('/api/eop_check_role_permission/' + login_cookie, {}).then((res) => {
            let ary = [];
            if (res.data.permission_data) {
                res.data.permission_data.forEach((row) => {
                    ary.push(row);
                });
                setRolePermissions(ary);
            } else {
                setRolePermissions([]);
            }
        });
    }, []);
    return (
        <div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                {authorize ? (
                    <div>
                        <div className="row">
                            {/* {rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '625bf20fc8f16c4898722676'
                        ) ? (
                            <div className="col-md-12 mb-4">
                                <MyInbox />
                            </div>
                        ) : (
                            ''
                        )} */}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bf23ac8f16c4898722689'
                            ) ? (
                                <div className="col-md-6">
                                    <PieChart />
                                </div>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bf25fc8f16c48987226a0'
                            ) ? (
                                <div className="col-md-6">
                                    <BarChart />
                                </div>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bf298c8f16c48987226c5'
                            ) ? (
                                <div className="col-md-12 mt-4">
                                    <ChartTable />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <AdminAuthorizationText langKey={lang.langKey} />
                    </div>
                )}
            </div>
            <div style={{ display: loading ? 'flex' : 'none' }} className="justify-content-center">
                <div
                    className="spinner-border"
                    style={{ width: '3rem', height: '3rem' }}
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
};
