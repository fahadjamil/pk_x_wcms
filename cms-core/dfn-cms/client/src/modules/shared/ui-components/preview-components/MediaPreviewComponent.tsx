import React from 'react';
import CustomDocumentPreviewModel from '../../models/custom-types-data-models/CustomDocumentPreviewModel';
import { getComponentLabel } from '../UiComponentsUtils';

function MediaPreviewComponent(props: CustomDocumentPreviewModel) {
    const label = getComponentLabel(props.dataKey, props.language.language);

    function getMediaLink() {
        if (props.value) {
            return (
                <div>
                    <a href={`/api/documents/${props.website}/${props.value}`} target="_blank">
                        Preview - {props.value}
                    </a>
                </div>
            );
        } else {
            return <div>No Document Avilable</div>;
        }
    }

    return (
        <div className="form-group">
            <label style={{ fontWeight: 'bold' }}>{label}</label>
            {getMediaLink()}
            <hr></hr>
        </div>
    );
}

export default MediaPreviewComponent;
