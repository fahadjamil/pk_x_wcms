import React from 'react';

interface ValidationMessageComponentModel {
    validationErrors: any[];
}

function ValidationMessageComponent(props: ValidationMessageComponentModel) {
    const { validationErrors } = props;

    if (validationErrors && validationErrors.length > 0) {
        return (
            <>
                {validationErrors.map((error, errorIndex) => {
                    const { type, message } = error;

                    return (
                        <React.Fragment key={`error-message-${errorIndex}`}>
                            <small className="text-danger">{message}</small>
                            <br />
                        </React.Fragment>
                    );
                })}
            </>
        );
    } else {
        return <></>;
    }
}

export default ValidationMessageComponent;
