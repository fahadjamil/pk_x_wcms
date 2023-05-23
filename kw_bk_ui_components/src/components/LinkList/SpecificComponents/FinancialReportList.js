import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { LinkListComponent } from '../LinkListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURLCollections } from '../../../config/path';

export const FinancialReportList = props => {
    const { data, commonConfigs, lang } = props;
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        setPath(data.settings.collection.value);
    }, []);

    const setPath = path => {

        let collection = '';
        let language = lang && lang.langKey;

        if (path == 1) {
            collection = 'docs-annual-reports';
        } else {
            collection = 'docs-quarterly-report';
        }

        const httpHeader = {
            params: {
                collection: collection,
                lang: language,
                sortBy: '_id',
                sortType: 'DESC'
            }
        }

        Axios.get(appServerURLCollections(),httpHeader).then((res) => {
            setLinkList(res.data)
        })
    }

    return (
        <Fragment>
        {commonConfigs.isPreview ? (
            <SpecificPreviewComponent title="Boursa Kuwait Financial Report Link List" />
        ) : (
            <LinkListComponent
                horizontalLine={true}
                bullets={false}
                icon="pdf"
                listData={linkList}
            />
        )}
    </Fragment>
    )

}