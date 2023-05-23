import React, { useRef, useEffect } from 'react';
import DropDownPropTypeModel from '../models/DropDownPropTypeModel';

function DropDownComponent(props: DropDownPropTypeModel) {
    const {
        id,
        name,
        value,
        isRequired,
        size,
        isMultipleSelect,
        dropDownListContent,
        type,
        isAutofocus,
    } = props;

    const inputElement = useRef<any>(null);

    useEffect(() => {
        if (inputElement.current && isAutofocus) {
            inputElement.current.focus();
        }
    }, []);

    const handleValueChange = (event) => {
        props.onValueChange(event);
    };

    return (
        <>
            <select
                className="form-control"
                id={id}
                value={value ? value : ''}
                name={name}
                size={size ? size : 1}
                required={isRequired ? isRequired : false}
                multiple={isMultipleSelect ? isMultipleSelect : false}
                onChange={handleValueChange}
                ref={inputElement}
            >
                <option disabled value={type === 'number' ? -1 : ''}>
                    -- select an option --
                </option>
                {type === 'number' &&
                    dropDownListContent &&
                    dropDownListContent.length !== 0 &&
                    dropDownListContent.map((dropDownItem, index) => {
                        const { displayText } = dropDownItem;
                        return (
                            <option key={'dropDownComponent' + index} value={index}>
                                {dropDownItem ? displayText : ''}
                            </option>
                        );
                    })}
                {type === 'string' &&
                    dropDownListContent &&
                    dropDownListContent.length !== 0 &&
                    dropDownListContent.map((dropDownItem, index) => {
                        const { key, value } = dropDownItem;
                        return (
                            <option key={'dropDownComponent' + index} value={key}>
                                {value}
                            </option>
                        );
                    })}
                {!type &&
                    dropDownListContent &&
                    dropDownListContent.length !== 0 &&
                    dropDownListContent.map((dropDownItem, index) => {
                        return (
                            <option
                                key={`dropDownComponent-${index}-${dropDownItem}`}
                                value={dropDownItem || ''}
                            >
                                {dropDownItem ? dropDownItem : ''}
                            </option>
                        );
                    })}
            </select>
        </>
    );
}

export default DropDownComponent;
