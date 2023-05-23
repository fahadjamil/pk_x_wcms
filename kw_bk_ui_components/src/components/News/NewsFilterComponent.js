import React, { memo } from 'react';
import styled from 'styled-components';

const NewsFilterWrapper = styled.div`
    width: 100%;
`;

const NewsFilterComponent = (params) => {
    const types = [
        { tag: '0', name: 'Market Annoucements' },
        { tag: '120', name: 'Companies Disclosure' },
        { tag: '110', name: 'AGM & EGM' },
        { tag: '14', name: "Board's Election" },
        { tag: '6', name: "Insider's Disclosure" },
        { tag: '101', name: "Previous Day's Disclosure" },
    ];
    const onTypeChange = (event) => {
        params.handleChange(types.find((type) => type.tag == event.target.value).tag);
    };
    return (
        <NewsFilterWrapper>
            <p>Filter News:</p>
            <select onChange={(event) => onTypeChange(event)} defaultValue={params.default || 0}>
                {types &&
                    types.map((type, index) => (
                        <option key={index} value={type.tag}>
                            {type.name}
                        </option>
                    ))}
            </select>
        </NewsFilterWrapper>
    );
};

export default NewsFilterComponent;
