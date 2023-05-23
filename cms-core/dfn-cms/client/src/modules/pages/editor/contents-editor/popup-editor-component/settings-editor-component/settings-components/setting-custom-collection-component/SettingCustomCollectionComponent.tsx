import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import MasterRepository from '../../../../../../../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../../../../../../../shared/utils/AuthorizationUtils';
import SettingModel from '../../models/SettingModel';

function SettingCustomCollectionComponent(props: SettingModel) {
    /*     const [customeTypePosts, setCustomeTypePosts] = useState<any>([]);*/
    const [customeTypeDocuments, setCustomeTypeDocuments] = useState<any>([]);
    const [selectedCustomCollection, setSelectedCustomCollection] = useState<string>('');
    //const [selectedCollection, setSelectedCollection] = useState<any>(undefined);
    const [documentsList, setDocumentsList] = useState<any>([]);
    const [selectedDocument, setSelectedDocument] = useState<string>('');
    const [fieldList, setFieldList] = useState<any>();
    const [selectedField, setSelectedField] = useState<string>('');

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            //getAllCustomeTypePosts();
            getAllCustomeTypeDocuments();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (props.initialSettingsValue) {
            setSelectedCustomCollection((prev) => props.initialSettingsValue.collection || '');
            setSelectedDocument((prev) => props.initialSettingsValue.documentId || '');
            setSelectedField((prev) => props.initialSettingsValue.documentField || '');
            updateCustomTypeCollection(props.initialSettingsValue.collection);

            if (props.onValueSelected) {
                props.onValueSelected({
                    [props.dataKey]: {
                        collection: props.initialSettingsValue.collection || '',
                        documentId: props.initialSettingsValue.documentId || '',
                        documentField: props.initialSettingsValue.documentField || '',
                    },
                });
            }
        }
    }, [props.initialSettingsValue, customeTypeDocuments]);

    /*  function getAllCustomeTypePosts() {
        const headerParameter = {
            collection: 'custome-types',
            searchQuery: 'Posts',
            user: MasterRepository.getCurrentUser().userName,
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                const { data, status } = response;

                if (status === 200) {
                    if (Array.isArray(data)) {
                        setCustomeTypePosts(data);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } */

    function getAllCustomeTypeDocuments() {
        const headerParameter = {
            collection: 'custome-types',
            searchQuery: 'Documents',
            user: MasterRepository.getCurrentUser().userName,
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                const { data, status } = response;

                if (status === 200) {
                    if (Array.isArray(data)) {
                        setCustomeTypeDocuments(data);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getCollectionDocumentsList(customCollection: string) {
        if (customCollection && customCollection !== '') {
            const headerParameter = { collection: customCollection };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.get('/api/custom-collections/types', httpHeaders)
                .then((response) => {
                    setDocumentsList(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function handleCustomTypesValueChanges(event) {
        updateCustomTypeCollection(event.target.value);
    }

    function updateCustomTypeCollection(collection: string) {
        setSelectedCustomCollection(collection);
        getCollectionDocumentsList(collection);

        const selectedType = customeTypeDocuments.find(
            (collectionType) => collectionType.customeCollectionName === collection
        );
        if (selectedType) {
            const { fieldsList } = selectedType;
            setFieldList((prev) => fieldsList);
        }
    }

    function getDocumentTitle(document: any, index: number) {
        const DefaultLanguage = 'EN';

        const recordTitle = document.fieldData
            ? document.fieldData[DefaultLanguage]
                ? document.fieldData[DefaultLanguage].entry_name
                    ? document.fieldData[DefaultLanguage].entry_name
                    : undefined
                : undefined
            : undefined;

        const recordIndex = index + 1;

        if (recordTitle === undefined || recordTitle === '') {
            return `Record ${recordIndex}`;
        } else {
            return recordTitle;
        }
    }

    const handleValueChange = (event) => {
        setSelectedDocument(event.target.value);

        if (props.onValueSelected) {
            props.onValueSelected({
                [props.dataKey]: {
                    collection: selectedCustomCollection,
                    documentId: event.target.value,
                    documentField: selectedField,
                },
            });
        }
    };

    function handleFieldsValueChanges(event) {
        setSelectedField(event.target.value);
    }

    return (
        <>
            <h5>{props.displayTitle}</h5>
            {/* <div className="form-group">
                <label htmlFor="customCollectionPosts">Custom Collection Posts</label>
                <select
                    className="form-control"
                    id="customCollectionPosts"
                    value={selectedCollection?.customeCollectionName || ''}
                    name="customCollectionPosts"
                    onChange={handleCustomTypesValueChanges}
                >
                    <option value="">-- select an option --</option>
                    {customeTypePosts.map((collection, index) => {
                        const { _id, menuName, customeCollectionName } = collection;
                        return (
                            <option key={_id} value={collection}>
                                {menuName}
                            </option>
                        );
                    })}
                </select>
            </div> */}
            <div className="form-group">
                <label htmlFor="customCollectionDocuments">Custom Collection Documents</label>
                <select
                    className="form-control"
                    id="customCollectionDocuments"
                    value={selectedCustomCollection}
                    name="customCollectionDocuments"
                    onChange={handleCustomTypesValueChanges}
                >
                    <option value="">-- select an option --</option>
                    {customeTypeDocuments.map((collection, index) => {
                        const { _id, menuName, customeCollectionName } = collection;
                        return (
                            <option key={_id} value={customeCollectionName}>
                                {menuName}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="fieldSelect">Custom Collection PDF Field</label>
                <select
                    className="form-control"
                    id="fieldSelect"
                    value={selectedField}
                    name="fieldSelect"
                    onChange={handleFieldsValueChanges}
                >
                    <option value="">-- Select Media Field --</option>
                    {fieldList &&
                        Object.keys(fieldList).map((field) => {
                            if (
                                field &&
                                fieldList[field] &&
                                fieldList[field].type &&
                                fieldList[field].type === 'media'
                            ) {
                                return (
                                    <option key={field} value={field}>
                                        {field.replace('_', ' ').toUpperCase()}
                                    </option>
                                );
                            } else {
                                return <></>;
                            }
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
                    onChange={handleValueChange}
                    disabled={
                        documentsList.length === 0 ||
                        selectedCustomCollection === '' ||
                        selectedField === ''
                    }
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
        </>
    );
}

export default SettingCustomCollectionComponent;
