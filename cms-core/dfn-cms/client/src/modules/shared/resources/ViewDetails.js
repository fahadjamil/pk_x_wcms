import React from 'react';

function ViewDetails(props) {
    return (
        <svg
            id="prefix__Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            x={0}
            y={0}
            viewBox="0 0 512 512"
            xmlSpace="preserve"
            {...props}
        >
            <title>{props.title || "View Details"}</title>
            <style>{'.prefix__st0{fill:#606b8c}'}</style>
            <path
                className="prefix__st0"
                d="M508.7 246C504.2 239.8 395.2 92.8 256 92.8S7.8 239.8 3.2 246c-4.3 5.9-4.3 14 0 19.9 4.6 6.3 113.6 153.2 252.7 153.2s248.2-147 252.7-153.2c4.5-5.9 4.5-13.9.1-19.9zM256 385.4c-102.5 0-191.3-97.5-217.6-129.4C64.6 224.1 153.2 126.6 256 126.6c102.5 0 191.3 97.5 217.6 129.4-26.2 31.9-114.9 129.4-217.6 129.4z"
            />
            <path
                className="prefix__st0"
                d="M256 154.7c-55.8 0-101.3 45.4-101.3 101.3S200.2 357.3 256 357.3 357.3 311.8 357.3 256 311.8 154.7 256 154.7zm0 168.8c-37.2 0-67.5-30.3-67.5-67.5s30.3-67.5 67.5-67.5 67.5 30.3 67.5 67.5-30.3 67.5-67.5 67.5z"
            />
        </svg>
    );
}

export default ViewDetails;
