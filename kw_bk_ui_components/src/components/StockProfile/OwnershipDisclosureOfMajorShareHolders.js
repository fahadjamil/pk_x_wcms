import React, { useEffect, useState } from 'react';
import { TableUiComponent } from '../Table/TableComponent';
import Axios from 'axios';
import { marketBackEndProxyPass } from '../../config/path';
import { DataUnavailable } from './subcomponents/DataAvailability';
import { useURLparam } from '../../customHooks/useURLparam';

export const OwnershipDisclosureOfMajorShareHolders = (props) => {
    const { lang } = props;
    const [tableData, setTableData] = useState([]);
    const [dataUnavailable, setDataUnavailable] = useState(false);
    const stockID = useURLparam();

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        if (stockID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3517,
                    SYMC: stockID,
                    L: convertByLang('A', 'E'),
                },
            })
                .then((res) => {
                    if (res && res.data && res.data['Ownership Disclosure']) {
                        setTableData(res.data['Ownership Disclosure']);
                    } else {
                        setDataUnavailable(true);
                    }
                })
                .catch((err) => setDataUnavailable(true));
        }
    }, [stockID]);
    const FULL_NAME = convertByLang('إسم العميل', 'Full Name');
    const DISCLOSURE_TYPE = convertByLang('نوع الإفصاح', 'Disclosure type');
    const PERCENTAGE_CHANGE = convertByLang('النسبة %', 'Percentage %');
    const PUBLISHED_ON = convertByLang('تاريخ النشر', 'Published on');

    const TITLE = convertByLang(
        'بيانات الافصاح عن ملكية كبار المساهمين',
        'Ownership Disclosure of Major Shareholders'
    );
    const DESC = convertByLang(
        'المزيد من التفاصيل في سجل الافصاح، والمرجع الأساسي هو بيانات السجل',
        'More Details in The Disclosure Record and The Basic Reference in The Data Record'
    );

    const tableConfig = {
        columns: [
            {
                columnName: FULL_NAME,
                dataType: 'text',
                mappingField: 'FullName',
                disableSorting: true,
            },
            {
                columnName: DISCLOSURE_TYPE,
                dataType: 'text',
                mappingField: 'DisclosureType',
                disableSorting: true,
            },
            {
                columnName: PERCENTAGE_CHANGE,
                dataType: 'perentage_2decimals',
                mappingField: 'Percentage',
                disableSorting: true,
            },

            {
                columnName: PUBLISHED_ON,
                dataType: 'longDate',
                mappingField: 'LastUpdated',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        lang: lang,
    };
    const OwnershipDisclosureOfMajorShareHoldersComponent = () => (
        <div>
            <h3>{TITLE}</h3>
            <p>{DESC}</p>
            <TableUiComponent componentSettings={tableConfig}></TableUiComponent>
        </div>
    );

    return dataUnavailable ? (
        <DataUnavailable lang={lang} />
    ) : (
        <OwnershipDisclosureOfMajorShareHoldersComponent />
    );
};
