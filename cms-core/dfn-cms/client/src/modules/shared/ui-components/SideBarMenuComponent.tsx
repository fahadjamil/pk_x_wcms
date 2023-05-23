import React from 'react';
import { useDispatch } from 'react-redux';
import { switchPage } from '../../redux/action';
import MainMenuModel from '../models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../models/side-bar-menu-models/SubMenuModel';
import AccordianExpandIcon from '../resources/AccordianExpandIcon';

interface SideBarMenuComponentModel {
    menuData: MainMenuModel[];
    activeMenuItemID?: string;
    setActiveMenuItemID?: any;
    onMenuClicked: any;
}

function SideBarMenuComponent(props: SideBarMenuComponentModel) {
    const dispatch = useDispatch();

    function getTopMenuItems(topMenuItem: MainMenuModel, topMenuIndex: number) {
        const uniqueMenuName = topMenuItem.topMenuText.replace(/[^A-Z0-9]+/gi, '_');
        const mainMenuId = `${uniqueMenuName}${topMenuIndex}`;
        return (
            <React.Fragment key={mainMenuId}>
                <div className="nav__accordion__section">
                    <div
                        className="nav__accordion__header"
                        id={mainMenuId}
                        data-toggle="collapse"
                        data-target={'#collapse' + mainMenuId}
                    >
                        <AccordianExpandIcon width="20px" height="20px" />
                        {topMenuItem.topMenuText.toUpperCase()}
                        <a href="#" className="newitem">
                            +
                        </a>
                    </div>

                    <div
                        id={'collapse' + mainMenuId}
                        className="collapse show"
                        aria-labelledby={mainMenuId}
                    >
                        <ul className="nav flex-column">
                            {topMenuItem.subMenus.map((subMenuItem, subMenuIndex) => {
                                return getSubMenuItems(
                                    mainMenuId,
                                    topMenuItem,
                                    subMenuItem,
                                    subMenuIndex,
                                    topMenuIndex
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    function getSubMenuItems(
        mainMenuUniqueId: string,
        topMenuItem: MainMenuModel,
        subMenuItem: SubMenuModel,
        subMenuItemIndex: number,
        topMenuItemIndex: number
    ) {
        const uniqueMenuName = subMenuItem.menuText.replace(/[^A-Z0-9]+/gi, '_');
        const subMenuId = `${uniqueMenuName}_${topMenuItemIndex}_${subMenuItemIndex}`;

        if (subMenuItem.subMenus && subMenuItem.subMenus.length > 0) {
            return (
                <li key={mainMenuUniqueId + subMenuId} className="nav-item">
                    <div
                        className="nav__accordion__submenuheader"
                        id={subMenuId}
                        data-toggle="collapse"
                        data-target={'#collapse' + subMenuId}
                    >
                        {subMenuItem.menuText}
                    </div>

                    <ul
                        id={'collapse' + subMenuId}
                        className="collapse show"
                        aria-labelledby={subMenuId}
                    >
                        {subMenuItem.subMenus.map((subMenu, index) => {
                            const uniqueParentMenuName = subMenu.menuText.replace(
                                /[^A-Z0-9]+/gi,
                                '_'
                            );
                            const subChildMenuId = `${uniqueParentMenuName}_${topMenuItemIndex}_${subMenuItemIndex}_${index}`;

                            return (
                                <li key={subMenuId + subChildMenuId} className="nav-item">
                                    <button
                                        type="button"
                                        className={`btn btn-block text-left ${
                                            props.activeMenuItemID === subChildMenuId
                                                ? 'active'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            props.onMenuClicked &&
                                                props.onMenuClicked(
                                                    topMenuItem,
                                                    subMenu,
                                                    subMenu.dataObject
                                                );
                                            props.setActiveMenuItemID &&
                                                props.setActiveMenuItemID(subChildMenuId);
                                            // set selected page name in top panel
                                            dispatch(switchPage(subMenu.menuText));
                                        }}
                                    >
                                        {subMenu.menuText}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </li>
            );
        } else {
            return (
                <li key={mainMenuUniqueId + subMenuId} className="nav-item">
                    <button
                        type="button"
                        className={`btn btn-block text-left ${
                            props.activeMenuItemID === subMenuId ? 'active' : ''
                        }`}
                        onClick={() => {
                            props.onMenuClicked &&
                                props.onMenuClicked(
                                    topMenuItem,
                                    subMenuItem,
                                    subMenuItem.dataObject
                                );
                            props.setActiveMenuItemID && props.setActiveMenuItemID(subMenuId);
                            // set selected page name in top panel
                            dispatch(switchPage(subMenuItem.menuText));
                        }}
                    >
                        {subMenuItem.menuText}
                    </button>
                </li>
            );
        }
    }

    return (
        <div className="accordion nav__accordion" id="accordionExample">
            {props.menuData &&
                props.menuData.map((topMenuItem, index) => {
                    return getTopMenuItems(topMenuItem, index);
                })}
        </div>
    );
}

export default SideBarMenuComponent;
