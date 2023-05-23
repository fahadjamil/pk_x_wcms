import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { switchPage } from '../redux/action';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import AccordianExpandIcon from '../shared/resources/AccordianExpandIcon';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import FooterMenuItemsComponent from './menu-components/FooterMenuItemsComponent';
import MainMenuItemsComponent from './menu-components/MainMenuItemsComponent';
import MenuSettingsComponent from './menu-components/MenuSettingsComponent';
import MiddleMenuComponent from './menu-components/MiddleMenuComponent';

function MenuPageComponent(props) {
    const dispatch = useDispatch();
    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [menuItem, setMenuItem] = useState([]);
    const [singleMenuItem, setSingleMenuItem] = useState([]);
    const [menus, setAllMenu] = useState<any>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState({});
    const [menuPath, setMenuPath] = useState('');
    const [menuRef, setMenuRef] = useState('');
    const [menuType, setMenuType] = useState('');
    const [menuIndex, setMenuIndex] = useState('');
    const [updatedItem, setUpdateMenuItem] = useState<any>();
    const database = props.website;
    const websiteLanguages = props.lang;

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            dispatch(switchPage('Main Menu'));
        }

        return () => {
            isMounted = false;
        };
    }, [database]);

    function mainMenuItemsHandler(menuItem, fullMenu, menuRef, menuType, index) {
        //Set first menu item for menu settings when selected main menu item
        let menuPath = menuItem?.path;
        if (menuPath) {
            menuPath = menuPath.toLowerCase().replace(/\s/g, '-').replace(/\//g, '').trim();
            setMenuPath(menuPath);
        }
        setSingleMenuItem(menuItem);

        setMenuItem(menuItem);
        setAllMenu(fullMenu);
        setMenuRef(menuRef);
        setMenuType(menuType);
        setMenuIndex(index);
    }

    function middleMenuItemsHandler(singleMenuItem, menuPath, pageObj) {
        setSingleMenuItem(singleMenuItem);
        setMenuPath(menuPath);
        setPage(pageObj);
    }

    function saveMenuItemsHandler(data) {
        setUpdateMenuItem(data);
        saveChanges();
    }

    // TODO: Currently only one menu (header or footer) will be saved at a time
    function saveChanges() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: database,
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
    }

    function addDummyMenuItems() {
        let topMenuObject: MainMenuModel = {
            topMenuText: 'FOOTER MENU',
            topMenuID: 'FOOTERMENU',
            subMenus: [{ menuText: 'Customize', dataObject: undefined, notifiIcon: {} }],
        };
        setMenuData([topMenuObject]);
    }

    function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {}

    return (
        <>
            <aside className="main__sidebar">
                <div className="main__sidebar__content">
                    <SideBarComponent>
                        <div className="accordion" id="accordionExample">
                            <div className="nav__accordion__section">
                                <div
                                    className="nav__accordion__header"
                                    id="MainMenu"
                                    data-toggle="collapse"
                                    data-target="#collapseMainMenu"
                                >
                                    <AccordianExpandIcon width="20px" height="20px" />
                                    Main Menu
                                    <a href="#" className="newitem">
                                        +
                                    </a>
                                </div>
                                <div
                                    id="collapseMainMenu"
                                    className="collapse show"
                                    aria-labelledby="MainMenu"
                                >
                                    <MainMenuItemsComponent
                                        dbName={database}
                                        supportLanguages={websiteLanguages}
                                        setHeaderMenu={setAllMenu}
                                        mainMenuItemsCallback={(
                                            menuItem,
                                            fullMenu,
                                            menuRef,
                                            menuType,
                                            index
                                        ) =>
                                            mainMenuItemsHandler(
                                                menuItem,
                                                fullMenu,
                                                menuRef,
                                                menuType,
                                                index
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="accordion" id="accordionExample">
                            <div className="nav__accordion__section">
                                <div
                                    className="nav__accordion__header"
                                    id="FooterMenu"
                                    data-toggle="collapse"
                                    data-target="#collapseFooterMenu"
                                >
                                    <AccordianExpandIcon width="20px" height="20px" />
                                    Footer Menu
                                    <a href="#" className="newitem">
                                        +
                                    </a>
                                </div>
                                <div
                                    id="collapseFooterMenu"
                                    className="collapse show"
                                    aria-labelledby="FooterMenu"
                                >
                                    <ul className="nav flex-column">
                                        <FooterMenuItemsComponent
                                            dbName={database}
                                            setFooterMenu={setAllMenu}
                                            mainMenuItemsCallback={(
                                                menuItem,
                                                fullMenu,
                                                menuRef,
                                                menuType,
                                                index
                                            ) =>
                                                mainMenuItemsHandler(
                                                    menuItem,
                                                    fullMenu,
                                                    menuRef,
                                                    menuType,
                                                    index
                                                )
                                            }
                                        />
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </SideBarComponent>
                </div>
            </aside>
            <main className="main__content">
                <TopPanelComponent />
                <div className="page__content__container pt-0">
                    <div className="page__toolbar__container mb-3">
                        <div className="row">
                            <div className="col text-right">
                                <button className="btn btn-outline-secondary mr-2">Discard</button>
                                <button className="btn btn-outline-primary" onClick={saveChanges}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-9">
                            <MiddleMenuComponent
                                menuItem={menuItem}
                                dbName={database}
                                menuReference={menuRef}
                                menuType={menuType}
                                menuIndex={menuIndex}
                                menus={menus}
                                supportLanguages={websiteLanguages}
                                setAllMenu={setAllMenu}
                                middleMenuItemsCallback={(singleMenuItem, menuPath, pageObj) =>
                                    middleMenuItemsHandler(singleMenuItem, menuPath, pageObj)
                                }
                            />
                        </div>
                        <div className="col-md-3">
                            <MenuSettingsComponent
                                singleMenuItem={singleMenuItem}
                                menuPath={menuPath}
                                dbName={database}
                                supportLanguages={websiteLanguages}
                                updateMenuCallback={(data) => saveMenuItemsHandler(data)}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
    };
};

export default connect(mapStateToProps)(MenuPageComponent);
