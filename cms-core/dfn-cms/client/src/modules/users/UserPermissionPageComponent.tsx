import React, { useState, useEffect } from 'react';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import SiteUserPermission from './permission-components/site-user/SitePermissionComponent';
import CmsUserRole from './permission-components/cms-user/RoleComponent';
import CmsUser from './permission-components/cms-user/UserComponent';
import CmsUserPermission from './permission-components/cms-user/PermissionComponent';
import SiteUserRole from './permission-components/site-user/SiteRoleComponent';
import SiteUsers from './permission-components/site-user/site-user-management/SiteUsers';
import { useDispatch, connect } from 'react-redux';
import { switchPage } from '../redux/action';
import SideBarMenuComponent from '../shared/ui-components/SideBarMenuComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import { isEnable } from '../shared/utils/AuthorizationUtils';
import ProductsComponent from './product-subscription/products/ProductsComponent';
import SubGroupsComponent from './product-subscription/sub-groups/SubGroupsComponent';
import GroupsComponent from './product-subscription/groups/GroupsComponent';
import SubscriptionPeriodsComponent from './product-subscription/subscription-periods/SubscriptionPeriodsComponent';
import SubscriptionsComponent from './product-subscription/subscriptions/SubscriptionsComponent';
import PurchaseTransactionsComponent from './product-subscription/purchase-transactions/PurchaseTransactionsComponent';

export function UserPermissionPageComponent(props) {
    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [showMenu, setShowMenu] = useState('');
    const [activeMenuItemID, setActiveMenuItemID] = useState('');

    const dispatch = useDispatch();
    const database = props.website;

    useEffect(() => {
        addDummyMenuItems();
        dispatch(switchPage('User Management'));
    }, [database]);

    useEffect(() => {
        if (menuData.length > 0 && menuData[0].subMenus.length > 0) {
            let initialTemplate = menuData[0].subMenus[0].dataObject;
            let menuText = menuData[0].subMenus[0].menuText;
            let topMenuIndex = 0;
            let subMenuIndex = 0;
            const uniqueMenuName = menuText.replace(/[^A-Z0-9]+/gi, '_');
            const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

            setInitialPermission(initialTemplate, menuText);
            setActiveMenuItemID(subMenuId);
        }
    }, [menuData]);

    function addDummyMenuItems() {
        let siteUsers: MainMenuModel = {
            topMenuText: 'SITE USERS',
            topMenuID: 'SiteUsers',
            subMenus: [
                { menuText: 'User Permissions', dataObject: 'siteUserPermission', notifiIcon: {} },
                { menuText: 'User Roles', dataObject: 'siteUserRole', notifiIcon: {} },
                { menuText: 'User Management', dataObject: 'siteUsers', notifiIcon: {} },
            ],
        };

        let cmsUsers: MainMenuModel = {
            topMenuText: 'CMS USERS',
            topMenuID: 'CMSUsers',
            subMenus: [
                {
                    menuText: 'CMS User Permissions',
                    dataObject: 'cmsUserPermission',
                    notifiIcon: {},
                },
                { menuText: 'CMS User Roles', dataObject: 'cmsUserRole', notifiIcon: {} },
                {
                    menuText: 'CMS Users',
                    dataObject: 'cmsUser',
                    notifiIcon: {},
                },
            ],
        };

        let productSubscription: MainMenuModel = {
            topMenuText: 'PRODUCT SUBSCRIPTION',
            topMenuID: 'ProductSubscription',
            subMenus: [
                { menuText: 'Products', dataObject: 'products', notifiIcon: {} },
                { menuText: 'Groups', dataObject: 'groups', notifiIcon: {} },
                { menuText: 'Sub Groups', dataObject: 'subGroups', notifiIcon: {} },
                {
                    menuText: 'Subscription Periods',
                    dataObject: 'subscriptionPeriods',
                    notifiIcon: {},
                },
                { menuText: 'Subscriptions', dataObject: 'subscriptions', notifiIcon: {} },
                {
                    menuText: 'KNET Transactions',
                    dataObject: 'purchaseTransactions',
                    notifiIcon: {},
                },
            ],
        };

        setMenuData([siteUsers, cmsUsers, productSubscription]);
    }

    function setInitialPermission(dataObject: any, title: string) {
        if (dataObject) {
            setShowMenu(dataObject);
            dispatch(switchPage(title));
        }
    }

    function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {
        setShowMenu(dataObject);
    }

    return (
        <>
            <aside className="main__sidebar">
                <div className="main__sidebar__content">
                    <SideBarComponent>
                        <SideBarMenuComponent
                            menuData={menuData}
                            activeMenuItemID={activeMenuItemID}
                            onMenuClicked={onMenuItemClicked}
                            setActiveMenuItemID={setActiveMenuItemID}
                        />
                    </SideBarComponent>
                </div>
            </aside>
            <main className="main__content">
                <TopPanelComponent />
                <div className="page__content__container">
                    {console.log(props)}
                    {(() => {
                        switch (showMenu) {
                            case 'siteUserPermission':
                                if (!isEnable('/api/menus')) {
                                    return (
                                        <SiteUserPermission
                                            website={props.website}
                                        ></SiteUserPermission>
                                    );
                                }
                            case 'siteUserRole':
                                if (!isEnable('/api/sites/roles')) {
                                    return <SiteUserRole website={props.website}></SiteUserRole>;
                                }
                            case 'siteUsers':
                                if (!isEnable('/api/sites/roles')) {
                                    return <SiteUsers website={props.website}></SiteUsers>;
                                }
                            case 'cmsUserPermission':
                                if (!isEnable('/api/cms/permissions')) {
                                    return (
                                        <CmsUserPermission
                                            website={props.website}
                                        ></CmsUserPermission>
                                    );
                                }
                            case 'cmsUserRole':
                                if (!isEnable('/api/cms/roles')) {
                                    return <CmsUserRole website={props.website}></CmsUserRole>;
                                }

                            case 'cmsUser':
                                if (!isEnable('/api/cms/users')) {
                                    return <CmsUser website={props.website}></CmsUser>;
                                }

                            // TODO: Handle permissions for this menu item
                            case 'products':
                                return <ProductsComponent></ProductsComponent>;

                            // TODO: Handle permissions for this menu item
                            case 'subGroups':
                                return <SubGroupsComponent></SubGroupsComponent>;

                            // TODO: Handle permissions for this menu item
                            case 'groups':
                                return <GroupsComponent></GroupsComponent>;

                            // TODO: Handle permissions for this menu item
                            case 'subscriptionPeriods':
                                return (
                                    <SubscriptionPeriodsComponent></SubscriptionPeriodsComponent>
                                );

                            // TODO: Handle permissions for this menu item
                            case 'subscriptions':
                                return <SubscriptionsComponent></SubscriptionsComponent>;

                            // TODO: Handle permissions for this menu item
                            case 'purchaseTransactions':
                                return (
                                    <PurchaseTransactionsComponent></PurchaseTransactionsComponent>
                                );
                        }
                    })()}
                </div>
            </main>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(UserPermissionPageComponent);
