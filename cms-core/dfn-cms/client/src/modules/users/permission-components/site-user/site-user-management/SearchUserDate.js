import React, { useState } from 'react';

function SearchUserDate(props) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value) return;
        props.getUsersByDate(value);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                onChange={(e) => {
                    console.log(e.target.value);
                    setValue(e.target.value);
                }}
            />
        </form>
    );
}

export default SearchUserDate;
