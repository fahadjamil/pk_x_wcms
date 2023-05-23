import React from 'react';
import CustomDocumentPreviewModel from '../../models/custom-types-data-models/CustomDocumentPreviewModel';
import { getFormattedDateTimeString } from '../../utils/DateTimeUtil';
import { getComponentLabel } from '../UiComponentsUtils';

function DatePickerPreviewComponent(props: CustomDocumentPreviewModel) {
    const label = getComponentLabel(props.dataKey, props.language.language);
    return (
        <div className="form-group">
            <label style={{ fontWeight: 'bold' }}>{label}</label>
            <p>{props.value ? props.value.substr(0, 10) : ''}</p>
            <hr></hr>
        </div>
    );
}

export default DatePickerPreviewComponent;
