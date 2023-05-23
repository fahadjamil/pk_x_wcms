import React, { useRef, useEffect } from 'react';
import DefaultPropTypeModel from '../models/DefaultPropTypeModel';

function LongTextComponent(props: DefaultPropTypeModel) {
    const {
        id,
        name,
        defaultValue,
        isRequired,
        minLength,
        maxLength,
        placeholder,
        isAutofocus,
    } = props;

    const inputElement = useRef<any>(null);

    useEffect(() => {
        if (inputElement.current && isAutofocus) {
            inputElement.current.focus();
        }
    }, []);

    const handleValueChange = (event) => {
        props.handleValueChange(event);
    };

    return (
        <>
            <textarea
                id={id}
                key={id}
                name={name}
                placeholder={placeholder ? placeholder : ''}
                className="form-control"
                defaultValue={defaultValue ? defaultValue : ''}
                required={isRequired ? isRequired : false}
                minLength={minLength ? minLength : 0}
                maxLength={maxLength ? maxLength : 524288}
                onChange={handleValueChange}
                ref={inputElement}
            ></textarea>
        </>
    );
}

export default LongTextComponent;
