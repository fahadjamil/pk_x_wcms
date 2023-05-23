import React from 'react';
import NewsComponent from '../../NewsComponent';

export const PreviousDaysDisclosure = (props) => {
    const { commonConfigs, lang } = props;
    return <NewsComponent default={101} commonConfigs={commonConfigs} lang={lang}></NewsComponent>;
};
