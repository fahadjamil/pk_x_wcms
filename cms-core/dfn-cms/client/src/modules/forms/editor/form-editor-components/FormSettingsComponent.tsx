import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styled from 'styled-components';
import ToggleSwitchComponent from '../../../shared/ui-components/input-fields/toggle-switch-component';
import { FormEditorPropTypes } from '../../shared/models/editorModels';

const FormRow = styled.div`
    border: 1px dashed rgb(213, 218, 223);
    padding: 5px;
    margin-bottom: 5px;
`;

const FormStylesEditor = (props) => {
    const { formColumnStyles } = props;
    const { sections } = props.selectedForm;

    if (sections && Array.isArray(sections) && sections[0]) {
        const { columns } = sections[0];

        if (columns && Array.isArray(columns) && columns.length > 0) {
            return (
                <>
                    {columns.map((column, columnIndex) => {
                        const { label, mappingField, columnId, columnStyles, uiProperties } =
                            column;

                        return (
                            <FormRow className="form-row" key={`from-row-${columnId}`}>
                                <div className="form-group col mb-0">
                                    <label>
                                        <strong> {`${label[props.languages[0].langKey]}`}</strong>
                                    </label>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor={`${mappingField}-form-group-styles`}>
                                                Form Group Styles
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`${label['EN']} - Form Group Styles`}
                                                id={`${mappingField}-form-group-styles`}
                                                name={`${mappingField}-form-group-styles`}
                                                value={
                                                    (formColumnStyles &&
                                                        formColumnStyles[columnId] &&
                                                        formColumnStyles[columnId][
                                                            'form-group-styles'
                                                        ]) ||
                                                    ''
                                                }
                                                onChange={(event) => {
                                                    props.handleFormGroupStylesChanges(
                                                        event,
                                                        columnId
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor={`${mappingField}-form-field-styles`}>
                                                Form Field Styles
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`${label['EN']} - Form Field Styles`}
                                                id={`${mappingField}-form-field-styles`}
                                                name={`${mappingField}-form-field-styles`}
                                                value={
                                                    (formColumnStyles &&
                                                        formColumnStyles[columnId] &&
                                                        formColumnStyles[columnId][
                                                            'form-field-styles'
                                                        ]) ||
                                                    ''
                                                }
                                                onChange={(event) => {
                                                    props.handleFormFieldStylesChanges(
                                                        event,
                                                        columnId
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FormRow>
                        );
                    })}
                </>
            );
        }

        return <></>;
    }

    return <></>;
};

const FormSettingsComponent = forwardRef((props: FormEditorPropTypes, ref): JSX.Element => {
    const [formColumnStyles, setFormColumnStyles] = useState<any>({});

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            const { sections } = props.selectedForm;

            if (sections && sections[0]) {
                const { columns } = sections[0];

                if (columns && columns.length > 0) {
                    let styles = {};

                    for (const column of columns) {
                        const { columnStyles, uiProperties, columnId } = column;

                        if (columnId && columnStyles && uiProperties) {
                            styles[columnId] = {
                                'form-field-styles': uiProperties.field.classes || '',
                                'form-group-styles': columnStyles.classes || '',
                            };
                        }
                    }

                    setFormColumnStyles(styles);
                }
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useImperativeHandle(ref, () => ({
        handleConfirme() {
            if (formColumnStyles) {
                const form = { ...props.selectedForm };
                const { sections } = form;

                if (sections && Array.isArray(sections) && sections[0]) {
                    const { columns } = sections[0];

                    for (const column of columns) {
                        const { columnId } = column;

                        if (formColumnStyles[columnId]) {
                            if (formColumnStyles[columnId]['form-field-styles'] != undefined) {
                                column.uiProperties.field.classes =
                                    formColumnStyles[columnId]['form-field-styles'];
                            }

                            if (formColumnStyles[columnId]['form-group-styles'] != undefined) {
                                column.columnStyles.classes =
                                    formColumnStyles[columnId]['form-group-styles'];
                            }
                        }
                    }
                }

                props.setSelectedForm(form);
            }
        },
    }));

    function handleFormFieldStylesChanges(event, columnId) {
        const styles = { ...formColumnStyles };
        const value = event.target.value;

        setFormColumnStyles({
            ...styles,
            [columnId]: {
                ...styles[columnId],
                'form-field-styles': value,
            },
        });
    }

    function handleFormGroupStylesChanges(event, columnId) {
        const styles = { ...formColumnStyles };
        const value = event.target.value;

        setFormColumnStyles({
            ...styles,
            [columnId]: {
                ...styles[columnId],
                'form-group-styles': value,
            },
        });
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <FormStylesEditor
                        {...props}
                        formColumnStyles={formColumnStyles}
                        handleFormFieldStylesChanges={handleFormFieldStylesChanges}
                        handleFormGroupStylesChanges={handleFormGroupStylesChanges}
                    ></FormStylesEditor>
                </div>
            </div>
        </div>
    );
});

export default FormSettingsComponent;
