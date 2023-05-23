import React from 'react';

function SubmitButtonComponent({ id, label, uiProperties, disableSubmitButton }) {
    if (id && label) {
        return (
            <React.Fragment>
                <button
                    type="submit"
                    className={uiProperties.field.classes || ''}
                    id={id}
                    disabled={disableSubmitButton}
                >
                    <span className={uiProperties.label.classes || ''}>{label}</span>
                </button>
            </React.Fragment>
        );
    }

    return <React.Fragment></React.Fragment>;
}

export default SubmitButtonComponent;
