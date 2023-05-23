import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { useURLparam } from '../../../customHooks/useURLparam';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { NewsSearch } from '../NewsSearch';

export const ListedCompanyNews = (props) => {
    const { commonConfigs, lang } = props;
    const companyID = useURLparam();

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Listed Company News" />
    ) : companyID ? (
        <NewsSearch
            dataSource={marketBackEndProxyPass()}
            symc={companyID}
            RT={3510}
            lang={lang}
            showResultsOnInitialLoad
        ></NewsSearch>
    ) : (
        // Handle AR 
        <p>Loading Data</p>
    );
};
