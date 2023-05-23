import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import FiledComponentMapping from './field-types/FieldComponentMapping';
import { getUpdatedWorkflowState } from '../../shared/utils/WorkflowUtils';
import { WorkflowsStatus } from '../../shared/config/WorkflowsStatus';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';

function DocumentEdit(props) {
    const targetDatabase = props.website;
    const [validated, setValidated] = useState(false);
    const [websiteLanguages, setwebsiteLanguages] = useState(props.lang);
    const [smShow, setSmShow] = useState(false);

    let fieldData = ({} = props.fieldObj);
    let collectionTypeObj: IcollType;

    interface IcollType {
        _id: '';
        fieldsList: {};
        customeCollectionName: '';
        collectionTypes: '';
        menuName: '';
    }
    collectionTypeObj = {
        _id: '',
        fieldsList: {},
        customeCollectionName: '',
        collectionTypes: '',
        menuName: '',
    };

    interface IfldTyp {
        default: '';
        max: '';
        min: '';
        regex: '';
        required: boolean;
        type: '';
        ext: '';
        islocalized: boolean;
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
        value: string;
    }

    getCollTypeObject();

    useEffect(() => {
        //setfielddata(props.fieldObj);
    }, []);

    function getCollTypeObject() {
        if (Object.keys(props.collectionTypes).length != 0) {
            collectionTypeObj = props.collectionTypes;
        }

        return collectionTypeObj;
    }

    function handleSubmit2(event) {
        let updateWorkflowState = getUpdatedWorkflowState(
            WorkflowsStatus.initial,
            props.workflowState,
            'Document edit',
            props.collectionTypes.customeCollectionName
        );
        if (props.onWorkflowEditSubmit) {
            props.onWorkflowEditSubmit(updateWorkflowState);
        }
        let FieldsListData = {
            ...{ fieldData },
            ...{ workflowStateId: updateWorkflowState.id },
            ...{ active: true },
            ...{ version: props.metaData.version },
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

        Axios.put(
            '/api/custom-collections/documents/update',
            {
                dbName: targetDatabase,
                collectionName: props.collectionTypes.customeCollectionName + '-drafts',
                _id: props._id,
                updated_data: FieldsListData,
            },
            httpHeaders
        )
            .then((res) => {
                //setDisableSubmit(true);
                props.callback();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function valueChange(event: any, lanKey: any) {
        if (event.type && event.type === 'media') {
            let fildName = Object.keys(event)[0];
            setSmShow(true);
            const formData = new FormData();
            formData.append('file', event[fildName]);
            formData.set('dbName', targetDatabase);

            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.post('/api/custom-collections/documents/upload', formData, httpHeaders)
                .then((resp) => {
                    console.log('resp.data.filename ----', resp.data.filename);
                    if (resp.data.filename) {
                        setSmShow(false);
                    }
                    fieldData[lanKey] = {
                        ...fieldData[lanKey],
                        ...{ [fildName]: resp.data.filename },
                    };
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            fieldData[lanKey] = { ...fieldData[lanKey], ...event };
            let tesObj = { entry_name: 'c', type: '', type33: '3' };
            tesObj = { ...tesObj, ...event };
        }
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

    const getFields = (value: IgetFields) => {
        const FieldComponent = FiledComponentMapping[value.fieldType];
        let keyId =
            String(value.dataKey) + String(value.fieldType) + String(value.language.langKey);
        return (
            <div key={keyId}>
                <FieldComponent {...value} onValueChange={valueChange}></FieldComponent>
            </div>
        );
    };

    const showLanguageWiseContent = () => {
        //collectionTypeObj -Schema object
        return Object.entries(collectionTypeObj.fieldsList).map(([fieldNm, value]) => {
            let fldTyplcl: IfldTyp;
            fldTyplcl = value as IfldTyp;
            let fieldData = props.fieldObj[websiteLanguages[0].langKey]
                ? props.fieldObj[websiteLanguages[0].langKey][fieldNm]
                : '';

            if (!fldTyplcl.islocalized) {
                return getFields({
                    dataKey: fieldNm,
                    fieldType: fldTyplcl?.type,
                    language: websiteLanguages[0],
                    initialValue: {
                        [websiteLanguages[0].langKey]: fieldData ? fieldData : '',
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
                    value: fieldData,
                });
            } else {
                return websiteLanguages.map((lang) => {
                    fieldData = props.fieldObj[lang.langKey]
                        ? props.fieldObj[lang.langKey][fieldNm]
                        : undefined;

                    return getFields({
                        dataKey: fieldNm,
                        fieldType: fldTyplcl?.type,
                        language: lang,
                        initialValue: {
                            [lang.langKey]: fieldData ? fieldData : '',
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
                        value: fieldData,
                    });
                });
            }
        });
    };

    return (
        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
            {showLanguageWiseContent()}

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
                    /*      disabled={
                        !sessionStorage
                            .getItem(props.website)!
                            .includes('/api/custom-collections/documents/update')
                    } */
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

export default connect(mapStateToProps)(DocumentEdit);
