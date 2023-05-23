import React from 'react';

export const GetValidationMessages = (props: any) => {
    const { validationErrors } = props;

    if (validationErrors && validationErrors.length > 0) {
        return validationErrors.map((error, errorIndex) => {
            return (
                <React.Fragment key={`error-message-${errorIndex}`}>
                    <div className="invalid-feedback d-block">{error}</div>
                </React.Fragment>
            );
        });
    } else {
        return <></>;
    }
};
