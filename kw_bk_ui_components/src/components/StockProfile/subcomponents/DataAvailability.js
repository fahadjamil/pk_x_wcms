import React from 'react';
import styled from 'styled-components';

const AvailabilityDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const DataUnavailable = (lang) => (
    <AvailabilityDiv>
        {lang.langKey === 'AR' ? 'البيانات غير متاحة' : 'Data Not Available'}
    </AvailabilityDiv>
);
