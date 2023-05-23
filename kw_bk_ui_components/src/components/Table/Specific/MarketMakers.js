import React, { useState, useEffect } from 'react';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import styled from 'styled-components';
import { marketMakerUrl } from '../../../config/path';
import Axios from 'axios';

export const MarketMakers = (props) => {
    const { commonConfigs, lang } = props;

    const MainDiv = styled.div`
        min-height: 400px;
    `;

    const SubHeadingH5 = styled.h5`
        margin-bottom: 0 !important;
        padding: 0.5rem !important;
        color: #212529;
        font-size: 15px;
        font-weight: bold;
    `;
    const SubHeadingH4 = styled.h5`
        margin-bottom: 0 !important;
        padding: 0.5rem !important;
        color: #212529;
    `;

    const TableRow = styled.tr`
        background-color: ${(props) => (props.index % 2 ? ' #EAEAEB;' : 'FAFAFA')};
    `;

    const TdSymbol = styled.td`
        padding: 5px;
        width: 200px;
    `;

    const TdDescription = styled.td`
        padding: 5px;
    `;

    let array = [];

    const [marketMakers, setMarketMakers] = useState([]);
    const [securities, setSecurities] = useState([]);
    const [subTopicText, setSubTopicText] = useState([]);

    useEffect(() => {
        Axios.get(marketMakerUrl(), {
            params: {
                lang: lang.langKey,
            },
        }).then((res) => {
            console.log('market makers', res.data.market_makers);
            setMarketMakers(res.data.market_makers);

            res.data.securities.forEach((item) => {
                let fieldData = {};
                fieldData['symbol'] = item.code;
                fieldData['marketMaker'] = item.name;
                fieldData['id'] = item.market_maker_id;
                array.push({ fieldData });
            });
            setSecurities(array);

            setSubTopicText(
                lang.langKey === 'EN'
                    ? 'The securities registered for market making'
                    : 'الأوراق المالية المسجل عليها محل نشاط صانع السوق'
            );
        });
    }, []);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Makers" />
    ) : (
        <MainDiv className="container">
            <br />
            {marketMakers.map((maker) => {
                let rowData = securities.filter((item) => {
                    return maker.id === item.fieldData.id;
                });
                console.log('rowData', rowData);
                const tableData = {
                    columns: [
                        { columnName: 'Symbol', dataType: 'text', mappingField: 'symbol' },
                        {
                            columnName: 'Market Maker',
                            dataType: 'text',
                            mappingField: 'marketMaker',
                        },
                    ],
                    showColumnTitle: false,
                    httpRequest: {},
                    rawData: rowData,
                };
                return rowData.length === 0 ? (
                    <div>
                        <SubHeadingH4>{maker.name}</SubHeadingH4>
                        <div>
                            <div className="p-3">
                                <SubHeadingH5> Registered securities not available </SubHeadingH5>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <SubHeadingH4>{maker.name}</SubHeadingH4>
                        <div>
                            <div className="p-3">
                                <SubHeadingH5>{subTopicText}</SubHeadingH5>
                            </div>
                            <table className="table">
                                {rowData.map((item, key) => {
                                    return (
                                        <TableRow key={key} index={key}>
                                            <TdSymbol>{item.fieldData.symbol}</TdSymbol>
                                            <TdDescription>
                                                {item.fieldData.marketMaker}
                                            </TdDescription>
                                        </TableRow>
                                    );
                                })}
                            </table>
                        </div>
                    </div>
                );
            })}
        </MainDiv>
    );
};
