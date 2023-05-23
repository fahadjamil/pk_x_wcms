import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import { v1 as uuidv1 } from 'uuid';

import PdfIconGold from '../resources/PdfIconGold';
import MsWordIcon from '../resources/MsWordIcon';
import MsExcelIcon from '../resources/MsExcelIcon';

const ListRow = styled.div`
    float: none;
`;

const IconSpan = styled.span`
    padding-right: 10px;
`;

const DocumentIconMapping = {
    pdf: PdfIconGold,
    xlsx: MsExcelIcon,
    xls: MsExcelIcon,
    docx: MsWordIcon,
    doc: MsWordIcon,
};

export function ListComponent(props) {
    const { commonConfigs, dbName } = props;
    const { data, styles, settings } = props.data;
    const selectedLanguage = props.lang;

    let collection = undefined;
    let recordsOrder = undefined;
    let list = '';

    if (settings) {
        collection = settings.collection;
        recordsOrder = settings.recordsOrder ? settings.recordsOrder.value : undefined;
    }

    if (data !== undefined) {
        list = data.list;
    }

    const [collectionData, setCollectionData] = useState([]);
    const [uniqueKey, setUniqueKey] = useState('');

    useEffect(() => {
        setUniqueKey(uuidv1());
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (isMounted && collection) {
            const { dataSourceUrl } = collection.externalParams;
            const header = {
                headers: {
                    // Authorization: jwt,
                },
                params: {
                    nameSpace: props.dbName,
                    collectionName: collection.value.customeCollectionName,
                    sorter: JSON.stringify({ _id: -1 }), // only get the latest records
                    searchQuery: JSON.stringify({ active: true }),
                },
            };

            Axios.get(dataSourceUrl, header).then((res) => {
                if (res.status === 200 && res.data.length > 0) {
                    let resposeData = [];
                    if (recordsOrder === 'desc') {
                        for (let index = res.data.length - 1; index >= 0; index--) {
                            const element = res.data[index];
                            resposeData.push(element);
                        }
                    } else {
                        for (let index = 0; index < res.data.length; index++) {
                            const element = res.data[index];
                            resposeData.push(element);
                        }
                    }

                    const updatedRecords = resposeData.map((record, recordIndex) => {
                        const { _id, fieldData } = record;
                        const recordData = fieldData[selectedLanguage.langKey];

                        let listData = {
                            id: _id,
                            listItem: {},
                        };

                        if (list && list.features && recordData) {
                            Object.entries(list.features).map(([key, value], featureIndex) => {
                                const { mappingField } = value;

                                listData.listItem[key] = recordData[mappingField];

                                if (key === 'document') {
                                    let path = recordData[mappingField]
                                        ? '/api/documents/' +
                                          dbName +
                                          '/' +
                                          recordData[mappingField]
                                        : '#';
                                    listData.listItem[key] = path;
                                }
                            });
                        }

                        return listData;
                    });

                    setCollectionData(updatedRecords);
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <React.Fragment>
            {settings && settings.collection && (
                <ListRow className="list-group list-group-flush">
                    {collectionData.map((item, index) => {
                        let document = item.listItem.document
                            ? item.listItem.document.split('.')
                            : '';
                        let documentType = document != '' ? document[document.length - 1] : 'pdf';
                        console.log('documentType', documentType);

                        let DocumentIconComp =
                            documentType != ''
                                ? DocumentIconMapping[documentType]
                                    ? DocumentIconMapping[documentType]
                                    : DocumentIconMapping['pdf']
                                : DocumentIconMapping['pdf'];

                        return (
                            <React.Fragment>
                                <a
                                    className="list-group-item d-flex align-items-center"
                                    key={uniqueKey + '' + item.listItem.title}
                                    href={item.listItem.document ? item.listItem.document : '#'}
                                    target="_blank"
                                >
                                    {/* <span className="badge badge-pill"> */}
                                    {DocumentIconComp != '' && (
                                        <IconSpan>
                                            <DocumentIconComp width="48" height="48" />
                                        </IconSpan>
                                    )}
                                    {item.listItem.title}
                                </a>
                            </React.Fragment>
                        );
                    })}
                </ListRow>
            )}
        </React.Fragment>
    );
}
