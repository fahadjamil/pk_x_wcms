import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { LinkListComponent } from '../LinkListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURLCollections } from '../../../config/path';

export const MarketParticipantForms = (props) => {
    const { commonConfigs, lang } = props;
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        const httpHeader = {
            params : {
                collection: 'docs-market-participant-forms',
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
                <SpecificPreviewComponent title="Market Participation Form" />
            ) : (
                <LinkListComponent
                    horizontalLine={true}
                    bullets={false}
                    icon="pdf"
                    path={'market_participants_form'}
                    listData={linkList}
                />
            )}
        </Fragment>
    );
};
