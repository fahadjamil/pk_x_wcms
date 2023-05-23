import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormEditorPropTypes } from '../../shared/models/editorModels';
import FormLabelsEditorComponent from './FormLabelsEditorComponent';
import FormValidationsEditorComponent from './FormValidationsEditorComponent';

const EditFormComponent = forwardRef((props: FormEditorPropTypes, ref): JSX.Element => {
    const [labelValues, setLabelValues] = useState<any>(undefined);
    const [validations, setValidations] = useState<any>(undefined);

    useImperativeHandle(ref, () => ({
        handleConfirme() {
            const form = { ...props.selectedForm };
            const { sections } = form;

            if (sections && Array.isArray(sections) && sections[0]) {
                const { columns } = sections[0];

                for (const column of columns) {
                    const { columnId } = column;

                    if (labelValues && labelValues[columnId]) {
                        column.label = labelValues[columnId];
                    }

                    if (validations && validations[columnId]) {
                        for (const validation in validations[columnId]) {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    validations[columnId],
                                    validation
                                )
                            ) {
                                if (
                                    column.settings.validations &&
                                    column.settings.validations[validation] !== undefined
                                ) {
                                    column.settings.validations[validation] =
                                        validations[columnId][validation];
                                }
                            }
                        }
                    }
                }
            }

            props.setSelectedForm(form);
        },
    }));

    return (
        <>
            <ul className="nav nav-tabs" id="formEditorTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a
                        className="nav-link active"
                        id="label-tab"
                        data-toggle="tab"
                        href="#label"
                        role="tab"
                        aria-controls="label"
                        aria-selected="true"
                    >
                        Labels
                    </a>
                </li>
                <li className="nav-item" role="presentation">
                    <a
                        className="nav-link"
                        id="validation-tab"
                        data-toggle="tab"
                        href="#validation"
                        role="tab"
                        aria-controls="validation"
                        aria-selected="false"
                    >
                        Validations
                    </a>
                </li>
            </ul>
            <div className="tab-content" id="formEditorTabContent">
                <div
                    className="tab-pane fade show active"
                    id="label"
                    role="tabpanel"
                    aria-labelledby="label-tab"
                >
                    <FormLabelsEditorComponent
                        {...props}
                        setLabelValues={setLabelValues}
                        labelValues={labelValues}
                    ></FormLabelsEditorComponent>
                </div>
                <div
                    className="tab-pane fade"
                    id="validation"
                    role="tabpanel"
                    aria-labelledby="validation-tab"
                >
                    <FormValidationsEditorComponent
                        {...props}
                        setValidations={setValidations}
                        validations={validations}
                    ></FormValidationsEditorComponent>
                </div>
            </div>
        </>
    );
});

export default EditFormComponent;
