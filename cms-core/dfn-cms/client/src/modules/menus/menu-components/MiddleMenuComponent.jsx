import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { v1 as uuidv1 } from 'uuid';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import MeatBalls from '../../shared/resources/MeatBalls';
import AddSubMenuItem from './AddSubMenuItem';
import LinkPageComponent from './LinkPageComponent';
import './MiddleMenuComponent.css';

const MiddleMenuList = styled.div`
    transition: background-color 0.2s ease;
    border: ${(props) => (props.isDragging ? '2px solid #e7e8ee' : '2px dashed #e7e8ee')};
    padding: 0;
    background-color: ${(props) => (props.isDraggingOver ? '#e7e8ee' : 'none')};
    content: '02';
    border-radius: 0.25rem;
`;

const MiddleMenuSubItemsList = styled.div`
    transition: background-color 0.2s ease;
    border: ${(props) => (props.isDragging ? '2px solid #e7e8ee' : '2px dashed #e7e8ee')};
    padding: 0;
    background-color: ${(props) => (props.isDraggingOver ? '#e7e8ee' : 'none')};
    content: '02';
    border-radius: 0.25rem;
    width: 100%;
    z-index: 2;
    margin-bottom: 0;
    position: relative;
    margin-left: 4rem;
`;

const MiddleMenuItem = styled.div`
    border: ${(props) => (props.isDragging ? 'solid 1px #e7e8ee' : 'dashed 1px #e7e8ee')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#e7e8ee' : 'none')};
    content: '06';
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
`;

const MiddleMenuSubItem = styled.div`
    border: ${(props) => (props.isDragging ? 'solid 1px #e7e8ee' : 'dashed 1px #e7e8ee')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#e7e8ee' : 'none')};
    content: '06';
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
    z-index: 5;
`;

const MiddleMenuSubItemChild = styled.ul`
    padding-left: 4rem !important;
`;

export default function MiddleMenuComponent(params) {
    const [menus, setMenus] = useState(params.menuItem);
    const [flMenu, setFullMenu] = useState();
    const [name, setName] = useState('');
    const [subLinks, setSubLinks] = useState([]);
    const [subLinkName, setSubLinkName] = useState('');
    const [subLinkIndex, setSubLinkIndex] = useState(0);
    const [subSectionName, setSubSectionName] = useState([]);
    const [sectionName, setSectionName] = useState([]);
    const [linkPage, setLinkPage] = useState({});
    const [isNewSection, setNewSection] = useState(false);
    const [pagePath, setPagePath] = useState('');
    const [updateData, setUpdateData] = useState('');
    const [showExternalLinkModal, setShowExternalLinkModal] = useState(false);
    const [showExt, setShowExt] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [showTopMenuDeleteModal, setShowTopMenuDeleteModal] = useState(false);
    const [showAddMenuItemModal, setAddMenuItemModal] = useState(false);
    const [showLinkPageModal, setShowLinkPageModal] = useState(false);
    const [showPageItem, setShowPageItem] = useState(false);

    const [extLinkName, setExtLinkName] = useState('');
    const [extLinkPath, setExtLinkPath] = useState();
    const [extLinksPath, setExtLinksPath] = useState({});
    const [subSectionLink, setSubSectionLinkName] = useState([]);
    const [uniqueKey, setUniqueKey] = useState('');

    const [mainIndex, setMainIndex] = useState('');
    const [selectedMenuItem, setSelectedMenuItem] = useState({});
    const [subMenuIndex, setSubMenuIndex] = useState('');

    const [selectedPageItem, setSelectedPageItem] = useState({});
    const [pageItemIndex, setPageItemIndex] = useState('');

    const [showMenuNameCannotEmpty, setShowMenuNameCannotEmpty] = useState(false);

    const handleClose = () => setShowExternalLinkModal(false);
    const handleShow = (subIndex) => {
        setShowExternalLinkModal(true);
        setSubLinkIndex(subIndex);
    };

    const handleCloseSubSection = () => setShowTopMenuDeleteModal(false);
    const handleShowSubSection = () => setShowTopMenuDeleteModal(true);

    const handleClosePageItem = () => setShowPageItem(false);
    const handleShowPageItem = () => setShowPageItem(true);

    const handleShowAddMenuItemModal = (event) => {
        newSectionClickHandler(event);
        setAddMenuItemModal(true);
    };
    const handleCloseAddMenuItemModal = () => setAddMenuItemModal(false);

    const handleCloseLinkPages = () => setShowLinkPageModal(false);
    const handleShowLinkPages = (subIndex) => {
        setShowLinkPageModal(true);
        setSubLinkIndex(subIndex);
    };

    const handleCloseExt = () => setShowExt(false);
    const handleShowExt = () => setShowExt(true);

    const menuType = params.menuType;
    const menuIndex = params.menuIndex;
    const supportLanguages = params.supportLanguages;
    let fullMenu = params.menus;

    let subMenuName = {};
    let pageId = {};
    let clickedPagesId;
    let pageName;
    let pageMenuPath;
    let linkPageObj = {};
    let selectedPage = '';
    let selectedPageSubSection = [];

    useEffect(() => {
        // setFullMenu(params.menus);
        let isMounted = true;

        if (isMounted) {
            setUniqueKey(uuidv1());
        }

        return () => {
            isMounted = false;
        };
    }, [params.dbName, fullMenu]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setMenus(params.menuItem);
        }

        return () => {
            isMounted = false;
        };
    }, [params.menuItem]);

    function inputChangedHandler(event) {
        event.preventDefault();

        let updatedKeyword = event.target.value;
        const updatedMenus = { ...menus };

        updatedMenus.name.en = updatedKeyword;

        setMenus(updatedMenus);
        setName(updatedKeyword);
    }

    function menuDeleteHandler(event, m, index) {
        if (index !== -1) {
            fullMenu.menu.splice(index, 1);
        }

        setUniqueKey(uniqueKey + index);
    }

    function newSectionInputChangeHandler(event) {
        event.preventDefault();

        const updatedMenus = { ...menus };
        let subLink = {
            name: {
                en: subLinkName,
                ar: '',
            },
            path: subLinkName.replace(/\s/g, '-').toLowerCase().trim() + '/',
            iconPath: '',
            menuType: '',
            subLinks: [],
            roles: [],
        };

        updatedMenus.subLinks.push(subLink);

        setMenus(updatedMenus);
        setUpdateData(uniqueKey + subLinkName);
    }

    function newExtLinkInputChangeHandler(event, subIndex) {
        event.preventDefault();

        const updatedMenus = { ...menus };
        let subLink = {
            name: {
                en: extLinkName,
                ar: '',
            },
            path: extLinkName.replace(/\s/g, '-').toLowerCase().trim(),
            iconPath: '',
            page: '',
            menuType: 'external-link',
            extLinks: extLinksPath,
            subLinks: [],
            roles: [],
        };

        if (menuType === 'mainMenu') {
            updatedMenus.subLinks[subIndex].subLinks.push(subLink);
            setMenus(updatedMenus);
            setSubSectionLinkName(...updatedMenus.subLinks[subIndex].subLinks, subLink);

            return;
        }

        updatedMenus.subLinks.push(subLink);
        setMenus(updatedMenus);
        setSubSectionLinkName(...updatedMenus.subLinks, subLink);
    }

    function newSectionLinkPageHandler(subIndex, pageId, pageName, linkPageObj) {
        const updatedMenus = { ...menus };

        linkPageObj.map((pages) => {
            let subLink = {
                name: {
                    en: pages.pageName,
                    ar: '',
                },
                path: pages.pageName.replace(/\s/g, '-').toLowerCase().trim() + '/',
                iconPath: '',
                page: pages._id,
                menuType: 'page',
                subLinks: [],
                roles: [],
            };

            updatedMenus.subLinks.push(subLink);
            setSectionName(...updatedMenus.subLinks[subIndex].subLinks, subLink);
        });

        setMenus(updatedMenus);
    }

    function newSubSectionLinkPageHandler(subIndex, pageId, pageName, linkPageObj) {
        const updatedMenus = { ...menus };

        linkPageObj.map((page) => {
            setLinkPage(page);
            let menuNames = {};

            if (page.pageInfo && page.pageInfo.pageTitle) {
                supportLanguages.forEach((lang) => {
                    menuNames[lang.langKey.toLowerCase()] =
                        page.pageInfo.pageTitle[lang.langKey.toLowerCase()];
                });

                if (menuNames.en === undefined || menuNames.en === '') {
                    menuNames.en = page.pageName;
                }
            } else {
                menuNames = {
                    en: page.pageName,
                    ar: '',
                };
            }

            let subLink = {
                name: menuNames,
                path: page.pageName.replace(/\s/g, '-').toLowerCase().trim(),
                iconPath: '',
                page: page._id,
                menuType: 'page',
                extLink: '',
                subLinks: [],
                roles: [],
            };

            if (menuType === 'mainMenu') {
                updatedMenus.subLinks[subIndex].subLinks.push(subLink);
                setSubSectionName(...updatedMenus.subLinks[subIndex].subLinks, subLink);

                return;
            }

            updatedMenus.subLinks.push(subLink);
            setSubSectionName(...updatedMenus.subLinks, subLink);
        });
        setMenus(updatedMenus);
    }

    function newSectionClickHandler(event) {
        let newSection = event.target.value;

        if (event.target.value === 'new-section') {
            setNewSection(true);
        } else {
            setNewSection(false);
        }
    }

    function linksDeleteHandler(event, sm2, subIndex2, menuIndex, subIndex, sm) {
        if (subIndex2 !== -1) {
            sm.subLinks.splice(subIndex2, 1);
        }

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: params.dbName,
        //         // dbName: 'bk-main-demo',
        //     },
        // };

        Axios.post('/api/menus/data/save', fullMenu, httpHeaders)
            .then((result) => {
                // setIsLoaded(true);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        if (sm2.menuType === 'page') {
            Axios.post(
                '/api/menus/page',

                {
                    dbName: params.dbName,
                    page_id: sm2.page,
                },
                httpHeaders
            )
                .then((response) => {})
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function newSectionDeleteHandler(event, sm, subIndex, menuIndex) {
        const updatedMenus = { ...menus };

        if (subIndex !== -1) {
            updatedMenus.subLinks.splice(subIndex, 1);
            setMenus(updatedMenus);
        }
        setUpdateData(uniqueKey + subIndex + menuIndex);

        sm.subLinks &&
            sm.subLinks.map((links, subIndex2, subIndex) => {
                if (links.menuType === 'page') {
                    selectedPageSubSection.push(links.page);
                }
            });

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: params.dbName,
        //         // dbName: 'bk-main-demo',
        //     },
        // };

        Axios.post('/api/menus/data/save', fullMenu, httpHeaders)
            .then((result) => {
                // setIsLoaded(true);
                //popup
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        selectedPageSubSection.map((pageId) => {
            Axios.post(
                '/api/menus/page',

                {
                    dbName: params.dbName,
                    page_id: pageId,
                },
                httpHeaders
            )
                .then((response) => {})
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    function mainSectionDeleteHandler(event, menuJson) {
        if (menuIndex !== -1) {
            menuJson.splice(menuIndex, 1);
        }
    }

    function inputChangedHandlerExtMenuName(event) {
        event.preventDefault();
        let updatedKeyword = event.target.value;
        setExtLinkName(updatedKeyword);
    }

    function inputChangedHandlerExtMenuPath(event,langKey) {
        event.preventDefault();
        let updatedKeyword = event.target.value;

        extLinksPath[langKey.toLowerCase()] = updatedKeyword

        setExtLinkPath(updatedKeyword);
        setExtLinksPath(extLinksPath)
    }

    const mainMenu = (m) => {
        return (
            <React.Fragment>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="btn-group dropright">
                            <button
                                type="button"
                                className="btn btn-outline-info dropdown-toggle"
                                data-toggle="dropdown"
                                data-display="static"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {m.name.en}
                            </button>
                            <div className="dropdown-menu dropdown-menu-lg-right">
                                <button className="dropdown-item" type="button">
                                    New Section Below
                                </button>
                                <button className="dropdown-item" type="button">
                                    Add Pages
                                </button>
                                <button className="dropdown-item" type="button">
                                    Inner Route
                                </button>
                                <button className="dropdown-item" type="button">
                                    External Link
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </React.Fragment>
        );
    };

    function onDragEnd(result) {
        const { destination, source, draggableId, type } = result;

        // If user drops outside of the droppable zone
        if (!destination) {
            return;
        }

        // If user drops the item back into the the start position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newMenus = { ...menus };

        if (type === 'topLevelDroppableArea') {
            // Drag and drop occure within same column (Source and Destinations are equal)
            const newMenuOrder = Array.from(newMenus.subLinks);
            const newMenuItem = newMenuOrder[source.index];

            newMenuOrder.splice(source.index, 1);
            newMenuOrder.splice(destination.index, 0, newMenuItem);
            newMenus.subLinks = newMenuOrder;

            setMenus(newMenus);

            if (fullMenu) {
                fullMenu.menu[menuIndex] = newMenus;
                params.setAllMenu(fullMenu);
            }

            return;
        }

        if (type === 'subLevelDroppableArea') {
            const startIndex = source?.droppableId ? source.droppableId.split('-')[1] : undefined;
            const finishIndex = destination?.droppableId
                ? destination.droppableId.split('-')[1]
                : undefined;

            // If user change the order within same sub level droppable area
            if (startIndex === finishIndex) {
                const subMenuPagesOrder = newMenus.subLinks[startIndex]['subLinks'];
                const newsubMenuPagesOrder = Array.from(subMenuPagesOrder);
                const newsubMenuPageItem = newsubMenuPagesOrder[source.index];

                newsubMenuPagesOrder.splice(source.index, 1);
                newsubMenuPagesOrder.splice(destination.index, 0, newsubMenuPageItem);
                newMenus.subLinks[startIndex]['subLinks'] = newsubMenuPagesOrder;

                setMenus(newMenus);

                if (fullMenu) {
                    fullMenu.menu[menuIndex] = newMenus;
                    params.setAllMenu(fullMenu);
                }

                return;
            }

            // If user drops between different sub level droppable areas
            const startSubMenuPagesOrder = newMenus.subLinks[startIndex]['subLinks'];
            const finishSubMenuPagesOrder = newMenus.subLinks[finishIndex]['subLinks'];

            const newStartsubMenuPagesOrder = Array.from(startSubMenuPagesOrder);
            const newFinishsubMenuPagesOrder = Array.from(finishSubMenuPagesOrder);
            const newsubMenuPageItem = newStartsubMenuPagesOrder[source.index];

            newStartsubMenuPagesOrder.splice(source.index, 1);
            newFinishsubMenuPagesOrder.splice(destination.index, 0, newsubMenuPageItem);
            newMenus.subLinks[startIndex]['subLinks'] = newStartsubMenuPagesOrder;
            newMenus.subLinks[finishIndex]['subLinks'] = newFinishsubMenuPagesOrder;

            setMenus(newMenus);

            if (fullMenu) {
                fullMenu.menu[menuIndex] = newMenus;
                params.setAllMenu(fullMenu);
            }

            return;
        }
    }

    if (menus && menus.name && menus.name.en) {
        return (
            <>
                <div className="">
                    <div className="menuitem__container">
                        <div className="col-md-12">
                            <React.Fragment>
                                <div className="row">
                                    <ul className="menuitem__list parent">
                                        <li
                                            className="menuitem__list__item"
                                            onClick={(event) => {
                                                const menuPath = menus.name.en;
                                                params.middleMenuItemsCallback(
                                                    menus,
                                                    menuPath.toLowerCase()
                                                );
                                            }}
                                        >
                                            <span>{menus.name.en}</span>
                                            <div className="more__container btn-group dropright">
                                                <button
                                                    type="button"
                                                    className="more__button"
                                                    data-toggle="dropdown"
                                                    data-display="static"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    type="submit"
                                                >
                                                    <MeatBalls width="25px" height="25px" />
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-lg-right">
                                                    {menuType === 'mainMenu' && (
                                                        <button
                                                            className="dropdown-item"
                                                            type="button"
                                                            data-toggle="modal"
                                                            data-target="#exampleModal"
                                                            data-whatever="@mdo"
                                                            value="new-section"
                                                            onClick={(event) => {
                                                                handleShowAddMenuItemModal(event);
                                                            }}
                                                        >
                                                            New Section
                                                        </button>
                                                    )}
                                                    {menuType === 'footerMenu' && (
                                                        <>
                                                            <button
                                                                className="dropdown-item"
                                                                type="button"
                                                                data-toggle="modal"
                                                                data-target="#exampleModalMain"
                                                                data-whatever="test"
                                                                onClick={(e) => {
                                                                    handleShowLinkPages(0);
                                                                }}
                                                            >
                                                                Add Pages
                                                            </button>
                                                            <button
                                                                className="dropdown-item"
                                                                type="button"
                                                                onClick={() => {
                                                                    handleShow(0);
                                                                }}
                                                            >
                                                                External Link
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </React.Fragment>
                            <React.Fragment>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <div className="row">
                                        <Droppable
                                            droppableId="topLevelDroppableArea"
                                            type="topLevelDroppableArea"
                                        >
                                            {(provided, snapshot) => {
                                                return (
                                                    <MiddleMenuList
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        isDraggingOver={snapshot.isDraggingOver}
                                                        className="col-md-12 ml-0 mr-0 pl-0 pr-0"
                                                    >
                                                        {menus &&
                                                            menus.subLinks &&
                                                            menus.subLinks.map((sm, subIndex) => {
                                                                return (
                                                                    <Draggable
                                                                        draggableId={`draggable-sub-menu-item-${subIndex.toString()}`}
                                                                        index={subIndex}
                                                                        key={`sub-menu-item-${subIndex}`}
                                                                    >
                                                                        {(provided, snapshot) => (
                                                                            <MiddleMenuItem
                                                                                ref={
                                                                                    provided.innerRef
                                                                                }
                                                                                {...provided.draggableProps}
                                                                                isDragging={
                                                                                    snapshot.isDragging
                                                                                }
                                                                                className="row"
                                                                            >
                                                                                <ul
                                                                                    className={
                                                                                        menuType ===
                                                                                        'mainMenu'
                                                                                            ? 'menuitem__list'
                                                                                            : 'menuitem__list child'
                                                                                    }
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <li
                                                                                        className={
                                                                                            menuType ===
                                                                                            'mainMenu'
                                                                                                ? 'menuitem__list__item branch--node'
                                                                                                : 'menuitem__list__item branch--node'
                                                                                        }
                                                                                        onClick={(
                                                                                            event
                                                                                        ) => {
                                                                                            let menuPath =
                                                                                                menus
                                                                                                    .name
                                                                                                    .en +
                                                                                                '/' +
                                                                                                sm
                                                                                                    .name
                                                                                                    .en;
                                                                                            menuPath = menuPath
                                                                                                .toLowerCase()
                                                                                                .replace(
                                                                                                    /\s/g,
                                                                                                    '-'
                                                                                                )
                                                                                                .trim();
                                                                                            params.middleMenuItemsCallback(
                                                                                                sm,
                                                                                                menuPath
                                                                                            );
                                                                                            setPagePath(
                                                                                                menuPath
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <span>
                                                                                            {
                                                                                                sm
                                                                                                    .name
                                                                                                    .en
                                                                                            }
                                                                                        </span>
                                                                                        <div className="btn-group more__container dropright">
                                                                                            <span className="badge badge-primary badge-pill">
                                                                                                {
                                                                                                    sm.menuType
                                                                                                }
                                                                                            </span>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="more__button dropdown-toggle"
                                                                                                data-toggle="dropdown"
                                                                                                data-display="static"
                                                                                                aria-haspopup="true"
                                                                                                aria-expanded="false"
                                                                                                style={{
                                                                                                    width:
                                                                                                        '100%',
                                                                                                    textAlign:
                                                                                                        'left',
                                                                                                }}
                                                                                                onClick={(
                                                                                                    event
                                                                                                ) => {
                                                                                                    let menuPath =
                                                                                                        menus
                                                                                                            .name
                                                                                                            .en +
                                                                                                        '/' +
                                                                                                        sm
                                                                                                            .name
                                                                                                            .en;
                                                                                                    menuPath = menuPath
                                                                                                        .toLowerCase()
                                                                                                        .replace(
                                                                                                            /\s/g,
                                                                                                            '-'
                                                                                                        )
                                                                                                        .trim();
                                                                                                    params.middleMenuItemsCallback(
                                                                                                        sm,
                                                                                                        menuPath
                                                                                                    );
                                                                                                    setPagePath(
                                                                                                        menuPath
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <MeatBalls
                                                                                                    width="25px"
                                                                                                    height="25px"
                                                                                                />
                                                                                                {isNewSection && (
                                                                                                    <span className="badge badge-primary-plus badge-pill">
                                                                                                        <svg
                                                                                                            width="1.5em"
                                                                                                            height="1.5em"
                                                                                                            viewBox="0 0 16 16"
                                                                                                            className="bi bi-plus"
                                                                                                            fill="currentColor"
                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                        >
                                                                                                            <path
                                                                                                                fillRule="evenodd"
                                                                                                                d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
                                                                                                            />
                                                                                                            <path
                                                                                                                fillRule="evenodd"
                                                                                                                d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
                                                                                                            />
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                )}
                                                                                            </button>
                                                                                            <div
                                                                                                className="dropdown-menu dropdown-menu-lg-right"
                                                                                                style={{
                                                                                                    left:
                                                                                                        '140%',
                                                                                                }}
                                                                                            >
                                                                                                <React.Fragment>
                                                                                                    {menuType ===
                                                                                                        'mainMenu' && (
                                                                                                        <>
                                                                                                            <button
                                                                                                                className="dropdown-item"
                                                                                                                type="button"
                                                                                                                data-toggle="modal"
                                                                                                                data-target={
                                                                                                                    '#exampleModalId3' +
                                                                                                                    subIndex
                                                                                                                }
                                                                                                                data-whatever="test"
                                                                                                                onClick={(
                                                                                                                    e
                                                                                                                ) => {
                                                                                                                    handleShowLinkPages(
                                                                                                                        subIndex
                                                                                                                    );
                                                                                                                }}
                                                                                                            >
                                                                                                                Add
                                                                                                                Pages
                                                                                                            </button>
                                                                                                            <button
                                                                                                                className="dropdown-item"
                                                                                                                type="button"
                                                                                                                data-whatever="ExtLink"
                                                                                                                onClick={() => {
                                                                                                                    handleShow(
                                                                                                                        subIndex
                                                                                                                    );
                                                                                                                }}
                                                                                                            >
                                                                                                                External
                                                                                                                Link
                                                                                                            </button>
                                                                                                        </>
                                                                                                    )}
                                                                                                </React.Fragment>
                                                                                                <button
                                                                                                    className="dropdown-item"
                                                                                                    type="button"
                                                                                                    data-whatever="delete"
                                                                                                    onClick={(
                                                                                                        event
                                                                                                    ) => {
                                                                                                        handleShowSubSection();
                                                                                                        setMainIndex(
                                                                                                            menuIndex
                                                                                                        );
                                                                                                        setSelectedMenuItem(
                                                                                                            sm
                                                                                                        );
                                                                                                        setSubMenuIndex(
                                                                                                            subIndex
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    Delete
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                                <Droppable
                                                                                    droppableId={`subLevelDroppableArea-${subIndex.toString()}`}
                                                                                    type="subLevelDroppableArea"
                                                                                >
                                                                                    {(
                                                                                        provided,
                                                                                        snapshot
                                                                                    ) => {
                                                                                        return (
                                                                                            <MiddleMenuSubItemsList
                                                                                                {...provided.droppableProps}
                                                                                                ref={
                                                                                                    provided.innerRef
                                                                                                }
                                                                                                isDraggingOver={
                                                                                                    snapshot.isDraggingOver
                                                                                                }
                                                                                            >
                                                                                                {sm.subLinks &&
                                                                                                    sm.subLinks.map(
                                                                                                        (
                                                                                                            sm2,
                                                                                                            subIndex2
                                                                                                        ) => {
                                                                                                            return (
                                                                                                                <Draggable
                                                                                                                    draggableId={`draggable-page-item-${subIndex.toString()}-${subIndex2.toString()}`}
                                                                                                                    index={
                                                                                                                        subIndex2
                                                                                                                    }
                                                                                                                    key={`page-item-${subIndex}-${subIndex2}`}
                                                                                                                >
                                                                                                                    {(
                                                                                                                        provided,
                                                                                                                        snapshot
                                                                                                                    ) => (
                                                                                                                        <MiddleMenuSubItem
                                                                                                                            ref={
                                                                                                                                provided.innerRef
                                                                                                                            }
                                                                                                                            {...provided.draggableProps}
                                                                                                                            isDragging={
                                                                                                                                snapshot.isDragging
                                                                                                                            }
                                                                                                                        >
                                                                                                                            <MiddleMenuSubItemChild
                                                                                                                                className="menuitem__list child"
                                                                                                                                {...provided.dragHandleProps}
                                                                                                                            >
                                                                                                                                <li
                                                                                                                                    className="menuitem__list__item branch--node"
                                                                                                                                    onClick={(
                                                                                                                                        event
                                                                                                                                    ) => {
                                                                                                                                        let menuPath =
                                                                                                                                            menus
                                                                                                                                                .name
                                                                                                                                                .en +
                                                                                                                                            '/' +
                                                                                                                                            sm
                                                                                                                                                .name
                                                                                                                                                .en +
                                                                                                                                            '/' +
                                                                                                                                            sm2
                                                                                                                                                .name
                                                                                                                                                .en;
                                                                                                                                        menuPath = menuPath
                                                                                                                                            .toLowerCase()
                                                                                                                                            .replace(
                                                                                                                                                /\s/g,
                                                                                                                                                '-'
                                                                                                                                            )
                                                                                                                                            .trim();
                                                                                                                                        params.middleMenuItemsCallback(
                                                                                                                                            sm2,
                                                                                                                                            menuPath,
                                                                                                                                            linkPageObj
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    <span>
                                                                                                                                        {
                                                                                                                                            sm2
                                                                                                                                                .name
                                                                                                                                                .en
                                                                                                                                        }
                                                                                                                                    </span>
                                                                                                                                    <div className="more__container btn-group dropright">
                                                                                                                                        <span className="badge badge-primary badge-pill">
                                                                                                                                            {
                                                                                                                                                sm2.menuType
                                                                                                                                            }
                                                                                                                                        </span>
                                                                                                                                        <button
                                                                                                                                            type="button"
                                                                                                                                            className="more__button"
                                                                                                                                            data-toggle="dropdown"
                                                                                                                                            data-display="static"
                                                                                                                                            aria-haspopup="true"
                                                                                                                                            aria-expanded="false"
                                                                                                                                            type="submit"
                                                                                                                                        >
                                                                                                                                            <MeatBalls
                                                                                                                                                width="25px"
                                                                                                                                                height="25px"
                                                                                                                                            />
                                                                                                                                        </button>
                                                                                                                                        <div className="dropdown-menu dropdown-menu-lg-right">
                                                                                                                                            <button
                                                                                                                                                className="dropdown-item"
                                                                                                                                                type="button"
                                                                                                                                                type="submit"
                                                                                                                                                onClick={(
                                                                                                                                                    event
                                                                                                                                                ) => {
                                                                                                                                                    setMainIndex(
                                                                                                                                                        menuIndex
                                                                                                                                                    );
                                                                                                                                                    setSelectedMenuItem(
                                                                                                                                                        sm
                                                                                                                                                    );
                                                                                                                                                    setSubMenuIndex(
                                                                                                                                                        subIndex
                                                                                                                                                    );
                                                                                                                                                    setSelectedPageItem(
                                                                                                                                                        sm2
                                                                                                                                                    );
                                                                                                                                                    setPageItemIndex(
                                                                                                                                                        subIndex2
                                                                                                                                                    );
                                                                                                                                                    handleShowPageItem();
                                                                                                                                                }}
                                                                                                                                            >
                                                                                                                                                Delete
                                                                                                                                            </button>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            </MiddleMenuSubItemChild>
                                                                                                                        </MiddleMenuSubItem>
                                                                                                                    )}
                                                                                                                </Draggable>
                                                                                                            );
                                                                                                        }
                                                                                                    )}
                                                                                                {
                                                                                                    provided.placeholder
                                                                                                }
                                                                                            </MiddleMenuSubItemsList>
                                                                                        );
                                                                                    }}
                                                                                </Droppable>
                                                                            </MiddleMenuItem>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                        {provided.placeholder}
                                                    </MiddleMenuList>
                                                );
                                            }}
                                        </Droppable>
                                    </div>
                                </DragDropContext>
                            </React.Fragment>
                            {menuType === 'mainMenu' && (
                                <div className="row">
                                    <div className="menuitem__list">
                                        <div
                                            className="menuitem__list__item add--item"
                                            type="button"
                                            data-whatever="@mdo"
                                            onClick={() => {
                                                setAddMenuItemModal(true);
                                            }}
                                        >
                                            Add New Menu
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Modal show={showAddMenuItemModal} onHide={handleCloseAddMenuItemModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Menu Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label className="col-form-label">Menu Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="recipient-name"
                                    placeholder="Menu Name"
                                    value={subLinkName}
                                    onChange={(e) => {
                                        setSubLinkName(e.target.value);
                                        setShowMenuNameCannotEmpty(false);
                                    }}
                                ></input>
                                {showMenuNameCannotEmpty && (
                                    <small className="text-danger">Menu name cannot be empty</small>
                                )}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddMenuItemModal}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={(event) => {
                                if (subLinkName && subLinkName !== '' && subLinkName !== null) {
                                    setShowMenuNameCannotEmpty(false);
                                    newSectionInputChangeHandler(event);
                                    handleCloseAddMenuItemModal();
                                    setSubLinkName('');
                                } else {
                                    setShowMenuNameCannotEmpty(true);
                                }
                            }}
                        >
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showLinkPageModal} onHide={handleCloseLinkPages}>
                    <Modal.Header closeButton>
                        <Modal.Title>Link Pages</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            <LinkPageComponent
                                linkPages={(
                                    subLinkIndex,
                                    clickedPagesId,
                                    pageName,
                                    linkPageObj
                                ) => {
                                    newSubSectionLinkPageHandler(
                                        subLinkIndex,
                                        clickedPagesId,
                                        pageName,
                                        linkPageObj
                                    );
                                }}
                                subIndex={subLinkIndex}
                                dbName={params.dbName}
                                pageMenuPath={pagePath}
                                menuRef={params.menuReference}
                                menuType={params.menuType}
                                handleCloseLinkPages={handleCloseLinkPages}
                            ></LinkPageComponent>
                        }
                    </Modal.Body>
                </Modal>
                <Modal
                    show={showTopMenuDeleteModal}
                    onHide={handleCloseSubSection}
                    // index={mainIndex}
                    // subIndex={subMenuIndex}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Top Menu - Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Section Menu ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSubSection}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={(e) => {
                                newSectionDeleteHandler(
                                    e,
                                    selectedMenuItem,
                                    subMenuIndex,
                                    mainIndex
                                );
                                handleCloseSubSection();
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showPageItem}
                    onHide={handleClosePageItem}
                    // index={mainIndex}
                    // subIndex={subMenuIndex}
                    // subPageIndex={pageItemIndex}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Link Page - Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this page item ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePageItem}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={(e) => {
                                // menuDeleteHandler(e, selectedMenuItem, mainIndex);
                                linksDeleteHandler(
                                    e,
                                    selectedPageItem,
                                    pageItemIndex,
                                    mainIndex,
                                    subMenuIndex,
                                    selectedMenuItem
                                );
                                handleClosePageItem();
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showExternalLinkModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add - External Link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label className="col-form-label">Menu Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="recipient-name"
                                    placeholder="Menu Name"
                                    value={extLinkName}
                                    onChange={(event) => inputChangedHandlerExtMenuName(event)}
                                ></input>
                             {params.supportLanguages &&
                                params.supportLanguages.map((language, languageIndex) => {
                                    return (
                                        <div className="form-group" key={`${language.langKey}-${languageIndex}`}>
                                             <label className="col-form-label">Link URL - {language.language}</label>
                                             <input
                                    className="form-control"
                                    placeholder={`Menu URL-${language.langKey}`}
                                    value={ extLinksPath[language.langKey.toLowerCase()]}
                                    onChange={(event) => inputChangedHandlerExtMenuPath(event,language.langKey)}
                                ></input>
                                        </div>
                                    );
                                })}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={(event) => {
                                newExtLinkInputChangeHandler(event, subLinkIndex);
                                setExtLinkName('');
                                setExtLinkPath({});
                                handleClose();
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    } else {
        return (
            <div className="page--tooltip">
                <div className="page--tooltip--text">
                    Select parent menu from sidebar or create new menu
                </div>
            </div>
        );
    }
}
