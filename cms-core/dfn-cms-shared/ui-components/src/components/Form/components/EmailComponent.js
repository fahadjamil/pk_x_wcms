import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
    ${(props) => {}}
`;

const InputEmail = styled.input`
    ${(props) => {}}
`;

function EmailComponent({
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
                <Label htmlFor={id} className={uiProperties.label.classes || ''}>
                    {label}
                </Label>
                <InputEmail
                    type="email"
                    className={uiProperties.field.classes || ''}
                    placeholder={label}
                    id={id}
                    name={id}
                    value={value || ''}
                    pattern="[A-Za-z0-9._%+-~]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    required={(settings && settings.required) || false}
                    minLength={(settings && settings.min) || null}
                    maxLength={(settings && settings.max) || null}
                    onChange={handleValueChanges}
                />
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

export default EmailComponent;
