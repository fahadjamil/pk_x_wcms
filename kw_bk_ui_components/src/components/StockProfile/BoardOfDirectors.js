import React, { useEffect, useState } from 'react';
import { TableUiComponent } from '../Table/TableComponent';
import Axios from 'axios';
import { marketBackEndProxyPass } from '../../config/path';
import { DataUnavailable } from './subcomponents/DataAvailability';
import { useURLparam } from '../../customHooks/useURLparam';

export const BoardOfDirectors = (props) => {
    const { lang } = props;
    const [tableData, setTableData] = useState([]);
    const [dataUnavailable, setDataUnavailable] = useState(false);
    const stockID = useURLparam();

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        if(stockID){Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3517,
                SYMC: stockID,
                L: convertByLang('A', 'E'),
            },
        })
            .then((res) => {
                if (res && res.data && res.data['Board of Directors']) {
                    setTableData(res.data['Board of Directors']);
                } else {
                    setDataUnavailable(true);
                }
            })
            .catch((err) => setDataUnavailable(true));}
    }, [stockID]);

    const TITLE = convertByLang('مجلس الإدارة', 'Board of Directors');

    const POSITION = convertByLang('المنصب', 'Position');
    const NAME = convertByLang('الاسم', 'Name');
    const BOD_TYPE = convertByLang('نوع العضوية', 'BOD Type');
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
                columnName: BOD_TYPE,
                dataType: 'text',
                mappingField: 'BODType',
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
    const BoardOfDirectorsComponent = () => (
        <div>
            <h3>{TITLE}</h3>
            <TableUiComponent componentSettings={tableConfig}></TableUiComponent>
        </div>
    );
    return dataUnavailable ? <DataUnavailable lang={lang} /> : <BoardOfDirectorsComponent />;
};
