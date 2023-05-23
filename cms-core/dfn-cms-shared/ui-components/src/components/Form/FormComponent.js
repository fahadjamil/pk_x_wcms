import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import FastestValidator from 'fastest-validator';
import { formComponentsDataTypeMappings, formComponentsMapping } from './formComponentsMapping';

const FormRow = styled.div`
    ${(props) => {}}
`;

const FormGroup = styled.div`
    ${(props) => {}}
`;

const GenerateForm = (props) => {
    const {
        section,
        dbName,
        commonConfigs,
        disableSubmitButton,
        validationErrors,
        recaptchaSiteKey,
        recaptchaRef,
        formData,
    } = props;

    // const [formData, setFormData] = useState(props.formData);

    // useEffect(() => {
    //     let isMounted = true;

    //     if (isMounted) {
    //         setFormData(props.formData);
    //     }

    //     return () => {
    //         isMounted = false;
    //     };
    // }, [props.formData]);

    function handleValueChanges(event) {
        props.handleValueChanges(event);
    }

    if (section && props.selectedLanguage) {
        const { columns, sectionStyles } = section;

        return (
            <FormRow className={sectionStyles ? sectionStyles.classes || '' : ''}>
                {columns &&
                    columns.map((column, columnIndex) => {
                        const {
                            columnId,
                            compType,
                            label,
                            columnStyles,
                            activeStatus,
                            mappingField,
                            settings,
                            uiProperties,
                        } = column;
                        const FormComponent = formComponentsMapping[compType];

                        const errors =
                            validationErrors &&
                            validationErrors.find((error) => {
                                return error.field == mappingField;
                            });

                        if (activeStatus && label && FormComponent) {
                            return (
                                <FormGroup
                                    className={columnStyles ? columnStyles.classes || '' : ''}
                                    key={`form-component-form-group-${columnId}`}
                                >
                                    <FormComponent
                                        id={mappingField}
                                        value={formData ? formData[mappingField] : undefined}
                                        label={label[props.selectedLanguage.langKey] || ''}
                                        settings={(settings && settings.validations) || undefined}
                                        uiProperties={uiProperties}
                                        disableSubmitButton={disableSubmitButton}
                                        dbName={dbName}
                                        recaptchaSiteKey={recaptchaSiteKey}
                                        validationErrors={errors}
                                        commonConfigs={commonConfigs}
                                        recaptchaRef={recaptchaRef}
                                        selectedLanguage={props.selectedLanguage}
                                        handleValueChanges={handleValueChanges}
                                        handleRichTextValueChanges={
                                            props.handleRichTextValueChanges
                                        }
                                        handleFileUpload={props.handleFileUpload}
                                        handleDatePickerValueChanges={
                                            props.handleDatePickerValueChanges
                                        }
                                        resetForm={props.resetForm}
                                        handleNumberCmpValueChanges={
                                            props.handleNumberCmpValueChanges
                                        }
                                        handleGoogleRecaptchaValueChanges={
                                            props.handleGoogleRecaptchaValueChanges
                                        }
                                    />
                                </FormGroup>
                            );
                        }

                        return null;
                    })}
            </FormRow>
        );
    }

    return null;
};

export const FormComponent = React.memo((props) => {
    const { commonConfigs, data, dbName, lang } = props;
    const [selectedForm, setSelectedForm] = useState(props.selectedForm);
    const [formData, setFormData] = useState(undefined);
    const [responseData, setResponseData] = useState(undefined);
    const [disableSubmitButton, setBisableSubmitButton] = useState(false);
    const [validationSchemas, setValidationSchemas] = useState(undefined);
    const [validationErrors, setValidationErrors] = useState(undefined);
    const [isVerified, setIsVerified] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('');
    const recaptchaRef = useRef();

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            if (!props.selectedForm && !selectedForm) {
                getSelectedFormDocument();
            }

            if (recaptchaSiteKey === '') {
                if (commonConfigs) {
                    if (!commonConfigs.isPreview) {
                        getRecaptchaSiteKey();
                    }
                }
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setFormValidationSchema();
        }

        return () => {
            isMounted = false;
        };
    }, [selectedForm]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            if (props.selectedForm) {
                setSelectedForm(props.selectedForm);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [props.selectedForm]);

    function getRecaptchaSiteKey() {
        Axios.get('/api/site/getValidationKey', {})
            .then((result) => {
                const { data, status } = result;

                if (status === 200 && data) {
                    if (data.status === 'success' && data.key) {
                        setRecaptchaSiteKey(data.key);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getSelectedFormDocument() {
        if (data) {
            const { settings } = data;

            if (settings && settings.collection && settings.collection.value) {
                const httpHeaders = {
                    headers: {},
                    params: {
                        collectionName: 'forms',
                        searchId: settings.collection.value,
                    },
                };

                if (commonConfigs) {
                    if (commonConfigs.isPreview) {
                        httpHeaders.params.dbName = dbName;
                    } else {
                        httpHeaders.params.nameSpace = dbName;
                    }
                } else {
                    httpHeaders.params.dbName = dbName;
                }

                Axios.get('/api/cms/getSingleDocumentById', httpHeaders)
                    .then((result) => {
                        const { data, status } = result;

                        if (status === 200 && data) {
                            setSelectedForm(data);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }

    function setFormValidationSchema() {
        if (selectedForm && lang) {
            const { sections } = selectedForm;

            if (sections.length > 0) {
                let schema = {};
                const { columns } = sections[0];

                for (const column of columns) {
                    let messages = {};
                    const { mappingField, compType, settings, label, activeStatus } = column;

                    if (mappingField && compType && settings && activeStatus) {
                        const { validations } = settings;

                        if (validations) {
                            const { required, min, max } = validations;

                            if (
                                formComponentsDataTypeMappings[compType] &&
                                formComponentsDataTypeMappings[compType] === 'string'
                            ) {
                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        type: 'string',
                                        pattern: /^[A-Za-z0-9\.\ \-\_\/\?\,\'"]*$/gm,
                                    },
                                };

                                messages = {
                                    ...messages,
                                    stringPattern: `Invalid character found. The ${
                                        label[lang.langKey]
                                    } field can't contain any of the following characters. <>\\:;*+()[]{}!@#$%&=~\`^`,
                                };

                                if (required) {
                                    messages = {
                                        ...messages,
                                        string: `The ${label[lang.langKey]} field is required.`,
                                    };
                                } else {
                                    schema = {
                                        ...schema,
                                        [mappingField]: {
                                            ...schema[mappingField],
                                            optional: true,
                                        },
                                    };
                                }

                                if (min && min !== '0') {
                                    schema = {
                                        ...schema,
                                        [mappingField]: {
                                            ...schema[mappingField],
                                            min: parseInt(min),
                                        },
                                    };

                                    messages = {
                                        ...messages,
                                        stringMin: `The ${
                                            label[lang.langKey]
                                        } field length must be greater than or equal to ${min} characters long.`,
                                    };
                                }

                                if (max && max !== '0') {
                                    schema = {
                                        ...schema,
                                        [mappingField]: {
                                            ...schema[mappingField],
                                            max: parseInt(max),
                                        },
                                    };

                                    messages = {
                                        ...messages,
                                        stringMax: `The ${
                                            label[lang.langKey]
                                        } field length must be less than or equal to ${max} characters long.`,
                                    };
                                }

                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        ...schema[mappingField],
                                        messages: messages,
                                    },
                                };
                            }

                            if (
                                formComponentsDataTypeMappings[compType] &&
                                formComponentsDataTypeMappings[compType] === 'number'
                            ) {
                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        type: 'number',
                                        optional: required ? false : required,
                                    },
                                };

                                if (required) {
                                    messages = {
                                        ...messages,
                                        number: `The ${label[lang.langKey]} field is required.`,
                                    };
                                }

                                if (min && min !== '0') {
                                    schema = {
                                        ...schema,
                                        [mappingField]: {
                                            ...schema[mappingField],
                                            min: parseInt(min),
                                        },
                                    };

                                    messages = {
                                        ...messages,
                                        numberMin: `The ${
                                            label[lang.langKey]
                                        } field must be greater than or equal to ${min}.`,
                                    };
                                }

                                if (max && max !== '0') {
                                    schema = {
                                        ...schema,
                                        [mappingField]: {
                                            ...schema[mappingField],
                                            max: parseInt(max),
                                        },
                                    };

                                    messages = {
                                        ...messages,
                                        numberMax: `The ${
                                            label[lang.langKey]
                                        } field must be less than or equal to ${max}.`,
                                    };
                                }

                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        ...schema[mappingField],
                                        messages: messages,
                                    },
                                };
                            }

                            if (
                                formComponentsDataTypeMappings[compType] &&
                                formComponentsDataTypeMappings[compType] === 'email'
                            ) {
                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        type: 'email',
                                        optional: required ? false : required,
                                    },
                                };

                                messages = {
                                    ...messages,
                                    email: `The ${
                                        label[lang.langKey]
                                    } field must be a valid e mail.`,
                                };

                                if (required) {
                                    messages = {
                                        ...messages,
                                        emailEmpty: `The ${label[lang.langKey]} field is required.`,
                                    };
                                }

                                if (min && min !== '0') {
                                    schema = {
                                        ...schema,
                                        [mappingField]: {
                                            ...schema[mappingField],
                                            min: parseInt(min),
                                        },
                                    };

                                    messages = {
                                        ...messages,
                                        emailMin: `The ${
                                            label[lang.langKey]
                                        } field must be greater than or equal to ${min}.`,
                                    };
                                }

                                if (max && max !== '0') {
                                    schema = {
                                        ...schema,
                                        [mappingField]: {
                                            ...schema[mappingField],
                                            max: parseInt(max),
                                        },
                                    };

                                    messages = {
                                        ...messages,
                                        emailMax: `The ${
                                            label[lang.langKey]
                                        } field must be less than or equal to ${max}.`,
                                    };
                                }

                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        ...schema[mappingField],
                                        messages: messages,
                                    },
                                };
                            }

                            if (
                                formComponentsDataTypeMappings[compType] &&
                                formComponentsDataTypeMappings[compType] === 'object'
                            ) {
                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        type: 'object',
                                        optional: required ? false : required,
                                    },
                                };

                                if (required) {
                                    messages = {
                                        ...messages,
                                        object: `The ${label[lang.langKey]} field is required.`,
                                    };
                                }

                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        ...schema[mappingField],
                                        messages: messages,
                                    },
                                };
                            }

                            if (
                                formComponentsDataTypeMappings[compType] &&
                                formComponentsDataTypeMappings[compType] === 'date'
                            ) {
                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        type: 'date',
                                        optional: required ? false : required,
                                    },
                                };

                                if (required) {
                                    messages = {
                                        ...messages,
                                        date: `The ${label[lang.langKey]} field is required.`,
                                    };
                                }

                                schema = {
                                    ...schema,
                                    [mappingField]: {
                                        ...schema[mappingField],
                                        messages: messages,
                                    },
                                };
                            }
                        }
                    }
                }

                setValidationSchemas(schema);
            }
        }
    }

    function handleOnSubmit(event) {
        event.preventDefault();

        //TODO: Need to use seperate URL conditionaly for forms which having disabled recaptcha widget
        if (isVerified && recaptchaToken != '') {
            if (commonConfigs) {
                if (formData && selectedForm && lang) {
                    const validator = new FastestValidator();
                    const check = validator.compile(validationSchemas);
                    const validity = check(formData);

                    if (validity === true) {
                        setBisableSubmitButton(true);

                        const { customCollection, title } = selectedForm;
                        const httpHeaders = {};
                        const FieldsData = {
                            fieldData: {
                                [lang.langKey]: formData,
                            },
                            workflowState: {
                                collectionName: `${customCollection}-drafts`,
                                fileTitle: title,
                                fileType: 'Forms',
                                state: 'initial',
                                comment: 'Record added',
                                createdBy: '',
                                modifiedBy: '',
                            },
                            active: true,
                        };

                        Axios.post(
                            '/api/customCollections/add-record',
                            {
                                nameSpace: dbName,
                                collectionName: `${customCollection}-drafts`,
                                data: FieldsData,
                                token: recaptchaToken,
                            },
                            httpHeaders
                        )
                            .then((response) => {
                                const { status, data } = response;

                                if (status === 200 && data) {
                                    const { result } = data;

                                    if (result && result.n == 1 && result.ok == 1) {
                                        setBisableSubmitButton(false);
                                        setFormData(undefined);
                                        setValidationErrors(undefined);
                                        setIsVerified(false);

                                        if (
                                            recaptchaRef &&
                                            recaptchaRef.current &&
                                            recaptchaRef.current.reset
                                        ) {
                                            recaptchaRef.current.reset();
                                        }

                                        setResponseData({
                                            status: 'success',
                                            msg: 'Record added successfully',
                                        });

                                        setTimeout(function () {
                                            setResponseData(undefined);
                                        }, 3000);
                                    } else {
                                        if (data.status && data.msg) {
                                            setResponseData(data);

                                            setTimeout(function () {
                                                setResponseData(undefined);
                                            }, 3000);
                                        } else {
                                            setResponseData({
                                                status: 'failed',
                                                msg: 'Failed to add record',
                                            });

                                            setTimeout(function () {
                                                setResponseData(undefined);
                                            }, 3000);
                                        }
                                    }
                                }
                            })
                            .catch((err) => {
                                console.log('error', err);
                            });
                    } else {
                        setValidationErrors(validity);
                    }
                }
            }
        } else {
            setResponseData({
                status: 'failed',
                msg: 'Recaptcha validation failed',
            });

            setTimeout(function () {
                setResponseData(undefined);
            }, 3000);
        }
    }

    function handleValueChanges(event) {
        if (commonConfigs) {
            const name = event.target.name;
            const value = event.target.value;

            setFormData({
                ...formData,
                [name]: value,
            });
        }
    }

    function handleNumberCmpValueChanges(event) {
        if (commonConfigs) {
            const name = event.target.name;
            const value = parseInt(event.target.value);

            setFormData({
                ...formData,
                [name]: value,
            });
        }
    }

    function handleFileUpload(data, key) {
        if (commonConfigs) {
            const value = data.filename;

            setFormData({
                ...formData,
                [key]: value,
            });
        }
    }

    function handleRichTextValueChanges(editor, key) {
        if (commonConfigs) {
            const value = editor.getData();

            setFormData({
                ...formData,
                [key]: value,
            });
        }
    }

    function handleDatePickerValueChanges(date, key) {
        if (commonConfigs) {
            if (date instanceof Date) {
                setFormData({
                    ...formData,
                    [key]: date,
                });
            } else {
                setFormData({
                    ...formData,
                    [key]: new Date(date),
                });
            }
        }
    }

    function handleGoogleRecaptchaValueChanges(value, key) {
        if (commonConfigs) {
            setIsVerified(true);
            setRecaptchaToken(value);
        }
    }

    function resetForm() {
        setFormData(undefined);
        setValidationErrors(undefined);
        setIsVerified(false);

        if (recaptchaRef && recaptchaRef.current && recaptchaRef.current.reset) {
            recaptchaRef.current.reset();
        }
    }

    if (selectedForm && lang) {
        const { sections } = selectedForm;

        if (sections.length > 0) {
            return (
                <React.Fragment>
                    {responseData && responseData.status === 'success' && (
                        <div className="row">
                            <div className="col-md-12">
                                <div
                                    className="alert alert-success alert-dismissible fade show mt-2"
                                    role="alert"
                                >
                                    <strong>Success</strong> {responseData.msg}
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="alert"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {responseData && responseData.status === 'failed' && (
                        <div className="row">
                            <div className="col-md-12">
                                <div
                                    className="alert alert-danger alert-dismissible fade show mt-2"
                                    role="alert"
                                >
                                    <strong>Failed</strong> {responseData.msg}
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="alert"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleOnSubmit}>
                        <GenerateForm
                            formData={formData}
                            section={sections[0]}
                            commonConfigs={commonConfigs}
                            selectedLanguage={lang}
                            disableSubmitButton={disableSubmitButton}
                            dbName={dbName}
                            recaptchaSiteKey={recaptchaSiteKey}
                            validationErrors={validationErrors}
                            recaptchaRef={recaptchaRef}
                            handleValueChanges={handleValueChanges}
                            handleRichTextValueChanges={handleRichTextValueChanges}
                            handleFileUpload={handleFileUpload}
                            handleDatePickerValueChanges={handleDatePickerValueChanges}
                            resetForm={resetForm}
                            setValidationSchemas={setValidationSchemas}
                            handleNumberCmpValueChanges={handleNumberCmpValueChanges}
                            handleGoogleRecaptchaValueChanges={handleGoogleRecaptchaValueChanges}
                        ></GenerateForm>
                    </form>
                </React.Fragment>
            );
        }

        return null;
    }

    return null;
});
