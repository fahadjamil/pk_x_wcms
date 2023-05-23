import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

function ResponsivePreviewComponent(props) {
    const { match } = props;
    const { params } = match;
    const [state, setstate] = useState('100%');
    const [activeIndex, setActiveIndex] = useState(0);
    const changeLayout = (width) => {
        setstate(width);
    };

    if (params) {
        const { website, page, lang } = params;

        return (
            <>
                <Helmet>
                    <body className="cms-responsive-preview" />
                </Helmet>
                <div className="responsive-preview">
                    <iframe
                        width={state}
                        height="971px"
                        src={`/preview/${website}/${lang}/${page}`}
                        className="preview-window"
                    ></iframe>
                </div>
                <div className="preview-toolbar">
                    <div className="preview-settings">
                        <button
                            onClick={() => {
                                changeLayout('100%');
                                setActiveIndex(0);
                            }}
                            className={activeIndex === 0 ? 'active' : ''}
                        >
                            <i className="icon-button desktop-icon"></i>
                        </button>
                        <button
                            onClick={() => {
                                changeLayout('800px');
                                setActiveIndex(1);
                            }}
                            className={activeIndex === 1 ? 'active' : ''}
                        >
                            <i className="icon-button tablet-icon"></i>
                        </button>
                        <button
                            onClick={() => {
                                changeLayout('468px');
                                setActiveIndex(2);
                            }}
                            className={activeIndex === 2 ? 'active' : ''}
                        >
                            <i className="icon-button mobile-icon"></i>
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return null;
}

export default ResponsivePreviewComponent;
