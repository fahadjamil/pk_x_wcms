import React, { useState, useEffect } from 'react';
import { TableUiComponent } from '../Table/TableComponent';
import Axios from 'axios';
import { newsDetailLink } from '../../config/constants';
import styled from 'styled-components';

const AvailabilityDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NewsResult = (props) => {
    const { dataSource, reqParams, lang } = props;
    const [tableData, setTableData] = useState([]);
    const [dataUnavailable, setDataUnavailable] = useState(false);

    useEffect(() => {
        Axios.get(dataSource, { params: reqParams })
            .then((res) => {
                let responseData = res.data.map((row) => ({
                    ...row,
                    Title: {
                        text: row.Title,
                        link: newsDetailLink(row.NewsId, lang),
                        LinkedFalseNews: row.LinkedFalseNews,
                        FalseNews: row.FalseNews,
                        LinkNewsId: row.LinkNewsId,
                        lang: lang,
                    },
                }));

                // Sort News from New to Old

                responseData.sort((a, b) => b.PostedDate - a.PostedDate);

                setTableData(responseData);
                if (responseData && responseData.length == 0) {
                    setDataUnavailable(true);
                }
            })
            .catch((err) => setDataUnavailable(true));
    }, [reqParams]);

    const columnsToDisplay = () =>
        props.showTicker
            ? [
                  {
                      columnName: reqParams.L === 'E' ? 'Date' : 'التاريخ',
                      mappingField: 'PostedDate',
                      dataType: 'dateTime',
                  },
                  {
                      columnName: reqParams.L === 'E' ? 'Ticker' : 'اسم السهم',
                      dataType: 'text',
                      mappingField: 'DisplayTicker',
                  },
                  {
                      columnName: reqParams.L === 'E' ? 'Title' : 'عنوان',
                      dataType: 'newsLink',
                      mappingField: 'Title',
                  },
              ]
            : [
                  {
                      columnName: reqParams.L === 'E' ? 'Date' : 'التاريخ',
                      mappingField: 'PostedDate',
                      dataType: 'dateTime',
                  },
                  {
                      columnName: reqParams.L === 'E' ? 'Title' : 'عنوان',
                      dataType: 'newsLink',
                      mappingField: 'Title',
                  },
              ];

    let componentSettings = {
        columns: columnsToDisplay(),
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        lang: lang,
    };

    return dataUnavailable ? (
        <AvailabilityDiv>
            {lang.langKey == 'EN' ? 'Data Not Available' : 'البيانات غير متاحة'}
        </AvailabilityDiv>
    ) : (
        <TableUiComponent componentSettings={componentSettings}></TableUiComponent>
    );
};

export default NewsResult;
