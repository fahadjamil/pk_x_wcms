import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { LinkListComponent } from '../LinkListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURLCollections } from '../../../config/path';

export const OTCForms = (props) => {
    const { commonConfigs, lang } = props;
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        const httpHeader = {
            params : {
                collection: 'docs-platform-participant-forms',
                lang: lang.langKey
            }
        }
        Axios.get(appServerURLCollections(),httpHeader).then((res) => {
            setLinkList(res.data)
        })
    }, [])

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="OTC Form" />
            ) : (
                <LinkListComponent
                    horizontalLine={true}
                    bullets={false}
                    icon="pdf"
                    listData={linkList}
                />
            )}
        </Fragment>
    );
};
