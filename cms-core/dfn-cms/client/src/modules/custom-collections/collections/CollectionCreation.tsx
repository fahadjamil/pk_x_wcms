import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';
import { getInitialWorkflowState } from '../../shared/utils/WorkflowUtils';
import FiledComponentMapping from './field-types/FieldComponentMapping';

function CollectionCreation(props) {
    const targetDatabase = props.website;
    const [validated, setValidated] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const websiteLanguages = props.lang;
    const [collectionTypeObj, setcollectionTypeObj] = useState({
        _id: '',
        fieldsList: {},
        customeCollectionName: '',
        collectionTypes: '',
        menuName: '',
    });
    //let collectionTypeObj: IcollType;
    const [fieldDataState, setfieldDataState] = useState({});

    interface IcollType {
        _id: '';
        fieldsList: {};
        customeCollectionName: '';
        collectionTypes: '';
        menuName: '';
    }
    interface IfldTyp {
        default: '';
        max: '';
        min: '';
        regex: '';
        required: boolean;
        islocalized: boolean;
        name: '';
        type: '';
        ext: '';
        itemList?: any;
        selectedCollection?: string;
    }
    interface IgetFields {
        dataKey: string;
        fieldType: string;
        initialValue: any;
        language: any;
        validations: any;
        dropDownListContent: any;
    }

    useEffect(() => {
        setcollectionTypeObj(props.collectionTypes);
    }, [props.collectionTypes]);

    function handleSubmit2(event) {
        let documentTitle = '';
        let documentType = '';

        if (props && props.collectionTypes && props.collectionTypes.collectionType) {
            documentType = props.collectionTypes.collectionType;
        }

        if (websiteLanguages && websiteLanguages.length > 0) {
            const fieldDataLangKey = websiteLanguages[0].langKey;
            const langFieldData = fieldDataState[fieldDataLangKey];

            if (langFieldData && langFieldData.entry_name) {
                documentTitle = langFieldData.entry_name;
            }
        }

        let FieldsListData = {
            fieldData: { ...fieldDataState },
            ...{
                workflowState: getInitialWorkflowState(
                    collectionTypeObj.customeCollectionName,
                    documentTitle,
                    documentType
                ),
            },
            ...{ active: true },
        };

        event.preventDefault();

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };
        Axios.post(
            '/api/custom-collections/new/create',
            {
                collection: collectionTypeObj.customeCollectionName + '-drafts',
                dbName: targetDatabase,
                pageData: FieldsListData,
            },
            httpHeaders
        )
            .then((response) => {
                props.callback();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function valueChange(event: any, lanKey: any) {
        let fildName = Object.keys(event)[0];

        if (event.type && event.type === 'media') {
            setSmShow(true);
            const formData = new FormData();
            formData.append('file', event[fildName]);
            formData.set('dbName', targetDatabase);

            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.post('/api/custom-collections/documents/upload', formData, httpHeaders)
                .then((resp) => {
                    if (resp.data.filename) {
                        setSmShow(false);
                    }
                    let fieldData = { ...fieldDataState };
                    fieldData[lanKey] = {
                        ...fieldData[lanKey],
                        ...{ [fildName]: resp.data.filename },
                    };
                    setfieldDataState(fieldData);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            let fieldData = { ...fieldDataState };
            fieldData[lanKey] = { ...fieldData[lanKey], ...event };
            setfieldDataState(fieldData);
        }
    }

    const getFields = (value: IgetFields) => {
        const FieldComponent = FiledComponentMapping[value.fieldType];

        return (
            <div key={value.dataKey + value.language.langKey}>
                <FieldComponent {...value} onValueChange={valueChange}></FieldComponent>
            </div>
        );
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

    return (
        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
            {websiteLanguages &&
                websiteLanguages.map((language) => {
                    return Object.entries(props.collectionTypes.fieldsList).map(([key, value]) => {
                        let fldTyplcl: IfldTyp;
                        fldTyplcl = value as IfldTyp;

                        if (fldTyplcl.islocalized) {
                            return getFields({
                                dataKey: key,
                                fieldType: fldTyplcl?.type,
                                language: language,
                                initialValue: {
                                    [language.langKey]: fldTyplcl?.default ? fldTyplcl.default : '',
                                },
                                validations: {
                                    required: fldTyplcl?.required ? fldTyplcl.required : false,
                                    minLen: fldTyplcl?.min ? Number(fldTyplcl.min) : 0,
                                    maxLen: fldTyplcl?.max ? Number(fldTyplcl.max) : 524288,
                                    regex: fldTyplcl?.regex,
                                    ext: fldTyplcl?.ext,
                                },
                                dropDownListContent: {
                                    itemList: fldTyplcl?.itemList,
                                    selectedCollection: fldTyplcl?.selectedCollection,
                                },
                            });
                        } else {
                            if (language.langKey.toLowerCase() === 'en') {
                                return getFields({
                                    dataKey: key,
                                    fieldType: fldTyplcl?.type,
                                    language: language,
                                    initialValue: {
                                        [language.langKey]: fldTyplcl?.default
                                            ? fldTyplcl.default
                                            : '',
                                    },
                                    validations: {
                                        required: fldTyplcl?.required ? fldTyplcl.required : false,
                                        minLen: fldTyplcl?.min ? Number(fldTyplcl.min) : 0,
                                        maxLen: fldTyplcl?.max ? Number(fldTyplcl.max) : 524288,
                                        regex: fldTyplcl?.regex,
                                        ext: fldTyplcl?.ext,
                                    },
                                    dropDownListContent: {
                                        itemList: fldTyplcl?.itemList,
                                        selectedCollection: fldTyplcl?.selectedCollection,
                                    },
                                });
                            }
                        }
                    });
                })}

            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                        props.onCloseCallBack();
                    }}
                >
                    Close
                </button>
                <Button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isEnable('/api/custom-collections/new/create')}
                >
                    Save changes
                </Button>
            </div>
            <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body>File Is Uploading...</Modal.Body>
            </Modal>
        </Form>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
    };
};

export default connect(mapStateToProps)(CollectionCreation);
