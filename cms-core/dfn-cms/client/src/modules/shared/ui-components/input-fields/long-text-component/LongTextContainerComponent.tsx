import React, { useEffect } from 'react';
import FieldComponetModel from '../../../../pages/editor/contents-editor/popup-editor-component/contents-editor-component/models/FieldComponentModel';
import { getComponentID, getComponentLabel } from '../../UiComponentsUtils';
import LongTextComponent from './LongTextComponent';

function LongTextContainerComponent(props: FieldComponetModel) {
    const { dataKey, initialValue, language, componentKey, validations, fieldIndex } = props;
    const id = getComponentID('longTextComponent', language.langKey, componentKey);
    const label = getComponentLabel(dataKey, language.language);
    const isAutofocus: boolean = fieldIndex === 0 ? true : false;

    useEffect(() => {
        if (initialValue) {
            props.onValueChange({ [dataKey]: initialValue[language.langKey] }, language.langKey);
        }
    }, []);

    const handleValueChange = (event: any) => {
        props.onValueChange({ [dataKey]: event.target.value }, language.langKey);
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>{label}</label>
                <LongTextComponent
                    id={id}
                    label={label}
                    name={dataKey}
                    defaultValue={initialValue ? initialValue[language.langKey] : ''}
                    isRequired={validations ? validations.required : false}
                    minLength={validations ? validations.minLen : 0}
                    maxLength={validations ? validations.maxLen : 524288}
                    isAutofocus={isAutofocus}
                    handleValueChange={handleValueChange}
                />
            </div>
        </>
    );
}

export default LongTextContainerComponent;
