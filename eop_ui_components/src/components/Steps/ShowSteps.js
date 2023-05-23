import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { GrFormAdd } from 'react-icons/gr';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const ShowSteps = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [stepData, setStepData] = useState([]);
    const [category_data, setcategory] = useState('');
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        show();
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
    const show = () => {
        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        setcategory(tempID);
        Axios.get('/api/eop_show_steps/' + tempID, {}).then((res) => {
            console.log('--res--');
            console.log(res);
            console.log('--res.data--');
            console.log(res.data);
            let ary = [];
            if (res.data.find_data) {
                res.data.find_data.forEach((row) => {
                    ary.push(row);
                });
                console.log('--ary--');
                console.log(ary);
                setStepData(ary);
            } else {
                console.log('--empty--');
                setStepData([]);
            }
        });
    };
    console.log(stepData);

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <table className="table table-striped">
                        <thead className="table-primary">
                            <tr>
                                <th scope="col">Category Step #</th>
                                <th scope="col">Category Name</th>
                                <th scope="col">Step Description</th>
                                {rolePermissions.find(
                                    (x) =>
                                        x.role_permissions.resource_id ===
                                        '625be7c9c8f16c4898721de5'
                                ) ? (
                                    <th scope="col">Action</th>
                                ) : (
                                    ''
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {stepData &&
                                stepData.map((stepdata, index) => {
                                    console.log('--stepdata--');
                                    console.log(stepData);
                                    let data =
                                        stepdata.step_number ||
                                        stepdata.category ||
                                        stepdata.entry_user;
                                    return data ? (
                                        <tr key={stepdata._id}>
                                            <td>{stepdata.step_number}</td>
                                            <td>{stepdata.category[0].category_name}</td>
                                            <td>{stepdata.step_description}</td>
                                            {rolePermissions.find(
                                                (x) =>
                                                    x.role_permissions.resource_id ===
                                                    '625be7c9c8f16c4898721de5'
                                            ) ? (
                                                <td>
                                                    <a
                                                        className="btn btn-primary"
                                                        href={
                                                            '/' +
                                                            lang.langKey +
                                                            '/update-step#' +
                                                            stepdata.items[0].step_id
                                                        }
                                                    >
                                                        <span className="input-group-btn">
                                                            <FaEdit size={25} />
                                                        </span>
                                                    </a>
                                                </td>
                                            ) : (
                                                ''
                                            )}
                                        </tr>
                                    ) : (
                                        ''
                                    );
                                })}
                        </tbody>
                    </table>
                    {rolePermissions.find(
                        (x) => x.role_permissions.resource_id === '625be845c8f16c4898721e33'
                    ) ? (
                        <a
                            className="input-group-btn btn btn-primary"
                            href={'/' + lang.langKey + '/add-workflow-step#' + category_data}
                        >
                            Add New Step
                        </a>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
