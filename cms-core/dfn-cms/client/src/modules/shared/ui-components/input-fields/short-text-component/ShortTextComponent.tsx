import React, { useCallback, useRef, useEffect } from 'react';
import DefaultPropTypeModel from '../models/DefaultPropTypeModel';

function ShortTextComponent(props: DefaultPropTypeModel) {
    const {
        id,
        label,
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
            <input
                id={id}
                key={id}
                name={name}
                type="text"
                className="form-control"
                placeholder={placeholder ? placeholder : ''}
                defaultValue={defaultValue ? defaultValue : ''}
                required={isRequired ? isRequired : false}
                minLength={minLength ? minLength : 0}
                maxLength={maxLength ? maxLength : 524288}
                onChange={handleValueChange}
                ref={inputElement}
            />
        </>
    );
}

export default ShortTextComponent;
