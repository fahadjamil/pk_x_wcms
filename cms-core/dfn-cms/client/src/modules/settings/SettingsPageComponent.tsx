import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { switchPage } from '../redux/action';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import SideBarMenuComponent from '../shared/ui-components/SideBarMenuComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import ActivityLogsPageComponent from './activity-logs/ActivityLogsPageComponent';
import ArchivesPageComponent from './archives/ArchivesPageComponent';
import LanguageListComponent from './main-settings/add-languages';
import StaticResourcesComponent from './main-settings/static-resources';
import SEOGuideComponent from './seo/seo-guide/SEOGuideComponent';
import ThemeConfigurationModel from './themes/models/ThemeConfigurationModel';
import ThemeEditorComponent from './themes/theme-editor-component/ThemeEditorComponent';

function SettingsPageComponent(props) {
    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<ThemeConfigurationModel>();
    const [selectedMenu, setSelectedMenu] = useState('');
    const [activeMenuItemID, setActiveMenuItemID] = useState('');
    const database = props.website;
    const dispatch = useDispatch();

    useEffect(() => {
        getAllThemes();
        setSelectedTheme(undefined);
        dispatch(switchPage('Website Settings'));
    }, [props.website]);

    useEffect(() => {
        if (menuData.length > 0 && menuData[0].subMenus.length > 0) {
            let initialTemplate = menuData[0].subMenus[0].dataObject;
            let menuText = menuData[0].subMenus[0].menuText;
            let topMenuIndex = 0;
            let subMenuIndex = 0;
            const uniqueMenuName = menuText.replace(/[^A-Z0-9]+/gi, '_');
            const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

            setInitialSetting(initialTemplate, menuText);
            setActiveMenuItemID(subMenuId);
        }
    }, [menuData]);

    function getAllThemes() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/themes', httpHeaders)
            .then((result) => {
                let topMenuObject: MainMenuModel = {
                    topMenuText: 'Themes',
                    topMenuID: 'ThemeComponent',
                    subMenus: [],
                };
                result.data.forEach((theme) => {
                    let subMenuObject: SubMenuModel = {
                        menuText: theme.displayName,
                        menuID: theme._id,
                        dataObject: theme,
                        notifiIcon: {},
                    };
                    topMenuObject.subMenus.push(subMenuObject);
                });

                let settingsObject = addDummyTopMenuItems();
                let activityAuditObect = addDummyMenuItems();
                let seoObejct = addDummySecondMenuItems();
                let archiveObject = addDummyThirdMenuItems();

                //menuData.push(topMenuObject);
                const cloneMenu = [
                    settingsObject,
                    topMenuObject,
                    activityAuditObect,
                    seoObejct,
                    archiveObject,
                ];
                setMenuData(cloneMenu);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function setInitialSetting(dataObject: any, title: string) {
        if (dataObject) {
            setSelectedMenu(dataObject);
            dispatch(switchPage(title));
        }
    }

    function addDummyTopMenuItems() {
        let topMenuObject: MainMenuModel = {
            topMenuText: 'Main Settings',
            topMenuID: 'MainSettings',
            subMenus: [
                { menuText: 'Static Resources', dataObject: 'staticresources', notifiIcon: {} },
                { menuText: 'Site Info', dataObject: 'siteinfo', notifiIcon: {} },
                { menuText: 'Site Languages', dataObject: 'sitelanguages', notifiIcon: {} },
            ],
        };
        return topMenuObject;
    }

    function addDummyMenuItems() {
        let topMenuObject: MainMenuModel = {
            // topMenuText: 'Activity & Audit',
            topMenuText: 'Activity',
            topMenuID: 'ActivityAudit',
            subMenus: [
                { menuText: 'Activity Logs', dataObject: 'activityLogs', notifiIcon: {} },
                // { menuText: 'Audit', dataObject: undefined, notifiIcon: {} },
            ],
        };
        return topMenuObject;
    }

    function addDummySecondMenuItems() {
        let topMenuObject: MainMenuModel = {
            topMenuText: 'SEO',
            topMenuID: 'SEO',
            subMenus: [
                { menuText: 'Analyze', dataObject: undefined, notifiIcon: {} },
                { menuText: 'SEO Guide', dataObject: 'seoGuide', notifiIcon: {} },
            ],
        };
        return topMenuObject;
    }

    function addDummyThirdMenuItems() {
        let topMenuObject: MainMenuModel = {
            topMenuText: 'Archives',
            topMenuID: 'Archives',
            subMenus: [{ menuText: 'Archives', dataObject: 'archives', notifiIcon: {} }],
        };
        return topMenuObject;
    }

    function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {
        if (dataObject instanceof Object) {
            setSelectedTheme(dataObject);
            setSelectedMenu('');
        } else {
            setSelectedTheme(undefined);
            setSelectedMenu(dataObject);
        }
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
                    {selectedTheme && <ThemeEditorComponent selectedTheme={selectedTheme} />}
                    {(() => {
                        switch (selectedMenu) {
                            case '':
                                return <></>;
                            case 'activityLogs':
                                return <ActivityLogsPageComponent website={props.website} />;
                            case 'sitelanguages':
                                return <LanguageListComponent websiteObj={props.websiteObj} />;
                            case 'seoGuide':
                                return <SEOGuideComponent />;
                            case 'archives':
                                return <ArchivesPageComponent website={props.website} />;
                            case 'staticresources':
                                return <StaticResourcesComponent website={props.website} />;
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
        lang: state.websiteReducer.website?.languages,
        websiteObj: state.websiteReducer.website,
    };
};

export default connect(mapStateToProps)(SettingsPageComponent);
