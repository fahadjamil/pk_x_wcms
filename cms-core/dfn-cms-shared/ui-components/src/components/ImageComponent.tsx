import React from 'react';
import styled from 'styled-components';
import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Image = styled.div`
    > img {
        ${(props: any) => {
            if (props.customCSS) {
                return props.customCSS;
            }
        }}
    }
`;

export const ImageComponent = (params: any) => {
    const { commonConfigs } = params;
    let inlineStyles: any = {};
    const { data, styles, settings } = params.data;
    const { isPreview } = commonConfigs;

    if (styles) {
        inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    }

    let path = '';
    let thumbnailUri = '';
    let description = '';
    let boundUrl = '';

    if (data) {
        const { image } = data;

        if (image) {
            path = isPreview ? image.filePath : '/images/' + image.fileName;
            thumbnailUri = image.thumbnailUri;
            description = image.description ? image.description : '';
            boundUrl = image.boundUrl ? image.boundUrl : '';
        }
    }
    /*     <Image {...inlineStyles}>
    <LazyLoadImage
        alt="Logo"
        src={path}
        height="auto"
        width="100%"
        effect="blur"
        visibleByDefault={false}
        placeholderSrc={thumbnailUri}
        className={inlineStyles?.cssClass ? inlineStyles.cssClass : ''}
    />
</Image> */
    if (path.length !== 0) {
        return (
            <Image {...inlineStyles}>
                {boundUrl != '' && settings && settings.seprateLink && settings.seprateLink.value && (
                    <a href={boundUrl} target="_blank">
                        <img
                            className={`img-fluid ${
                                inlineStyles?.cssClass ? inlineStyles.cssClass : ''
                            }`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                            src={path}
                            alt={description ? description : 'Image'}
                        />
                    </a>
                )}
                {boundUrl != '' &&
                    settings &&
                    (settings.seprateLink === undefined ||
                        (settings.seprateLink && !settings.seprateLink.value)) && (
                        <a href={boundUrl}>
                            <img
                                className={`img-fluid ${
                                    inlineStyles?.cssClass ? inlineStyles.cssClass : ''
                                }`}
                                style={{ maxWidth: '100%', height: 'auto' }}
                                src={path}
                                alt={description ? description : 'Image'}
                            />
                        </a>
                    )}
                {boundUrl === '' && (
                    <img
                        className={`img-fluid ${
                            inlineStyles?.cssClass ? inlineStyles.cssClass : ''
                        }`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        src={path}
                        alt={description ? description : 'Image'}
                    />
                )}
            </Image>
        );
    } else {
        return <></>;
    }
};
