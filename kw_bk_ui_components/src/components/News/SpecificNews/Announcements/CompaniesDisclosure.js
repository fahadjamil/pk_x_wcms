import React from 'react';
import NewsComponent from '../../NewsComponent';

export const CompaniesDisclosure = (props) => {
    const { commonConfigs, lang } = props;
    return <NewsComponent default={120} commonConfigs={commonConfigs} lang={lang}></NewsComponent>;
};
