import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { NewsSearch } from '../NewsSearch';

export const OTCNews = (props) => {
    const { commonConfigs, lang } = props;

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="OTC News And Announcements" />
    ) : (
        <NewsSearch
            dataSource={marketBackEndProxyPass()}
            RT={3557}
            // showKeywordSearch
            displayTicker
            lang={lang}
            otc
        ></NewsSearch>
    );
};
