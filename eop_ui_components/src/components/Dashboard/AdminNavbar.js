import React, { useEffect, useState } from 'react';
import { AiOutlineDashboard } from 'react-icons/ai';
import Axios from 'axios';
import { BiEdit } from 'react-icons/bi';
import { TiTicket } from 'react-icons/ti';
import { ImStack } from 'react-icons/im';
import { BsStack, BsDot, BsInbox } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { HiDocumentReport } from 'react-icons/hi';
import { CgIfDesign } from 'react-icons/cg';
import { AiOutlineCodepen } from 'react-icons/ai';
import { GrCertificate } from 'react-icons/gr';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';

export const AdminNavbar = (props) => {
    const { lang } = props;
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [inboxCount, setInboxCount] = useState('');
    useEffect(() => {
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
        Axios.get('/api/eop_myInbox_count/' + login_cookie, {}).then((res) => {
            console.log('res.data.myInbox_count');
            console.log(res.data.myInbox_count);
            setInboxCount(res.data.myInbox_count);
            console.log("inboxCount");
            console.log(inboxCount);
        });
    }, []); //useEffectmyzz

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto pr-0">
                    <div className="d-flex flex-column align-items-center align-items-sm-start h-100">
                        <ul
                            className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                            id="menu"
                        >
                            <li className="text-white">
                                <a
                                    href={'/' + lang.langKey + '/dashboard'}
                                    className="nav-link px-0 align-middle"
                                >
                                    <AiOutlineDashboard size={25} /> <span>Dashboard</span>
                                </a>
                            </li>
                            <li className="text-white">
                                <a
                                    href={'/' + lang.langKey + '/inbox'}
                                    className="nav-link px-0 align-middle"
                                >
                                    <BsInbox size={25} /> <span>My Inbox </span><span class="badge badge-pill badge-danger">{inboxCount}</span>
                                </a>
                            </li>
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '62f4c25138720939db01c767'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={'/' + lang.langKey + '/vouchers_list'}
                                        className="nav-link px-0 align-middle"
                                    >
                                        <TiTicket size={25} /> <span>Voucher Listing</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625e9a6ac8f16c48987385ee'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={'/' + lang.langKey + '/submitted-applications-list'}
                                        className="nav-link px-0 align-middle"
                                    >
                                        <BiEdit size={25} /> <span>Applications</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '62498fa9c8f16c48984a2800'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={'/' + lang.langKey + '/category-listing'}
                                        className="nav-link px-0 align-middle"
                                    >
                                        <ImStack size={25} /> <span>Categories</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bbfe9c8f16c48987199b6'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={'/' + lang.langKey + '/admin-user-listing'}
                                        className="nav-link px-0 align-middle"
                                    >
                                        <FiUsers size={25} /> <span>Admin Users</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bc2d2c8f16c489871a39c'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={'/' + lang.langKey + '/registered-users'}
                                        className="nav-link px-0"
                                    >
                                        <HiUsers size={25} />
                                        <span className="d-none d-sm-inline">Registered Users</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bc084c8f16c4898719bce'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={'/' + lang.langKey + '/role-listing'}
                                        className="nav-link px-0 align-middle"
                                    >
                                        <BsStack size={25} /> <span>Roles</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bc247c8f16c489871a1c4'
                            ) ? (
                                <li>
                                    <a
                                        href={'/' + lang.langKey + '/designation-listing'}
                                        className="nav-link px-0 align-middle"
                                    >
                                        <CgIfDesign size={25} /> <span>Designations</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625bc14dc8f16c4898719e7c'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={'/' + lang.langKey + '/department-listing'}
                                        className="nav-link px-0 align-middle"
                                    >
                                        <AiOutlineCodepen size={25} /> <span>Departments</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '62a5a55d38720939dbb12326'
                            ) ? (
                                <li className="text-white">
                                    <a
                                        href={
                                            '/' +
                                            lang.langKey +
                                            '/application-forms#6292233535aef500115646a1'
                                        }
                                        className="nav-link px-0 align-middle"
                                    >
                                        <GrCertificate size={25} /> <span>Death NOC</span>
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                            {rolePermissions.find(
                                (x) => x.role_permissions.resource_id === '625e9bcfc8f16c4898738984'
                            ) ? (
                                <li>
                                    <button
                                        data-toggle="collapse"
                                        data-target="#submenu4"
                                        className="nav-link px-0 align-middle"
                                        style={{ background: 'transparent', border: 'none' }}
                                    >
                                        <HiDocumentReport size={25} /> <span>Reports</span>
                                    </button>
                                    <ul className="collapse nav flex-column ms-1" id="submenu4" style={{ fontSize: '0.8em' }}>
                                        <li className="ml-2">
                                            <a
                                                href={'/' + lang.langKey + '/applications-report'}
                                                className="nav-link px-0"
                                            >
                                                <BsDot size={25} />
                                                <span className="d-none d-sm-inline">
                                                    Applications
                                                </span>
                                            </a>
                                        </li>
                                        <li className="ml-2">
                                            <a
                                                href={
                                                    '/' +
                                                    lang.langKey +
                                                    '/application-progress-status'
                                                }
                                                className="nav-link px-0"
                                            >
                                                <BsDot size={25} />
                                                <span className="d-none d-sm-inline">
                                                    Application Status
                                                </span>
                                            </a>
                                        </li>
                                        <li className="ml-2">
                                            <a
                                                href={
                                                    '/' +
                                                    lang.langKey +
                                                    '/applications-report-category-wise'
                                                }
                                                className="nav-link px-0"
                                            >
                                                <BsDot size={25} />
                                                <span className="d-none d-sm-inline">
                                                    Application (Category Wise)
                                                </span>
                                            </a>
                                        </li>
                                        <li className="ml-2">
                                            <a
                                                href={
                                                    '/' +
                                                    lang.langKey +
                                                    '/css_track_and_monitor_report'
                                                }
                                                className="nav-link px-0"
                                            >
                                                <BsDot size={25} />
                                                <span className="d-none d-sm-inline">
                                                    CSS Track And Monitor
                                                </span>
                                            </a>
                                        </li>
                                        {rolePermissions.find(
                                            (x) =>
                                                x.role_permissions.resource_id ===
                                                '62a5a55d38720939dbb12326'
                                        ) ? (
                                            <li className="ml-2">
                                                <a
                                                    href={'/' + lang.langKey + '/death_noc_report'}
                                                    className="nav-link px-0"
                                                >
                                                    <BsDot size={25} />
                                                    <span className="d-none d-sm-inline">
                                                        Death NOC Report
                                                    </span>
                                                </a>
                                            </li>
                                        ) : (
                                            ''
                                        )}
                                    </ul>
                                </li>
                            ) : (
                                ''
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
