import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';
import CardComponent from './CardComponent';

const CardRow = styled.div`
    ${(props) => {
        return props.customCSS ? props.customCSS : '';
    }}
`;

const CardColumn = styled.div`
    padding-top: 15px;
    padding-bottom: 15px;
`;

function CardListComponent(params) {
    let cardList = '';
    let inlineStyles = {};
    let collection = undefined;
    let recordsLimit = undefined;
    let cardsPerRow = undefined;
    let viewMoreLink = undefined;
    let recordsOrder = undefined;

    const { commonConfigs, dbName } = params;
    const selectedLanguage = params.lang;
    const { data, styles, settings } = params.data;

    if (styles) {
        inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    }

    if (settings) {
        collection = settings.collection;
        recordsLimit = settings.recordsLimit ? settings.recordsLimit.value : undefined;
        cardsPerRow = settings.cardsPerRow ? settings.cardsPerRow.value : undefined;
        viewMoreLink = settings.viewMoreLink ? settings.viewMoreLink.value : undefined;
        recordsOrder = settings.recordsOrder ? settings.recordsOrder.value : undefined;
    }

    if (data !== undefined) {
        cardList = data.cardList;
    }

    const [collectionData, setCollectionData] = useState([]);
    const [rowCount, setRowCount] = useState(undefined);

    useEffect(() => {
        let isMounted = true;

        if (isMounted && collection) {
            const { dataSourceUrl } = collection.externalParams;
            const header = {
                headers: {
                    // Authorization: jwt,
                },
                params: {
                    nameSpace: params.dbName,
                    collectionName: collection.value.customeCollectionName,
                    sorter: JSON.stringify({ _id: -1 }), // only get the latest records
                    limit: recordsLimit ? recordsLimit : 0,
                    searchQuery: JSON.stringify({ active: true }),
                },
            };

            Axios.get(dataSourceUrl, header).then((res) => {
                if (res.status === 200 && res.data.length > 0) {
                    if (cardsPerRow) {
                        setRowCount(Math.ceil(res.data.length / cardsPerRow));
                    }

                    let resposeData = [];

                    //change oredr when desc selected
                    if (recordsOrder === 'desc') {
                        let limit = 0;
                        if (recordsLimit > 0 && res.data.length - recordsLimit > 0) {
                            limit = res.data.length - recordsLimit;
                        }
                        for (let index = res.data.length - 1; index >= limit; index--) {
                            const element = res.data[index];
                            resposeData.push(element);
                        }
                    } else {
                        let limit = res.data.length;
                        if (recordsLimit > 0 && res.data.length > recordsLimit) {
                            limit = recordsLimit;
                        }
                        for (let index = 0; index < limit; index++) {
                            const element = res.data[index];
                            resposeData.push(element);
                        }
                    }

                    const updatedRecords = resposeData.map((record, recordIndex) => {
                        const { _id, fieldData } = record;
                        const recordData = fieldData[selectedLanguage.langKey];

                        let cardData = {
                            id: _id,
                            card: {},
                        };

                        if (cardList && cardList.features && recordData) {
                            Object.entries(cardList.features).map(([key, value], featureIndex) => {
                                const { mappingField } = value;

                                cardData.card[key] = recordData[mappingField];

                                if (key === 'image') {
                                    let path = recordData[mappingField]
                                        ? '/api/documents/' +
                                          dbName +
                                          '/' +
                                          recordData[mappingField]
                                        : '#';
                                    cardData.card[key] = path;
                                }

                                if (key === 'link') {
                                    let path = recordData[mappingField]
                                        ? '/api/documents/' +
                                          dbName +
                                          '/' +
                                          recordData[mappingField]
                                        : '#';
                                    cardData.card[key] = path;
                                }
                            });
                        }

                        return cardData;
                    });

                    setCollectionData(updatedRecords);
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, []);

    if (rowCount && collectionData.length > 0) {
        const items = [];
        for (let index = 0; index < rowCount; index++) {
            let activeCards = [...collectionData];
            const newActiveCards = activeCards.splice(index * cardsPerRow, cardsPerRow);

            items.push(
                <CardRow
                    className={`row ${
                        inlineStyles ? (inlineStyles.cssClass ? inlineStyles.cssClass : '') : ''
                    }`}
                    key={`card-row-${index}`}
                    {...inlineStyles}
                >
                    {newActiveCards &&
                        newActiveCards.map((record, recordIndex) => {
                            const { id, card } = record;
                            let cardCmpData = {
                                ...params.data,
                                data: {
                                    ...params.data.data,
                                    card: card,
                                    id: id,
                                },
                            };

                            return (
                                <CardColumn className="col-md" key={id}>
                                    <CardComponent
                                        data={cardCmpData}
                                        dbName={params.dbName}
                                        lang={params.lang}
                                        editMode={params.editMode}
                                        componentIndex={params.componentIndex}
                                        commonConfigs={params.commonConfigs}
                                    />
                                </CardColumn>
                            );
                        })}
                </CardRow>
            );
        }

        return <React.Fragment>{items}</React.Fragment>;
    }

    return <React.Fragment></React.Fragment>;
}

export default CardListComponent;
