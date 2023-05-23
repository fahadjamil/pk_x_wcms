import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { displayFormat } from '../../../helper/date';
import { setLanguage } from '../../../helper/metaData';

const TableHeader = styled.th`
    text-align: center;
    background-color: #c5964a;
    color: white;
    border: 1px solid;
    padding-left: 7px;
    padding-right: 7px;
`;

const TableRow = styled.tr`
    background-color: ${(props) => (props.index % 2 ? ' #EAEAEB;' : 'FAFAFA')};
`;

export const DailyReportOfChangesInDisclosures = (props) => {
    const { commonConfigs, lang } = props;
    const [data, setData] = useState([]);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3515, AT: 4, L: setLanguage(lang) },
        }).then((res) => {
            if (res.data && Array.isArray(res.data)) {
                setData(res.data);
            }
        });
    }, []);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Daily Report Of Changes In Disclosures" />
    ) : (
        <table>
            <tr>
                <TableHeader rowSpan="3">
                    {lang.langKey === 'AR' ? 'اسم السهم' : 'Ticker'}
                </TableHeader>
                <TableHeader rowSpan="3">
                    {lang.langKey === 'AR' ? 'الاسم الكامل' : 'Full Name'}
                </TableHeader>
                <TableHeader colSpan="6">
                    {lang.langKey === 'AR' ? 'طريقة المساهمة' : 'Ownership Method'}
                </TableHeader>
                <TableHeader rowSpan="3">
                    {lang.langKey === 'AR' ? 'تم تحديثه في' : 'Updated on'}
                </TableHeader>
            </tr>
            <tr>
                <TableHeader colSpan="2">{lang.langKey === 'AR' ? 'مباشر' : 'Direct'}</TableHeader>
                <TableHeader colSpan="2">
                    {lang.langKey === 'AR' ? 'غير مباشر' : 'Indirect'}
                </TableHeader>
                <TableHeader colSpan="2">
                    {lang.langKey === 'AR' ? 'مباشر وغير مباشر' : 'Direct & Indirect'}
                </TableHeader>
            </tr>
            <tr>
                <TableHeader>{lang.langKey === 'AR' ? 'حالية' : 'Current'}</TableHeader>
                <TableHeader>{lang.langKey === 'AR' ? 'سابقة' : 'Previous'}</TableHeader>
                <TableHeader>{lang.langKey === 'AR' ? 'حالية' : 'Current'}</TableHeader>
                <TableHeader>{lang.langKey === 'AR' ? 'سابقة' : 'Previous'}</TableHeader>
                <TableHeader>{lang.langKey === 'AR' ? 'حالية' : 'Current'}</TableHeader>
                <TableHeader>{lang.langKey === 'AR' ? 'سابقة' : 'Previous'}</TableHeader>
            </tr>

            {data &&
                data.map((change, index) => (
                    <TableRow index={index}>
                        <td>{change.DisplayTicker || ' - '}</td>
                        <td>{change.FullName || ' - '}</td>
                        <td>{change.Direct || ' - '}</td>
                        <td>{change.DirectOld || ' - '}</td>
                        <td>{change.Indirect || ' - '}</td>
                        <td>{change.IndirectOld || ' - '}</td>
                        <td>{change.DirectIndirect || ' - '}</td>
                        <td>{change.DirectIndirectOld || ' - '}</td>
                        <td>{change.LastUpdate ? displayFormat(change.LastUpdate) : ' - '}</td>
                    </TableRow>
                ))}
        </table>
    );
};
