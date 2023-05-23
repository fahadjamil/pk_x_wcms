import { getAuthorizationHeader, isEnable } from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './SitePermissionComponent.css';

export default function AddPermissionComponent(props) {
    const [menus, setMenu] = useState([]);
    const [customCollections, setCustomCollection] = useState([]);
    const [roles, setRole] = useState([]);

    let customCollectionType = '';

    useEffect(() => {
        getAllRole();
        getAllMenu();
        getCustomCollection();
    }, [props.website]);

    function getAllMenu() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.get('/api/menus', httpHeaders)
            .then((result) => {
                setMenu(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getCustomCollection() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.get('/api/custom-collections', httpHeaders)
            .then((result) => {
                setCustomCollection(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllRole() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.get('/api/sites/roles', httpHeaders)
            .then((result) => {
                setRole(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function saveMenu() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.post('/api/menus/save', menus, httpHeaders)
            .then((result) => {
                //popup
            })
            .catch((err) => {
                console.log(err);
            });

        Axios.post('/api/custom-collections/save', customCollections, httpHeaders)
            .then((result) => {})
            .catch((err) => {
                console.log(err);
            });
    }

    const updateMainMenu = (menuTypeIndex, mainIndex, role) => {
        let newMenus = [...menus];
        let indexOfRoleId = menus[menuTypeIndex].menu[mainIndex].roles.indexOf(role.id);

        if (indexOfRoleId !== -1) {
            newMenus[menuTypeIndex].menu[mainIndex].roles.splice(indexOfRoleId, 1);
        } else {
            newMenus[menuTypeIndex].menu[mainIndex].roles.push(role.id);
        }

        setMenu(newMenus);
    };

    const updateSubSection = (menuTypeIndex, mainIndex, subSectionIndex, role) => {
        let newMenus = [...menus];
        let indexOfRoleId = newMenus[menuTypeIndex].menu[mainIndex].subLinks[
            subSectionIndex
        ].roles.indexOf(role.id);

        if (indexOfRoleId !== -1) {
            newMenus[menuTypeIndex].menu[mainIndex].subLinks[subSectionIndex].roles.splice(
                indexOfRoleId,
                1
            );
        } else {
            newMenus[menuTypeIndex].menu[mainIndex].subLinks[subSectionIndex].roles.push(role.id);
        }

        setMenu(newMenus);
    };

    const updateSubLink = (menuTypeIndex, mainIndex, subSectionIndex, subLinkIndex, role) => {
        let newMenus = [...menus];
        let indexOfRoleId = newMenus[menuTypeIndex].menu[mainIndex].subLinks[
            subSectionIndex
        ].subLinks[subLinkIndex].roles.indexOf(role.id);

        if (indexOfRoleId !== -1) {
            newMenus[menuTypeIndex].menu[mainIndex].subLinks[subSectionIndex].subLinks[
                subLinkIndex
            ].roles.splice(indexOfRoleId, 1);
        } else {
            newMenus[menuTypeIndex].menu[mainIndex].subLinks[subSectionIndex].subLinks[
                subLinkIndex
            ].roles.push(role.id);
        }

        setMenu(newMenus);
    };

    const updateCustomComponent = (customIndex, role) => {
        let newCustomCollections = [...customCollections];
        let indexOfRoleId = customCollections[customIndex].roles.indexOf(role.id);

        if (indexOfRoleId !== -1) {
            customCollections[customIndex].roles.splice(indexOfRoleId, 1);
        } else {
            customCollections[customIndex].roles.push(role.id);
        }

        setCustomCollection(newCustomCollections);
    };

    const subLinkPermissions = (
        menuTypeIndex,
        subLink,
        mainIndex,
        subSectionIndex,
        subLinkIndex,
        subSection
    ) => {
        let key = menuTypeIndex + '-' + mainIndex + '-' + subSectionIndex + '-' + subLinkIndex;

        return (
            <React.Fragment key={'menuTypeIndex-' + menuTypeIndex + 'subLink-' + key}>
                <tbody>
                    <tr className="border_bottom">
                        <td className="col-md-6" scope="col">
                            <h5 className="subHeader">
                                {' '}
                                {subSection.name.en + ' / ' + subLink.name.en}
                            </h5>
                        </td>
                        {Array.isArray(roles) &&
                            roles.map((role, roleIndex) => {
                                return (
                                    <React.Fragment
                                        key={
                                            'menuTypeIndex-' +
                                            menuTypeIndex +
                                            'subLink-' +
                                            key +
                                            '-' +
                                            roleIndex
                                        }
                                    >
                                        <td scope="col">
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id={key + '-' + roleIndex}
                                                    data-onstyle="success"
                                                    checked={
                                                        menus[menuTypeIndex].menu[
                                                            mainIndex
                                                        ].subLinks[subSectionIndex].subLinks[
                                                            subLinkIndex
                                                        ].roles.indexOf(role.id) !== -1
                                                    }
                                                    onChange={(event) => {
                                                        updateSubLink(
                                                            menuTypeIndex,
                                                            mainIndex,
                                                            subSectionIndex,
                                                            subLinkIndex,
                                                            role
                                                        );
                                                    }}
                                                ></input>
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor={key + '-' + roleIndex}
                                                ></label>
                                            </div>
                                        </td>
                                    </React.Fragment>
                                );
                            })}
                    </tr>
                </tbody>
            </React.Fragment>
        );
    };

    const subSectionPermissions = (menuTypeIndex, subSection, mainIndex, subSectionIndex) => {
        let key = menuTypeIndex + '-' + mainIndex + '-' + subSectionIndex;

        return (
            <React.Fragment key={'menuTypeIndex-' + menuTypeIndex + 'subSection-' + key}>
                <tbody>
                    <tr>
                        <td className="col-md-6" scope="col">
                            <h5 className="subHeader"> {subSection.name.en}</h5>
                        </td>
                        {Array.isArray(roles) &&
                            roles.map((role, roleIndex) => {
                                return (
                                    <React.Fragment
                                        key={
                                            'menuTypeIndex-' +
                                            menuTypeIndex +
                                            'subSection-' +
                                            key +
                                            '-' +
                                            roleIndex
                                        }
                                    >
                                        <td scope="col">
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id={key + '-' + roleIndex}
                                                    data-onstyle="success"
                                                    checked={
                                                        menus[menuTypeIndex].menu[
                                                            mainIndex
                                                        ].subLinks[subSectionIndex].roles.indexOf(
                                                            role.id
                                                        ) !== -1
                                                    }
                                                    onChange={(event) => {
                                                        updateSubSection(
                                                            menuTypeIndex,
                                                            mainIndex,
                                                            subSectionIndex,
                                                            role
                                                        );
                                                    }}
                                                ></input>
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor={key + '-' + roleIndex}
                                                ></label>
                                            </div>
                                        </td>
                                    </React.Fragment>
                                );
                            })}
                    </tr>
                </tbody>
                {subSection.subLinks != null &&
                    subSection.subLinks.map((subLink, subLinkIndex) => {
                        return subLinkPermissions(
                            menuTypeIndex,
                            subLink,
                            mainIndex,
                            subSectionIndex,
                            subLinkIndex,
                            subSection
                        );
                    })}
            </React.Fragment>
        );
    };

    const mainMenuPermissions = (menuTypeIndex, mainMenu, mainIndex) => {
        let key = menuTypeIndex + '-' + mainIndex;

        return (
            <React.Fragment key={'menuTypeIndex-' + menuTypeIndex + 'mainMenu-' + mainIndex}>
                <tbody>
                    <tr className="table-active">
                        <td className="col" scope="col">
                            <h5 className="mainHeader">{mainMenu.name.en.toUpperCase()}</h5>
                        </td>
                        {Array.isArray(roles) &&
                            roles.map((role, roleIndex) => {
                                return (
                                    <React.Fragment
                                        key={
                                            'menuTypeIndex-' +
                                            menuTypeIndex +
                                            'mainMenu-' +
                                            key +
                                            '-' +
                                            roleIndex
                                        }
                                    >
                                        <td scope="col">
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id={key + '-' + roleIndex}
                                                    checked={menus[menuTypeIndex].menu[
                                                        mainIndex
                                                    ].roles.includes(role.id)}
                                                    onChange={(event) => {
                                                        updateMainMenu(
                                                            menuTypeIndex,
                                                            mainIndex,
                                                            role
                                                        );
                                                    }}
                                                ></input>
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor={key + '-' + roleIndex}
                                                ></label>
                                            </div>
                                        </td>
                                    </React.Fragment>
                                );
                            })}
                    </tr>
                </tbody>
                {mainMenu.subLinks &&
                    mainMenu.subLinks.map((subSection, subSectionIndex) => {
                        return subSectionPermissions(
                            menuTypeIndex,
                            subSection,
                            mainIndex,
                            subSectionIndex
                        );
                    })}
            </React.Fragment>
        );
    };

    return (
        <>
            <div className={('container', 'table')} key="0">
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <tbody className="w-100">
                        <tr>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={isEnable('/api/menus/save')}
                                    onClick={() => saveMenu()}
                                >
                                    Save
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th scope="col">
                                <h2 className="header">Menus</h2>
                            </th>
                            {Array.isArray(roles) &&
                                roles.map((role, roleIndex) => {
                                    return (
                                        <React.Fragment key={roleIndex + 'header'}>
                                            <th scope="col">
                                                <h6>{role.name.toUpperCase()}</h6>
                                            </th>
                                        </React.Fragment>
                                    );
                                })}
                        </tr>
                    </thead>
                    {Array.isArray(menus) &&
                        menus.map((data, menuTypeIndex) => {
                            let menuType;
                            if (menuTypeIndex === 0) {
                                menuType = 'Main Menu';
                            } else {
                                menuType = 'Footer Menu';
                            }
                            {
                                return (
                                    <React.Fragment key={menuTypeIndex}>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <h2 className="header">{menuType}</h2>
                                                </th>
                                            </tr>
                                        </thead>
                                        {data.menu.map((mainMenu, mainIndex) => {
                                            return mainMenuPermissions(
                                                menuTypeIndex,
                                                mainMenu,
                                                mainIndex
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            }
                        })}
                    <thead>
                        <tr>
                            <th>
                                <h2 className="header">Features</h2>
                            </th>
                            {Array.isArray(roles) &&
                                roles.map((role, roleIndex) => {
                                    return (
                                        <React.Fragment key={roleIndex + 'Features'}>
                                            <th></th>
                                        </React.Fragment>
                                    );
                                })}
                        </tr>
                    </thead>

                    {customCollections.map((customCollection, customIndex) => {
                        return (
                            <React.Fragment key={customIndex + 'custom'}>
                                {(() => {
                                    if (
                                        customCollectionType === '' ||
                                        customCollectionType !== customCollection.collectionType
                                    ) {
                                        customCollectionType = customCollection.collectionType;
                                        return (
                                            <tbody>
                                                <tr className="table-active">
                                                    <td>
                                                        <h5 className="mainHeader">
                                                            {customCollectionType.toUpperCase()}
                                                        </h5>
                                                    </td>
                                                    {Array.isArray(roles) &&
                                                        roles.map((role, roleIndex) => {
                                                            return (
                                                                <React.Fragment
                                                                    key={
                                                                        roleIndex +
                                                                        customCollectionType
                                                                    }
                                                                >
                                                                    <td></td>
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                </tr>
                                            </tbody>
                                        );
                                    }
                                })()}
                                <tbody>
                                    <tr>
                                        <td className="col" scope="col">
                                            <h5 className="subHeader">
                                                {customCollection.menuName}
                                            </h5>
                                        </td>
                                        {Array.isArray(roles) &&
                                            roles.map((role, roleIndex) => {
                                                let key = customIndex + '-' + roleIndex;
                                                return (
                                                    <React.Fragment key={key + 'custom'}>
                                                        <td scope="col">
                                                            <div className="custom-control custom-switch">
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    id={key + 'custom'}
                                                                    data-onstyle="success"
                                                                    checked={customCollections[
                                                                        customIndex
                                                                    ].roles.includes(role.id)}
                                                                    onChange={(event) => {
                                                                        updateCustomComponent(
                                                                            customIndex,
                                                                            role
                                                                        );
                                                                    }}
                                                                ></input>
                                                                <label
                                                                    className="custom-control-label"
                                                                    htmlFor={key + 'custom'}
                                                                ></label>
                                                            </div>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </tr>
                                </tbody>
                            </React.Fragment>
                        );
                    })}

                </table>
            </div>
        </>
    );
}
