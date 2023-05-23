import React, { useEffect } from 'react';
import { useState } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';

function EditorDocumentAccordionComponent(props: FieldComponetModel) {
    const { contentUiSettings, componentSettings, languageData } = props;
    const [filedMappingConfig, setFieldMappingConfig] = useState<any>({});

    useEffect(() => {
        if (componentSettings && componentSettings.fieldMappings) {
            setFieldMappingConfig(componentSettings.fieldMappings);
        } else {
            setFieldMappingConfig({ titleDataMap: '', paragraphDataMap: '' });
        }
    }, [componentSettings]);

    function onTitleMappingTextChange(event) {
        if (event && event.target && event.target.value) {
            filedMappingConfig.titleDataMap = event.target.value;
        }

        props.onValueChange({ fieldMappings: filedMappingConfig });
    }

    function onParagraphMappingTextChange(event) {
        if (event && event.target && event.target.value) {
            filedMappingConfig.paragraphDataMap = event.target.value;
        }
        props.onValueChange({ fieldMappings: filedMappingConfig });
    }

    return (
        <div className="col">
            <div className="form-group">
                <label htmlFor="titleMapping">Title Mapping Field</label>
                <input
                    type="text"
                    className="form-control"
                    id="titleMapping"
                    required
                    defaultValue={filedMappingConfig.titleDataMap}
                    onChange={(event) => {
                        onTitleMappingTextChange(event);
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="paragraphMapping">Paragraph Mapping Field</label>
                <input
                    type="text"
                    className="form-control"
                    id="paragraphMapping"
                    required
                    defaultValue={filedMappingConfig.paragraphDataMap}
                    onChange={(event) => {
                        onParagraphMappingTextChange(event);
                    }}
                />
            </div>
        </div>
    );
}

export default EditorDocumentAccordionComponent;
