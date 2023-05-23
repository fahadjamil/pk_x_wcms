import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DetailListItem } from './Common/DetailListItem';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';
import { displayFormat } from '../../helper/date';
import { marketBackEndProxyPass } from '../../config/path';
import { setLanguage } from '../../helper/metaData';
import { newsDetailLink,corporateActionsLink } from '../../config/constants';

const CorporateActionsWrapper = styled.div`
    color: #ffffff;
    padding-left: 20px;
    height: 350px;
`;

export const CorporateActionsSummary = (props) => {
    const { commonConfigs, lang } = props;

    const [actionData, setActionData] = useState([]);
    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3509, R: 4, L: setLanguage(lang) },
        }).then((res) => setActionData(res.data));
    }, []);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Summary of Corporate Actions" />
    ) : (
        <CorporateActionsWrapper>
            {actionData &&
                actionData
                    .slice(0, 4)
                    .map((action) => (
                        <DetailListItem
                            date={displayFormat(action.AGMRecordDate)}
                            ticker={action.DisplayTicker}
                            text={action.Title}
                            isCorporateAction
                            redirectURL={newsDetailLink(action.NewsID, lang)}
                        ></DetailListItem>
                    ))}
        </CorporateActionsWrapper>
    );
};
