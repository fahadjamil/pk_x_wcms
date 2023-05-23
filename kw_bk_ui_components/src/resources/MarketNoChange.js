import React from 'react';

function MarketNoChange(props) {
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
                        <circle cx="9" cy="9" r="9" fill="#ccc" className="cls-2"></circle>
                    </g>
                    <path
                        fill="gray"
                        d="M14.11 9L9.3 13.81 8.11 12.62 10.89 9.84 4.65 9.84 4.65 8.16 10.89 8.16 8.11 5.38 9.3 4.19 14.11 9z"
                        className="cls-3"
                    ></path>
                </g>
            </g>
        </svg>
    );
}

export default MarketNoChange;
