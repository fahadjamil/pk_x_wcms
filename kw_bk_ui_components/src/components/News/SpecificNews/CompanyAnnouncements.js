import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { NewsSearch } from '../NewsSearch';

export const CompanyAnnouncements = () => {
    return <NewsSearch dataSource={marketBackEndProxyPass()}></NewsSearch>;
};
