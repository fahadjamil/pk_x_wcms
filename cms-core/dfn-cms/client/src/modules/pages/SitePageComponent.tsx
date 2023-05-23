import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { switchPage } from '../redux/action';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import WorkflowStateModel from '../shared/models/workflow-models/WorkflowStateModel';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import SideBarMenuComponent from '../shared/ui-components/SideBarMenuComponent';
import ToolbarComponent from '../shared/ui-components/ToolbarComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import AddPageComponent from './add-page-component';
import PageHistoryComponent from './history/page-history-component';
import PageInfoComponent from './page-info/page-info-component';
import ConfirmationModal from '../shared/ui-components/modals/confirmation-modal';
import NavigatorPanelComponent from './preview/navigator-panel-component';
import PageContentComponent from './preview/page-content-component';
import { WorkflowsStatus } from '../shared/config/WorkflowsStatus';
import { getUpdatedWorkflowState } from '../shared/utils/WorkflowUtils';
import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../shared/utils/AuthorizationUtils';
import NotificationModal from '../shared/ui-components/modals/notification-modal';
import SearchComponent from '../shared/ui-components/SearchComponent';
import MasterRepository from '../shared/repository/MasterRepository';
import { ConfirmationDataModel } from '../shared/models/SharedModels';
import { Prompt } from 'react-router-dom';

const deviceSize = {
    extraSmall: '',
    small: 'sm',
    medium: 'md',
    large: 'lg',
    extraLarge: 'xl',
};

interface ResponseDataType {
    status: string;
    msg: string;
}

function SitePageComponent(props) {
    const sitePageComponentRef: any = useRef();
    const pageInfoComponentRef: any = useRef();
    const pageToolbarComponentRef: any = useRef();
    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [error, setError] = useState<any>(null);
    const [allUnlinkedPages, setAllUnlinkedPages] = useState<any>([]);
    const [allLinkedPages, setAllLinkedPages] = useState<any>([]);
    const [allPages, setAllPages] = useState<any>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isVisibleAddPage, setIsVisibleAddPage] = useState<boolean>(false);
    const [isVisiblePageContent, setIsVisiblePageContent] = useState<boolean>(false);
    const [isVisibleDuplicatePage, setIsVisibleDuplicatePage] = useState<boolean>(false);
    const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [themes, setThemes] = useState<any>([]);
    const [selectedPage, setSelectedPage] = useState<any>(undefined);
    const [pageContentData, setPageContentData] = useState({});
    const [isFirstTabActive, setIsFirstTabActive] = useState<boolean>(true);
    const [isPageViewTabActive, setIsPageViewTabActive] = useState<boolean>(false);
    const [isPageInfoTabActive, setIsPageInfoTabActive] = useState<boolean>(false);
    const [isManuallyShowContent, setIsManuallyShowContent] = useState<boolean>(false);
    const [isPageDeleteConfirmationModalOpen, setPageDeleteConfirmationModalOpen] =
        useState<boolean>(false);
    const [deletedPageId, setDeletedPageId] = useState<string>('');
    const [selectedPageWorkflowState, setSelectedPageWorkflowState] =
        useState<WorkflowStateModel>();
    const [isNewPageAdded, setIsNewPageAdded] = useState<boolean>(false);
    const [pagesValidationErrors, setPagesValidationErrors] = useState<any>({});
    const [isPagesValidationNotificationModalOpen, setIsPagesValidationNotificationModalOpen] =
        useState<boolean>(false);
    const [responseData, setResponseData] = useState<ResponseDataType>({ status: '', msg: '' });
    const [activeMenuItemID, setActiveMenuItemID] = useState('');
    const [confirmationData, setConfirmationData] = useState<ConfirmationDataModel | undefined>(
        undefined
    );
    const database = props.website;
    const languages = props.lang;
    const dispatch = useDispatch();
    let isInitialLoad = true;

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllPages();
            dispatch(switchPage('Pages'));
            setSelectedPage(undefined);
        }

        return () => {
            isMounted = false;
        };
    }, [database]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            generateMenuItems();
        }

        return () => {
            isMounted = false;
        };
    }, [allPages, allLinkedPages, allUnlinkedPages]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && isNewPageAdded) {
            let newPage = allPages[allPages.length - 1];
            let topMenuIndex = menuData.length - 1;
            let subMenuIndex = menuData[menuData.length - 1].subMenus.length;
            const uniqueMenuName = newPage.pageName.replace(/[^A-Z0-9]+/gi, '_');
            const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

            setActiveMenuItemID(subMenuId);
            setInitialPage(newPage);
            setIsNewPageAdded(false);
        }

        return () => {
            isMounted = false;
        };
    }, [allPages]);

    async function getAllPageDataFromDB(pageDataIds) {
        try {
            const headerParameter = { idList: pageDataIds };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            const results = await Axios.get('/api/pages/contents/data', httpHeaders);
            return results;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async function getPageFromDB(pageId) {
        try {
            const headerParameter = { id: pageId };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            const results = await Axios.get('/api/pages/data', httpHeaders);
            return results;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    function goToEditMode() {
        setEditMode(true);
    }

    function pageCheckedOut() {
        getAllPages();
        dispatch(switchPage('Pages'));
        setSelectedPage(undefined);
    }

    async function getAllPages() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/pages', httpHeaders)
            .then((result) => {
                if (result.data.length > 0) {
                    setAllPages(result.data);
                }
            })
            .then(() => {
                return Axios.get('/api/pages/unlink-pages', httpHeaders)
                    .then((result) => {
                        setAllUnlinkedPages(result.data);
                    })
                    .catch((err) => {
                        setIsLoaded(false);
                        setError(err);
                        console.log(err);
                    });
            })
            .then(() => {
                return Axios.get('/api/menus', httpHeaders)
                    .then((result) => {
                        setAllLinkedPages(result.data);
                    })
                    .catch((err) => {
                        setIsLoaded(false);
                        setError(err);
                        console.log(err);
                    });
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        Axios.get('/api/themes', httpHeaders)
            .then(function (response) {
                if (response && response.status === 200) {
                    const { data } = response;

                    if (Array.isArray(data) && data.length > 0) {
                        setThemes(data);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function getAllContentDataOfSelectedPage(selectedPageDoc) {
        try {
            const { pageData } = selectedPageDoc;
            let pageContentResult = {};

            if (pageData && Array.isArray(pageData) && pageData.length > 0) {
                let pageDataIds = pageData.map((pageDataItem) => {
                    return pageDataItem.id;
                });

                const result = await getAllPageDataFromDB(pageDataIds);

                const { status, data }: any = result;

                if (status === 200 && data && Array.isArray(data) && data.length > 0) {
                    for (let languageWiseContentData of data) {
                        const { _id, ...contentData } = languageWiseContentData;

                        if (_id) {
                            const langPageData = pageData.find(
                                (langPageData) => langPageData.id === _id
                            );
                            pageContentResult[langPageData.lang] = contentData;
                        }
                    }
                }
            }

            setPageContentData(pageContentResult);
        } catch (error) {
            console.error(error);
            setPageContentData({});
        }
    }

    function getSelectedPageWorkflowState(pageWorkflowDocId) {
        const headerParameter = { id: pageWorkflowDocId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/workflow/state', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    const { _id, ...workFlowStateData } = result.data;
                    const workflowState: WorkflowStateModel = { id: _id, ...workFlowStateData };
                    setSelectedPageWorkflowState(workflowState);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function generateUnlinkedPagesMenuItems() {
        let topMenuObject: MainMenuModel = {
            topMenuText: 'Unlinked Pages',
            topMenuID: 'unlinked-pages',
            subMenus: [],
        };

        allUnlinkedPages &&
            allUnlinkedPages.forEach((unlinkedPage, unlinkedPageIndex) => {
                if (!unlinkedPage?.path) {
                    let subMenuObject: SubMenuModel = {
                        menuText: unlinkedPage?.pageName,
                        menuID: unlinkedPage?._id,
                        dataObject: unlinkedPage,
                        notifiIcon: {},
                    };

                    topMenuObject.subMenus.push(subMenuObject);
                }
            });

        return topMenuObject;
    }

    function generateExternalLinkPagesMenuItems() {
        let topMenuObject: MainMenuModel = {
            topMenuText: 'External link Pages',
            topMenuID: 'external-link-pages',
            subMenus: [],
        };

        allUnlinkedPages &&
            allUnlinkedPages.forEach((unlinkedPage, unlinkedPageIndex) => {
                if (unlinkedPage?.path) {
                    let subMenuObject: SubMenuModel = {
                        menuText: unlinkedPage?.pageName,
                        menuID: unlinkedPage?._id,
                        dataObject: unlinkedPage,
                        notifiIcon: {},
                    };

                    topMenuObject.subMenus.push(subMenuObject);
                }
            });

        return topMenuObject;
    }

    function generateMenuItems() {
        let allMenuData: MainMenuModel[] = [];
        let topMenu = -1;
        let subMenu = -1;

        allLinkedPages &&
            allLinkedPages.forEach((topMenuItem, topMenuItemIndex) => {
                const { _id, version, type, menu } = topMenuItem;

                menu &&
                    menu.forEach((menuItem, menuItemIndex) => {
                        const { name, subLinks } = menuItem;
                        topMenu++;

                        let topMenuObject: MainMenuModel = {
                            topMenuText: name ? name['en'] : '',
                            topMenuID: `${type ? type : ''}-${name ? name['en'] : ''}`,
                            subMenus: [],
                        };

                        subLinks &&
                            subLinks.forEach((topLevelSubLink, topLevelSubLinkIndex) => {
                                const { subLinks, page } = topLevelSubLink;

                                // If second level sub links exists
                                if (subLinks && subLinks.length > 0) {
                                    subLinks &&
                                        subLinks.forEach(
                                            (topLevelSubLink, topLevelSubLinkIndex) => {
                                                const { subLinks, page } = topLevelSubLink;

                                                if (page) {
                                                    const matchingPage =
                                                        allPages &&
                                                        allPages.find(
                                                            (pageItem) => pageItem._id === page
                                                        );

                                                    if (matchingPage) {
                                                        subMenu++;

                                                        if (isInitialLoad && !isNewPageAdded) {
                                                            if (selectedPage === undefined) {
                                                                const uniqueMenuName =
                                                                    matchingPage?.pageName.replace(
                                                                        /[^A-Z0-9]+/gi,
                                                                        '_'
                                                                    );
                                                                const subMenuId = `${uniqueMenuName}_${topMenu}_${subMenu}`;

                                                                setActiveMenuItemID(subMenuId);
                                                                setInitialPage(matchingPage);
                                                                dispatch(
                                                                    switchPage(
                                                                        matchingPage?.pageName
                                                                    )
                                                                );
                                                                isInitialLoad = false;
                                                            }
                                                        }
                                                        let subMenuObject: SubMenuModel = {
                                                            menuText: matchingPage.pageName,
                                                            menuID: matchingPage._id,
                                                            dataObject: matchingPage,
                                                            notifiIcon: {},
                                                        };

                                                        topMenuObject.subMenus.push(subMenuObject);
                                                    }
                                                }
                                            }
                                        );
                                }

                                if (page) {
                                    const matchingPage =
                                        allPages &&
                                        allPages.find((pageItem) => pageItem._id === page);

                                    if (matchingPage) {
                                        subMenu++;

                                        let subMenuObject: SubMenuModel = {
                                            menuText: matchingPage?.pageName,
                                            menuID: matchingPage?._id,
                                            dataObject: matchingPage,
                                            notifiIcon: {},
                                        };

                                        topMenuObject.subMenus.push(subMenuObject);
                                    }
                                }
                            });

                        allMenuData.push(topMenuObject);
                    });
            });

        const externalLinkPagesMenus = generateExternalLinkPagesMenuItems();
        allMenuData.push(externalLinkPagesMenus);

        const unlinkedPagesMenus = generateUnlinkedPagesMenuItems();
        allMenuData.push(unlinkedPagesMenus);

        const cloneMenu = [...allMenuData];

        setMenuData(cloneMenu);
        setIsLoaded(true);
    }

    function setSelectedPageContentdata(selectedPageContentdata) {
        setPageContentData(selectedPageContentdata);
    }

    // Not in use
    function getAllThemes() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/themes', httpHeaders)
            .then((result) => {
                setThemes(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function displayPageContent() {
        setEditMode(false);
        setIsVisiblePageContent(true);
        setIsVisibleAddPage(false);
        setIsVisibleDuplicatePage(false);
        setIsFirstTime(false);
        getAllPages();
        setIsNewPageAdded(true);
    }

    function onCancel() {
        setEditMode(false);
        getAllPages();
        setIsVisiblePageContent(true);
        setIsVisibleAddPage(false);
        setIsVisibleDuplicatePage(false);
        setIsFirstTime(false);
    }

    function updateCurrentPage(page) {
        if (selectedPage && selectedPage.page) {
            selectedPage.page = page;
            setSelectedPage({ ...selectedPage });
        }
    }

    function setInitialPage(dataObject: any) {
        if (dataObject) {
            const pageDocument = {
                page: dataObject,
                id: dataObject._id,
                databaseName: database,
                languages: languages,
            };

            getAllContentDataOfSelectedPage(dataObject);
            getSelectedPageWorkflowState(dataObject.workflowStateId);
            setSelectedPage(pageDocument);
            dispatch(switchPage(dataObject?.pageName));
            setIsVisiblePageContent(true);
            setIsVisibleAddPage(false);
            setIsVisibleDuplicatePage(false);
        }
    }

    async function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {
        const { _id } = dataObject;
        const pageObj: any = await getPageFromDB(_id);

        if (pageObj && pageObj.data) {
            const { page, pageData } = pageObj.data;

            if (page) {
                const pageDocument = {
                    page: page,
                    id: page._id,
                    databaseName: database,
                    languages: languages,
                };

                if (pageData) {
                    setPageContentData(pageData);
                }

                setSelectedPage(pageDocument);
            }
        }

        getSelectedPageWorkflowState(dataObject.workflowStateId);
        setIsVisiblePageContent(true);
        setIsVisibleAddPage(false);
        setIsVisibleDuplicatePage(false);
    }

    function isFirstTimeLoad() {
        let isFirstTime = false;

        menuData.forEach((menu, index) => {
            if (index === 0 && menu.subMenus.length === 0) {
                isFirstTime = true;
            }
        });

        return isFirstTime;
    }

    function onWorkflowSubmited(updatedWorkflowState: WorkflowStateModel) {
        setSelectedPageWorkflowState(updatedWorkflowState);
        updatePageWorkflow(updatedWorkflowState);
    }

    function updatePageWorkflow(updatedWorkflowState) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/workflow/pages/update',
            {
                pageId: selectedPage?.id,
                dbName: database,
                pageWorkflow: updatedWorkflowState,
            },
            httpHeaders
        )
            .then((res) => {})
            .catch((err) => {
                console.log('error', err);
            });
    }

    async function saveAsDraft() {
        if (
            sitePageComponentRef &&
            sitePageComponentRef.current &&
            sitePageComponentRef.current.submitPageToDrafts
        ) {
            let pageMetaInfo = {};

            if (selectedPageWorkflowState) {
                const restWorkflow = getUpdatedWorkflowState(
                    WorkflowsStatus.initial,
                    selectedPageWorkflowState,
                    'Page edit & save as darft',
                    'pages'
                );
                onWorkflowSubmited(restWorkflow);
            }

            if (
                pageInfoComponentRef &&
                pageInfoComponentRef.current &&
                pageInfoComponentRef.current.handlePageInfoSubmit
            ) {
                const metaInfoData = pageInfoComponentRef.current.handlePageInfoSubmit();
                const { status, ...metaInfo } = metaInfoData;

                if (status === 'valid') {
                    pageMetaInfo = { ...metaInfo };
                }

                if (status === 'invalid') {
                    const { msg } = metaInfo;
                    const updatedMsgs = {
                        ...pagesValidationErrors,
                        pageInfo: msg,
                    };

                    setPagesValidationErrors(updatedMsgs);
                    setIsPagesValidationNotificationModalOpen(true);

                    return false;
                }
            }

            await sitePageComponentRef.current.submitPageToDrafts(pageMetaInfo);

            if (isPageInfoTabActive) {
                setIsManuallyShowContent(true);
                setIsFirstTabActive(true);
            }

            setEditMode(false);

            return true;
        }
    }

    function discardPageChanges() {
        if (isPageInfoTabActive) {
            setIsManuallyShowContent(true);
            setIsFirstTabActive(true);
        }

        setEditMode(false);
    }

    function setPageEditMode() {
        if (
            sitePageComponentRef &&
            sitePageComponentRef.current &&
            sitePageComponentRef.current.setPageEditMode
        ) {
            sitePageComponentRef.current.setPageEditMode();
        }
    }

    function openPreviewMode() {
        if (
            sitePageComponentRef &&
            sitePageComponentRef.current &&
            sitePageComponentRef.current.openPreviewMode
        ) {
            //onWorkflowSubmited('', WorkflowsStatus.modified);
            sitePageComponentRef.current.openPreviewMode();
        }
    }

    function openResponsivePreviewMode() {
        if (
            sitePageComponentRef &&
            sitePageComponentRef.current &&
            sitePageComponentRef.current.openResponsivePreviewMode
        ) {
            sitePageComponentRef.current.openResponsivePreviewMode();
        }
    }

    function duplicateCurrentPage() {
        if (selectedPage && selectedPage.id && selectedPage.page) {
            setIsVisibleDuplicatePage(true);
            setIsVisiblePageContent(false);
        }
    }

    function deleteCurrentPage(pageId: string) {
        setPageDeleteConfirmationModalOpen(true);
        setDeletedPageId(pageId);
    }

    function getPageDeleteModalTitle() {
        let title: string = '';

        if (deletedPageId && deletedPageId !== '') {
            if (deletedPageId === selectedPage?.id) {
                title = `Delete Page - ${selectedPage?.page?.pageName}`;
            }
        }

        return title;
    }

    async function handlePageDeteleConfimation() {
        try {
            if (selectedPage && deletedPageId === selectedPage.id) {
                const menuId = selectedPage.page?.menu;
                const headerParameter = {
                    pageId: deletedPageId,
                    pageData: selectedPage.page?.pageData,
                    workflowId: selectedPage.page?.workflowStateId,
                    deletedBy: MasterRepository.getCurrentUser().docId,
                };
                const payload = getAuthorizationHeaderForDelete(headerParameter);

                // Delete page from page drafts
                // Delete language wise page contents from page contents drafts
                // Delete workflow from workflows
                // Delete related activity logs
                // Insert records into pagesHisory and pageContentHistory
                const result = await Axios.delete('/api/pages/delete', payload);
                const { data, status } = result;
                const menusData = [...allLinkedPages];

                if (status == 200 && menusData && menuId) {
                    for (let topMenuItem of menusData) {
                        const { _id, version, type, menu } = topMenuItem;

                        if (type === 'mainMenu' && menu && menu.length > 0) {
                            for (let menuItem of menu) {
                                const { subLinks } = menuItem;

                                if (subLinks && subLinks.length > 0) {
                                    for (let topLevelSubLink of subLinks) {
                                        const { subLinks } = topLevelSubLink;

                                        if (subLinks && subLinks.length > 0) {
                                            for (let [
                                                index,
                                                bottomLevelSubLink,
                                            ] of subLinks.entries()) {
                                                const { page } = bottomLevelSubLink;

                                                if (page === deletedPageId) {
                                                    subLinks.splice(index, 1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (type === 'footerMenu' && menu && menu.length > 0) {
                            for (let menuItem of menu) {
                                const { name, subLinks } = menuItem;

                                if (subLinks && subLinks.length > 0) {
                                    for (let [index, bottomLevelSubLink] of subLinks.entries()) {
                                        const { page } = bottomLevelSubLink;

                                        if (page === deletedPageId) {
                                            subLinks.splice(index, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    const headerParameter = {};
                    const httpHeaders = getAuthorizationHeader(headerParameter);

                    await Axios.post('/api/menus/save', menusData, httpHeaders);
                }

                setResponseData(data);
                setTimeout(function () {
                    setResponseData({ status: '', msg: '' });
                }, 3000);
                dispatch(switchPage('Pages'));
            }

            setPageDeleteConfirmationModalOpen(false);
            getAllPages();
            setSelectedPage(undefined);
        } catch (error) {
            setIsLoaded(false);
            setError(error);
            console.log(error);
        }
    }

    function getPageNamesList() {
        const pageNameList =
            allPages &&
            allPages.map((page, pageIndex) => {
                return page.pageName;
            });

        return pageNameList;
    }

    function isCurrentPageUnlinked() {
        if (allUnlinkedPages && selectedPage) {
            const element = allUnlinkedPages.find((element) => element._id === selectedPage.id);

            if (element) {
                return true;
            }
        }

        return false;
    }

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

        let type = result.type ? result.type : '';
        const newSections: any = Array.from(selectedPage?.page?.section);

        if (type === 'sectionItem') {
            const newSection: any =
                newSections &&
                newSections.find((section, index) => {
                    return section.sectionId === draggableId;
                });

            newSections.splice(source.index, 1);
            newSections.splice(destination.index, 0, newSection);

            const newSelectedPage = {
                ...selectedPage,
                page: {
                    ...selectedPage?.page,
                    section: newSections,
                },
            };

            setSelectedPage(newSelectedPage);
            return;
        }

        let start: any;
        let finish: any;

        // Get source column
        newSections &&
            newSections
                .map((section, index) => {
                    const { columns } = section;
                    return (
                        columns &&
                        columns.find((column, columnIndex) => {
                            return column?.columnId === source.droppableId;
                        })
                    );
                })
                .filter((element) => {
                    return !!element;
                })
                .forEach((element) => (start = element));

        // Get destination column
        newSections &&
            newSections
                .map((section, index) => {
                    const { columns } = section;
                    return (
                        columns &&
                        columns.find((column, columnIndex) => {
                            return column.columnId === destination.droppableId;
                        })
                    );
                })
                .filter((element) => {
                    return !!element;
                })
                .forEach((element) => (finish = element));

        // If source and destination columns are same
        if (start && finish && start.columnId === finish.columnId) {
            // Inner section drag and drop within same column
            const innerSectionsArray: any = Array.from(finish?.section);

            let newInnerSection = innerSectionsArray.find((section, index) => {
                return section.sectionId === draggableId;
            });

            innerSectionsArray.splice(source.index, 1);
            innerSectionsArray.splice(destination.index, 0, newInnerSection);

            newSections &&
                newSections.forEach((section, sectionIndex) => {
                    section &&
                        section.columns.forEach((column, columnIndex) => {
                            if (column && column.columnId === destination.droppableId) {
                                newSections[sectionIndex].columns[columnIndex].section =
                                    innerSectionsArray;
                            }
                        });
                });

            const newSelectedPage = {
                ...selectedPage,
                page: {
                    ...selectedPage?.page,
                    section: newSections,
                },
            };

            setSelectedPage(newSelectedPage);
            return;
        }
    };

    function pageSearch(query) {
        setSelectedPage(undefined);
        dispatch(switchPage('Pages'));
        setAllPages(
            allPages.filter((page) => page.pageName.toLowerCase().includes(query.toLowerCase()))
        );
        setAllUnlinkedPages(
            allUnlinkedPages.filter((page) =>
                page.pageName.toLowerCase().includes(query.toLowerCase())
            )
        );
    }

    function resetPages() {
        getAllPages();
        generateMenuItems();
    }

    function handleBackToPagesClick() {
        setConfirmationData({
            modalTitle: 'Discard Changes',
            show: true,
            body: (
                <div className="alert alert-warning" role="alert">
                    Are you sure you want to discard the changes?
                </div>
            ),
            handleClose: () => {
                setConfirmationData(undefined);
            },
            handleConfirme: backToPages,
        });
    }

    function backToPages() {
        setEditMode(false);
        setConfirmationData(undefined);

        if (isPageInfoTabActive) {
            setIsManuallyShowContent(true);
            setIsFirstTabActive(true);
        }

        if (
            pageToolbarComponentRef &&
            pageToolbarComponentRef.current &&
            pageToolbarComponentRef.current.handleUnlockRecordForRef
        ) {
            pageToolbarComponentRef.current.handleUnlockRecordForRef();
        }
    }

    function handleAddNewPage() {
        if (editMode) {
            setConfirmationData({
                modalTitle: 'Discard Changes',
                show: true,
                body: (
                    <div className="alert alert-warning" role="alert">
                        Are you sure you want to discard the changes?
                    </div>
                ),
                handleClose: () => {
                    setConfirmationData(undefined);
                },
                handleConfirme: () => {
                    setConfirmationData(undefined);
                    setEditMode(false);
                    addNewPage();
                },
            });
        } else {
            addNewPage();
        }
    }

    function addNewPage() {
        setIsVisibleAddPage(true);
        setIsNewPageAdded(false);
        setIsVisiblePageContent(false);
        setSelectedPage(undefined);
        dispatch(switchPage('Create New Page'));
        if (isFirstTimeLoad()) {
            setIsFirstTime(true);
        }
    }

    return (
        <>
            <aside className="main__sidebar is-visible">
                <div className="main__sidebar__content">
                    <SideBarComponent>
                        {editMode && (
                            <div>
                                <button
                                    className="btn float-left"
                                    style={{ color: '#42a5f5', height: '50px' }}
                                    onClick={handleBackToPagesClick}
                                >
                                    Back To Pages
                                </button>
                            </div>
                        )}
                        {!editMode && (
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
                                    disabled={isEnable('/api/pages/create')}
                                    onClick={handleAddNewPage}
                                >
                                    Add New Page
                                </button>
                            </div>
                        )}
                        <br />

                        {editMode && (
                            <>
                                <NavigatorPanelComponent
                                    page={selectedPage && selectedPage.page}
                                    contentData={pageContentData}
                                    onDragEnd={onDragEnd}
                                    onComponentClick={
                                        sitePageComponentRef &&
                                        sitePageComponentRef.current &&
                                        sitePageComponentRef.current.onComponentClick
                                    }
                                />
                                {/* <span
                                className="d-inline-block"
                                tabIndex={0}
                                data-toggle="tooltip"
                                title="Add New Section"
                                style={{
                                    cursor: 'pointer',
                                    color: 'rgb(128, 133, 138)',
                                }}
                                // onClick={loadColumnSelectionModal}
                            >
                                <CircledPlusIcon width="25px" height="25px" />
                            </span> */}
                            </>
                        )}
                        {!editMode && (
                            <div>
                                <SearchComponent
                                    search={pageSearch}
                                    reset={resetPages}
                                    placeholder="Search Pages"
                                />

                                <SideBarMenuComponent
                                    menuData={menuData}
                                    activeMenuItemID={activeMenuItemID}
                                    setActiveMenuItemID={setActiveMenuItemID}
                                    onMenuClicked={onMenuItemClicked}
                                />
                            </div>
                        )}
                    </SideBarComponent>
                </div>
            </aside>
            <main className="main__content">
                <TopPanelComponent />
                {responseData && responseData.status === 'success' && (
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                className="alert alert-success alert-dismissible fade show mt-2"
                                role="alert"
                            >
                                <strong>Success!</strong> {responseData.msg}
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {responseData && responseData.status === 'failed' && (
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                className="alert alert-danger alert-dismissible fade show mt-2"
                                role="alert"
                            >
                                <strong>Failed!</strong> {responseData.msg}
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isVisiblePageContent && selectedPage && (
                    <>
                        <div className="container-fluid 1">
                            <ToolbarComponent
                                dbName={database}
                                page={selectedPage.page}
                                pageId={selectedPage.id}
                                editMode={editMode}
                                isFirstTabActive={isFirstTabActive}
                                isPageViewTabActive={isPageViewTabActive}
                                isPageInfoTabActive={isPageInfoTabActive}
                                ref={pageToolbarComponentRef}
                                setEditMode={setEditMode}
                                onSubmitWorkflow={onWorkflowSubmited}
                                saveAsDraftOnclick={saveAsDraft}
                                onDiscardClick={discardPageChanges}
                                setPageEditMode={setPageEditMode}
                                openPreviewMode={openPreviewMode}
                                openResponsivePreviewMode={openResponsivePreviewMode}
                                onPageDuplicateClick={duplicateCurrentPage}
                                onPageDeleteClick={deleteCurrentPage}
                                setIsPageViewTabActive={setIsPageViewTabActive}
                                setIsFirstTabActive={setIsFirstTabActive}
                                setIsPageInfoTabActive={setIsPageInfoTabActive}
                                selectedPageWorkflowState={selectedPageWorkflowState}
                                setSelectedPage={setSelectedPage}
                                setPageContentData={setPageContentData}
                                setIsManuallyShowContent={setIsManuallyShowContent}
                                setConfirmationData={setConfirmationData}
                            />
                            <div className="tab-content" id="site-page-nav-tabContent">
                                <div
                                    className={`tab-pane fade active show ${
                                        isManuallyShowContent ? 'active show' : ''
                                    }`}
                                    id="site-page-nav-edit"
                                    role="tabpanel"
                                    aria-labelledby="site-page-nav-edit-tab"
                                >
                                    <PageContentComponent
                                        key={selectedPage.id}
                                        data={selectedPage.page}
                                        pageContentData={pageContentData}
                                        database_name={selectedPage.databaseName}
                                        siteLanguages={selectedPage.languages}
                                        theme={themes}
                                        editMode={editMode}
                                        setSelectedPageContentdata={setSelectedPageContentdata}
                                        updateCurrentPage={updateCurrentPage}
                                        getAllPages={getAllPages}
                                        ref={sitePageComponentRef}
                                        websiteObj={props.websiteObj}
                                        getAllPageDataFromDB={getAllPageDataFromDB}
                                        handleRecordUnlock={
                                            pageToolbarComponentRef?.current
                                                ?.handleUnlockRecordForRef
                                        }
                                    />
                                </div>
                                {editMode && (
                                    <div
                                        className="tab-pane fade"
                                        id="site-page-nav-info"
                                        role="tabpanel"
                                        aria-labelledby="site-page-nav-info-tab"
                                    >
                                        <div className="row mt-4">
                                            <PageInfoComponent
                                                data={selectedPage.page}
                                                languages={languages}
                                                dbName={database}
                                                isUnlinkedPage={isCurrentPageUnlinked()}
                                                ref={pageInfoComponentRef}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div
                                    className="tab-pane fade"
                                    id="site-page-nav-history"
                                    role="tabpanel"
                                    aria-labelledby="site-page-nav-history-tab"
                                >
                                    <div className="mt-4">
                                        <PageHistoryComponent
                                            database_name={selectedPage.databaseName}
                                            pageId={selectedPage.id}
                                            workflowStatus={selectedPageWorkflowState?.state}
                                            pageTitle={selectedPage?.page?.pageName}
                                            checkOutHandlder={pageCheckedOut}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {(isFirstTime || isVisibleAddPage || isVisibleDuplicatePage) && (
                    <AddPageComponent
                        isDuplicatePage={isVisibleDuplicatePage}
                        duplicatePageId={selectedPage?.id}
                        duplicatePageTitle={selectedPage?.page?.pageName}
                        onSubmitSuccess={displayPageContent}
                        onCancel={onCancel}
                        dbName={database}
                        pageNamesList={getPageNamesList()}
                    />
                )}

                {isPageDeleteConfirmationModalOpen && (
                    <ConfirmationModal
                        modalTitle={getPageDeleteModalTitle()}
                        show={isPageDeleteConfirmationModalOpen}
                        handleClose={() => {
                            setPageDeleteConfirmationModalOpen(false);
                        }}
                        handleConfirme={handlePageDeteleConfimation}
                    >
                        <p>"Are you sure you want to delete this page?"</p>
                    </ConfirmationModal>
                )}

                {isPagesValidationNotificationModalOpen && (
                    <NotificationModal
                        modalTitle="Validation Failed"
                        show={isPagesValidationNotificationModalOpen}
                        titleTextClass="text-danger"
                        handleClose={() => {
                            setIsPagesValidationNotificationModalOpen(false);
                        }}
                    >
                        <div className="alert alert-danger" role="alert">
                            <strong>Please fix the following errors.</strong>
                            <br />
                            <ul
                                style={{
                                    listStyleType: 'square',
                                }}
                            >
                                {Object.entries(pagesValidationErrors).map(
                                    ([key, value]: any, errorIndex: number) => {
                                        return <li key={key + errorIndex}>{value}</li>;
                                    }
                                )}
                            </ul>
                        </div>
                    </NotificationModal>
                )}
                {confirmationData && (
                    <ConfirmationModal
                        modalTitle={confirmationData.modalTitle}
                        show={confirmationData.show}
                        size={confirmationData.size}
                        handleClose={confirmationData.handleClose}
                        handleConfirme={confirmationData.handleConfirme}
                    >
                        {confirmationData.body}
                    </ConfirmationModal>
                )}
                <Prompt
                    when={editMode}
                    message={(location) => {
                        return `Are you sure you want to leave?`;
                    }}
                />
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

export default connect(mapStateToProps)(SitePageComponent);
