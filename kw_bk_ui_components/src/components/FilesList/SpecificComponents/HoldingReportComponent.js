import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import { useURLparam } from '../../../customHooks/useURLparam';
import { holdingReportDetailUrl } from '../../../config/path';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

const Td = styled.td`
    padding: 10px;
    border: 1px solid;
    border-color: #c5964a;
    text-align: center;
`;

const Tr = styled.tr`
    padding: 5px;
    border: 1px solid;
    border-color: #c5964a;
    margin: 10px;
`;

const Title = styled.div`
    font-size: 18px;
    padding: 5px;
    font-weight: 500;
`;
const Table = styled.table`
    width: 700px;
    table-layout: fixed;
    padding: 5px;
    margin: 10px;
`;

export const HoldingReportComponent = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    const [tableTitle, setTableTitle] = useState([]);

    const months = [
        { id: '1', titleEN: 'January', titleAR: 'يناير' },
        { id: '2', titleEN: 'Febuary', titleAR: 'فبراير' },
        { id: '3', titleEN: 'March', titleAR: 'مارس' },
        { id: '4', titleEN: 'April', titleAR: 'أبريل' },
        { id: '5', titleEN: 'May', titleAR: 'مايو' },
        { id: '6', titleEN: 'June', titleAR: 'يونيو' },
        { id: '7', titleEN: 'July', titleAR: 'يوليو' },
        { id: '8', titleEN: 'August', titleAR: 'أغسطس' },
        { id: '9', titleEN: 'September', titleAR: 'سبتمبر' },
        { id: '10', titleEN: 'October', titleAR: 'أكتوبر' },
        { id: '11', titleEN: 'November', titleAR: 'نوفمبر' },
        { id: '12', titleEN: 'December', titleAR: 'ديسمبر' },
    ];
    const reportID = useURLparam();
    // const reportID = '201910';

    useEffect(() => {
        if (reportID) {
            Axios.get(holdingReportDetailUrl(), {
                params: {
                    lang: lang.langKey.toLowerCase(),
                    year: reportID.substring(0, 4),
                    month: reportID.substring(4),
                },
            }).then((res) => {
                setTableData(res.data);
            });
        }
    }, [reportID]);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Bank Holding Report View" />
    ) : (
        <div>
            <Table>
                <Tr>
                    <td colspan={tableData.filter((data) => data.document).length}>
                        <Title>
                            {reportID ? (
                                <div>
                                    {lang.langKey === 'EN'
                                        ? months[parseInt(reportID.substring(4)) - 1].titleEN
                                        : months[parseInt(reportID.substring(4)) - 1].titleAR}{' '}
                                    - {reportID.substring(0, 4)}
                                </div>
                            ) : (
                                <Fragment></Fragment>
                            )}
                        </Title>
                    </td>
                </Tr>
                <tr>
                    {tableData.map((value) => {
                        return value.document ? (
                            <Td>
                                {' '}
                                <a href={`/api/documents/boursa/${value.document}`}>
                                    {' '}
                                    {value.date}/{value.month}/{value.year}{' '}
                                </a>{' '}
                            </Td>
                        ) : (
                            <Fragment></Fragment>
                        );
                    })}
                </tr>
            </Table>
        </div>
    );
};
