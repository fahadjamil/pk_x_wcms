import React from 'react';
import CustomDocumentPreviewModel from '../../models/custom-types-data-models/CustomDocumentPreviewModel';
import { getComponentLabel } from '../UiComponentsUtils';
import { ParagraphComponent } from 'ui-components';


function RichTextPreviewComponent(props: CustomDocumentPreviewModel) {
    const label = getComponentLabel(props.dataKey, props.language.language);
    const componentData = { data: { styles: undefined, data: { paragraph: props.value } } };
    return (
        <div className="form-group">
            <label style={{fontWeight:'bold'}}>{label}</label>
            <ParagraphComponent {...componentData}/>
            <hr></hr>
        </div>
    );
}

export default RichTextPreviewComponent;
