import React from 'react';

export default function PlusIcon(props) {
    return (
        <svg
            className="bi bi-plus-circle-fill"
            width="1em"
            height="1em"
            viewBox="0 0 64 64"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width={props.width}
            height={props.height}
            enableBackground="new 0 0 64 64"
        >
            <g>
                <line
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    x1="32"
                    y1="50"
                    x2="32"
                    y2="14"
                />
                <line
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    x1="14"
                    y1="32"
                    x2="50"
                    y2="32"
                />
            </g>
        </svg>
    );
}
