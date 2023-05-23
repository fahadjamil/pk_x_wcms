import {getAuthorizationHeader, isEnable} from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import './MiddleMenuComponent.css';

export default function MenuSettingsComponent(params) {
    const [name, setName] = useState('');
    const [route, setRoute] = useState('');
    const [menuType, setMenuType] = useState('');
    const [externalLink, setExternalLink] = useState('');

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isExternalLink, setIsExternalLink] = useState(false);
    const [pages, setPages] = useState([]);
    const [roles, setRole] = useState([]);
    const [uniqueKey, setUniqueKey] = useState('');

    const menuPath = params.menuPath;
    let menuJson = params.singleMenuItem;
    if(menuJson && menuJson.extLinks === undefined){
        menuJson.extLinks = {}
    }

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            getAllRole();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            if(menuJson?.menuType === 'external-link'){
                updateInitialExtLink();
                setIsExternalLink(true)
            }else{
                setIsExternalLink(false) 
            }
        }

        return () => {
            isMounted = false;
        };
    }, [menuJson?.menuType]);

    function getAllRole() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: params.dbName,
        //     },
        // };

        Axios.get('/api/sites/roles', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setRole(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function inputChangedHandlerTitle(event, langKey) {
        event.preventDefault();
        let updatedKeyword = event.target.value;
        menuJson.name[langKey.toLowerCase()] = updatedKeyword;
        setName(updatedKeyword);
    }

    function inputChangedHandlerTitleAR(event) {
        event.preventDefault();
        let updatedKeyword = event.target.value;
        menuJson.name.ar = updatedKeyword;
        setName(updatedKeyword);
    }

    function inputChangedUpdateMenuType(event,langKey) {
        event.preventDefault();
        let updatedKeyword = event.target.value;
        menuJson.extLinks[langKey] = updatedKeyword;
        setExternalLink(updatedKeyword);
    }

    function inputChangedHandlerRoute(event) {
        event.preventDefault();
        let updatedKeyword = event.target.value;
        menuJson.path = updatedKeyword;
        setRoute(updatedKeyword);
    }

    function updateMenuPath(event) {
        event.preventDefault();
        let updatedKeyword = event.target.value;
        menuJson.menuType = updatedKeyword;
        setMenuType(updatedKeyword);
        if (event.target.value === 'external-link') {           
            updateInitialExtLink();
            setIsExternalLink(true);
        } else {
            setIsExternalLink(false);
        }
    }

    function updateInitialExtLink() {
        for(let i=0; i<params.supportLanguages.length;i++){
            let language = params.supportLanguages[i];
            let langKey = language.langKey.toLowerCase()
            if(menuJson.extLinks[langKey] === undefined || menuJson.extLinks[langKey] === ''){
                if(Object.keys(menuJson.extLinks).length === 0){
                    menuJson.extLinks[langKey] = menuJson.extLink
                    params.updateMenuCallback(menuJson);
                }
    
            }
        }
    }

    const updateRole = (roleId) => {
        let arrayIndex = menuJson.roles.indexOf(roleId);
        setUniqueKey(uuidv1());
        if (arrayIndex !== -1) {
            menuJson.roles.splice(arrayIndex, 1);
        } else {
            menuJson.roles.push(roleId);
        }
    };

    function deleteMenuItem(event, menuItem) {
        event.preventDefault();

        let deleteMenuItem = menuItem;
        menuJson = {};
    }

    if (menuJson && menuJson.name && menuJson.name.en) {
        return (
            <>
                <div className="card--thm--01 form--thm--01">
                    <div className="row">
                        <div className="col-md-12">
                            <h3>{menuJson.name.en}</h3>
                            {params.supportLanguages &&
                                params.supportLanguages.map((language, languageIndex) => {
                                    return (
                                        <div className="form-group" key={`${language.langKey}-${languageIndex}`}>
                                            <label>Title-{language.language}</label>
                                            <input
                                                placeholder={`Title-${language.langKey}`}
                                                className="form-control"
                                                value={
                                                    menuJson.name[language.langKey.toLowerCase()]?  menuJson.name[language.langKey.toLowerCase()] : ''
                                                }
                                                onChange={(event) =>
                                                    inputChangedHandlerTitle(
                                                        event,
                                                        language.langKey
                                                    )
                                                }
                                            ></input>
                                        </div>
                                    );
                                })}

                            <div className="form-group">
                                <label>Route</label>
                                <input
                                    className="form-control"
                                    placeholder="Path"
                                    value={menuPath}
                                    onChange={(event) => inputChangedHandlerRoute(event)}
                                ></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputState">Menu Type</label>
                                <select
                                    id="inputState"
                                    className="form-control"
                                    value={menuJson.menuType}
                                    onChange={(event) => {
                                        updateMenuPath(event);
                                    }}
                                >
                                    <option value="page">
                                        Page
                                    </option>
                                    <option value="inner-route">Inner Route</option>
                                    <option value="external-link">External Link</option>
                                </select>
                            </div>


                                
                            {isExternalLink &&  params.supportLanguages &&
                                params.supportLanguages.map((language, languageIndex) => {
                                    return (
                                        <div className="form-group" key={`${language.langKey}-${languageIndex}`}>
                                            <label>ExternalLink -{language.language}</label>
                                            <input
                                                placeholder={`ExternalLink-${language.langKey}`}
                                                className="form-control"
                                                value={menuJson.extLinks[language.langKey.toLowerCase()]?  menuJson.extLinks[language.langKey.toLowerCase()] : ''}
                                                onChange={(event) => inputChangedUpdateMenuType(event,language.langKey.toLowerCase())}
                                            ></input>
                                        </div>
                                    );
                            })}
                            {/* )} */}

                            <hr></hr>
                            <div>
                                <p>
                                    <a
                                        className="btn btn-outline-primary btn-sm dropdown-toggle"
                                        data-toggle="collapse"
                                        href="#collapseExample"
                                        role="button"
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                    >
                                        Permission
                                    </a>
                                </p>
                                <div className="collapse" id="collapseExample">
                                    <div className="card card-body-cms">
                                        <div className="form-row">
                                            {roles.map((role, index) => {
                                                return (
                                                    <React.Fragment key={`rolesNameGroup${index}`}>
                                                        <div className="form-group col-md-4 ">
                                                            <span
                                                                htmlFor="inputCity1"
                                                                className="lb-sm"
                                                            >
                                                                {role.name}
                                                            </span>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                        <div className="row">
                                            {roles.map((role, index) => {
                                                return (
                                                    <React.Fragment key={`roles${index}`}>
                                                        <div className="col-md-4">
                                                            <div className="custom-control custom-switch">
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    id={index}
                                                                    data-onstyle="success"
                                                                    checked={
                                                                        menuJson.roles.indexOf(
                                                                            role.id
                                                                        ) != -1
                                                                    }
                                                                    onChange={(event) => {
                                                                        updateRole(role.id);
                                                                    }}
                                                                ></input>
                                                                <label
                                                                    className="custom-control-label"
                                                                    htmlFor={index}
                                                                ></label>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {roles.map((role, index) => {
                                    if (menuJson.roles.indexOf(role.id) != -1) {
                                        return (
                                            <span key={index} className="badge badge-success mr-2">
                                                {role.name}
                                            </span>
                                        );
                                    }
                                })}
                            </div>
                            <br></br>
                            <br></br>
                            <button
                                type="submit"
                                className="btn btn-primary mr-2"
                                disabled={
                                    isEnable('/api/menus/data/save')
                                }
                                onClick={(event) => {
                                    params.updateMenuCallback(menuJson);
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return <div className="col-md-12"></div>;
    }
}
