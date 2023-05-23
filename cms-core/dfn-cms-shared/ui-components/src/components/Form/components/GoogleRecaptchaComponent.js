import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import GoogleRecaptchaPlaceholderComponent from './GoogleRecaptchaPlaceholderComponent';

function GoogleRecaptchaComponent({
    id,
    label,
    value,
    settings,
    uiProperties,
    validationErrors,
    commonConfigs,
    recaptchaSiteKey,
    handleGoogleRecaptchaValueChanges,
    recaptchaRef,
}) {
    function handleVerify(value) {
        handleGoogleRecaptchaValueChanges(value, id);
    }

    if (commonConfigs) {
        if (commonConfigs.isPreview) {
            return <GoogleRecaptchaPlaceholderComponent />;
        } else {
            if (recaptchaSiteKey && recaptchaSiteKey != '') {
                return (
                    <React.Fragment>
                        <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} onChange={handleVerify} />
                    </React.Fragment>
                );
            } else {
                return null;
            }
        }
    }

    if (!commonConfigs) {
        return <GoogleRecaptchaPlaceholderComponent />;
    }

    return null;
}

export default GoogleRecaptchaComponent;
