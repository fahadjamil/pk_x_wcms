import React from 'react';

function MarketDown(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            fill={props.color}
            width={props.width}
            height={props.height}
        >
            <g data-name="Layer 2">
                <g data-name="Layer 2">
                    <g className="cls-1" opacity={0.2}>
                        <circle cx="9" cy="9" r="9" fill="#a31621" className=""></circle>
                    </g>
                    <path
                        fill="#a31621"
                        d="M13.81 9.3L9 14.11 4.19 9.3 5.38 8.1 8.16 10.88 8.16 4.65 9.84 4.65 9.84 10.88 12.62 8.1 13.81 9.3z"
                        className=""
                    ></path>
                </g>
            </g>
        </svg>
    );
}

export default MarketDown;
