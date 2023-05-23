import React from 'react';
import ReactPlayer from 'react-player';

function VideoPlayerComponent(props) {
    const { path, controls, autoPlay, config } = props;
    
    return (
        <>
            <ReactPlayer
                url={path}
                controls={controls}
                width="100%"
                height="100%"
                playing={autoPlay}
                config={config}
            />
        </>
    );
}

export default VideoPlayerComponent;
