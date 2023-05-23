import React from 'react';

function ResetButtonComponent({ id, label, resetForm, uiProperties }) {
    if (id && label) {
        return (
            <React.Fragment>
                <button
                    type="reset"
                    className={uiProperties.field.classes || ''}
                    id={id}
                    onClick={resetForm}
                >
                    <span className={uiProperties.label.classes || ''}>{label}</span>
                </button>
            </React.Fragment>
        );
    }

    return <React.Fragment></React.Fragment>;
}

export default ResetButtonComponent;
