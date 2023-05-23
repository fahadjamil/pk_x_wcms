import React from 'react';

function LongTextComponent({
    id,
    label,
    value,
    settings,
    uiProperties,
    validationErrors,
    handleValueChanges,
}) {
    if (id && label) {
        return (
            <React.Fragment>
                <label htmlFor={id} className={uiProperties.label.classes || ''}>
                    {label}
                </label>
                <textarea
                    className={uiProperties.field.classes || ''}
                    placeholder={label}
                    id={id}
                    name={id}
                    value={value || ''}
                    required={(settings && settings.required) || false}
                    minLength={(settings && settings.min) || null}
                    maxLength={(settings && settings.max) || null}
                    onChange={handleValueChanges}
                ></textarea>
                {validationErrors && (
                    <div className="invalid-feedback d-block">
                        {validationErrors.message || 'Invalid field data'}
                    </div>
                )}
            </React.Fragment>
        );
    }

    return <React.Fragment></React.Fragment>;
}

export default LongTextComponent;
