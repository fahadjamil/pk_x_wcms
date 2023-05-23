import React, { useState } from 'react';
import FieldComponetModel from '../../../../pages/editor/contents-editor/popup-editor-component/contents-editor-component/models/FieldComponentModel';
import { getComponentID, getComponentLabel } from '../../UiComponentsUtils';
import InternalMediaComponent from './InternalMediaComponent';

function InternalMediaContainerComponent(props: FieldComponetModel) {
    const { dataKey, language, componentKey, validations, initialValue } = props;
    const id = getComponentID('internalMediaComponent', language.langKey, componentKey);
    const label = getComponentLabel(dataKey, language.language);
    const [selectedFile, setSelectedFile] = useState('');

    // useEffect(() => {
    //     if (initialValue) {
    //         props.onValueChange({ [dataKey]: initialValue[language.langKey] }, language.langKey);
    //     }
    // });

    const handleValueChange = (event: any) => {
        const file = event.target.files[0];
        props.onValueChange({ [dataKey]: file, type: 'media' }, language.langKey);
        setSelectedFile(file);
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>{label}</label>
                <InternalMediaComponent
                    id={id}
                    label={label}
                    name={dataKey}
                    ext={validations ? validations.ext : ''}
                    selectedFile={selectedFile ? selectedFile : initialValue[language.langKey]}
                    handleValueChange={handleValueChange}
                />
            </div>
        </>
    );
}

export default InternalMediaContainerComponent;
