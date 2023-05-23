import { getAuthorizationHeader, isEnable } from '../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import useForceUpdate from 'use-force-update';
import { switchPage } from '../redux/action';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import SideBarMenuComponent from '../shared/ui-components/SideBarMenuComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import DocumentList from './collections/DocumentList';
import IconsComponent from './collections/media/IconsComponent';
import ImageComponent from './collections/media/ImageComponent';
import VideoComponent from './collections/media/VideoComponent';
import NewCollctionType from './collections/NewCollctionType';
import AddTreeViewComponent from './tree-view/AddTreeViewComponent';
import TreeViewComponent from './tree-view/TreeViewComponent';
import MasterRepository from '../shared/repository/MasterRepository';
import SearchComponent from '../shared/ui-components/SearchComponent';

function DocumentsPageComponent(props) {
    const dispatch = useDispatch();

    const [collectionNamesPost, setcollectionNamesPost] = useState([{}]);
    const [collectionNamesDocs, setcollectionNamesDocs] = useState([{}]);
    const [collectionNamesForms, setcollectionNamesForms] = useState([{}]);
    const [collectionTypesPost, setcollectionTypesPost] = useState({});
    const [collectionTypesDocs, setcollectionTypesDocs] = useState({});
    const [collectionTypesForms, setcollectionTypesForms] = useState({});
    const [isVisibleCollectionList, setisVisibleCollectionList] = useState(false);
    const [SelectedName, setSelectedName] = useState('');
    const [selectedCollecType, setselectedCollecType] = useState({});
    const [isVisibleAddNewType, setisVisibleAddNewType] = useState(false);
    const [updateMenuOnCllBak, setupdateMenuOnCllBak] = useState(1);
    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [selectedType, setSelectedType] = useState('Posts');
    const forceUpdate = useForceUpdate();
    const [isVisibVideoComp, setisVisibVideoComp] = useState(false);
    const [isVisibImageComp, setisVisibImageComp] = useState(false);
    const [isVisibIconComp, setisVisibIconComp] = useState(false);
    const [isVisibleTreeView, setIsVisibleTreeView] = useState(false);
    const [selectedTreeViewId, setSelectedTreeViewId] = useState<string>();

    const [postCategories, setPostCategories] = useState<string[]>([]);
    const [documentCategories, setDocumentCategories] = useState<string[]>([]);
    const [formCategories, setFormCategories] = useState<string[]>([]);
    const [newCollectionTypAdded, setNewCollectionTypAdded] = useState(false);
    const [addedType, setAddedType] = useState('');
    const [activeMenuItemID, setActiveMenuItemID] = useState('');

    const targetDatabase = props.website;
    const UNCATEGORIZED_COLLECTION = 'un-categorized-collection';

    let menuDataLocal: MainMenuModel[] = [];

    interface value1 {
        collectionType: string;
        customeCollectionName: string;
        fieldsList: {};
        _id: string;
        menuName: string;
    }

    interface IcollType {
        _id: '';
        fieldsList: {};
        customeCollectionName: '';
        collectionTypes: '';
        menuName: '';
    }

    interface mnuType {
        uid: '';
        menuname: '';
    }
    useEffect(() => {
        setcollectionTypesPost({});
        setcollectionTypesDocs({});
        setcollectionTypesForms({});
        setcollectionNamesPost([{}]);
        setcollectionNamesDocs([{}]);
        setcollectionNamesForms([{}]);
        dispatch(switchPage('Documents'));
        if (collectionNamesPost.length === 1) {
            getMenuDataPost();
        }

        setupdateMenuOnCllBak(1);
    }, [targetDatabase, updateMenuOnCllBak]);

    useEffect(() => {
        collectionNamesPost.shift();
        collectionNamesDocs.shift();
        collectionNamesForms.shift();
    }, []);

    useEffect(() => {
        if (menuData.length > 0 && menuData[0].subMenus.length > 0 && !newCollectionTypAdded) {
            if (menuData[0].subMenus[0].dataObject) {
                let initialTemplate = menuData[0].subMenus[0].dataObject;
                let menuText = menuData[0].subMenus[0].menuText;
                let topMenuIndex = 0;
                let subMenuIndex = 0;
                const uniqueMenuName = menuText.replace(/[^A-Z0-9]+/gi, '_');
                const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

                setInitialCollection(initialTemplate, menuText);
                setActiveMenuItemID(subMenuId);
            } else if (
                menuData[0].subMenus[0].subMenus &&
                menuData[0].subMenus[0].subMenus.length > 0
            ) {
                let initialTemplate = menuData[0].subMenus[0].subMenus[0].dataObject;
                let menuText = menuData[0].subMenus[0].subMenus[0].menuText;
                let topMenuIndex = 0;
                let subMenuIndex = 0;
                const uniqueMenuName = menuText.replace(/[^A-Z0-9]+/gi, '_');
                const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

                setInitialCollection(initialTemplate, menuText);
                setActiveMenuItemID(subMenuId);
            }
        } else if (menuData.length > 0 && newCollectionTypAdded) {
            setNewTypeAsInitial();
        }

        /* else if (menuData.length > 0 && menuData[0].subMenus.length >= 1) {
            setInitialCollection(
                menuData[0].subMenus[1].dataObject,
                menuData[0].subMenus[1].menuText
            );
        } */
    }, [menuData]);

    function setNewTypeAsInitial() {
        let index = 0;

        for (let x = 0; x < menuData.length; x++) {
            if (menuData[x].topMenuText === addedType) {
                index = x;
                break;
            }
        }

        let menuSection = menuData[index];
        let subMenuLength = menuData[index].subMenus.length;

        if (
            menuSection.subMenus[subMenuLength - 1].dataObject &&
            (menuSection.subMenus[subMenuLength - 1].dataObject.collectionType === addedType ||
                menuSection.subMenus[subMenuLength - 1].dataObject.collectionType === undefined)
        ) {
            let addedCollection = menuSection.subMenus[subMenuLength - 1].dataObject;
            let menuText = menuSection.subMenus[subMenuLength - 1].menuText;
            let topMenuIndex = index;
            let subMenuIndex = subMenuLength - 1;
            const uniqueMenuName = menuText.replace(/[^A-Z0-9]+/gi, '_');
            const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

            setInitialCollection(addedCollection, menuText);
            setActiveMenuItemID(subMenuId);
        }
    }

    function setInitialCollection(dataObject: any, title: string) {
        if (dataObject) {
            getCollectionList(
                dataObject.customeCollectionName,
                dataObject.collectionType ? dataObject.collectionType : 'Tree',
                dataObject.id
            );
            dispatch(switchPage(title));
        }
    }

    function groupByCategory(collectionTypes) {
        if (collectionTypes && collectionTypes.length > 0) {
            const group = collectionTypes.reduce((acc, val) => {
                let category = UNCATEGORIZED_COLLECTION;

                if (val.category && val.category !== '') {
                    category = val.category;
                }

                acc[category] = [...(acc[category] || []), val];

                return acc;
            }, {});

            return group;
        }

        return {};
    }

    function arrayRemove(arr: string[], value: string) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }

    function getMenuDataPost() {
        const headerParameter = {
            collection: 'custome-types',
            searchQuery: 'Posts',
            user: MasterRepository.getCurrentUser().userName,
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                let topMenuObject: MainMenuModel = {
                    topMenuText: 'Posts',
                    topMenuID: 'PostID',
                    subMenus: [],
                };
                setcollectionTypesPost(response.data);

                const postGroup = groupByCategory(response.data);
                const postGroupList = Object.keys(postGroup);
                const visibleGroupList = arrayRemove(postGroupList, UNCATEGORIZED_COLLECTION);
                setPostCategories(visibleGroupList);

                // view uncategorized items in bottom
                const organizedPostGroupList = [...visibleGroupList, UNCATEGORIZED_COLLECTION];
                organizedPostGroupList.forEach((group) => {
                    let subMenuObjectLevelOne: SubMenuModel = {
                        menuText: group,
                        menuID: group,
                        dataObject: undefined,
                        notifiIcon: {},
                    };

                    if (postGroup[group]) {
                        postGroup[group].forEach((collType) => {
                            let val1: value1;
                            val1 = collType as value1;

                            let subMenuObject: SubMenuModel = {
                                menuText: val1.menuName,
                                menuID: val1.customeCollectionName,
                                dataObject: val1,
                                notifiIcon: {},
                            };

                            if (group !== UNCATEGORIZED_COLLECTION) {
                                if (subMenuObjectLevelOne.subMenus) {
                                    subMenuObjectLevelOne.subMenus.push(subMenuObject);
                                } else {
                                    subMenuObjectLevelOne.subMenus = [subMenuObject];
                                }
                            } else {
                                topMenuObject.subMenus.push(subMenuObject);
                            }

                            setcollectionNamesPost((collectionNames) => [
                                ...collectionNames,
                                { uid: val1.customeCollectionName, menuname: val1.menuName },
                            ]);
                        });
                    }

                    if (group !== UNCATEGORIZED_COLLECTION) {
                        topMenuObject.subMenus.push(subMenuObjectLevelOne);
                    }
                });

                /*  Object.entries(response.data).map(([key, value]) => {
                    let val1: value1;
                    val1 = value as value1;

                    let subMenuObject: SubMenuModel = {
                        menuText: val1.menuName,
                        menuID: val1.customeCollectionName,
                        dataObject: val1,
                        notifiIcon: {},
                    };
                    topMenuObject.subMenus.push(subMenuObject);

                    setcollectionNamesPost((collectionNames) => [
                        ...collectionNames,
                        { uid: val1.customeCollectionName, menuname: val1.menuName },
                    ]);
                }); */
                menuDataLocal.push(topMenuObject);
                const cloneMenu = [...menuDataLocal];
                setMenuData(cloneMenu);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                getMenuDataDoc();
            });
    }

    async function getMenuDataDoc() {
        const headerParameter2 = {
            collection: 'custome-types',
            searchQuery: 'Documents',
            user: MasterRepository.getCurrentUser().userName,
        };
        const httpHeaders2 = getAuthorizationHeader(headerParameter2);

        Axios.get('/api/custom-collections/types', httpHeaders2)
            .then(async (response) => {
                let topMenuObject: MainMenuModel = {
                    topMenuText: 'Documents',
                    topMenuID: 'DocumentsID',
                    subMenus: [],
                };

                setcollectionTypesDocs(response.data);

                const documentGroup = groupByCategory(response.data);
                const documentGroupList = Object.keys(documentGroup);
                const visibleGroupList = arrayRemove(documentGroupList, UNCATEGORIZED_COLLECTION);
                setDocumentCategories(visibleGroupList);

                // view uncategorized items in bottom
                const organizedDocsGroupList = [...visibleGroupList, UNCATEGORIZED_COLLECTION];
                organizedDocsGroupList.forEach((group) => {
                    let subMenuObjectLevelOne: SubMenuModel = {
                        menuText: group,
                        menuID: group,
                        dataObject: undefined,
                        notifiIcon: {},
                    };

                    if (documentGroup[group]) {
                        documentGroup[group].forEach((collType) => {
                            let val1: value1;
                            val1 = collType as value1;

                            let subMenuObject: SubMenuModel = {
                                menuText: val1.menuName,
                                menuID: val1.customeCollectionName,
                                dataObject: val1,
                                notifiIcon: {},
                            };

                            if (group !== UNCATEGORIZED_COLLECTION) {
                                if (subMenuObjectLevelOne.subMenus) {
                                    subMenuObjectLevelOne.subMenus.push(subMenuObject);
                                } else {
                                    subMenuObjectLevelOne.subMenus = [subMenuObject];
                                }
                            } else {
                                topMenuObject.subMenus.push(subMenuObject);
                            }

                            setcollectionNamesDocs((collectionNames) => [
                                ...collectionNames,
                                { uid: val1.customeCollectionName, menuname: val1.menuName },
                            ]);
                        });
                    }

                    if (group !== UNCATEGORIZED_COLLECTION) {
                        topMenuObject.subMenus.push(subMenuObjectLevelOne);
                    }
                });

                /* Object.entries(response.data).map(([key, value]) => {
                    let val1: value1;
                    val1 = value as value1;

                    let subMenuObjectLevelOne: SubMenuModel = {
                        menuText: 'Level1 test',
                        menuID: val1.customeCollectionName,
                        dataObject: val1,
                        notifiIcon: {},
                    };

                    let subMenuObject: SubMenuModel = {
                        menuText: val1.menuName,
                        menuID: val1.customeCollectionName,
                        dataObject: val1,
                        notifiIcon: {},
                    };

                    if (subMenuObjectLevelOne.subMenus) {
                        subMenuObjectLevelOne.subMenus.push(subMenuObject);
                    } else {
                        subMenuObjectLevelOne.subMenus = [subMenuObject];
                    }

                    topMenuObject.subMenus.push(subMenuObjectLevelOne);

                    setcollectionNamesDocs((collectionNames) => [
                        ...collectionNames,
                        { uid: val1.customeCollectionName, menuname: val1.menuName },
                    ]);
                }); */
                menuDataLocal.push(topMenuObject);
                const cloneMenu = [...menuDataLocal];
                setMenuData(cloneMenu);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                getMenuDataForms();
            });
    }

    async function getMenuDataForms() {
        const headerParameter2 = {
            collection: 'custome-types',
            searchQuery: 'Forms',
            user: MasterRepository.getCurrentUser().userName,
        };
        const httpHeaders2 = getAuthorizationHeader(headerParameter2);

        Axios.get('/api/custom-collections/types', httpHeaders2)
            .then(async (response) => {
                let topMenuObject: MainMenuModel = {
                    topMenuText: 'Forms',
                    topMenuID: 'FormsID',
                    subMenus: [],
                };

                setcollectionTypesForms(response.data);

                const formGroup = groupByCategory(response.data);
                const formGroupList = Object.keys(formGroup);
                const visibleGroupList = arrayRemove(formGroupList, UNCATEGORIZED_COLLECTION);
                setFormCategories(visibleGroupList);

                // view uncategorized items in bottom
                const organizedFormsGroupList = [...visibleGroupList, UNCATEGORIZED_COLLECTION];
                organizedFormsGroupList.forEach((group) => {
                    let subMenuObjectLevelOne: SubMenuModel = {
                        menuText: group,
                        menuID: group,
                        dataObject: undefined,
                        notifiIcon: {},
                    };

                    if (formGroup[group]) {
                        formGroup[group].forEach((collType) => {
                            let val1: value1;
                            val1 = collType as value1;

                            let subMenuObject: SubMenuModel = {
                                menuText: val1.menuName,
                                menuID: val1.customeCollectionName,
                                dataObject: val1,
                                notifiIcon: {},
                            };

                            if (group !== UNCATEGORIZED_COLLECTION) {
                                if (subMenuObjectLevelOne.subMenus) {
                                    subMenuObjectLevelOne.subMenus.push(subMenuObject);
                                } else {
                                    subMenuObjectLevelOne.subMenus = [subMenuObject];
                                }
                            } else {
                                topMenuObject.subMenus.push(subMenuObject);
                            }

                            setcollectionNamesForms((collectionNames) => [
                                ...collectionNames,
                                { uid: val1.customeCollectionName, menuname: val1.menuName },
                            ]);
                        });
                    }

                    if (group !== UNCATEGORIZED_COLLECTION) {
                        topMenuObject.subMenus.push(subMenuObjectLevelOne);
                    }
                });

                menuDataLocal.push(topMenuObject);
                const cloneMenu = [...menuDataLocal];
                setMenuData(cloneMenu);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                getCustomTreeCollection();
            });
    }

    function getCustomTreeCollection() {
        const headerParameter = { user: MasterRepository.getCurrentUser().userName };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/tree/all', httpHeaders)
            .then((response) => {
                let topMenuObject: MainMenuModel = {
                    topMenuText: 'Tree',
                    topMenuID: 'Tree',
                    subMenus: [],
                };

                if (response.data) {
                    response.data.forEach((treeDocument) => {
                        const { id, title } = treeDocument;
                        let subMenuObject: SubMenuModel = {
                            menuText: title,
                            menuID: id.toString(),
                            dataObject: treeDocument,
                            notifiIcon: {},
                        };
                        topMenuObject.subMenus.push(subMenuObject);
                    });
                }

                menuDataLocal.push(topMenuObject);
                let activityAuditObect = addDummyMenuItems();
                const cloneMenu = [...menuDataLocal, ...activityAuditObect];
                setMenuData(cloneMenu);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getCollectionList(event, ColTypeLoc: string, menuID: string) {
        if (ColTypeLoc === 'Posts' || ColTypeLoc === 'Documents' || ColTypeLoc === 'Forms') {
            let objArry: any;
            let collectionTypeObj: IcollType;
            if (ColTypeLoc === 'Posts') {
                objArry = collectionTypesPost;
                if (objArry.length > 0) {
                    collectionTypeObj = objArry.find(
                        (Obj) => Obj.customeCollectionName === event
                    ) as IcollType;
                    setselectedCollecType(collectionTypeObj);
                }
            } else if (ColTypeLoc === 'Documents') {
                objArry = collectionTypesDocs;
                if (objArry.length > 0) {
                    collectionTypeObj = objArry.find(
                        (Obj) => Obj.customeCollectionName === event
                    ) as IcollType;
                    setselectedCollecType(collectionTypeObj);
                }
            } else if (ColTypeLoc === 'Forms') {
                objArry = collectionTypesForms;
                if (objArry.length > 0) {
                    collectionTypeObj = objArry.find(
                        (Obj) => Obj.customeCollectionName === event
                    ) as IcollType;
                    setselectedCollecType(collectionTypeObj);
                }
            }
            setisVisibVideoComp(false);
            setisVisibImageComp(false);
            setisVisibIconComp(false);
            setisVisibleAddNewType(false);
            setisVisibleCollectionList(true);
            setIsVisibleTreeView(false);
            setSelectedName(event);
        } else if (ColTypeLoc === 'Tree') {
            setisVisibVideoComp(false);
            setisVisibImageComp(false);
            setisVisibIconComp(false);
            setisVisibleAddNewType(false);
            setIsVisibleTreeView(true);
            setisVisibleCollectionList(false);
            setselectedCollecType({});
            setSelectedName(event);
            setSelectedTreeViewId(menuID);
        }
    }

    function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {
        if (topMenuModel.topMenuID === 'Media') {
            if (subMenuModel.menuText === 'Videos') {
                setisVisibVideoComp(true);
                setisVisibImageComp(false);
                setisVisibIconComp(false);
            } else if (subMenuModel.menuText === 'Images') {
                setisVisibVideoComp(false);
                setisVisibImageComp(true);
                setisVisibIconComp(false);
            } else if (subMenuModel.menuText === 'Icons') {
                setisVisibVideoComp(false);
                setisVisibImageComp(false);
                setisVisibIconComp(true);
            }
            setIsVisibleTreeView(false);
            setisVisibleAddNewType(false);
            setisVisibleCollectionList(false);
        } else if (topMenuModel.topMenuID === 'Tree') {
            setisVisibVideoComp(false);
            setisVisibImageComp(false);
            setisVisibIconComp(false);
            setisVisibleAddNewType(false);
            setisVisibleCollectionList(false);
            setIsVisibleTreeView(true);
            setSelectedTreeViewId(subMenuModel.menuID);
        } else {
            if (dataObject.collectionType === 'Posts') {
                getCollectionList(dataObject.customeCollectionName, 'Posts', '');
            } else if (dataObject.collectionType === 'Documents') {
                getCollectionList(dataObject.customeCollectionName, 'Documents', '');
            } else if (dataObject.collectionType === 'Forms') {
                getCollectionList(dataObject.customeCollectionName, 'Forms', '');
            }
        }
    }

    function onGoBackInNewCollection() {
        setisVisibleAddNewType(false);
        if (SelectedName) {
            setisVisibleCollectionList(true);
        }
    }

    function addDummyMenuItems() {
        let topMenuObject: MainMenuModel[] = [
            {
                topMenuText: 'Media',
                topMenuID: 'Media',
                subMenus: [
                    { menuText: 'Images', dataObject: undefined, notifiIcon: {} },
                    { menuText: 'Videos', dataObject: undefined, notifiIcon: {} },
                    { menuText: 'Icons', dataObject: undefined, notifiIcon: {} },
                ],
            },
        ];

        return topMenuObject;
    }

    function getAddNewCollectionTypeComponent() {
        if (selectedType === 'Tree') {
            return (
                <AddTreeViewComponent
                    dbName={targetDatabase}
                    onSubmitSuccess={() => {
                        setupdateMenuOnCllBak(2);
                        setAddedType('Tree');
                        setNewCollectionTypAdded(true);
                    }}
                />
            );
        } else {
            return (
                <NewCollctionType
                    selectedType={selectedType}
                    postCategories={postCategories}
                    documentCategories={documentCategories}
                    formCategories={formCategories}
                    collectionTypesPost={collectionTypesPost}
                    collectionTypesDocs={collectionTypesDocs}
                    callback={(type) => {
                        setupdateMenuOnCllBak(2);
                        setAddedType(type);
                        setNewCollectionTypAdded(true);
                    }}
                    onGoBack={() => {
                        onGoBackInNewCollection();
                    }}
                ></NewCollctionType>
            );
        }
    }

    function collectionSearch(query) {
        const filteredMenu: MainMenuModel[] = [...menuData];
        let filteredSubMenu: SubMenuModel[] = [];

        filteredMenu.forEach((menu) => {
            filteredSubMenu = [];
            menu.subMenus.forEach((subMenu) => {
                if (subMenu.menuText.toLowerCase().includes(query.toLowerCase())) {
                    filteredSubMenu.push(subMenu);
                }
            });
            menu.subMenus = [...filteredSubMenu];
        });

        setMenuData(filteredMenu);
        dispatch(switchPage('Documents'));

        const initialSearchResult = filteredMenu.find((menu) => menu.subMenus.length > 0);
        const initialSearchResultMenuText = initialSearchResult?.subMenus[0].menuText
            ? initialSearchResult?.subMenus[0].menuText
            : 'Documents';
        const initialSearchResultDataObj = initialSearchResult?.subMenus[0].dataObject
            ? initialSearchResult?.subMenus[0].dataObject
            : {};

        setInitialCollection(initialSearchResultDataObj, initialSearchResultMenuText);
        if (!initialSearchResult) {
            setIsVisibleTreeView(false);
        }
    }

    function resetCollections() {
        getMenuDataPost();
    }

    return (
        <>
            <aside className="main__sidebar">
                <div className="main__sidebar__content">
                    <SideBarComponent>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-block"
                                data-toggle="dropdown"
                                style={{
                                    color: '#42a5f5',
                                    height: '50px',
                                    border: 'solid 1px #42a5f5',
                                    width: '150px',
                                    marginLeft: '20px',
                                    marginRight: 'auto',
                                    //position: 'static',
                                }}
                                disabled={isEnable('/api/custom-collections/create')}
                            >
                                Add New Type
                            </button>
                            <div className="dropdown-menu" style={{ zIndex: 20 }}>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => {
                                        setisVisibleAddNewType(false);
                                        setisVisibleAddNewType(true);
                                        setisVisibleCollectionList(false);
                                        setisVisibVideoComp(false);
                                        setisVisibImageComp(false);
                                        setisVisibIconComp(false);
                                        setIsVisibleTreeView(false);
                                        setSelectedType('Posts');
                                        forceUpdate();
                                    }}
                                >
                                    Add Post
                                </button>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => {
                                        setisVisibleAddNewType(false);
                                        setisVisibleAddNewType(true);
                                        setisVisibleCollectionList(false);
                                        setisVisibVideoComp(false);
                                        setisVisibImageComp(false);
                                        setisVisibIconComp(false);
                                        setIsVisibleTreeView(false);
                                        setSelectedType('Documents');
                                        forceUpdate();
                                    }}
                                >
                                    Add Document
                                </button>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => {
                                        setisVisibleAddNewType(false);
                                        setisVisibleAddNewType(true);
                                        setisVisibleCollectionList(false);
                                        setisVisibVideoComp(false);
                                        setisVisibImageComp(false);
                                        setisVisibIconComp(false);
                                        setIsVisibleTreeView(false);
                                        setSelectedType('Tree');
                                        forceUpdate();
                                    }}
                                >
                                    Add Tree
                                </button>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => {
                                        setisVisibleAddNewType(false);
                                        setisVisibleAddNewType(true);
                                        setisVisibleCollectionList(false);
                                        setisVisibVideoComp(false);
                                        setisVisibImageComp(false);
                                        setisVisibIconComp(false);
                                        setIsVisibleTreeView(false);
                                        setSelectedType('Forms');
                                        forceUpdate();
                                    }}
                                >
                                    Add Form
                                </button>
                            </div>
                        </div>
                        <SearchComponent
                            search={collectionSearch}
                            reset={resetCollections}
                            placeholder="Search Collections"
                        />
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
                <div className="page__content__container pt-0">
                    <div className="row">
                        {isVisibleCollectionList ? (
                            <DocumentList
                                collName={SelectedName}
                                collectionTypes={selectedCollecType}
                                postCategories={postCategories}
                                documentCategories={documentCategories}
                                formCategories={formCategories}
                                collectionTypesPost={collectionTypesPost}
                                collectionTypesDocs={collectionTypesDocs}
                                callback={() => {
                                    setupdateMenuOnCllBak(2);
                                }}
                            ></DocumentList>
                        ) : (
                            ''
                        )}
                        {isVisibleAddNewType ? getAddNewCollectionTypeComponent() : ''}
                        {isVisibVideoComp ? <VideoComponent></VideoComponent> : ''}
                        {isVisibImageComp ? <ImageComponent IsPopup={false}></ImageComponent> : ''}
                        {isVisibIconComp ? <IconsComponent></IconsComponent> : ''}
                        {isVisibleTreeView ? (
                            <TreeViewComponent
                                treeId={selectedTreeViewId}
                                dbName={targetDatabase}
                                documents={collectionNamesDocs}
                                posts={collectionNamesPost}
                                forms={collectionNamesForms}
                                supportLanguages={props.lang}
                                onDeleteTree={resetCollections}
                            ></TreeViewComponent>
                        ) : (
                            ''
                        )}
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

export default connect(mapStateToProps)(DocumentsPageComponent);
