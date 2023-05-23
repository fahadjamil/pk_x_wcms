import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
// import cookies from 'js-cookie';
import Cookies from 'universal-cookie/es6';
import { LoggedUserComponent } from './LoggedUserComponent';

const MenuDropdown = styled.li`
    background: #eee;
    padding: 2rem;
    color: #4b4c4d;
    border: none;
    background-color: white;

    > .row {
        > .col-md {
            min-width: 25%;
            margin-bottom: 1rem;
            &:nth-child(5),
            &:nth-child(6),
            &:nth-child(7),
            &:nth-child(8),
            &:nth-child(9),
            &:nth-child(10) {
                max-width: 25%;
            }

            > h6 {
                font-size: 1.125rem;
                font-weight: 600;
                &:after {
                    width: 1.5rem;
                    height: 0.2rem;
                    position: relative;
                    content: '';
                    display: block;
                    background: #c7954a;
                    z-index: 0;
                    border-radius: 1px;
                }
            }

            > ul {
                padding-bottom: 0.5rem;
                > li {
                    > a {
                        color: #4b4c4d;
                    }
                }
            }

            &:last-child:not(:only-child):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)):not(:nth-child(9)) {
                margin: -2rem -1rem;
                padding: 2rem;
                background: #435058;
                color: #fff;

                > h6 {
                    color: #fff;
                }

                > ul {
                    > li {
                        > a {
                            color: #ffffffa3;
                        }
                    }
                }
            }
        }
    }
`;

export const MainMenuComponent = (params) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [menus, setMenu] = useState(null);
    const [error, setError] = useState(null);
    const [pageId, setPageId] = useState('');
    const [hrefUrl, setHrefUrl] = useState('#');
    const { commonConfigs, data } = params;
    const { isEditMode, isPreview } = commonConfigs;
    const isPreviewMode = isPreview ? isPreview : false;
    const isHidden = !isPreviewMode;
    const cookies = new Cookies();

    let menuName = '';
    let settingsConfigs=undefined;
    const selectedLanguage = params.lang;
    let loggedUser = cookies.get('bk_name') ? cookies.get('bk_name') : undefined;

    if(data){
        const {settings}=data;
        if(settings){
            settingsConfigs=settings;
        }
    }
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            if (isPreviewMode) {
                getAllMenu();
            } else {
                const sessionStorageMenus = sessionStorage.getItem('menu');
                const menuPermissions = sessionStorage.getItem('permission');

                if (
                    menuPermissions === undefined ||
                    menuPermissions === null ||
                    menuPermissions === ''
                ) {
                    console.log('Permission not available. Requesting again from Client');
                    getMenuPermissions();
                } else if (
                    sessionStorageMenus === undefined ||
                    sessionStorageMenus === null ||
                    sessionStorageMenus === ''
                ) {
                    console.log('Menus not available. Requesting again from Client');
                    getMenusAndSetSessionStorage();
                } else {
                    setMenu(JSON.parse(sessionStorageMenus));
                }
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted && selectedLanguage) {
            if (selectedLanguage.langKey.toLowerCase() === 'en') {
                setHrefUrl(getUrl('ar'));
            } else if (selectedLanguage.langKey.toLowerCase() === 'ar') {
                setHrefUrl(getUrl('en'));
            }
        }

        return () => {
            isMounted = false;
        };
    }, [selectedLanguage]);

    function getMenuPermissions() {
        const jwt = localStorage.getItem('jwt-token');
        const sessionId = localStorage.getItem('sessionId');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                // dbName: params.dbName,
                //  websiteName: params.dbName,
                sessionId: sessionId,
            },
        };

        Axios.get('/api/getPermissions', httpHeaders)
            .then((result) => {
                sessionStorage.setItem('permission', result.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                getMenusAndSetSessionStorage();
            });
    }

    function getMenusAndSetSessionStorage() {
        const jwt = localStorage.getItem('jwt-token');
        const sessionId = localStorage.getItem('sessionId');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                //   dbName: params.dbName,
                //   websiteName: params.dbName,
                sessionId: sessionId,
            },
        };
        Axios.get('/api/menus', httpHeaders)
            .then((result) => {
                console.log('Menu Result on page main menu comp: ', result.data[0]);
                sessionStorage.setItem('menu', JSON.stringify(result.data[0]));
                setMenu(result.data[0]);
            })
            .catch((err) => {
                // setIsLoaded(false)
                // setError(err)
                console.log(err);
            });
    }

    function getAllMenu() {
        const jwt = localStorage.getItem('jwt-token');
        const sessionId = localStorage.getItem('sessionId');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                dbName: params.dbName,
                websiteName: params.dbName,
                sessionId: sessionId,
            },
        };
        Axios.get('/api/menus', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                // console.log("Menu : "+JSON.stringify(result.data[0]))
                setMenu((menus) => result.data[0]);
                setPageId(result.data[0]._id);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function isHide(menu) {
        if (isPreviewMode) {
            return false;
        } else {
            if (
                sessionStorage.getItem('permission') !== null &&
                sessionStorage.getItem('permission').includes(menu.path)
            ) {
                return false;
            } else {
                return true;
            }
        }
    }

    const subMenu2 = (sm2, mainIndex, subIndex, subIndex2, sm, m) => {
        let key = mainIndex + '-' + subIndex + '-' + subIndex2;
        // let fullMenuPath = `/${selectedLanguage.langKey}` + m.path + sm.path + sm2.path;
        let fullMenuPath = '';

        if (sm2.menuType !== 'external-link') {
            fullMenuPath =
                `/${selectedLanguage.langKey.toLowerCase()}` + m.path + sm.path + sm2.path + '/';

            return (
                <React.Fragment key={'sm2-' + key}>
                    <ul className="list-unstyled">
                        <li>
                            <a href={fullMenuPath} hidden={isHide(sm2)}>
                                {/* {sm2.name.en} */}
                                {sm2.name[selectedLanguage.langKey.toLowerCase()]}
                            </a>
                        </li>
                    </ul>
                </React.Fragment>
            );
        } else {
            let selectedLangKey = selectedLanguage.langKey.toLowerCase();
            let externalLink = sm2.extLinks ? sm2.extLinks[selectedLangKey] : '';
            if (
                sm2.extLinks &&
                sm2.extLinks[selectedLangKey] &&
                !sm2.extLinks[selectedLangKey].includes('http://') &&
                !sm2.extLinks[selectedLangKey].includes('https://')
            ) {
                externalLink = `/${selectedLangKey}/${sm2.extLinks[selectedLangKey]}`;
            }

            fullMenuPath = externalLink;

            return (
                <React.Fragment key={'sm2-' + key}>
                    <ul className="list-unstyled">
                        <li>
                            <a href={fullMenuPath} hidden={isHide(sm2)} target="_blank">
                                {/* {sm2.name.en} */}
                                {sm2.name[selectedLangKey]}
                            </a>
                        </li>
                    </ul>
                </React.Fragment>
            );
        }
    };

    const subMenu = (m, sm, mainIndex, subIndex) => {
        let key = mainIndex + '-' + subIndex;
        return (
            <React.Fragment key={'sm-' + key}>
                <div className="col-md">
                    <h6 className="title" hidden={isHide(sm)}>
                        {/* {sm.name.en} */}
                        {sm.name[selectedLanguage.langKey.toLowerCase()]}
                    </h6>

                    {sm.subLinks != null &&
                        sm.subLinks.map((sm2, subIndex2) => {
                            return subMenu2(sm2, mainIndex, subIndex, subIndex2, sm, m);
                        })}
                </div>
            </React.Fragment>
        );
    };

    const mainMenu = (m, mainIndex) => {
        let key = mainIndex;
        return (
            <React.Fragment key={'m-' + mainIndex}>
                <div className="nav-item dropdown has-megamenu">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        data-toggle="dropdown"
                        style={{ color: '#000000' }}
                        hidden={isHide(m)}
                    >
                        {/* {m.name.en} */}
                        {m.name[selectedLanguage.langKey.toLowerCase()]}
                    </a>

                    <li
                        className="mainMenuDropDownStyle dropdown-menu megamenu dropdown-large menu__dropdown"
                        onMouseOver={(event) => event.stopPropagation()}
                    >
                        <div className="row">
                            {m.subLinks &&
                                m.subLinks.map((sm, subIndex) => {
                                    return subMenu(m, sm, mainIndex, subIndex);
                                })}
                        </div>
                    </li>
                </div>
            </React.Fragment>
        );
    };

    const getUrl = (languageKey) => {
        let updatedUrl = '#';

        if (typeof window !== 'undefined') {
            const languageKeys = ['en', 'ar'];
            const currentUrl = window.location.href;
            const currentWebHost = window.location.hostname;
            const currentPathName = window.location.pathname;
            const currentProtocol = window.location.protocol;
            updatedUrl = currentUrl;

            if (currentPathName.length > 0) {
                const currentLangKey = currentPathName.split('/')[1];

                if (languageKeys.includes(currentLangKey)) {
                    const updatedPath = currentPathName.replace(currentLangKey, languageKey);
                    updatedUrl = currentUrl.replace(currentPathName, updatedPath);
                }
            }
        }

        return updatedUrl;
    };

    return (
        <React.Fragment>
            <nav className={`navbar navbar-expand-lg ${params.editMode ? 'navbar_edit_mode' : ''}`}>
                <div className="container">
                    <a
                        className="navbar-brand primary-logo"
                        href={`${
                            selectedLanguage &&
                            selectedLanguage.langKey &&
                            selectedLanguage.langKey.toLowerCase().length > 0
                                ? '/' + selectedLanguage.langKey.toLowerCase()
                                : '/en'
                        }/`}
                        aria-label="home-page"
                    >
                        {isPreviewMode ? (
                            <img
                                className="primary-logo"
                                src={
                                    (settingsConfigs &&
                                        settingsConfigs.logo &&
                                        settingsConfigs.logo.value &&
                                        settingsConfigs.logo.value.filePath) ||
                                    '/logo.png'
                                }
                                alt="LOGO"
                            ></img>
                        ) : (
                            <img
                                className="primary-logo"
                                src={
                                    (settingsConfigs &&
                                        settingsConfigs.logo &&
                                        settingsConfigs.logo.value &&
                                        settingsConfigs.logo.value.fileName &&
                                        `/images/${settingsConfigs.logo.value.fileName}`) ||
                                    '/logo.png'
                                }
                                alt="LOGO"
                            ></img>
                        )}
                    </a>
                    <div className="nav-float">
                        <div className="collapse navbar-collapse" id="mainMenuNavBarToggle">
                            {loggedUser && (
                                <span className="bk-loggedUser mobile-only  d-md-none">
                                    {' '}
                                    <LoggedUserComponent lang={selectedLanguage}/>
                                </span>
                            )}
                            <div className="navbar-nav">
                                {menus && menus.menu && selectedLanguage && selectedLanguage.langKey && (
                                    <React.Fragment key="M_1">
                                        {menus.menu.map((m, index) => {
                                            return mainMenu(m, index);
                                        })}
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                        <div className="otc-logo-container">
                            <img
                                className="secondary-logo"
                                src="/bk-icons/bk-otc-logo.svg"
                                alt=""
                            ></img>
                        </div>
                    </div>
                    <div className="header__utility mobile-only d-md-none">
                        <div className="input-group flex-nowrap">
                            <div
                                className="btn-group header-lang"
                                role="group"
                                aria-label="Menu Btn"
                            >
                                {selectedLanguage &&
                                    selectedLanguage.langKey.toLowerCase() === 'en' && (
                                        <a
                                            className="lang-button btn bg-transparent btn-sm text-nowrap"
                                            href={hrefUrl}
                                            target="_self"
                                        >
                                            <img
                                                src="/bk-icons/bk-lang-arabic.svg"
                                                height="24"
                                                alt="lang"
                                            />
                                        </a>
                                    )}
                                {selectedLanguage &&
                                    selectedLanguage.langKey.toLowerCase() === 'ar' && (
                                        <a
                                            className="lang-button btn bg-transparent btn-sm text-nowrap"
                                            href={hrefUrl}
                                            target="_self"
                                        >
                                            <img src="/bk-icons/bk-lang-english.svg" height="24" />
                                        </a>
                                    )}
                            </div>

                            {loggedUser === undefined && (
                                <div
                                    className="btn-group header-signin"
                                    role="group"
                                    aria-label="Menu Btn"
                                >
                                    {selectedLanguage &&
                                        selectedLanguage.langKey.toLowerCase() === 'en' && (
                                            <React.Fragment>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent btn-sm text-nowrap"
                                                    onClick={() => {
                                                        if (location) {
                                                            location.href = '/en/login';
                                                        }
                                                    }}
                                                >
                                                    Sign In
                                                </button>
                                            </React.Fragment>
                                        )}
                                    {selectedLanguage &&
                                        selectedLanguage.langKey.toLowerCase() === 'ar' && (
                                            <React.Fragment>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent btn-sm text-nowrap"
                                                    onClick={() => {
                                                        if (location) {
                                                            location.href = '/ar/login';
                                                        }
                                                    }}
                                                >
                                                    تسجيل الدخول
                                                </button>
                                            </React.Fragment>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="header__utility web-only d-none d-md-block">
                        <div className="input-group flex-nowrap">
                            <div
                                className="btn-group header-lang"
                                role="group"
                                aria-label="Menu Btn"
                            >
                                {selectedLanguage &&
                                    selectedLanguage.langKey.toLowerCase() === 'en' && (
                                        <a
                                            type="button"
                                            className="btn bg-transparent btn-sm text-nowrap"
                                            href={hrefUrl}
                                            target="_self"
                                        >
                                            <img
                                                src="/bk-icons/bk-lang-arabic.svg"
                                                height="24"
                                                alt="lang"
                                            />
                                        </a>
                                    )}
                                {selectedLanguage &&
                                    selectedLanguage.langKey.toLowerCase() === 'ar' && (
                                        <a
                                            type="button"
                                            className="btn bg-transparent btn-sm text-nowrap"
                                            href={hrefUrl}
                                            target="_self"
                                        >
                                            <img src="/bk-icons/bk-lang-english.svg" height="24" />
                                        </a>
                                    )}
                            </div>

                            {loggedUser && (
                                <span className="bk-loggedUser web-only">
                                    {' '}
                                    <LoggedUserComponent lang={selectedLanguage} />
                                </span>
                            )}

                            {loggedUser === undefined && (
                                <div
                                    className="btn-group header-signin"
                                    role="group"
                                    aria-label="Menu Btn"
                                >
                                    {selectedLanguage &&
                                        selectedLanguage.langKey.toLowerCase() === 'en' && (
                                            <React.Fragment>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent btn-sm text-nowrap"
                                                    onClick={() => {
                                                        if (location) {
                                                            location.href = '/en/login';
                                                        }
                                                    }}
                                                >
                                                    Sign In
                                                </button>
                                            </React.Fragment>
                                        )}
                                    {selectedLanguage &&
                                        selectedLanguage.langKey.toLowerCase() === 'ar' && (
                                            <React.Fragment>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent btn-sm text-nowrap"
                                                    onClick={() => {
                                                        if (location) {
                                                            location.href = '/ar/login';
                                                        }
                                                    }}
                                                >
                                                    تسجيل الدخول
                                                </button>
                                            </React.Fragment>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="navbar-toggler navbar-light"
                        type="button"
                        data-toggle="collapse"
                        data-target="#mainMenuNavBarToggle"
                        aria-controls="mainMenuNavBarToggle"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>


                </div>
            </nav>
        </React.Fragment>
    );
};
