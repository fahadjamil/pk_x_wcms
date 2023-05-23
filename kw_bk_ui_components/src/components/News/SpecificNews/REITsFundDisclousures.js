import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { NewsSearch } from '../NewsSearch';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { useURLparam } from '../../../customHooks/useURLparam';

export const REITsFundDisclousures = (props) => {
    const companyID = useURLparam();
    const { commonConfigs, lang } = props;

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="RIETs Fund Disclosure" />
    ) : companyID ? (
        <NewsSearch
            dataSource={marketBackEndProxyPass()}
            symc={companyID}
            RT={3512}
            lang={lang}
            showResultsOnInitialLoad
        ></NewsSearch>
    ) : (
        // Handle AR 

        <p>Loading Data</p>
    );
};
