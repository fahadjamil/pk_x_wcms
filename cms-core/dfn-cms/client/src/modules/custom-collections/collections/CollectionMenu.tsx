import {getAuthorizationHeader} from '../../shared/utils/AuthorizationUtils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import DocumentList from './DocumentList';
import NewCollctionType from './NewCollctionType';

function CollectionMenu(props) {
    // const targetDatabase = 'boursa2';
    const targetDatabase = props.website;
    const [collectionNamesPost, setcollectionNamesPost] = useState([{}]);
    const [collectionNamesDocs, setcollectionNamesDocs] = useState([{}]);
    const [collectionTypesPost, setcollectionTypesPost] = useState({});
    const [collectionTypesDocs, setcollectionTypesDocs] = useState({});
    const [isVisibleNewCollctionType, setisVisibleNewCollctionType] = useState(false);
    const [isVisibleCollectionList, setisVisibleCollectionList] = useState(false);
    const [SelectedName, setSelectedName] = useState('');
    const [selectedCollecType, setselectedCollecType] = useState({});

    const [isVisible, setisVisible] = useState(false);
    const [ColType, setColType] = useState('');
    //let ColType;
    const [updateMenuOnCllBak, setupdateMenuOnCllBak] = useState(1);

    interface value1 {
        collectiontype: string;
        customecollectionname: string;
        fieldslist: {};
        _id: string;
        menuname: string;
    }

    interface IcollType {
        _id: '';
        fieldslist: {};
        customecollectionname: '';
        collectionTypes: '';
        menuname: '';
    }

    interface mnuType {
        uid: '';
        menuname: '';
    }
    useEffect(() => {
        setcollectionTypesPost({});
        setcollectionTypesDocs({});
        setcollectionNamesPost([{}]);
        setcollectionNamesDocs([{}]);
        if (collectionNamesPost.length === 1) {
            getMenuData();
        }

        setupdateMenuOnCllBak(1);
    }, [updateMenuOnCllBak]);

    useEffect(() => {
        collectionNamesPost.shift();
        collectionNamesDocs.shift();
    }, []);

    function getMenuData() {
        const headerParameter = {collection: 'custome-types', searchQuery: 'Posts'};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                setcollectionTypesPost(response.data);
                Object.entries(response.data).map(([key, value]) => {
                    let val1: value1;
                    val1 = value as value1;

                    setcollectionNamesPost((collectionNames) => [
                        ...collectionNames,
                        { uid: val1.customecollectionname, menuname: val1.menuname },
                    ]);
                });
            })
            .catch((err) => {
                console.log(err);
            });

            const headerParameter2 = { collection: 'custome-types', searchQuery: 'Documents' };
            const httpHeaders2 = getAuthorizationHeader(headerParameter2);

        Axios.get('/api/custom-collections/types', httpHeaders2)
            .then((response) => {
                setcollectionTypesDocs(response.data);
                Object.entries(response.data).map(([key, value]) => {
                    let val1: value1;
                    val1 = value as value1;

                    setcollectionNamesDocs((collectionNames) => [
                        ...collectionNames,
                        { uid: val1.customecollectionname, menuname: val1.menuname },
                    ]);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function addNewTypeClick() {
        setisVisibleNewCollctionType(true);
        setisVisibleCollectionList(false);
        setisVisible(false);
    }

    function addNewCollectionClick(event, ColType: string) {
        setisVisibleNewCollctionType(false);
        setisVisibleCollectionList(false);
        setisVisible(true);
    }

    function getCollectionList(event, ColTypeLoc: string) {
        let objArry: any;
        let collectionTypeObj: IcollType;
        if (ColTypeLoc === 'Posts') {
            objArry = collectionTypesPost;
            if (objArry.length > 0) {
                collectionTypeObj = objArry.find(
                    (Obj) => Obj.customecollectionname === event
                ) as IcollType;
                setselectedCollecType(collectionTypeObj);
            }
        } else if (ColTypeLoc === 'Documents') {
            objArry = collectionTypesDocs;
            if (objArry.length > 0) {
                collectionTypeObj = objArry.find(
                    (Obj) => Obj.customecollectionname === event
                ) as IcollType;
                setselectedCollecType(collectionTypeObj);
            }
        }

        setisVisibleNewCollctionType(false);
        setisVisible(false);
        setisVisibleCollectionList(true);
        setSelectedName(event);
        setColType(ColTypeLoc);
    }

    function refresh() {
        if (updateMenuOnCllBak === 1) {
            setupdateMenuOnCllBak(2);
        }
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-sm-3">
                        <List disablePadding dense>
                            <ListItemText>Custom Collections</ListItemText>
                            <ListItem key="AddNewType" button>
                                <button
                                    type="button"
                                    className="btn"
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter1"
                                >
                                    <ListItemText>Add New Type</ListItemText>
                                </button>
                                <div
                                    className="modal fade"
                                    id="exampleModalCenter1"
                                    role="dialog"
                                    aria-labelledby="exampleModalCenterTitle"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="modal-dialog modal-dialog-centered"
                                        role="document"
                                    >
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5
                                                    className="modal-title"
                                                    id="exampleModalLongTitle"
                                                >
                                                    New Collection Type
                                                </h5>
                                            </div>
                                            <div className="modal-body">
                                                <NewCollctionType
                                                    callback={() => {
                                                        setupdateMenuOnCllBak(2);
                                                    }}
                                                ></NewCollctionType>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ListItem>
                            <ListItemText>Posts</ListItemText>
                            {collectionNamesPost.map((val, i) => {
                                let val1: mnuType;
                                val1 = val as mnuType;
                                return (
                                    <ListItem
                                        key={val1.uid}
                                        button
                                        dense
                                        onClick={(e) => getCollectionList(val1.uid, 'Posts')}
                                    >
                                        <ListItemText>{val1.menuname}</ListItemText>
                                    </ListItem>
                                );
                            })}

                            <ListItemText>Documents</ListItemText>
                            {collectionNamesDocs.map((val) => {
                                let val1: mnuType;
                                val1 = val as mnuType;

                                return (
                                    <ListItem
                                        key={val1.uid}
                                        button
                                        dense
                                        onClick={(e) => getCollectionList(val1.uid, 'Documents')}
                                    >
                                        <ListItemText>{val1.menuname}</ListItemText>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                    <div className="col-sm-9">
                        {isVisibleCollectionList ? (
                            <DocumentList
                                collName={SelectedName}
                                collectionTypes={selectedCollecType}
                            ></DocumentList>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(CollectionMenu);
