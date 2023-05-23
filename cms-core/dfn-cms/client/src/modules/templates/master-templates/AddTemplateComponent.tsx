import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';
import MasterRepository from '../../shared/repository/MasterRepository';
import { getInitialWorkflowState } from '../../shared/utils/WorkflowUtils';
import validator from '../../shared/utils/Validator';
import ValidationMessageComponent from '../../shared/ui-components/validation/ValidationMessageComponent';

const templateTitleValidatorKey = 'templateTitleValidator';

const schema = {
    $$root: true,
    type: 'string',
    min: 2,
    messages: {
        string: 'Template title must be string',
        stringMin: 'Template title must be greater than or equal to 2 characters long',
    },
};

function AddTemplateComponent(props) {
    const [targetDatabase, setTargetDatabase] = useState(props.website);
    const [templateTitle, setTemplateTitle] = useState('');
    const [validationErrors, setValidationErrors] = useState<any>([]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            if (props.isDuplicateTemplate && props.selectedTemplateName) {
                const title = `${props.selectedTemplateName} copy`;
                setTemplateTitle(title);
            }
            validator.setValidatorSchema(templateTitleValidatorKey, schema);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    function addNewTemplate() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        const today = new Date();

        Axios.post(
            '/api/templates/create',
            {
                title: templateTitle,
                dbName: targetDatabase,
                header: { section: [] },
                footer: { section: [] },
                templateData: [],
                lang: '',
                created_date: today.toLocaleString(),
                updated_date: today.toLocaleString(),
                version: 0,
                userpermissons: '',
                createdBy: MasterRepository.getCurrentUser().docId,
                workflowState: getInitialWorkflowState('templates', templateTitle, 'Template'),
            },
            httpHeaders
        )
            .then((response) => {
                props.onSubmitSuccess();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function duplicateTemplate() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        const today = new Date();

        Axios.post(
            '/api/templates/duplicate',
            {
                templateTitle: templateTitle,
                templateId: props.selectedTemplateId,
                dbName: targetDatabase,
                createdDate: today.toLocaleString(),
                updatedDate: today.toLocaleString(),
                createdBy: MasterRepository.getCurrentUser().docId,
                templateWorkflow: getInitialWorkflowState(
                    'templates',
                    templateTitle,
                    'Template',
                    `Duplicate template from ${props.selectedTemplateName}`
                ),
            },
            httpHeaders
        )
            .then((response) => {
                const { status, data } = response;

                if (status == 200) {
                    props.onSubmitSuccess();
                    props.setResponseData(data);

                    setTimeout(function () {
                        props.setResponseData({ status: '', msg: '' });
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();

        const [isValid, error] = validator.validateData(templateTitleValidatorKey, templateTitle);

        if (isValid) {
            if (props.isDuplicateTemplate) {
                duplicateTemplate();
            } else {
                addNewTemplate();
            }
        } else {
            setValidationErrors(error);
        }
    }

    return (
        <>
            <div className="center-block-item">
                <h2>{`${props.isDuplicateTemplate ? 'Duplicate' : 'Create new'} template`}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="template">Add template title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="template"
                            placeholder="Enter Templete Title"
                            value={templateTitle}
                            onChange={(e) => setTemplateTitle(e.target.value)}
                        />
                        <ValidationMessageComponent validationErrors={validationErrors} />
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            props.onCancel();
                        }}
                    >
                        Back
                    </button>
                    &nbsp;
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isEnable('/api/templates/create')}
                    >
                        {`${props.isDuplicateTemplate ? 'Duplicate' : 'Create'}`}
                    </button>
                </form>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        page: state.pageName.page,
    };
};

export default connect(mapStateToProps)(AddTemplateComponent);
