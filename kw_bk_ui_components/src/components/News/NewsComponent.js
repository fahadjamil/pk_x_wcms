import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../config/path';
import { setLanguage } from '../../helper/metaData';
import { TableUiComponent } from '../Table/TableComponent';
import { newsDetailLink } from '../../config/constants';

export const NewsComponent = (params) => {
    const { commonConfigs, lang } = params;
    const [newsData, setNewsData] = useState([]);
    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3515,
                AT: params.default,
                L: setLanguage(lang),
            },
        })
            .then((result) => {
                setNewsData(
                    result.data.map((row) => ({
                        ...row,
                        Title: {
                            text: row.Title,
                            link: newsDetailLink(row.NewsId, lang),
                            LinkedFalseNews: row.LinkedFalseNews,
                            FalseNews: row.FalseNews,
                            LinkNewsId: row.LinkNewsId,
                            lang: lang,
                        },
                    }))
                );
            })
            .catch(() => console.log('Fetch Failed'));
    }, []);

    let columnConfig = {
        columns: [
            {
                columnName: 'Date',
                mappingField: 'PostedDate',
                dataType: 'dateTime',
            },
            { columnName: 'Ticker', dataType: 'ticker', mappingField: 'DisplayTicker' },
            { columnName: 'News', dataType: 'newsLink', mappingField: 'Title' },
        ],
        showColumnTitle: false,
        httpRequest: {
            header: {},
        },
        rawData: newsData,
        lang : lang
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="News" />
    ) : (
        <TableUiComponent componentSettings={columnConfig}></TableUiComponent>
    );
};

export default NewsComponent;
