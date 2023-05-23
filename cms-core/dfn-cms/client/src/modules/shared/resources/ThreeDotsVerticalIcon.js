import React from 'react';

export default function ThreeDotsVerticalIcon(props) {
    return (
        <svg
            width={props.width}
            height={props.height}
            fill={props.fill}
            viewBox="0 0 16 16"
            className="bi bi-three-dots-vertical"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
            />
        </svg>
    );
}
