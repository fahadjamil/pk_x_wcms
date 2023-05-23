import React from 'react';

export default function AccordionIcon(props) {
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 16 16"
            {...props}
        >
            <path d="M0 4v8h16v-8h-16zM15 11h-14v-4h14v4z"></path>
            <path d="M0 0h16v3h-16v-3z"></path>
            <path d="M0 13h16v3h-16v-3z"></path>
        </svg>
    );
}
