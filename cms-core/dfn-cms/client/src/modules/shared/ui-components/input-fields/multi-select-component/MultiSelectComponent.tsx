import React from 'react';
import MultiSelect from 'react-multi-select-component';

interface PropTypes {
    options: any;
    value: any;
    onChange: any;
}

function MultiSelectComponent({ options, value, onChange }: PropTypes) {
    return (
        <>
            <MultiSelect
                className="multi-select"
                options={options}
                value={value}
                onChange={onChange}
                labelledBy={'Select'}
            />
        </>
    );
}

export default MultiSelectComponent;
