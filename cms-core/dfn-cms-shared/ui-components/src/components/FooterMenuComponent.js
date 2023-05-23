import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  
    figure.image {
        text-align: center;
    }
    
    

`;

export const FooterMenuComponent = (params) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [menus, setMenu] = useState([]);
    const [error, setError] = useState(null);
    const [pageId, setPageId] = useState('');
    let menuName = '';
    const selectedLanguage = params.lang;
    const { commonConfigs } = params;
    const { isEditMode, isPreview } = commonConfigs;
    const isPreviewMode = isPreview ? isPreview : false;

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            if (isPreviewMode) {
                getAllMenu();
            } else {
                // getMenuPermissions();
                const sessionStorageMenus = sessionStorage.getItem('footer-menu');
                const menuPermissions = sessionStorage.getItem('permission');
                console.log('menuPermissions');

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
                    setMenu([JSON.parse(sessionStorageMenus)]);
                }
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

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
                setMenu((menus) => [result.data[1]]);

                setPageId(result.data[1]._id);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    const subMenu2 = (sm2, mainIndex, subIndex, subIndex2, sm) => {
        let key = mainIndex + '-' + subIndex + '-' + subIndex2;
        return (
            <React.Fragment key={'sm2-' + key}>
                <ul className="list-unstyled">
                    <li>
                        <a href="#">{sm2.name.en}</a>
                    </li>
                </ul>
            </React.Fragment>
        );
    };

    const subMenu = (sm, mainIndex, subIndex, m) => {
        let key = mainIndex + '-' + subIndex;
        // let fullMenuPath = `/${selectedLanguage.langKey}/` + sm.path;
        let fullMenuPath = '';
        let selectedLangKey = selectedLanguage.langKey.toLowerCase();
        if (sm.menuType !== 'external-link') {
            fullMenuPath = `/${selectedLangKey}/` + sm.path + '/';
        } else {
            fullMenuPath = sm.extLinks[selectedLangKey];
        }
        return (
            <React.Fragment key={'sm-' + key}>
                <li>
                    <a href={fullMenuPath} hidden={isHide(sm)}>
                        {sm.name[selectedLangKey]}
                    </a>
                </li>
            </React.Fragment>
        );
    };

    const mainMenu = (m, mainIndex) => {
        let key = mainIndex;

        return (
            <React.Fragment key={'m-' + mainIndex}>
                <div className="col-lg">
                    <h6 className="title" hidden={isHide(m)}>
                        <b>{m.name[selectedLanguage.langKey.toLowerCase()]}</b>
                        <hr></hr>
                    </h6>
                    <ul className="list-unstyled">
                        {m.subLinks &&
                            m.subLinks.map((sm, subIndex) => {
                                return subMenu(sm, mainIndex, subIndex, m);
                            })}
                    </ul>
                </div>
            </React.Fragment>
        );
    };

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

    function getMenuPermissions() {
        const jwt = localStorage.getItem('jwt-token');
        const sessionId = localStorage.getItem('sessionId');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                // dbName: params.dbName,
                // websiteName: params.dbName,
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
                console.log('Footer Menu Result on page main menu comp: ', result.data[1]);
                sessionStorage.setItem('footer-menu', JSON.stringify(result.data[1]));
                setMenu([result.data[1]]);
            })
            .catch((err) => {
                // setIsLoaded(false)
                // setError(err)
                console.log(err);
            });
    }

    return (
        <React.Fragment>
            <div
                className={`footer__container jumbotron jumbotron-fluid ${
                    params.editMode ? 'footer_container_edit_mode' : ''
                }`}
            >
                <div className="container">
                    {selectedLanguage &&
                        selectedLanguage.langKey &&
                        menus.map((data, index) => {
                            {
                                return (
                                    <React.Fragment key={index}>
                                        <div className="row">
                                            {data.menu.map((m, index) => {
                                                return mainMenu(m, index);
                                            })}
                                        </div>
                                    </React.Fragment>
                                );
                            }
                        })}
                </div>
                {/* <div className="footer__nav">
                    <div className="container">
                        <div className="row">
                            <div className="col-md">
                                <span>
                                    <span>
                                        <a
                                            href="https://www.instagram.com/boursakw"
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            <img
                                                src="/bk-icons/social-instagram.svg"
                                                height="12"
                                                className="mr-2"
                                                alt="instagram"
                                            />
                                        </a>
                                    </span>
                                    <span>
                                        <a
                                            href="https://twitter.com/BoursaKW"
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            <img
                                                src="/bk-icons/social-twitter.svg"
                                                height="12"
                                                className="mr-2"
                                                alt="twitter"
                                            />
                                        </a>
                                    </span>
                                    <span>
                                        <a
                                            href="https://www.linkedin.com/company/10108082/"
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            <img
                                                src="/bk-icons/social-linkedin.svg"
                                                height="12"
                                                className="mr-2"
                                                alt="linkedin"
                                            />
                                        </a>
                                    </span>
                                </span>
                                &nbsp; &nbsp; <span className="opacity-2"> | </span> &nbsp; &nbsp;
                                {selectedLanguage.langKey == 'EN'
                                    ? 'Disclaimer and terms & conditions of use'
                                    : 'الإعفاء من المسؤولية وأحكام وشروط الاستخدام'}
                            </div>
                            {selectedLanguage.langKey == 'EN' ? (
                                <div className="col-md text-right">
                                    {' '}
                                    &#169; Copyright {new Date().getFullYear()} Boursa Kuwait. All
                                    Rights Reserved
                                </div>
                            ) : (
                                <div className="col-md text-right">
                                    &#169;
                                    <React.Fragment>
                                        {' '}
                                        {new Date().getFullYear()} حقوق النشر والحقوق الفكرية
                                        الواردة في هذا الموقع، تحفظ لبورصة الكويت
                                    </React.Fragment>
                                </div>
                            )}
                        </div>
                    </div>
                </div> */}
            </div>
        </React.Fragment>
    );
};
