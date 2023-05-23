import React from 'react';
import NewsComponent from '../../NewsComponent';

export const InsidersDisclosure = (props) => {
    const { commonConfigs, lang } = props;
    return <NewsComponent default={6} commonConfigs={commonConfigs} lang={lang}></NewsComponent>;
};
