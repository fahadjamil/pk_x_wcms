// import { PreviewPageComponent } from './PreviewPageComponent';
// //import { PreviewPageComponent } from "ui-components"
import React, { useEffect, useState } from 'react';
import { PreviewPageComponent } from './PreviewPageComponent';
import Axios from 'axios';
import styled from 'styled-components';
import ScrollUpButton from 'react-scroll-up-button';
import ScrollToTopIcon from '../../resources/ScrolToTopIcon';

export function PagePreviewComponent(props) {
    // const [session, setSession] = useState(false);
    // const [permission, setPermission] = useState(false);

    // useEffect(() => {
    //     storePermission(false, props.dbName);
    //     isPermissionUpdated();
    // }, []);

    // function isPermissionUpdated() {
    //     // return session || sessionStorage.getItem('menu') || sessionStorage.getItem('permission');
    //     if (
    //         sessionStorage.getItem('menu') != null ||
    //         sessionStorage.getItem('permission') != null
    //     ) {
    //         setSession(true);
    //     }
    // }

    // function storePermission(isUpdate, dbName) {
    //     if (isUpdate || sessionStorage.getItem('permission') === null) {
    //         const jwt = localStorage.getItem('jwt-token');
    //         const sessionId = localStorage.getItem('sessionId');
    //         const httpHeaders = {
    //             headers: {
    //                 Authorization: jwt,
    //             },
    //             params: {
    //                 // dbName: dbName,
    //                 //websiteName: dbName,
    //                 sessionId: sessionId,
    //             },
    //         };

    //         Axios.get('/api/getPermissions', httpHeaders)
    //             .then((result) => {
    //                 sessionStorage.setItem('permission', result.data);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             })
    //             .finally(() => {
    //                 getAllMenu(props.dbName);
    //             });
    //     }
    // }

    // function getAllMenu(dbName) {
    //     const jwt = localStorage.getItem('jwt-token');
    //     const sessionId = localStorage.getItem('sessionId');
    //     const httpHeaders = {
    //         headers: {
    //             Authorization: jwt,
    //         },
    //         params: {
    //             //   dbName: dbName,
    //             //   websiteName: dbName,
    //             sessionId: sessionId,
    //         },
    //     };
    //     Axios.get('/api/menus', httpHeaders)
    //         .then((result) => {
    //             console.log('Menu Result on page preview comp: ', result);

    //             sessionStorage.setItem('menu', JSON.stringify(result.data[0]));
    //             sessionStorage.setItem('footer-menu', JSON.stringify(result.data[1]));
    //             setSession(true);
    //         })
    //         .catch((err) => {
    //             // setIsLoaded(false)
    //             // setError(err)
    //             console.log(err);
    //         });
    // }

    return (
        // <>
        <React.Fragment>
            {/* {session && ( */}
            <div>
                <div className="row">
                    <div className="col-md-12" style={{ height: '68px' }}>
                        <PreviewPageComponent
                            {...props.headerPreviewData}
                            editMode={props.editMode}
                            section="header"
                            openComponentList={props.openComponentList}
                            dbName={props.dbName}
                            selectedLanguage={props.selectedLanguage}
                            isPreview={props.isPreview}
                        />
                        {/* {getPreview(templateContentData, 'header', selectedLanguage)} */}
                    </div>
                    <div
                        className="col-md-12 page__contet__parent"
                        style={{ minHeight: 'calc(100vh - 578px)' }}
                    >
                        <PreviewPageComponent
                            {...props.pagePreviewData}
                            editMode={props.editMode}
                            section=""
                            openComponentList={props.openComponentList}
                            dbName={props.dbName}
                            selectedLanguage={props.selectedLanguage}
                            isPreview={props.isPreview}
                        />
                        <div>
                            <ScrollUpButton
                                ContainerClassName="scrolltotop-container"
                                TransitionClassName="scrolltotop-transition"
                                EasingType="easeInCubic"
                            >
                                <ScrollToTopIcon width={48} height={48} />
                            </ScrollUpButton>
                        </div>
                        {/* {getPreview(pageContentData, '', selectedLanguage)} */}
                    </div>
                    <div className="col-md-12">
                        <PreviewPageComponent
                            {...props.footerPreviewData}
                            editMode={props.editMode}
                            section="footer"
                            openComponentList={props.openComponentList}
                            dbName={props.dbName}
                            selectedLanguage={props.selectedLanguage}
                            isPreview={props.isPreview}
                        />
                        {/* {getPreview(templateContentData, 'footer', selectedLanguage)} */}
                    </div>
                </div>
            </div>
            {/* )} */}
        </React.Fragment>
        // </>
    );
}
