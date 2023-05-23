import React, {useState, useRef, useEffect} from 'react';
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

export const TradesData = (props) => {
    const { commonConfigs } = props;

    let selectedDate = '';
    let date = useRef(null);

    let componentSettingsEndOfDay = {
        menuName: "OTC All Trades",
        columns: [
            { columnName: "Date", mappingField: "date", dataType: "date" },
            { columnName: "Trade No", mappingField: "tradeNo", dataType: "text" },
            { columnName: "Security Code", mappingField: "secCode", dataType: "text" },
            { columnName: "Security Name", mappingField: "secName", dataType: "ticker" },
            { columnName: "Instrument", mappingField: "inst", dataType: "text" },
            { columnName: "ISIN", mappingField: "isin", dataType: "text" },
            { columnName: "Price", mappingField: "prc", dataType: "price" },
            { columnName: "Quentity", mappingField: "qty", dataType: "number" },
        ],
        showColumnTitle: true,
        // httpRequest: {
        //     dataSource: "http://localhost:4500/tradesData",
        //     header: selectedDate ? {date: selectedDate} : {},
        // }
        httpRequest: {
            dataSource: "/api/getSampleResponse",
            header: {
                key: "dataservice_trade_data"
            }
        }
    };

    let onClickShow = () => {
        selectedDate = date.current.value;
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Trades Data" />
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
