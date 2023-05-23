import React from 'react';
import DropDownContainerPropType from '../models/DropDownContainerPropType';
import DropDownComponent from './DropDownComponent';

function DropDownContainerComponent(props: DropDownContainerPropType) {
    const { id, name, value, label, type, dropDownListContent, fieldIndex } = props;
    const isAutofocus: boolean = fieldIndex === 0 ? true : false;

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>{label}</label>
                <DropDownComponent
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    isRequired={false}
                    isAutofocus={isAutofocus}
                    dropDownListContent={dropDownListContent}
                    onValueChange={props.onValueChange}
                />
            </div>
        </>
    );
}

export default DropDownContainerComponent;
