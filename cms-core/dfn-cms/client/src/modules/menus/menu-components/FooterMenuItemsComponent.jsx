import {getAuthorizationHeader, isEnable} from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
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

const FooterMenuList = styled.ul`
    transition: background-color 0.2s ease;
    border: ${(props) => (props.isDragging ? '1px solid #FFF' : '1px dashed #ffffff33')};
    list-style: none;
    padding: 0;
    background-color: ${(props) => (props.isDraggingOver ? '#66bcff33' : 'none')};
    content: '02';
    border-radius: 0.25rem;
`;

const FooterMenuItem = styled.li`
    color: #ffffffb3;
    border: ${(props) => (props.isDragging ? 'none' : 'none')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#66bcff33' : 'none')};
    content: '06';
    padding: 0 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
`;

export default function FooterMenuItemsComponent(props) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasMenuItemClicked, setHasMenuItemClicked] = useState(false);
    const [menus, setMenu] = useState({});
    const [error, setError] = useState(null);
    const history = useHistory();
    const [pageId, setPageId] = useState('');
    const [menuType, setMenuType] = useState('');
    const [mainIndex, setMainIndex] = useState('');
    const addMenuItemInput = useRef(null);

    // const [mainIndex, setMainIndex] = useState('');
    const [selectedMenuItem, setSelectedMenuItem] = useState({});

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
    }, [props.dbName]);

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
                setIsLoaded(true); //result.data
                setMenu((menus) => result.data[1]);
                setPageId(result.data[1]._id);
                setMenuType(result.data[1].type);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        let section = {
            name: {
                en: menuName,
                ar: '',
            },
            path: '',
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

    function inputChangedHandler(event) {
        event.preventDefault();
        menuName = event.target.value;
    }

    function menuDeleteHandler(event, m, index) {
        const updatedMenus = { ...menus };

        if (mainIndex !== -1) {
            updatedMenus.menu.splice(mainIndex, 1);
        }

        // setMenu(menus[0]);

        m.subLinks &&
            m.subLinks.map((sm, subIndex2, subIndex) => {
                sm.subLinks &&
                    sm.subLinks.map((links) => {
                        selectedPageSubSection.push(links.page);
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

        Axios.post('/api/menus/data/save', updatedMenus, httpHeaders)
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

        setMenu(updatedMenus);

        if (hasMenuItemClicked) {
            props.mainMenuItemsCallback(menus.menu[0], menus, pageId, menuType, 0);
            dispatch(switchPage(menus.menu[0].name.en));
        }
    }

    const GetFooterMenuItems = (params) => {
        const { index, menuItem } = params;

        return (
            <React.Fragment key={`mainMenu${index}`}>
                <span className="nav-item hover-parent">
                    <button
                        className="row"
                        type="button"
                        type="submit"
                        onClick={(event) => {
                            setHasMenuItemClicked(true);
                            props.mainMenuItemsCallback(menus.menu[index], menus, pageId, menuType, index);
                            dispatch(switchPage(menuItem.name.en));
                        }}
                    >
                        <span className="col"> {menuItem.name.en} </span>
                        <span
                            className="col-1 badge badge-outline-danger badge-pill hover-child"
                            onClick={(event) => {
                                handleShow();
                                setMainIndex(index);
                                setSelectedMenuItem(menuItem);
                            }}
                        >
                            <PESectionDelete width="20px" height="20px" />
                        </span>
                    </button>
                </span>
            </React.Fragment>
        );
    };

    const onDragEnd = (result) => {
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
        props.setFooterMenu(newMenus);
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
                                    <FooterMenuList
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
                                                        <FooterMenuItem
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            isDragging={snapshot.isDragging}
                                                        >
                                                            <GetFooterMenuItems
                                                                index={menuItemIndex}
                                                                menuItem={menuItem}
                                                            />
                                                        </FooterMenuItem>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </FooterMenuList>
                                );
                            }}
                        </Droppable>
                    </MenuSectionsListContainer>
                </DragDropContext>
                <div>
                    <div>
                        <a
                            className=""
                            data-toggle="collapse"
                            href="#multiCollapseExampleFooter"
                            role="button"
                            aria-expanded="false"
                            aria-controls="multiCollapseExample1"
                        >
                            + New Footer Menu
                        </a>

                        <div className="">
                            <div className="">
                                <div
                                    className="collapse multi-collapse"
                                    id="multiCollapseExampleFooter"
                                >
                                    <div className="col-12">
                                        <form onSubmit={handleSubmit}>
                                            <div className="input-group mt-2 mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Name"
                                                    aria-label="Menu Name"
                                                    aria-describedby="Add new Footer item"
                                                    onChange={inputChangedHandler}
                                                    id="footer"
                                                    ref={addMenuItemInput}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        className="btn btn-primary"
                                                        disabled={
                                                            isEnable('/api/menus/create')
                                                        }
                                                        type="submit"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={handleClose} index={mainIndex}>
                    <Modal.Header closeButton>
                        <Modal.Title>Footer Menu - Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Footer Menu ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
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
