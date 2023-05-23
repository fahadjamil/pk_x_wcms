import React from 'react';
import { appServerURLCollections } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const CircuitBreakerBulletin = (props) => {
    const { commonConfigs, lang } = props;
    const convertByLang = (arText, enText) => lang.langKey ==='AR' ? arText : enText;

    let componentSettings = {
        columns: [
            {
                columnName: convertByLang("نسبة انخفاض المؤشر",'Index Decline %'),
                mappingField: 'decline_percentage',
                dataType: 'text',
            },
            {
                columnName: convertByLang("مدة الوقف",'Halt Duration'),
                dataType: 'text',
                mappingField: 'halt_duration',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: appServerURLCollections(),
            header: {
                params: {
                    collection: 'docs-index-circuit-breakers',
                    lang: 'en',
                },
            },
        },
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Circuit Breaker Table" />
    ) : (
        <TableUiComponent componentSettings={componentSettings}></TableUiComponent>
    );
};
