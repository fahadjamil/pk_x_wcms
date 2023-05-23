import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopAddRolePermissions } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import { AiFillDelete, AiFillSave, AiOutlineLeft, AiFillLeftCircle } from 'react-icons/ai';

export const RolePermission = (props) => {

    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [userRole, setUserRole] = useState('');
    const [pages, setPages] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [resources, setResources] = useState([]);
    const [previousData, setPreviousData] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {

        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);

        let hashValue = window.location.hash;
        let roleId = hashValue.substring(1);

        let role_data, permission_data, resource_data, categories_data;
        Axios.get('/api/eop_single_role_listing/' + roleId, {}).then((res) => {
            console.log('--eop_single_role_listing--');
            console.log(res);
            role_data = res.data.find_data;

            Axios.get('/api/eop_get_permissions', {}).then((res) => {
                console.log('--eop_get_permissions--');
                console.log(res);
                permission_data = res.data.permissions;

                Axios.get('/api/eop_get_resources', {}).then((res) => {
                    console.log('--eop_get_resources--');
                    console.log(res);
                    resource_data = res.data.Resources;

                    Axios.get('/api/eop_show_categories_admin', {}).then((res) => {
                        console.log('--eop_show_categories_admin--');
                        console.log(res);
                        categories_data = res.data.user_data.showCategories;

                        Axios.get('/api/eop_show_role_permissions/' + roleId, {}).then((res) => {
                            console.log('--eop_show_role_permissions--');
                            console.log(res);
                            setPreviousData(res.data.permission_data);
                            setUserRole(role_data);
                            setPermissions(permission_data);
                            setResources(resource_data);
                            setCategories(categories_data);
                        });
                    });

                });
            });
        });
    }, []);

    const updatePermissions = (e) => {

        e.preventDefault();
        // console.log('--e.target.elements--');
        // console.log(e.target.elements);

        var permissionsData = [];
        for (let j = 0; j < permissions.length; j++) {
            for (let i = 0; i < resources.length; i++) {
                console.log(document.getElementById('check_' + permissions[j]._id + resources[i]._id));
                console.log(document.getElementById('check_' + permissions[j]._id + resources[i]._id).checked);
                if (document.getElementById('check_' + permissions[j]._id + resources[i]._id).checked) {
                    permissionsData.push({
                        role_id: userRole._id,
                        resource_id: resources[i]._id,
                        type: 'resource',
                        permission_id: permissions[j]._id,
                    });
                }
            }
        }

        console.log('--permissionsData--');
        console.log(permissionsData);

        var categoriesData = [];
        for (let j = 0; j < permissions.length; j++) {
            for (let i = 0; i < categories.length; i++) {
                console.log(document.getElementById('check_' + permissions[j]._id + categories[i]._id));
                console.log(document.getElementById('check_' + permissions[j]._id + categories[i]._id).checked);
                if (document.getElementById('check_' + permissions[j]._id + categories[i]._id).checked) {
                    categoriesData.push({
                        role_id: userRole._id,
                        resource_id: categories[i]._id,
                        type: 'category',
                        permission_id: permissions[j]._id,
                    });
                }
            }
        }

        console.log('--categoriesData--');
        console.log(categoriesData);

        let combinedPermissions = permissionsData.concat(categoriesData);

        console.log('--combinedPermissions--');
        console.log(combinedPermissions);


        if (combinedPermissions) {

            Axios.get('/getCSRFToken').then((response) => {

                if (response.data.csrfToken) {
                    Axios.post(
                        eopAddRolePermissions(),
                        {
                            item_data: JSON.stringify(combinedPermissions),
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
        } else {
            toast.error('No permissions changes found to update');
        }
    };

    return (
        <div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                {authorize ? (
                    <div>
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            toastOptions={{
                                duration: 5000,
                            }}
                        />
                        <form onSubmit={updatePermissions}>
                            {resources && userRole && permissions ? (
                                <div>
                                    <h5 className="mt-3 mb-2">
                                        <strong>Role:</strong> {userRole.role_name}
                                    </h5>
                                    <table className="table table-striped">
                                        <tbody>
                                            <tr>
                                                <td style={{ backgroundColor: '#006622', color: '#fff' }} colSpan={permissions.length + 1}>General Permissions</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#bbb' }} scope="col">Resource Name</td>
                                                {permissions &&
                                                    permissions.map((permission, index) => {
                                                        return <td style={{ backgroundColor: '#bbb' }} scope="col">{permission.name}</td>;
                                                    })}
                                            </tr>
                                            {resources &&
                                                resources.map((resource, index) => {
                                                    let data = resource.name || resource.desc;

                                                    return data ? (
                                                        <tr key={resource._id}>
                                                            <td>{resource.name}</td>
                                                            {permissions &&
                                                                permissions.map((permission, index) => {
                                                                    let document;
                                                                    if (previousData) {
                                                                        document = previousData.find(
                                                                            (x) =>
                                                                                x.permission_id ===
                                                                                permission._id &&
                                                                                x.resource_id ===
                                                                                resource._id
                                                                        );
                                                                    }
                                                                    return (
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={
                                                                                    'check_' +
                                                                                    permission._id +
                                                                                    resource._id
                                                                                }
                                                                                value={permission._id}
                                                                                defaultChecked={
                                                                                    document ? true : ''
                                                                                }
                                                                            />
                                                                        </td>
                                                                    );
                                                                })}
                                                        </tr>
                                                    ) : (
                                                        ''
                                                    );
                                                })}
                                            <tr>
                                                <td colSpan={permissions.length + 1}>&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#006622', color: '#fff' }} colSpan={permissions.length + 1}>Category Permissions</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#bbb' }}>Category Name</td>
                                                {permissions &&
                                                    permissions.map((permission, index) => {
                                                        return <td style={{ backgroundColor: '#bbb' }} scope="col">{permission.name}</td>;
                                                    })}

                                            </tr>
                                            {categories &&
                                                categories.map((category, index) => {
                                                    let data = category._id || category.category_name;
                                                    return data ? (
                                                        <tr key={category._id}>
                                                            <td>{category.category_name}</td>
                                                            {permissions &&
                                                                permissions.map((permission, index) => {
                                                                    let document;
                                                                    if (previousData) {
                                                                        document = previousData.find((x) => x.permission_id === permission._id && x.resource_id === category._id);
                                                                    }
                                                                    return (
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={
                                                                                    'check_' +
                                                                                    permission._id +
                                                                                    category._id
                                                                                }
                                                                                value={permission._id}
                                                                                defaultChecked={document ? true : ''}
                                                                            />
                                                                        </td>
                                                                    );
                                                                })}
                                                        </tr>
                                                    ) : (
                                                        ''
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                    <a href={'/' + lang.langKey + '/role-listing'} className="btn btn-lg btn-secondary mt-4">
                                        <AiFillLeftCircle size={25} />&nbsp;Go Back
                                    </a>
                                    <button type="submit" className="btn btn-lg btn-primary float-right mt-4">
                                        <AiFillSave size={25} />&nbsp;Save Changes
                                    </button>
                                </div>
                            ) : (
                                ''
                            )}
                        </form>
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
