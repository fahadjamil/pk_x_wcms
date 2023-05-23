import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';
import { DetailListItem } from './Common/DetailListItem';
import { displayFormat, displayTime } from '../../helper/date';
import { marketBackEndProxyPass } from '../../config/path';
import { setLanguage } from '../../helper/metaData';
import { newsDetailLink,companyAnnouncementLink } from '../../config/constants';

const CompanyAnnouncementsWrapper = styled.div``;

export const CompanyAnnouncementsSummary = (props) => {
    const { commonConfigs, lang } = props;
    const [actionData, setActionData] = useState([]);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3508,
                L: setLanguage(lang),
            },
        }).then((res) => setActionData(res.data));
    }, []);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Summary of Company Announcements" />
    ) : (
        <CompanyAnnouncementsWrapper>
            {actionData.slice(0, 5).map((action) => (
                <DetailListItem
                    date={displayFormat(action.PostedDate)}
                    time={displayTime(action.PostedDate)}
                    ticker={action.DisplayTicker}
                    text={action.Title}
                    isSecurityHighlighted
                    redirectURL={newsDetailLink(action.NewsId, lang)}
                ></DetailListItem>
            ))}
        </CompanyAnnouncementsWrapper>
    );
};
