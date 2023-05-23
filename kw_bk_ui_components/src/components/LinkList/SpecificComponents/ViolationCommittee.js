import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { LinkListComponent } from '../LinkListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURLCollections } from '../../../config/path';

export const ViolationCommittee = (props) => {
    const { commonConfigs, lang } = props;
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        const httpHeader = {
            params: {
                collection: 'docs-violation-committee',
                lang: lang.langKey,
                sortBy: '_id',
                sortType: 'DESC'
            },
        };

        Axios.get(appServerURLCollections(),httpHeader).then((res) => {
            setLinkList(res.data)
        })
    }, [])

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Violation Committee" />
            ) : (
                <LinkListComponent
                    horizontalLine={true}
                    bullets={false}
                    icon="pdf"
                    path={'links'}
                    listData={linkList}
                />
            )}
        </Fragment>
    );
};
