import React, { useEffect, useState } from 'react';
import { TableUiComponent } from '../Table/TableComponent';
import Axios from 'axios';
import { marketBackEndProxyPass } from '../../config/path';
import { DataUnavailable } from './subcomponents/DataAvailability';
import { useURLparam } from '../../customHooks/useURLparam';

export const Auditor = (props) => {
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
                    if (res && res.data && res.data['Auditors']) {
                        setTableData(res.data['Auditors']);
                    } else {
                        setDataUnavailable(true);
                    }
                })
                .catch((err) => setDataUnavailable(true));
        }
    }, [stockID]);

    const TITLE = convertByLang('مراقب الحسابات', 'Auditor');

    const POSITION = convertByLang('المنصب', 'Position');
    const NAME = convertByLang('الاسم', 'Name');
    const COMMENTS = convertByLang('ملاحظـات', 'Comments');

    const tableConfig = {
        columns: [
            {
                columnName: POSITION,
                dataType: 'text',
                mappingField: 'Position',
                disableSorting: true,
            },
            {
                columnName: NAME,
                dataType: 'text',
                mappingField: 'Name',
                disableSorting: true,
            },
            {
                columnName: COMMENTS,
                dataType: 'text',
                mappingField: 'Comments',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        lang: lang,
    };
    const AuditorsComponent = () => (
        <div>
            <h3>{TITLE}</h3>
            <TableUiComponent componentSettings={tableConfig}></TableUiComponent>
        </div>
    );
    return dataUnavailable ? <DataUnavailable lang={lang} /> : <AuditorsComponent />;
};
