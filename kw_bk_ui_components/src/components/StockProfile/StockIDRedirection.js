import React from 'react';
import { useStockID } from '../../customHooks/useStockID';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';

export const StockIDRedirection = (props) => {
    const { commonConfigs, lang } = props;

    const stockID = useStockID(lang.langKey == 'AR' ? 'ar' : 'en');

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Stock ID Redirection"></SpecificPreviewComponent>
    ) : (
        <React.Fragment></React.Fragment>
    );
};
