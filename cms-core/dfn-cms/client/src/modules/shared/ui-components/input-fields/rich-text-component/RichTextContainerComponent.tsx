import React, { useEffect } from 'react';
import FieldComponetModel from '../../../../pages/editor/contents-editor/popup-editor-component/contents-editor-component/models/FieldComponentModel';
import { getComponentID, getComponentLabel } from '../../UiComponentsUtils';
import RichTextComponent from './RichTextComponent';
import { getRichTextComponentConfiguration } from './RichTextUtil';

function RichTextContainerComponent(props: FieldComponetModel) {
    const { dataKey, initialValue, language, componentKey, validations, fieldIndex } = props;
    const id = getComponentID('richTextComponent', language.langKey, componentKey);
    const label = getComponentLabel(dataKey, language.language);
    const isAutofocus: boolean = fieldIndex === 0 ? true : false;

    const config = getRichTextComponentConfiguration(props.dbName, language?.langKey?.toLowerCase());

    useEffect(() => {
        if (initialValue) {
            props.onValueChange({ [dataKey]: initialValue[language.langKey] }, language.langKey);
        }
    }, []);

    const handleValueChange = (event: any, editor: any) => {
        props.onValueChange({ [dataKey]: editor.getData() }, language.langKey);
    };

    const onInit = (editor) => {
        if (isAutofocus) {
            editor.editing.view.focus();
        }
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>{label}</label>
                <RichTextComponent
                    id={id}
                    label={label}
                    config={config}
                    data={initialValue ? initialValue[language.langKey] : ''}
                    handleValueChange={handleValueChange}
                    onInit={onInit}
                />
            </div>
        </>
    );
}

export default RichTextContainerComponent;
