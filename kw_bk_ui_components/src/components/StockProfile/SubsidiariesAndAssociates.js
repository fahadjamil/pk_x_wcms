import React, { useEffect, useState } from 'react';
import { TableUiComponent } from '../Table/TableComponent';
import Axios from 'axios';
import { marketBackEndProxyPass } from '../../config/path';
import { DataUnavailable } from './subcomponents/DataAvailability';
import { useURLparam } from '../../customHooks/useURLparam';

export const SubsidiariesAndAssociates = (props) => {
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
                    if (
                        res &&
                        res.data &&
                        res.data['Company Subsidiaries'] &&
                        Array.isArray(res.data['Company Subsidiaries'])
                    ) {
                        setTableData(res.data['Company Subsidiaries']);
                    } else {
                        setDataUnavailable(true);
                    }
                })
                .catch((err) => setDataUnavailable(true));
        }
    }, [stockID]);
    const COMPANY_NAME = convertByLang('اسم الشركة', 'Company Name');
    const PERCENTAGE = convertByLang('النسبة %', 'Percentage');
    const TYPE_OF_RELATIONSHIP = convertByLang('نوع العلاقة', 'Type of relationship');
    const LAST_UPDATE_ON = convertByLang('آخر تحديث على', 'Last updated on');

    const TITLE = convertByLang(
        'الشركات التابعة والزميلة المدرجة في السوق',
        'Subsidiaries and Associates Companies listed in the Exchange'
    );

    const tableConfig = {
        columns: [
            {
                columnName: COMPANY_NAME,
                dataType: 'text',
                mappingField: 'CName',
                disableSorting: true,
            },
            {
                columnName: PERCENTAGE,
                dataType: 'perentage_2decimals',
                mappingField: 'Percentage',
                disableSorting: true,
            },
            {
                columnName: TYPE_OF_RELATIONSHIP,
                dataType: 'text',
                mappingField: 'Relation',
                disableSorting: true,
            },
            {
                columnName: LAST_UPDATE_ON,
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
    const SubsidiariesAndAssociatesComponent = () => (
        <div>
            <h3>{TITLE}</h3>
            <TableUiComponent componentSettings={tableConfig}></TableUiComponent>
        </div>
    );

    return dataUnavailable ? (
        <DataUnavailable lang={lang} />
    ) : (
        <SubsidiariesAndAssociatesComponent />
    );
};
