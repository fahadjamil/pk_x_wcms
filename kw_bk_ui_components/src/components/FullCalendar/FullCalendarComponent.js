import React, { useState } from 'react';
import { useUserAgent } from '../../customHooks/useUserAgent';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';
import { CalendarToolbar } from './CalendarToolbar';
import { FullCalendar } from './FullCalendar';

export const FullCalendarComponent = (params) => {
    const { commonConfigs, lang } = params;
    
    const isMobile = useUserAgent();
    const [filters, setFilters] = useState({});

    const handleFilter = (newFilters) => setFilters(newFilters);

    return commonConfigs && commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Corporate Event Calendar"></SpecificPreviewComponent>
    ) : (
        <div>
            {' '}
            <CalendarToolbar callback={handleFilter} lang={lang.langKey}isMobile={isMobile}></CalendarToolbar> <br />
            <FullCalendar filters={filters} lang={lang.langKey} isMobile={isMobile}></FullCalendar>
        </div>
    );
};
