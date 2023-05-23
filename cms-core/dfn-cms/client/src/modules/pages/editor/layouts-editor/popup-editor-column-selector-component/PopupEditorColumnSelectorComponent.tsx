import React from 'react';
import { SectionStructureModel } from '../models/SectionStructureModel';
import EditorColumnSelectorComponent from './editor-column-selector-component';
import { titleStyles } from './PopupEditorColumnSelectorComponentStyles';

interface PopupEditorColumnSelectorComponentModel {
    onColumnSelect: any;
    onClosePopup: any;
    contentHeader: string;
}

function PopupEditorColumnSelectorComponent(props: PopupEditorColumnSelectorComponentModel) {
    return (
        <>
            <div className="row">
                <div className="col-sm">
                    <div style={titleStyles}>
                        {props.contentHeader ? props.contentHeader : ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <EditorColumnSelectorComponent
                    onColumnSelect={(section: SectionStructureModel) => {
                        props.onColumnSelect && props.onColumnSelect(section);
                        props.onClosePopup && props.onClosePopup();
                    }}
                />
            </div>
        </>
    );
}

export default PopupEditorColumnSelectorComponent;
