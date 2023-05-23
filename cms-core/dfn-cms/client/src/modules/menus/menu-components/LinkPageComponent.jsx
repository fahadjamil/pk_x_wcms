import {getAuthorizationHeader} from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function LinkPageComponent(props) {
    const [pageId, setPageId] = useState();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pages, setPages] = useState([]);
    const [clickedPagesId, setClickedPagesId] = useState();
    const [pageName, setPageName] = useState();
    const [pageObjPersit, setPageObj] = useState([]);
    let selectedPage = [];
    const [unLinkPages, setUnlinePages] = useState([]);
    let formattedPath = '';

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            getAllPages();
            getAllUnLinkPages();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    function getAllPages() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.dbName,
        //     },
        // };

        Axios.get('/api/pages', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setPages(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function getAllUnLinkPages() {
        const headerParameter = { workflowState: 'approved'};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.dbName,
        //         workflowState: 'approved',
        //     },
        // };

        Axios.get('/api/pages/unlink-pages', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                const unlinkedPages = [ ...result.data ];
                const homePageIndex = unlinkedPages.findIndex(
                    (element) => element.isHomePage === true
                );

                if (homePageIndex !== -1) {
                    unlinkedPages.splice(homePageIndex, 1);
                }

                setUnlinePages(unlinkedPages);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    const updatePageDetails = (event, id, title, pageObj) => {
        setClickedPagesId(id);
        setPageName(title);
        selectedPage.push(pageObj);
    };

    // console.log('pageMenu Path : ', props.pageMenuPath);

    const saveLinkPageDetails = (menuName, pageObj, menuRef) => {
        pageObj.map((po) => {
            if (props.menuType !== 'footerMenu') {
                formattedPath = props.pageMenuPath + '/' + po.pageName;
            } else {
                formattedPath = po.pageName;
            }

            formattedPath = formattedPath
                .replace(/\s/g, '-')
                .toLowerCase()
                .trim()
                .replace('-&-', '-')
                .trim(); ///-/g

            po.path = formattedPath;

            po.menu = menuRef;

            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            // const jwt = localStorage.getItem('jwt-token');
            // const httpHeaders = {
            //     headers: {
            //         Authorization: jwt,
            //     },
            //     params: {
            //         dbName: props.dbName,
            //     },
            // };

            Axios.put('/api/pages/link-page', po, httpHeaders)
                .then((result) => {})
                .catch((err) => {
                    setIsLoaded(false);
                    setError(err);
                    console.log(err);
                });
        });
    };

    const handleRoleNameInputChange = (event) => {
        setPageId(event.target.value);
    };

    return (
        <>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a
                        className="nav-link active"
                        id="home-tab"
                        data-toggle="tab"
                        href="#home"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                    >
                        Unlink Pages
                    </a>
                </li>
                <li className="nav-item" role="presentation">
                    <a
                        className="nav-link"
                        id="profile-tab"
                        data-toggle="tab"
                        href="#profile"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="false"
                    >
                        All Pages
                    </a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div
                    className="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                >
                    <ul className="list-group-cms list-group-flush">
                        {unLinkPages.map((page, index) => {
                            return (
                                <li key={page._id} className="list-group-item ml-3">
                                    <label className="form-check-label">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="exampleCheck1"
                                            onChange={(event) => {
                                                let indexOfPage = selectedPage
                                                    .map(function (e) {
                                                        return e._id;
                                                    })
                                                    .indexOf(page._id);

                                                if (indexOfPage !== -1) {
                                                    selectedPage.splice(indexOfPage, 1);
                                                } else {
                                                    selectedPage.push(page);
                                                }

                                                // selectedPage.push(page);
                                            }}
                                        ></input>
                                        {page.pageName}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div
                    className="tab-pane fade"
                    id="profile"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                >
                    <ul className="list-group-cms list-group-flush">
                        {pages.map((page, index) => {
                            // console.log('update PageId : ', page._id);

                            return (
                                <li key={page._id} className="list-group-item ml-3">
                                    <label className="form-check-label">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="exampleCheck1"
                                            onChange={(event) => {
                                                // selectedPage.push(page);

                                                let indexOfPage = selectedPage
                                                    .map(function (e) {
                                                        return e._id;
                                                    })
                                                    .indexOf(page._id);

                                                if (indexOfPage !== -1) {
                                                    selectedPage.splice(indexOfPage, 1);
                                                } else {
                                                    selectedPage.push(page);
                                                }
                                            }}
                                        ></input>
                                        {page.pageName}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={props.handleCloseLinkPages}
                >
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                        props.linkPages(props.subIndex, clickedPagesId, pageName, selectedPage);
                        saveLinkPageDetails(pageName, selectedPage, props.menuRef);
                        props.handleCloseLinkPages();
                    }}
                >
                    Link
                </button>
            </div>
        </>
    );
}
