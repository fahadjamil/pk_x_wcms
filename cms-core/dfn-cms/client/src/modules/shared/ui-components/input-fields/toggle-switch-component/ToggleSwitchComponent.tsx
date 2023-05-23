import React from 'react';
import DefaultPropTypeModel from '../models/DefaultPropTypeModel';

function ToggleSwitchComponent(props: DefaultPropTypeModel) {
    const { id, name, isRequired, checked, label } = props;

    const handleValueChange = (event) => {
        props.handleValueChange(event);
    };

    return (
        <>
            <div className="custom-control custom-switch">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    id={id}
                    name={name}
                    checked={checked}
                    required={isRequired ? isRequired : false}
                    onChange={handleValueChange}
                ></input>
                <label className="custom-control-label" htmlFor={id}>
                    {label}
                </label>
            </div>
        </>
    );
}

export default ToggleSwitchComponent;
