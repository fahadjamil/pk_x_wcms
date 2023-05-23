import React from 'react';
import NewsComponent from '../../NewsComponent';

export const AGMandEGM = (props) => {
    const { commonConfigs, lang } = props;
    return <NewsComponent default={110} commonConfigs={commonConfigs} lang={lang}></NewsComponent>;
};
