import React, { useEffect } from 'react';
import { useState } from 'react';
import FieldComponetModel from '../../../pages/editor/contents-editor/popup-editor-component/contents-editor-component/models/FieldComponentModel';
import { DatePickerComponent } from '../../../shared/ui-components/input-fields/date-picker-component';
import { getComponentID, getComponentLabel } from '../../../shared/ui-components/UiComponentsUtils';

function DateContainerComponent(props: FieldComponetModel) {
    const { dataKey, initialValue, language, componentKey, validations, fieldIndex } = props;
    const id = getComponentID('dateComponent', language.langKey, componentKey);
    const label = getComponentLabel(dataKey, language.language);
    const [selectedDate, setSelectedDate] = useState<any>(null);

    useEffect(() => {
        if (initialValue) {
            props.onValueChange({ [dataKey]: initialValue[language.langKey] }, language.langKey);

            if (initialValue[language.langKey] && initialValue[language.langKey] != '') {
                setSelectedDate(new Date(initialValue[language.langKey]));
            }
        }
    }, []);

    const handleValueChange = (date: any) => {
        props.onValueChange({ [dataKey]: date }, language.langKey);
        setSelectedDate(date);
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>{label}</label>
                <div>
                    <DatePickerComponent
                        handleValueChange={(date) => {
                            handleValueChange(date);
                        }}
                        onFocus={(e) => {}}
                        onBlur={(e) => {}}
                        selected={selectedDate}
                        placeholderText="Select To Date"
                        isClearable={true}
                    />
                </div>
            </div>
        </>
    );
}

export default DateContainerComponent;
