import React, { useState, useEffect } from 'react';

export const useUserAgent = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => setIsMobile(checkIsMobile()), []);

    var checkIsMobile = () => {
        const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    };
    return isMobile;
};
