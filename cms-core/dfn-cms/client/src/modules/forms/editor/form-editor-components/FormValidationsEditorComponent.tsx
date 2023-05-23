import React, { useEffect } from 'react';
import FormValidationsChangeCollection from './FormValidationsChangeCollection';
import FormValidationsChangeOptions from './FormValidationsChangeOptions';

function FormValidationsEditorComponent(props) {
    const { sections } = props.selectedForm;
    const validationsList: any = [
        {
            key: 'required',
            value: 'Is Required',
        },
        {
            key: 'islocalized',
            value: 'Is Localized',
        },
        {
            key: 'min',
            value: 'Min',
        },
        {
            key: 'max',
            value: 'Max',
        },
        {
            key: 'ext',
            value: 'Extensions',
        },
        {
            key: 'itemList',
            value: 'Options',
        },
        {
            key: 'selectedCollection',
            value: 'Custom Collection',
        },
    ];

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            props.setValidations(setInitialValidations());
        }

        return () => {
            isMounted = false;
        };
    }, []);

    function setInitialValidations() {
        if (sections && Array.isArray(sections) && sections[0]) {
            const { columns } = sections[0];
            let validations: any = undefined;

            for (const column of columns) {
                const { label, mappingField, columnId, settings } = column;

                if (columnId && settings && settings.validations) {
                    if (!validations) {
                        validations = {};
                    }

                    validations[columnId] = {};
                    validations[columnId] = settings.validations;
                }
            }

            return validations;
        }

        return undefined;
    }

    function onValueChange(event, columnId, validation) {
        if (columnId && validation) {
            const validations = {
                ...props.validations,
                [columnId]: {
                    ...props.validations[columnId],
                    [validation]: event.target.value,
                },
            };

            props.setValidations(validations);
        }
    }

    function toggleSwitchOnValueChange(event, columnId, validation) {
        if (columnId && validation) {
            const validations = {
                ...props.validations,
                [columnId]: {
                    ...props.validations[columnId],
                    [validation]: event.target.checked,
                },
            };

            props.setValidations(validations);
        }
    }

    function validationFieldTypeMappings(validation, id, value, columnId) {
        let field: any = null;

        switch (validation) {
            case 'required':
            case 'islocalized':
                field = (
                    <div className="custom-control custom-switch">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id={id}
                            name={id}
                            checked={value || false}
                            onChange={(event) => {
                                toggleSwitchOnValueChange(event, columnId, validation);
                            }}
                        ></input>
                        <label className="custom-control-label" htmlFor={id}></label>
                    </div>
                );
                break;
            case 'min':
            case 'max':
                field = (
                    <>
                        <input
                            type="number"
                            className="form-control"
                            placeholder={validation}
                            id={id}
                            name={id}
                            value={value || ''}
                            onChange={(event) => {
                                onValueChange(event, columnId, validation);
                            }}
                        />
                    </>
                );
                break;
            case 'ext':
                field = (
                    <>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={validation}
                            id={id}
                            name={id}
                            value={value || ''}
                            onChange={(event) => {
                                onValueChange(event, columnId, validation);
                            }}
                        />
                    </>
                );
                break;
            case 'itemList':
                field = (
                    <FormValidationsChangeOptions
                        setValidations={props.setValidations}
                        validations={props.validations}
                        validation={validation}
                        id={id}
                        value={value}
                        columnId={columnId}
                    ></FormValidationsChangeOptions>
                );
                break;
            case 'selectedCollection':
                field = (
                    <FormValidationsChangeCollection
                        setValidations={props.setValidations}
                        validations={props.validations}
                        validation={validation}
                        id={id}
                        value={value}
                        columnId={columnId}
                    ></FormValidationsChangeCollection>
                );
                break;
            default:
                field = <></>;
                break;
        }

        return field;
    }

    function generateTableHeaders() {
        return (
            <>
                {validationsList.map((validation, validationKey) => {
                    const { key, value } = validation;

                    return (
                        <th key={`form-validations-table-header-data-${key}-${validationKey}`}>
                            {value}
                        </th>
                    );
                })}
            </>
        );
    }

    function generateTableBody(label, settings, columnId, mappingField) {
        if (settings && settings.validations) {
            return (
                <>
                    <td>{label[props.languages[0].langKey]}</td>
                    {validationsList.map((validation, validationIndex) => {
                        const { key, value } = validation;

                        if (Object.prototype.hasOwnProperty.call(settings.validations, key)) {
                            return (
                                <td
                                    key={`form-validations-table-body-data-${key}-${validationIndex}`}
                                >
                                    {validationFieldTypeMappings(
                                        key,
                                        `${mappingField}-${key}`,
                                        props.validations &&
                                            props.validations[columnId] &&
                                            props.validations[columnId][key],
                                        columnId
                                    )}
                                </td>
                            );
                        } else {
                            return (
                                <td
                                    key={`form-validations-table-body-data-${key}-${validationIndex}`}
                                ></td>
                            );
                        }
                    })}
                </>
            );
        }

        return null;
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
                                <table className="table-borderless table-hover tbl-thm-01 table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {generateTableHeaders()}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {columns.map((column, columnIndex) => {
                                            const { label, mappingField, columnId, settings } =
                                                column;

                                            return (
                                                <tr key={`table-body-${columnId}`}>
                                                    {generateTableBody(
                                                        label,
                                                        settings,
                                                        columnId,
                                                        mappingField
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
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

export default FormValidationsEditorComponent;
