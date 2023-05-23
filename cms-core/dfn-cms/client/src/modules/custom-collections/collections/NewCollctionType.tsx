import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import useForceUpdate from 'use-force-update';
import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';
import AdvanceConfigs from './AdvanceConfigs';

function NewCollctionType(props) {
    const [collectionName, setCollectionName] = useState('');
    const [FieldName, setFieldName] = useState('');
    const [FieldType, setFieldType] = useState('');
    const [selectedKey, setSelectedKey] = useState('');
    const [CollectionType, setCollectionType] = useState('Documents');
    const [showAdvanceConf, setshowAdvanceConf] = useState(false);
    const targetDatabase = props.website;
    const forceUpdate = useForceUpdate();
    const [validated, setValidated] = useState(false);
    const [fieldsList, setFieldsList] = useState({
        entry_name: {
            type: 'fieldShortText',
            required: true,
            name: 'Entry Name',
            islocalized: true,
            min: '0',
            max: '50',
        },
    });

    const SELECT_NEW_CATEGORY = 'sel_new_cat';

    const [selectedCategory, setSelectedCategory] = useState(SELECT_NEW_CATEGORY);
    const [newCategoryName, setNewCategoryName] = useState('');

    let prefxColName;
    let isSuccess = false;
    let defaultValueType = props.selectedType;

    useEffect(() => {
        setCollectionType(props.selectedType);
    }, []);

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

        let FieldsListLocal = {
            ...{ fieldsList },
            ...{ customeCollectionName: prefxColName },
            ...{ collectionType: CollectionType },
            ...{ menuName: collectionName },
            ...{ roles: [] },
            category: '',
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

        Axios.post(
            '/api/custom-collections/create',
            {
                collection: 'custome-types',
                dbName: targetDatabase,
                pageData: FieldsListLocal,
            },
            httpHeaders
        )
            .then((response) => {
                isSuccess = true;
                ClearData();

                props.callback(CollectionType);
            })
            .catch((err) => {});
    }

    function ClearData() {
        setFieldName('');
        setFieldsList({
            entry_name: {
                type: 'fieldShortText',
                required: true,
                name: '',
                islocalized: true,
                min: '0',
                max: '50',
            },
        });
        setFieldType('');
        setCollectionName('');
        props.onGoBack();
    }

    function fieldTypeUpdate(
        fieldType,
        fieldName,
        requir,
        isLocalized,
        minVal,
        maxVal,
        extensions,
        itemList,
        selectedCollection
    ) {
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
    }

    function OnAdvanceClickHandler(key, event) {
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
    }

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

    function getCategoriesList() {
        if (CollectionType === 'Posts') {
            return (
                <>
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
        <div className="page__content__container">
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                <div className="row justify-content-md-center">
                    <div className="col-sm-8 ">
                        <div className="card--thm--01 form--thm--01">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h4>Add New Collection Type</h4>
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
                                                    [FieldName.toLocaleLowerCase()
                                                        .split(' ')
                                                        .join('_')]: {
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
                                    <div className="">
                                        <table className="table-borderless table-hover tbl-thm-01 table">
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
                                                        required: true;
                                                    }
                                                    let val: Ifield;
                                                    val = value as Ifield;
                                                    return (
                                                        <tr
                                                            key={key}
                                                            className="text-center align-items-center"
                                                        >
                                                            <td>{fieldsList[key].name} </td>
                                                            <td>
                                                                <select
                                                                    className="form-control form-control-sm"
                                                                    id="colltypedd"
                                                                    onChange={(e) =>
                                                                        fieldTypeUpdate(
                                                                            e.target.value,
                                                                            { key },
                                                                            fieldsList[key]
                                                                                .required,
                                                                            fieldsList[key]
                                                                                .islocalized,
                                                                            fieldsList[key].min,
                                                                            fieldsList[key].max,
                                                                            fieldsList[key].ext,
                                                                            fieldsList[key]
                                                                                .itemList,
                                                                            fieldsList[key]
                                                                                .selectedCollection
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="fieldShortText">
                                                                        Text
                                                                    </option>
                                                                    <option value="fieldLongText">
                                                                        Paragraph
                                                                    </option>
                                                                    <option value="richTextEditor">
                                                                        Rich text Editor
                                                                    </option>
                                                                    <option value="media">
                                                                        Media
                                                                    </option>
                                                                    <option value="number">
                                                                        Number
                                                                    </option>
                                                                    <option value="email">
                                                                        Email
                                                                    </option>
                                                                    <option value="date">
                                                                        Date Picker
                                                                    </option>
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
                                                                            fieldsList[key]
                                                                                .islocalized,
                                                                            fieldsList[key].min,
                                                                            fieldsList[key].max,
                                                                            fieldsList[key].ext,
                                                                            fieldsList[key]
                                                                                .itemList,
                                                                            fieldsList[key]
                                                                                .selectedCollection
                                                                        )
                                                                    }
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
                                                                            fieldsList[key]
                                                                                .required,
                                                                            e.target.checked,
                                                                            fieldsList[key].min,
                                                                            fieldsList[key].max,
                                                                            fieldsList[key].ext,
                                                                            fieldsList[key]
                                                                                .itemList,
                                                                            fieldsList[key]
                                                                                .selectedCollection
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary mr-2 btn-sm"
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
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                ClearData();
                                            }}
                                        >
                                            Previous collection list
                                        </button>
                                        <Button
                                            type="submit"
                                            data-dismiss="modal"
                                            disabled={isEnable('/api/custom-collections/create')}
                                        >
                                            Save changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
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

export default connect(mapStateToProps)(NewCollctionType);
