import React, {useState, useRef} from 'react';
import { TableUiComponent } from '../../TableComponent';
import styled from 'styled-components';
import {SpecificPreviewComponent} from "../../../SpecificPreviewComponent";

const FormWrapper = styled.div`
    padding: 10px;

    & > pad-left {
        padding-left: 10px
    }

    & > pad-right {
        padding-right: 10px
    }
`;

export const BuySellStats = (props) => {
    const { commonConfigs } = props;

    let selectedDate = '';
    let date = useRef(null);

    let componentSettingsEndOfDay = {
        menuName: "Buy Sell Statistics",
        columns: [
            { columnName: "Date", mappingField: "date", dataType: "date" },
            { columnName: "Security Code", mappingField: "secCode", dataType: "text" },
            { columnName: "Security Name", mappingField: "secName", dataType: "ticker" },
            { columnName: "Market", mappingField: "mkt", dataType: "text" },
            { columnName: "Buy Kuwait", mappingField: "buyKuwait", dataType: "number" },
            { columnName: "Buy Others", mappingField: "buyOthers", dataType: "number" },
            { columnName: "Buy Individuals", mappingField: "buyIndividuals", dataType: "number" },
            { columnName: "Buy Corporates", mappingField: "buyCorporates", dataType: "number" },
            { columnName: "Sell Kuwait", mappingField: "sellKuwait", dataType: "number" },
            { columnName: "Sell Others", mappingField: "sellOthers", dataType: "number" },
            { columnName: "Sell Individuals", mappingField: "sellIndividuals", dataType: "number" },
            { columnName: "Sell Corporates", mappingField: "sellCorporates", dataType: "number" },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: "/api/getSampleResponse",
            // header: selectedDate ? {date: selectedDate} : {},
            header: {
                params: {
                    key: "buy_sell_stats"
                }
            }
        }
    };

    let onClickShow = () => {
        selectedDate = date.current.value;
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Buy Sell Status" />
    ) : (
        <div>
            <FormWrapper>
                <label className="pad-left pad-right">Select Date</label>
                <input className="pad-right" type="date" ref={date}></input>
                <button className="pad-right" onClick={onClickShow}>Show</button>
            </FormWrapper>

            <TableUiComponent  componentSettings={componentSettingsEndOfDay}></TableUiComponent>
        </div>
    );
};
