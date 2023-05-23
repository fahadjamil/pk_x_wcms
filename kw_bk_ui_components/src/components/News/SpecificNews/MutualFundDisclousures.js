import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { NewsSearch } from '../NewsSearch';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { useURLparam } from '../../../customHooks/useURLparam';

export const MutualFundDisclousures = (props) => {
    const companyID = useURLparam();
    const { commonConfigs, lang } = props;
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Mutual Fund Disclosure" />
    ) : companyID ? (
        <NewsSearch
            dataSource={marketBackEndProxyPass()}
            FID={companyID}
            RT={3520}
            lang={lang}
            showResultsOnInitialLoad
        ></NewsSearch>
    ) : (
        // Handle AR 

        <p>Loading Data</p>
    );
};
