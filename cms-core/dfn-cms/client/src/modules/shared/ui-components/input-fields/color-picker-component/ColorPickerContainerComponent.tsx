import React from 'react';
import ColorPickerComponent from './ColorPickerComponent';

function ColorPickerContainerComponent(props) {
    const { id, label, name, defaultValue, theme, isAddPicker } = props;
    return (
        <>
            <div className="form-group row">
                <label htmlFor={id} className="col-sm-3 col-form-label">
                    {label}
                </label>
                <div className="col-sm-3 offset-sm-6">
                    <ColorPickerComponent
                        id={id}
                        name={name}
                        section={''}
                        theme={theme}
                        isAddPicker={isAddPicker}
                        defaultValue={defaultValue ? defaultValue : ''}
                        onChangeComplete={props.onChangeComplete}
                    />
                </div>
            </div>
        </>
    );
}

export default ColorPickerContainerComponent;
