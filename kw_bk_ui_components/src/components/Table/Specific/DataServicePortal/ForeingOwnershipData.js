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

export const ForeingOwnershipData = (props) => {
    const { commonConfigs } = props;

    let selectedDate = '';
    let date = useRef(null);

    let componentSettingsEndOfDay = {
        menuName: "Foreing Ownership Data",
        columns: [
            { columnName: "Date", mappingField: "date", dataType: "date" },
            { columnName: "Security Code", mappingField: "secCode", dataType: "text" },
            { columnName: "Security Name", mappingField: "secName", dataType: "ticker" },
            { columnName: "Market", mappingField: "mkt", dataType: "text" },
            { columnName: "Kuwait Holding", mappingField: "kuwaitHolding", dataType: "number" },
            { columnName: "Other Holding", mappingField: "otherHolding", dataType: "number" },
        ],
        showColumnTitle: true,
        // httpRequest: {
        //     dataSource: "http://localhost:4500/foreingOwnershipData",
        //     header: selectedDate ? {date: selectedDate} : {},
        // }
        httpRequest: {
            dataSource: "/api/getSampleResponse",
            header: {
                key: "foreign_ownership_data",
                date: selectedDate
            }
        }
    };

    let onClickShow = () => {
        selectedDate = date.current.value;
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Foreign Ownership" />
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
