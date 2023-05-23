import React from 'react';

export default function ColThreeThreeSixRightIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 50"
            width={props.width}
            height={props.height}
            fill={props.fill}
        >
            <path
                d="M48,0V50H0V0Z M74,0V50H50V0Z M100,0V50H76V0Z"
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            ></path>
        </svg>
    );
}
