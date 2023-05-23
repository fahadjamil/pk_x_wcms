import React, { useEffect } from 'react';
import { FormLabelsEditorPropTypes } from '../../shared/models/editorModels';

function FormLabelsEditorComponent(props: FormLabelsEditorPropTypes) {
    const { sections } = props.selectedForm;

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            props.setLabelValues(setInitialLabelValues());
        }

        return () => {
            isMounted = false;
        };
    }, []);

    function setInitialLabelValues() {
        if (sections && Array.isArray(sections) && sections[0]) {
            const { columns } = sections[0];
            let labels: any = undefined;

            for (const column of columns) {
                const { label, mappingField, columnId } = column;

                if (columnId && label) {
                    if (!labels) {
                        labels = {};
                    }

                    labels[columnId] = {};
                    labels[columnId] = label;
                }
            }

            return labels;
        }

        return undefined;
    }

    function onValueChange(event, columnId, langKey) {
        if (columnId && langKey) {
            const labels = {
                ...props.labelValues,
                [columnId]: {
                    ...props.labelValues[columnId],
                    [langKey]: event.target.value,
                },
            };

            props.setLabelValues(labels);
        }
    }

    if (sections && Array.isArray(sections) && sections[0]) {
        const { columns } = sections[0];

        if (
            columns &&
            Array.isArray(columns) &&
            columns.length > 0 &&
            props.languages &&
            Array.isArray(props.languages)
        ) {
            return (
                <>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-row">
                                    <h5 className="mt-2 mb-1">{`Selected Custom Collection - ${props.selectedForm.customCollectionName}`}</h5>
                                </div>
                                {columns.map((column, columnIndex) => {
                                    const { label, mappingField, columnId, compType } = column;

                                    if (compType !== 'recaptcha') {
                                        return (
                                            <div
                                                className="form-row"
                                                key={`from-row-label-${columnId}`}
                                            >
                                                {props.languages.map((lang, langIndex) => {
                                                    const { language, langKey } = lang;

                                                    return (
                                                        <div
                                                            className="form-group col"
                                                            key={`from-row-label-${columnId}-${langKey}`}
                                                        >
                                                            <label htmlFor={mappingField}>
                                                                {`${label[langKey]} - ${language}`}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={`${label[langKey]} - ${language}`}
                                                                id={mappingField}
                                                                name={`${langKey}-${mappingField}`}
                                                                value={
                                                                    (props.labelValues &&
                                                                        props.labelValues[
                                                                            columnId
                                                                        ] &&
                                                                        props.labelValues[columnId][
                                                                            langKey
                                                                        ]) ||
                                                                    ''
                                                                }
                                                                onChange={(event) => {
                                                                    onValueChange(
                                                                        event,
                                                                        columnId,
                                                                        langKey
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }

                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        return <></>;
    }

    return <></>;
}

export default FormLabelsEditorComponent;
