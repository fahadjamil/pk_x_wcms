import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DetailListItem } from './Common/DetailListItem';
import { SpecificPreviewComponent } from '../../components/SpecificPreviewComponent';
import { displayFormat } from '../../helper/date';
import { marketBackEndProxyPass } from '../../config/path';
import { setLanguage } from '../../helper/metaData';
import { researchReportViewLink } from '../../config/constants';

const ResearchReportWrapper = styled.div``;

export const ResearchReportSummary = (props) => {
    const { commonConfigs, lang } = props;
    const [actionData, setActionData] = useState([]);

    useEffect(() => {
        console.log('----ResearchReportSummary-api----');
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3505, L: setLanguage(lang), NR: 5 },
        }).then((res) => setActionData(res.data.dataFields));
    }, []);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Summary of Research Reports" />
    ) : (
        <ResearchReportWrapper>
            {actionData.slice(0, 5).map((action) => (
                <DetailListItem
                    date={displayFormat(action.postedDate)}
                    companyName={action.companyName}
                    text={action.reportTitle}
                    redirectURL={researchReportViewLink(action.rowId, lang)}
                    isSecurityHighlighted
                ></DetailListItem>
            ))}
        </ResearchReportWrapper>
    );
};
