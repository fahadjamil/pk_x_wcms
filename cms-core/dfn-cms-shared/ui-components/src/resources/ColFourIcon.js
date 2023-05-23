import React from 'react';

export default function ColFourIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 50"
            width={props.width}
            height={props.height}
            fill={props.fill}
        >
            <path
                d="M23.5,0V50H0V0Z M49,0V50H25.5V0Z M74.5,0V50H51V0Z M100,0V50H76.5V0Z"
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            ></path>
        </svg>
    );
}
