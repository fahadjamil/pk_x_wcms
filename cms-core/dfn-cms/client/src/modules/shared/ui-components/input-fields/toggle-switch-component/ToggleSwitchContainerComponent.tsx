import React, { useEffect, useState } from 'react';
import FieldComponetModel from '../../../../pages/editor/contents-editor/popup-editor-component/contents-editor-component/models/FieldComponentModel';
import { getComponentID, getComponentLabel } from '../../UiComponentsUtils';
import ToggleSwitchComponent from './ToggleSwitchComponent';

function ToggleSwitchContainerComponent(props: FieldComponetModel) {
    const { dataKey, initialValue, language, componentKey, languageData } = props;
    const id = getComponentID('toggleSwitchComponent', language ? language.langKey : '', dataKey);
    const label = getComponentLabel(dataKey, language ? language.language : '');
    const [initialToggleSwitchValue, setInitialToggleSwitchValue] = useState<boolean>(false);

    useEffect(() => {
        if (initialValue) {
            if (language) {
                props.onValueChange(
                    { [dataKey]: initialValue[language.langKey] },
                    language.langKey
                );

                setInitialToggleSwitchValue(initialValue[language.langKey]);
            }

            if (languageData && languageData.length > 0) {
                languageData.forEach((langData, langDataIndex) => {
                    const { langKey } = langData;

                    props.onValueChange({ [dataKey]: initialValue[langKey] }, langKey);

                    setInitialToggleSwitchValue(initialValue[langKey]);
                });
            }
        }
    }, []);

    const handleValueChange = (event: any) => {
        if (language) {
            props.onValueChange({ [dataKey]: event.target.checked }, language.langKey);
        }

        if (languageData && languageData.length > 0) {
            languageData.forEach((langData, langDataIndex) => {
                const { langKey } = langData;

                props.onValueChange({ [dataKey]: event.target.checked }, langKey);
            });
        }

        setInitialToggleSwitchValue(event.target.checked);
    };

    return (
        <>
            <div className="form-group">
                <ToggleSwitchComponent
                    id={id}
                    name={dataKey}
                    checked={initialToggleSwitchValue}
                    label={label}
                    handleValueChange={handleValueChange}
                />
            </div>
        </>
    );
}

export default ToggleSwitchContainerComponent;
