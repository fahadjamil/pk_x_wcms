import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { LinkListComponent } from '../LinkListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURLCollections } from '../../../config/path';

export const ExecutiveDecisions = props => {
    const { data, commonConfigs, lang } = props;
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        const httpHeader = {
            params: {
                collection: 'docs-executive-decision',
                lang: lang.langKey,
                field: "type",
                value: data && data.settings && data.settings.collection.value,
                filterType: 1,
                sortBy:'_id',
                sortType: 'DESC'
            },
        };

        Axios.get(appServerURLCollections(),httpHeader).then((res) => {
            setLinkList(res.data)
        })
    }, []);

    return (
        <Fragment>
        {commonConfigs.isPreview ? (
            <SpecificPreviewComponent title="Executive Decisions" />
        ) : (
            <LinkListComponent
                horizontalLine={true}
                bullets={false}
                icon="pdf"
                path={'executive_decisions'}
                listData={linkList}
            />
        )}
    </Fragment>
    )

}