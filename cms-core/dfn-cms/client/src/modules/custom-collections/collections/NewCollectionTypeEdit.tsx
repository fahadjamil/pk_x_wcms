import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import useForceUpdate from 'use-force-update';
import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';
import AdvanceConfigs from './AdvanceConfigs';

function NewCollectionTypeEdit(props: any) {
    const [collectionName, setCollectionName] = useState('');
    const [FieldName, setFieldName] = useState('');
    const [fieldsList, setFieldsList] = useState({});
    const [FieldType, setFieldType] = useState('');
    const [selectedKey, setSelectedKey] = useState('');
    const [CollectionType, setCollectionType] = useState('Documents');
    const [showAdvanceConf, setshowAdvanceConf] = useState(false);
    const [validated, setValidated] = useState(false);
    const targetDatabase = props.website;
    const forceUpdate = useForceUpdate();

    const SELECT_NEW_CATEGORY = 'sel_new_cat';

    const [selectedCategory, setSelectedCategory] = useState(SELECT_NEW_CATEGORY);
    const [newCategoryName, setNewCategoryName] = useState('');

    let prefxColName;
    let isSuccess = false;
    let defaultValueType = props.collectionTypes.collectionType;
    let defaultCategory = SELECT_NEW_CATEGORY;
    //console.log('props-----------------', props);
    useEffect(() => {
        setCollectionType(props.collectionTypes.collectionType);
        if (props.collectionTypes.category && props.collectionTypes.category !== '') {
            defaultCategory = props.collectionTypes.category;
            setSelectedCategory(props.collectionTypes.category);
        }
        fillFormData();
    }, []);

    function fillFormData() {
        setFieldName('');
        setFieldsList(props.collectionTypes.fieldsList);
        setFieldType('');
        setCollectionName(props.collectionTypes.menuName);
    }

    function setBaseComponentState(status: any) {
        setFieldsList({ ...fieldsList, ...status });
        setFieldName('');
    }

    function handleSubmit2(event) {
        event.preventDefault();

        let colNameNoSpace = collectionName.replace(/\s/g, '-');
        if (CollectionType === 'Posts') {
            prefxColName = 'posts-' + colNameNoSpace.toLowerCase();
        } else if (CollectionType === 'Documents') {
            prefxColName = 'docs-' + colNameNoSpace.toLowerCase();
        } else if (CollectionType === 'Forms') {
            prefxColName = 'forms-' + colNameNoSpace.toLowerCase();
        }

        const { _id, ...collectionTypeData } = props.collectionTypes;

        let FieldsListLocal = {
            ...collectionTypeData,
            ...{ fieldsList },
            ...{ customeCollectionName: prefxColName },
            ...{ collectionType: CollectionType },
            ...{ menuName: collectionName },
        };

        if (selectedCategory === SELECT_NEW_CATEGORY) {
            if (newCategoryName.trim() !== '') {
                FieldsListLocal = { ...FieldsListLocal, category: newCategoryName.trim() };
            }
        } else {
            FieldsListLocal = { ...FieldsListLocal, category: selectedCategory };
        }

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.put(
            '/api/custom-collections/new/update',
            {
                dbName: targetDatabase,
                collectionName: 'custome-types',
                _id: props.collectionTypes._id,
                updated_data: FieldsListLocal,
            },
            httpHeaders
        )
            .then((res) => {
                props.callback();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const fieldTypeUpdate = (
        fieldType,
        fieldName,
        requir,
        isLocalized = false,
        minVal,
        maxVal,
        extensions,
        itemList,
        selectedCollection
    ) => {
        const updatedFieldType = { ...fieldsList };
        const data: any = {
            type: fieldType,
            required: requir,
            islocalized: isLocalized,
            name: fieldsList[fieldName.key].name,
        };

        if (
            fieldType === 'fieldShortText' ||
            fieldType === 'fieldLongText' ||
            fieldType === 'richTextEditor' ||
            fieldType === 'email' ||
            fieldType === 'number'
        ) {
            if (minVal) {
                data.min = minVal;
            } else {
                data.min = '0';
            }

            if (maxVal) {
                data.max = maxVal;
            } else {
                data.max = '50';
            }
        }

        if (fieldType === 'media') {
            if (extensions) {
                data.ext = extensions;
            } else {
                data.ext = '.pdf,.docx,.doc';
            }
        }

        if (fieldType === 'dropDownList') {
            if (itemList) {
                data.itemList = itemList;
            }

            if (selectedCollection) {
                data.selectedCollection = selectedCollection;
            }
        }

        updatedFieldType[fieldName.key] = data;
        setFieldsList(updatedFieldType);
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else if (form.checkValidity() === true) {
            handleSubmit2(event);
        }
        setValidated(true);
    };

    const OnAdvanceClickHandler = (key, event) => {
        setshowAdvanceConf(false);
        fieldTypeUpdate(
            fieldsList[key].type,
            { key },
            fieldsList[key].required,
            fieldsList[key].islocalized,
            event.min,
            event.max,
            event.ext,
            event.itemList,
            event.selectedCollection
        );
    };

    function getCategoriesList() {
        if (CollectionType === 'Posts') {
            return (
                <>
                    <option value="">None</option>
                    <option value={SELECT_NEW_CATEGORY}>Select New Category</option>
                    {props.postCategories &&
                        props.postCategories.map((category) => {
                            return (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            );
                        })}
                </>
            );
        } else if (CollectionType === 'Documents') {
            return (
                <>
                    <option value="">None</option>
                    <option value={SELECT_NEW_CATEGORY}>Select New Category</option>
                    {props.documentCategories &&
                        props.documentCategories.map((category) => {
                            return (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            );
                        })}
                </>
            );
        } else if (CollectionType === 'Forms') {
            return (
                <>
                    <option value="">None</option>
                    <option value={SELECT_NEW_CATEGORY}>Select New Category</option>
                    {props.formCategories &&
                        props.formCategories.map((category) => {
                            return (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            );
                        })}
                </>
            );
        } else {
            return (
                <>
                    <option value={SELECT_NEW_CATEGORY}>Select New Category</option>
                </>
            );
        }
    }

    return (
        <div className="col-sm-12">
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                <div className="row">
                    <div className="col-sm-12">
                        <h5
                            style={{
                                color: '#495057',
                                padding: '8px',
                                textAlign: 'center',
                                background: '#e9ecef',
                            }}
                        >
                            Edit Collection Type
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="CollectionName"
                                placeholder="Enter collection name"
                                onChange={(e) => setCollectionName(e.target.value)}
                                value={collectionName}
                                required
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <select
                                className="form-control"
                                id="colltypedd"
                                onChange={(e) => setCollectionType(e.target.value)}
                                defaultValue={defaultValueType}
                                disabled
                            >
                                <option value="Posts">Posts</option>
                                <option value="Documents">Documents</option>
                                <option value="Forms">Forms</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            {selectedCategory === SELECT_NEW_CATEGORY && (
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoryName"
                                    placeholder="Enter Category Name"
                                    onChange={(e) => {
                                        setNewCategoryName(e.target.value);
                                    }}
                                    value={newCategoryName}
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <select
                                className="form-control"
                                id="catogory"
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                }}
                                value={selectedCategory}
                            >
                                {getCategoriesList()}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="FieldName"
                                placeholder="Enter Field Name"
                                onChange={(e) => {
                                    setFieldName(e.target.value);
                                    e.target.value = '';
                                }}
                                value={FieldName}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <button
                            className="btn btn-primary"
                            value="Add"
                            onClick={(e) => {
                                e.preventDefault();
                                if (FieldName.length != 0) {
                                    setBaseComponentState({
                                        [FieldName.toLocaleLowerCase().split(' ').join('_')]: {
                                            type: 'fieldShortText',
                                            required: false,
                                            name: FieldName,
                                            isLocalized: false,
                                            min: '0',
                                            max: '50',
                                        },
                                    });
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="table-responsive-sm">
                            <table className="table table-hover">
                                <thead>
                                    <tr className="text-center">
                                        <th scope="col">Name</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Required</th>
                                        <th scope="col">Localized</th>
                                        <th scope="col">Advance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(fieldsList).map(([key, value]) => {
                                        interface Ifield {
                                            type: '';
                                            required: '';
                                        }
                                        let val: Ifield;
                                        val = value as Ifield;
                                        return (
                                            <tr key={key} className="text-center">
                                                <td>{fieldsList[key].name} </td>
                                                <td>
                                                    <select
                                                        className="form-control"
                                                        id="colltypedd"
                                                        onChange={(e) =>
                                                            fieldTypeUpdate(
                                                                e.target.value,
                                                                { key },
                                                                fieldsList[key].required,
                                                                fieldsList[key].islocalized,
                                                                fieldsList[key].min,
                                                                fieldsList[key].max,
                                                                fieldsList[key].ext,
                                                                fieldsList[key].itemList,
                                                                fieldsList[key].selectedCollection
                                                            )
                                                        }
                                                        value={
                                                            fieldsList[key].type || 'fieldShortText'
                                                        }
                                                    >
                                                        <option value="fieldShortText">Text</option>
                                                        <option value="fieldLongText">
                                                            Paragraph
                                                        </option>
                                                        <option value="richTextEditor">
                                                            Rich text Editor
                                                        </option>
                                                        <option value="media">Media</option>
                                                        <option value="number">Number</option>
                                                        <option value="email">Email</option>
                                                        <option value="date">Date Picker</option>
                                                        <option value="dropDownList">
                                                            Drop Down List
                                                        </option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="ckbRequired"
                                                        onChange={(e) =>
                                                            fieldTypeUpdate(
                                                                fieldsList[key].type,
                                                                { key },
                                                                e.target.checked,
                                                                fieldsList[key].islocalized,
                                                                fieldsList[key].min,
                                                                fieldsList[key].max,
                                                                fieldsList[key].ext,
                                                                fieldsList[key].itemList,
                                                                fieldsList[key].selectedCollection
                                                            )
                                                        }
                                                        checked={fieldsList[key].required || false}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="ckbIsLocalized"
                                                        onChange={(e) =>
                                                            fieldTypeUpdate(
                                                                fieldsList[key].type,
                                                                { key },
                                                                fieldsList[key].required,
                                                                e.target.checked,
                                                                fieldsList[key].min,
                                                                fieldsList[key].max,
                                                                fieldsList[key].ext,
                                                                fieldsList[key].itemList,
                                                                fieldsList[key].selectedCollection
                                                            )
                                                        }
                                                        checked={
                                                            fieldsList[key].islocalized || false
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary mr-2"
                                                        onClick={(e) => {
                                                            setshowAdvanceConf(true);
                                                            setSelectedKey(key);
                                                        }}
                                                    >
                                                        Configurations
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="modal-footer">
                            <Button
                                type="submit"
                                disabled={isEnable('/api/custom-collections/new/update')}
                                className="btn btn-primary"
                            >
                                Save Edited changes
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
            {showAdvanceConf && (
                <Modal
                    show={showAdvanceConf}
                    onHide={() => {
                        setshowAdvanceConf(false);
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Advance Configurations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AdvanceConfigs
                            fieldsListObj={fieldsList[selectedKey]}
                            collectionTypesPost={props.collectionTypesPost}
                            collectionTypesDocs={props.collectionTypesDocs}
                            onClick={(e) => {
                                OnAdvanceClickHandler(selectedKey, e);
                                setshowAdvanceConf(false);
                            }}
                            mode="edit"
                            closeModal={setshowAdvanceConf}
                        ></AdvanceConfigs>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(NewCollectionTypeEdit);
