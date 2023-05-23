import React from 'react';
import { useREITsID } from '../../customHooks/useREITsID';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';

export const REITsIDRedirection = (props) => {
    const { commonConfigs, lang } = props;
    const REITsID = useREITsID(lang.langKey == 'AR' ? 'ar' : 'en')

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="REITs ID Redirection"></SpecificPreviewComponent>
    ) : (
        <React.Fragment></React.Fragment>
    );
};
