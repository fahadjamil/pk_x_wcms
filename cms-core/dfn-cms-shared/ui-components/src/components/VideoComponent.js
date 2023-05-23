import React from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';

const Wrapper = styled.div`
    ${(props) => {
        if (props.customCSS) {
            return props.customCSS;
        }
    }}
`;

function VideoComponent(props) {
    const { commonConfigs } = props;
    const { data, styles, settings } = props.data;
    const { isPreview } = commonConfigs;
    let inlineStyles = {};
    let path = '';
    let thumbnailUri = '';
    let autoPlay = false;
    let isExternalUrl = false;
    let downloadable = true;
    let config = {};
    let width = '100%';
    let height = '100%';

    if (data) {
        const { video } = data;

        if (video) {
            isExternalUrl = video.isExternalUrl;

            if (isExternalUrl) {
                path = video.filePath;
                thumbnailUri = video.thumbnailFileURI;
                width = '640px';
                height = '360px';
            } else {
                path = isPreview ? video.filePath : '/videos/' + video.fileName;
                thumbnailUri = video.thumbnailFileURI;
            }
        }
    }

    if (styles) {
        inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    }

    if (settings) {
        autoPlay = settings.autoPlay ? settings.autoPlay.value : false;
        downloadable = settings.downloadable ? settings.downloadable.value : true;

        if (isExternalUrl) {
            config = {};
        } else {
            if (!downloadable) {
                config = {
                    file: { attributes: { controlsList: 'nodownload' } },
                };
            }
        }
    }

    return (
        <Wrapper className={inlineStyles.cssClass ? inlineStyles.cssClass : ''} {...inlineStyles}>
            {ReactPlayer.canPlay(path) && (
                <ReactPlayer
                    url={path}
                    controls={true}
                    width={width}
                    height={height}
                    playing={autoPlay}
                    config={config}
                />
            )}
        </Wrapper>
    );
}

export default React.memo(VideoComponent);
