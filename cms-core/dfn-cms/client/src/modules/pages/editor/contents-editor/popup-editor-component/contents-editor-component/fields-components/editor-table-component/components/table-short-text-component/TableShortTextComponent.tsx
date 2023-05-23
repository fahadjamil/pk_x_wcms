import React, { useState } from 'react';
import DefaultPropTypeModel from '../../models/DefaultPropTypeModel';
import { ShortTextComponent } from '../../../../../../../../../shared/ui-components/input-fields/short-text-component';

function TableShortTextComponent(props: DefaultPropTypeModel) {
    const {
        columnId,
        firstParam,
        labelName,
        id,
        cmpData,
        dependentField,
        fieldName,
        dependingFieldValues,
        langKey,
        data,
    } = props;
    const [shortTextFieldValue, setShortTextFieldValue] = useState<string>(data);

    const handleValueChanges = (event) => {
        const value = event.target.value;

        setShortTextFieldValue(value);
        props.onValueChange(columnId, fieldName, value, langKey);
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>{labelName}</label>
                <ShortTextComponent
                    id={id}
                    label={labelName}
                    name={id}
                    defaultValue={shortTextFieldValue}
                    isRequired={false}
                    minLength={0}
                    maxLength={524288}
                    handleValueChange={handleValueChanges}
                />
            </div>
        </>
    );
}

export default TableShortTextComponent;
