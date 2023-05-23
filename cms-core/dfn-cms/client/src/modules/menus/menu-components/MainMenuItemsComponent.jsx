import {getAuthorizationHeader, isEnable} from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import './MiddleMenuComponent.css';
import { useDispatch } from 'react-redux';
import { switchPage } from '../../redux/action';

import PESectionEdit from '../../shared/resources/PageEditor-Section-Edit';
import PESectionSettings from '../../shared/resources/PageEditor-Section-Settings';
import PESectionDelete from '../../shared/resources/PageEditor-Section-Delete';

const MenuSectionsListContainer = styled.div`
    margin: 0.5rem;
    padding: 20px 0px;
    display: flex;
    flex-direction: column;
    min-height: auto;
    content: '01';
`;

const MainMenuList = styled.ul`
    transition: background-color 0.2s ease;
    border: ${(props) => (props.isDragging ? '1px solid #FFF' : '1px dashed #ffffff33')};
    list-style: none;
    padding: 0;
    background-color: ${(props) => (props.isDraggingOver ? '#66bcff33' : 'none')};
    content: '02';
    border-radius: 0.25rem;
`;

const MainMenuItem = styled.li`
    color: #ffffffb3;
    border: ${(props) => (props.isDragging ? 'none' : 'none')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#66bcff33' : 'none')};
    content: '06';
    padding: 0 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
`;

export default function MainMenuItemsComponent(props) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasMenuItemClicked, setHasMenuItemClicked] = useState(false);
    const [menus, setMenu] = useState({});
    const [error, setError] = useState(null);
    const history = useHistory();
    const [pageId, setPageId] = useState('');
    const [menuType, setMenuType] = useState('');
    const [mainIndex, setMainIndex] = useState('');
    const [selectedMenuItem, setSelectedMenuItem] = useState({});
    const addMenuItemInput = useRef(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let menuName = '';
    let selectedPageSubSection = [];

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            getAllMenu();
        }
        return () => {
            isMounted = false;
        };
    }, [props.dbName, isLoaded]);

    useEffect(() => {
        if (menus?.menu) {
            setInitialMenus(menus, menus?.menu[0]?.name?.en);
        }
    }, [menus]);

    function setInitialMenus(dataObject, title) {
        if (dataObject) {
            props.mainMenuItemsCallback(
                dataObject.menu[0],
                dataObject,
                dataObject._id,
                dataObject.type,
                0
            );
            dispatch(switchPage(title));
        }
    }

    function getAllMenu() {
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
        Axios.get('/api/menus', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setMenu((menus) => result.data[0]);
                setPageId(result.data[0]._id);
                setMenuType(result.data[0].type);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (menuName && menuName !== '' && menuName !== null) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            // const jwt = localStorage.getItem('jwt-token');

            const ValueObj = {
                [props.supportLanguages[0].langKey.toLowerCase()]: menuName,
            };

            let section = {
                name: ValueObj,
                path: '/' + menuName.replace(/\s/g, '-').toLowerCase().trim() + '/',
                iconPath: '',
                menuType: '',
                subLinks: [],
                roles: [],
            };
            // const httpHeaders = {
            //     headers: {
            //         Authorization: jwt,
            //     },
            // };

            Axios.post(
                '/api/menus/create',

                {
                    dbName: props.dbName,
                    page_id: pageId,
                    new_section: section,
                },
                httpHeaders
            )
                .then((response) => {
                    menuName = '';
                    getAllMenu();
                    addMenuItemInput.current.value = '';
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function inputChangedHandler(event) {
        event.preventDefault();
        menuName = event.target.value;
    }

    function onDragEnd(result) {
        const { destination, source, draggableId } = result;

        // If user drops outside of the droppable zone
        if (!destination) {
            return;
        }

        // If user drops the item back into the the start position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // Drag and drop occure within same column (Source and Destinations are equal)
        const newMenus = { ...menus };
        const newMenuOrder = Array.from(newMenus.menu);
        const newMenuItem = newMenuOrder[source.index];

        newMenuOrder.splice(source.index, 1);
        newMenuOrder.splice(destination.index, 0, newMenuItem);

        newMenus.menu = newMenuOrder;
        setMenu(newMenus);
        props.setHeaderMenu(newMenus);
    }

    const GetMainMenuItems = (params) => {
        const { index, m } = params;

        return (
            <React.Fragment>
                <span className="hover-parent" >
                    <button
                        className="row"
                        onClick={() => {
                            setHasMenuItemClicked(true);
                            props.mainMenuItemsCallback(
                                menus.menu[index],
                                menus,
                                pageId,
                                menuType,
                                index
                            );
                            dispatch(
                                switchPage(m.name[props.supportLanguages[0].langKey.toLowerCase()])
                            );
                        }}
                    >
                        <span className="col"> {m.name[props.supportLanguages[0].langKey.toLowerCase()]} </span>

                        <span
                            className="col-1 badge badge-outline-danger badge-pill  hover-child"
                            // onClick={(event) => {
                            //     menuDeleteHandler(event, m, index);
                            // }}
                            onClick={(event) => {
                                handleShow();
                                setMainIndex(index);
                                setSelectedMenuItem(m);
                            }}
                            // onClick={handleShow}
                        >
                            <PESectionDelete width="18px" height="18px" />
                        </span>
                    </button>
                </span>
            </React.Fragment>
        );
    };

    function menuDeleteHandler(event, m, index) {
        if (mainIndex !== -1) {
            menus.menu.splice(mainIndex, 1);
        }

        m.subLinks &&
            m.subLinks.map((sm, subIndex2, subIndex) => {
                sm.subLinks &&
                    sm.subLinks.map((links) => {
                        if (links.menuType === 'page') {
                            selectedPageSubSection.push(links.page);
                        }
                    });
            });

            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.dbName,
        //         // dbName: 'bk-main-demo',
        //     },
        // };

        Axios.post('/api/menus/data/save', menus, httpHeaders)
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
                    dbName: props.dbName,
                    page_id: pageId,
                },
                httpHeaders
            )
                .then((response) => {})
                .catch((err) => {
                    console.log(err);
                });
        });

        if (hasMenuItemClicked) {
            props.mainMenuItemsCallback(menus.menu[0], menus, pageId, menuType, 0);
            dispatch(switchPage(menus.menu[0].name.en));
        }
    }

    const mainMenu = (m, index) => {
        return (
            <React.Fragment key={`MainMenu${index}`}>
                <Modal show={show} onHide={handleClose} index={index}>
                    <Modal.Header closeButton>
                        <Modal.Title>Top Menu - Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Top Menu ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={(e) => {
                                menuDeleteHandler(e, m, index);
                                handleClose();
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Draggable draggableId={uuidv4()} index={index} isDragDisabled={false}>
                    {(provided, snapshot) => {
                        return (
                            <li
                                className="nav-item"
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                isDragging={snapshot.isDragging}
                            >
                                <button
                                    type="button"
                                    className=""
                                    type="submit"
                                    onClick={(event) => {
                                        props.mainMenuItemsCallback(
                                            menus[0].menu[index],
                                            menus[0],
                                            pageId,
                                            menuType,
                                            index
                                        );
                                    }}
                                >
                                    {m.name.en}
                                    <span
                                        className="badge badge-outline-danger badge-pill"
                                        // onClick={(event) => {
                                        //     menuDeleteHandler(event, m, index);
                                        // }}
                                        onClick={(event) => {
                                            handleShow();
                                            setMainIndex(index);
                                        }}
                                        // onClick={handleShow}
                                    >
                                        <svg
                                            width="1.2em"
                                            height="1.2em"
                                            viewBox="0 0 16 16"
                                            className="bi bi-x"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            </li>
                        );
                    }}
                </Draggable>
            </React.Fragment>
        );
    };

    if (menus && Object.keys(menus).length > 0) {
        const { _id, menu, type } = menus;

        return (
            <>
                <DragDropContext onDragEnd={onDragEnd}>
                    <MenuSectionsListContainer>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => {
                                return (
                                    <MainMenuList
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        isDraggingOver={snapshot.isDraggingOver}
                                    >
                                        {menu.map((menuItem, menuItemIndex) => {
                                            const { name } = menuItem;

                                            return (
                                                <Draggable
                                                    key={`draggable-menu-item-${menuItemIndex.toString()}`}
                                                    draggableId={`draggable-menu-item-${menuItemIndex.toString()}`}
                                                    index={menuItemIndex}
                                                >
                                                    {(provided, snapshot) => (
                                                        <MainMenuItem
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            isDragging={snapshot.isDragging}
                                                        >
                                                            <GetMainMenuItems
                                                                index={menuItemIndex}
                                                                m={menuItem}
                                                            />
                                                        </MainMenuItem>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </MainMenuList>
                                );
                            }}
                        </Droppable>
                    </MenuSectionsListContainer>
                </DragDropContext>
                <a
                    data-toggle="collapse"
                    href="#multiCollapseExample1"
                    role="button"
                    aria-expanded="false"
                    aria-controls="multiCollapseExample1"
                >
                    + New Main Menu
                </a>
                <div className="collapse multi-collapse" id="multiCollapseExample1">
                    <div className="col-12 ml-1">
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mt-2 mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    aria-label="Menu Name"
                                    aria-describedby="Add new menu item"
                                    onChange={inputChangedHandler}
                                    id="website"
                                    ref={addMenuItemInput}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                        disabled={
                                            isEnable('/api/menus/create')
                                        }
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <Modal show={show} onHide={handleClose} index={mainIndex}>
                    <Modal.Header closeButton>
                        <Modal.Title>Top Menu - Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Top Menu ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            disabled={
                                isEnable('/api/menus/data/save')
                            }
                            onClick={(e) => {
                                menuDeleteHandler(e, selectedMenuItem, mainIndex);
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
        return <></>;
    }
}
