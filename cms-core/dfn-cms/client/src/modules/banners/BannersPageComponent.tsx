import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { switchPage } from '../redux/action';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import SideBarMenuComponent from '../shared/ui-components/SideBarMenuComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import AddBannerComponent from './banners/AddBannerComponent';
import BannerViewComponent from './banners/BannerViewComponent';
import BannerDataModel from './models/BannerDataModel';

function BannersPageComponent(props) {
    const database = props.website;
    const websiteLanguages = props.lang;

    const dispatch = useDispatch();

    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [isVisibleAddBanner, setIsVisibleAddBanner] = useState<boolean>(false);
    const [selectedBanner, setSelectedBanner] = useState<BannerDataModel>();
    const [isNewBannerAdded, setIsNewBannerAdded] = useState<boolean>(false);
    const [allBanners, setAllBanners] = useState<any>([]);
    const [activeMenuItemID, setActiveMenuItemID] = useState('');

    useEffect(() => {
        dispatch(switchPage('Banners'));
        getAllBanners();
        setSelectedBanner(undefined);
    }, [database]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && isNewBannerAdded) {
            let newBanner = allBanners[allBanners.length - 1];
            let topMenuIndex = 0;
            let subMenuIndex = menuData[menuData.length - 1].subMenus.length;
            const uniqueMenuName = newBanner.title.replace(/[^A-Z0-9]+/gi, '_');
            const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;
            setActiveMenuItemID(subMenuId);
            setInitialBanner(allBanners[allBanners.length - 1]);
            setIsNewBannerAdded(false);
        }

        return () => {
            isMounted = false;
        };
    }, [allBanners]);

    function setInitialBanner(dataObject: any) {
        if (dataObject) {
            dispatch(switchPage(dataObject.title));
            setSelectedBanner(dataObject);
            setIsVisibleAddBanner(false);
        }
    }

    function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {
        setIsVisibleAddBanner(false);
        setSelectedBanner(dataObject);
    }

    function getAllBanners() {
        const jwt = localStorage.getItem('jwt-token');

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/banners', httpHeaders)
            .then((result) => {
                if (result.data.length > 0) {
                    setAllBanners(result.data);
                }

                let topMenuObject: MainMenuModel = {
                    topMenuText: 'Banners',
                    topMenuID: 'Banners',
                    subMenus: [],
                };

                if (result && result.data) {
                    const banners: BannerDataModel[] = result.data.map((banner) => {
                        let bannerModel: BannerDataModel = {
                            id: banner._id,
                            title: banner.title,
                            bannerData: banner.bannerData,
                            createdBy: banner.createdBy,
                            workflowStateId: banner.workflowStateId,
                            version: banner.version,
                        };

                        return bannerModel;
                    });

                    if (banners) {
                        if (!isVisibleAddBanner) {
                            let initialBanner = banners[0];
                            let topMenuIndex = 0;
                            let subMenuIndex = 0;
                            const uniqueMenuName = initialBanner.title.replace(/[^A-Z0-9]+/gi, '_');
                            const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;
                            setActiveMenuItemID(subMenuId);
                            setInitialBanner(initialBanner);
                        }

                        banners.forEach((banner) => {
                            let subMenuObject: SubMenuModel = {
                                menuText: banner.title,
                                menuID: banner.id,
                                dataObject: banner,
                                notifiIcon: {},
                            };

                            topMenuObject.subMenus.push(subMenuObject);
                        });
                    }
                }

                setMenuData([topMenuObject]);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function onAddNewBanner() {
        setIsVisibleAddBanner(false);
        getAllBanners();
        setIsNewBannerAdded(true);
    }

    function onCancel() {
        getAllBanners();
    }

    function onDeleteBanner() {
        setSelectedBanner(undefined);
        getAllBanners();
    }

    return (
        <>
            <aside className="main__sidebar">
                <div className="main__sidebar__content">
                    <SideBarComponent>
                        <div>
                            <button
                                className="btn btn-block"
                                style={{
                                    color: '#42a5f5',
                                    border: 'solid 1px #42a5f5',
                                    width: '95%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                                onClick={() => {
                                    setIsVisibleAddBanner(true);
                                    setIsNewBannerAdded(false);
                                }}
                            >
                                Add New Banner
                            </button>
                        </div>
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
                    {isVisibleAddBanner && (
                        <AddBannerComponent
                            onSubmitSuccess={onAddNewBanner}
                            dbName={database}
                            onCancel={onCancel}
                        />
                    )}
                    {!isVisibleAddBanner && selectedBanner && (
                        <BannerViewComponent
                            key={selectedBanner.id}
                            supportLanguages={websiteLanguages}
                            bannerData={selectedBanner}
                            dbName={database}
                            workflowStateId={selectedBanner.workflowStateId}
                            onDeleteBanner={onDeleteBanner}
                        />
                    )}
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

export default connect(mapStateToProps)(BannersPageComponent);
