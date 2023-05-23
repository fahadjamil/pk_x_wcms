import React, { useState } from 'react';

export default function RadioButtonComponent(props) {
    const [isCustomEnabled, setIsCustomEnabled] = useState<boolean>(props.isCustom);
    const [isCustomStyle, setIsCustomStyle] = useState<boolean>(false);
    const [initialValue, setInitialValue] = useState<boolean>(props.selectedValue);

    let radioItems = props.items;

    function handleValueChange(e) {
        setInitialValue(e.target.value);
        props.onChange(e);
    }

    return (
        <>
            <div className="row">
                {isCustomStyle && (
                    <div className="col-4">
                        <input type="text" name="customValue" />
                    </div>
                )}

                {!isCustomStyle &&
                    radioItems.map((radioItem, index) => {
                        return (
                            <div className="col-3" key={index}>
                                {initialValue === radioItem.name && (
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            value={radioItem.name}
                                            onChange={handleValueChange}
                                            checked={true}
                                        />
                                        {radioItem.name}
                                    </label>
                                )}
                                {initialValue != radioItem.name && (
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            value={radioItem.name}
                                            onChange={handleValueChange}
                                        />
                                        {radioItem.name}
                                    </label>
                                )}
                            </div>
                        );
                    })}

                {isCustomEnabled && (
                    <div className="col-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setIsCustomStyle(!isCustomStyle);
                            }}
                        >
                            {!isCustomStyle && <span>Add Custom </span>}
                            {isCustomStyle && <span>Remove Custom </span>}
                        </button>
                    </div>
                )}
            </div>
            <br />
        </>
    );
}
