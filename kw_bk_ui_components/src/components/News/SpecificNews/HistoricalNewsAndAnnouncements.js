import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { NewsSearch } from '../NewsSearch';

export const HistoricalNewsAndAnnouncements = (props) => {
    const { commonConfigs, lang } = props;

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Historical News And Announcements" />
    ) : (
        <NewsSearch
            dataSource={marketBackEndProxyPass()}
            RT={3516}
            showKeywordSearch
            displayTicker
            lang={lang}
        ></NewsSearch>
    );
};
