import React from 'react';

export default function DashboardIcon(props) {
    return (
        <svg viewBox="0 0 22.2 22.2" {...props}>
            <defs>
                <linearGradient
                    id="prefix__a"
                    x1={11.1}
                    y1={1.6}
                    x2={11.1}
                    y2={20.6}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#fff" stopOpacity={0} />
                    <stop offset={1} stopColor="#fff" stopOpacity={0.7} />
                </linearGradient>
            </defs>
            <title>{"home"}</title>
            <g data-name="Layer 2">
                <g data-name="Layer 1">
                    <path fill="none" d="M0 0h22.2v22.2H0z" />
                    <path
                        opacity={0.25}
                        fill="url(#prefix__a)"
                        d="M20.14 8.72V20.6H2.06V8.72l9.05-7.12 9.03 7.12z"
                    />
                    <path
                        d="M20.64 21.1H1.56V8.47L11.1 1l9.54 7.51zm-18.08-1h17.08V9L11.1 2.24 2.56 9z"
                        fill="#fff"
                    />
                </g>
            </g>
        </svg>
    );
}
