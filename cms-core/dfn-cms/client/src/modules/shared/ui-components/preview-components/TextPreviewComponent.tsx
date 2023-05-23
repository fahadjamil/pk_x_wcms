import React from 'react';
import CustomDocumentPreviewModel from '../../models/custom-types-data-models/CustomDocumentPreviewModel';
import { getComponentLabel } from '../UiComponentsUtils';

function TextPreviewComponent(props: CustomDocumentPreviewModel) {
    const label = getComponentLabel(props.dataKey, props.language.language);
    return (
        <div className="form-group">
            <label style={{fontWeight:'bold'}}>{label}</label>
            <p>{props.value}</p>
            <hr></hr>
        </div>
    );
}

export default TextPreviewComponent;
