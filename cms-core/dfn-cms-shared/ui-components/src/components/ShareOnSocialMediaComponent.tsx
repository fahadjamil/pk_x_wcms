import React, { useEffect, useState } from 'react';

const ShareOnSocialMediaComponent = () => {
    const [currentUrl, setCurrentUrl] = useState('')
    
    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setCurrentUrl(window.location.href)
        }

        return () => {
            isMounted = false;
        }
    }, [])

    return (
        <div className="sm-share-toolbar">
            <span className="share-title en">Share on:</span>
            <span className="share-title ar">مشاركه فى</span>
            <a className="share-button facebook"
                href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                rel="nofollow"
                target="_blank"
            >
                &nbsp;
            </a>
            <a className="share-button linkedin"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                rel="nofollow"
                target="_blank"
            >
                &nbsp;
            </a>
            <a className="share-button twitter"
                href={`https://twitter.com/intent/tweet?url=${currentUrl}`}
                rel="nofollow"
                target="_blank"
            >
                &nbsp;
            </a>
        </div>
    );
};

export default ShareOnSocialMediaComponent;
