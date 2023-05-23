import React from 'react';

function MarketUp(props) {
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
                        <circle cx="9" cy="9" r="9" fill="#4c7f58" className=""></circle>
                    </g>
                    <path
                        fill="#4c7f58"
                        d="M13.81 8.71L12.62 9.89 9.85 7.13 9.85 13.35 8.16 13.35 8.16 7.12 5.39 9.89 4.19 8.71 9 3.9 13.81 8.71z"
                        className=""
                    ></path>
                </g>
            </g>
        </svg>
    );
}

export default MarketUp;
