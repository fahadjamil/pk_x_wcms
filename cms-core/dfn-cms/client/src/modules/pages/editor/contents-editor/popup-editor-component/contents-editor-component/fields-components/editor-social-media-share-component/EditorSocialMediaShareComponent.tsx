import React, { useEffect } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';

function EditorSocialMediaShareComponent(props: FieldComponetModel) {
    const { dataKey, initialValue, language, componentKey, validations, fieldIndex } = props;

    // useEffect(() => {
    //     if (initialValue) {
    //         props.onValueChange({ [dataKey]: initialValue[language.langKey] }, language.langKey);
    //     }
    // }, []);

    const handleValueChange = (event: any) => {
        // props.onValueChange({ [dataKey]: event.target.value }, language.langKey);
    };

    return (
        <div>
            <div className="form-check">
                <input onClick={handleValueChange} type="checkbox" className="form-check-input" id="facebook" name="facebook" />
                <label className="form-check-label" htmlFor="facebook">
                    Facebook
                </label>
            </div>
            <div className="form-check">
                <input onClick={handleValueChange} type="checkbox" className="form-check-input" id="linkdin" name="linkdin" />
                <label className="form-check-label" htmlFor="linkdin">
                    LinkdIn
                </label>
            </div>
            <div className="form-check">
                <input onClick={handleValueChange} type="checkbox" className="form-check-input" id="twitter" name="twitter" />
                <label className="form-check-label" htmlFor="twitter">
                    Twitter
                </label>
            </div>
        </div>
    );
}

export default EditorSocialMediaShareComponent;
