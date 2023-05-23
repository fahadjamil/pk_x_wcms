import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { v1 as uuidv1 } from 'uuid';
import TreeNodeModel from '../models/TreeNodeModel';
import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';
import LanguageModel from '../../shared/models/LanguageModel';

interface AddTreeNodePopupComponentModal {
    showPopup: boolean;
    onClosePopup: any;
    onSubmitData: any;
    allCustomCollection: any;
    supportLanguages: LanguageModel[];
    initialNodeData: TreeNodeModel | undefined;
    isEditMode: boolean;
}

function AddTreeNodePopupComponent(props: AddTreeNodePopupComponentModal) {
    const [nodeTitle, setNodeTitle] = useState<{ [key: string]: string }>({});
    const [selectedCustomCollection, setSelectedCustomCollection] = useState<string>('');
    const [documentsList, setDocumentsList] = useState<any>([]);
    const [selectedDocument, setSelectedDocument] = useState<string>('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        setValidated(false);

        if (props.isEditMode && props.initialNodeData) {
            setNodeTitle(props.initialNodeData.localizeTitle);
            getCollectionDocumentsList(props.initialNodeData.customCollection, true);
        } else {
            // Set parent node titles when adding new node
            if(props.initialNodeData && props.initialNodeData.localizeTitle){
                setNodeTitle(props.initialNodeData.localizeTitle);
            }else{
                setNodeTitle({});
            }
            setSelectedCustomCollection('');
            setSelectedDocument('');
            setDocumentsList([]);
        }

        return () => {
            setNodeTitle({});
            setSelectedCustomCollection('');
            setSelectedDocument('');
            setDocumentsList([]);
        };
    }, [props.showPopup]);

    function onSubmitForm(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            let nodeID = uuidv1();
            if (props.isEditMode && props.initialNodeData) {
                nodeID = props.initialNodeData.nodeID;
            }

            const newNode: TreeNodeModel = {
                nodeID: nodeID,
                customCollection: selectedCustomCollection,
                documentID: selectedDocument,
                localizeTitle: nodeTitle,
            };

            if (props.onSubmitData) {
                props.onSubmitData(newNode);
            }
        } else {
            setValidated(true);
        }
    }

    function getCollectionDocumentsList(customCollection: string, isEditMode: boolean) {
        if (customCollection && customCollection !== '') {
            const headerParameter = { collection: customCollection };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.get('/api/custom-collections/types', httpHeaders)
                .then((response) => {
                    setDocumentsList(response.data);

                    if (isEditMode && props.initialNodeData) {
                        
                        setSelectedCustomCollection(props.initialNodeData.customCollection);
                        setSelectedDocument(props.initialNodeData.documentID);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function getDocumentTitle(document: any, index: number) {
        const DefaultLanguage = props.supportLanguages[0];
        const SecondnaryLanguage = props.supportLanguages[1];

        const recordTitle = document.fieldData
            ? document.fieldData[DefaultLanguage.langKey]
                ? document.fieldData[DefaultLanguage.langKey].entry_name
                    ? document.fieldData[DefaultLanguage.langKey].entry_name
                    : document.fieldData[SecondnaryLanguage.langKey]
                    ? document.fieldData[SecondnaryLanguage.langKey].entry_name
                    : ''
                : ''
            : document.fieldData[SecondnaryLanguage.langKey]
            ? document.fieldData[SecondnaryLanguage.langKey].entry_name
            : '';

        const recordIndex = index + 1;
        if (recordTitle === undefined || recordTitle === '') {
            return `Record ${recordIndex}`;
        } else {
            return recordTitle;
        }
    }

    function onTitleChange(event: any, languageKey: string) {
        if (event && event.target && event.target.value) {
            nodeTitle[languageKey] = event.target.value;
            setNodeTitle({ ...nodeTitle });
        }
    }

    function getDefaultTitle(languageKey: string) {
        if (
            props.initialNodeData &&
            props.initialNodeData.localizeTitle &&
            props.initialNodeData.localizeTitle[languageKey.toLowerCase()]
        ) {
            return props.initialNodeData.localizeTitle[languageKey.toLowerCase()];
        }
        return '';
    }

    return (
        <Modal
            show={props.showPopup}
            onHide={props.onClosePopup}
            size="lg"
            scrollable={true}
            autoFocus={false}
            enforceFocus={false}
        >
            <Form noValidate validated={validated} onSubmit={onSubmitForm}>
                <Modal.Header>
                    <Modal.Title>Add Node Title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.supportLanguages &&
                        props.supportLanguages.map((language) => {
                            return (
                                <div
                                    className="form-group"
                                    key={`treePopupTttle${language.langKey}`}
                                >
                                    <label htmlFor={`NodeTitle${language.langKey}`}>
                                        Title {language.language}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={`NodeTitle${language.langKey}`}
                                        required
                                        defaultValue={getDefaultTitle(language.langKey)}
                                        onChange={(event) => {
                                            onTitleChange(event, language.langKey.toLowerCase());
                                        }}
                                    />
                                </div>
                            );
                        })}
                    <div className="form-group">
                        <label htmlFor="customCollections">Custom Collections</label>
                        <select
                            className="form-control"
                            id="customCollections"
                            value={selectedCustomCollection}
                            name="customCollection"
                        
                            onChange={(event) => {
                                setDocumentsList((prev) => []);
                                setSelectedDocument((prev) => '');
                                setSelectedCustomCollection(event.target.value);
                                getCollectionDocumentsList(event.target.value, false);
                            }}
                        >
                            <option value="">None</option>
                            {props.allCustomCollection.map((collection, index) => {
                                const { uid, menuname } = collection;
                                return (
                                    <option key={uid} value={uid}>
                                        {menuname}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="collectionDocumentList">Collection Record</label>
                        <select
                            className="form-control"
                            id="collectionDocumentList"
                            value={selectedDocument}
                            name="collectionDocumentList"
                            
                            onChange={(event) => {
                                setSelectedDocument(event.target.value);
                            }}
                            disabled={documentsList.length === 0}
                        >
                            <option value="">None</option>
                            {documentsList.map((document, index) => {
                                const { _id } = document;
                                const title = getDocumentTitle(document, index);
                                return (
                                    <option key={_id.toString()} value={_id.toString()}>
                                        {title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={props.onClosePopup}>
                        Close
                    </Button>
                    <Button type="submit" data-dismiss="modal">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddTreeNodePopupComponent;
