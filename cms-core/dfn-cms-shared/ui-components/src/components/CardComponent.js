import React from 'react';

function CardComponent(params) {
    let card = '';
    let inlineStyles = {};

    const { commonConfigs, dbName } = params;
    const { data, styles, settings } = params.data;
    const selectedLanguage = params.lang;
    const { isEditMode, isPreview } = commonConfigs;

    // if (styles) {
    //     inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    // }

    if (data !== undefined) {
        card = data.card;
    }

    if (selectedLanguage && card) {
        const { header, footer, title, subTitle, text, image, link } = card;

        return (
            <React.Fragment>
                <div className="card">
                    {/* {header && <div className="card-header">{header}</div>} */}
                    <a href={link ? link : '#'} rel="noreferrer" target="_blank">
                        {image && (
                            <img className="card-img-bottom" src={image} alt="Card image cap" />
                        )}
                        <div className="card-body">
                            {title && <h5 className="card-title">{title}</h5>}
                            {/* {subTitle && (
                                <h6 className="card-subtitle mb-2 text-muted">{subTitle}</h6>
                            )} */}
                            <div className="card-content">
                                {text && <p className="card-text">{text}</p>}
                            </div>
                        </div>
                    </a>
                    {/* {footer && (
                        <div className="card-footer">
                            <small className="text-muted">{footer}</small>
                        </div>
                    )} */}
                </div>
            </React.Fragment>
        );
    }

    return <React.Fragment></React.Fragment>;
}

export default CardComponent;
