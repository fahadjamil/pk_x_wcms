import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getInitialWorkflowState } from '../../shared/utils/WorkflowUtils';
import validator from '../../shared/utils/Validator';
import ValidationMessageComponent from '../../shared/ui-components/validation/ValidationMessageComponent';

interface AddPageComponentModel {
    dbName: string;
    onSubmitSuccess: any;
    isDuplicatePage: boolean;
    duplicatePageTitle: string;
    duplicatePageId: string;
    pageNamesList: string[];
    onCancel: any;
}

const pageNameValidatorKey = 'pageNameValidator';

const schema = {
    pageName: {
        type: 'string',
        min: 2,
        messages: {
            string: 'Page name must be string',
            stringMin: 'Page name must be greater than or equal to 2 characters long',
        },
    },
    pageNames: {
        type: 'array',
        // unique: true,
        // items: {
        //     type: 'string',
        // },
        // messages: {
        //     arrayUnique: 'Page name already exists!',
        // },
    },
};

function AddPageComponent(props: AddPageComponentModel) {
    const { pageNamesList } = props;
    const [pageTitle, setPageTitle] = useState('');
    const [templates, setTemplates] = useState([]);
    const [validationErrors, setValidationErrors] = useState<any>([]);
    const [showPopUp, setShowPopUp] = useState(true);
    const [selectedMasterTemplate, setSelectedMasterTemplate] = useState<any>({});

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllTemplates();

            if (props.isDuplicatePage && props.duplicatePageTitle) {
                const title = `${props.duplicatePageTitle} copy`;
                setShowPopUp(false);
                setPageTitle(title);
            }
            validator.setValidatorSchema(pageNameValidatorKey, schema);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const callbackRef = useCallback((inputElement) => {
        if (inputElement) {
            inputElement.focus();
        }
    }, []);

    function getAllTemplates() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.dbName,
        //     },
        // };

        Axios.get('/api/templates/approved', httpHeaders)
            .then((result) => {
                setTemplates(result.data);
                setSelectedMasterTemplate(result.data[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();

        const tempPageNamesList = [...pageNamesList];
        tempPageNamesList.push(pageTitle);

        const submitData = { pageName: pageTitle, pageNames: tempPageNamesList };

        const [isValid, error] = validator.validateData(pageNameValidatorKey, submitData);

        if (isValid) {
            if (props.isDuplicatePage && props.duplicatePageId) {
                duplicatePage();
            } else {
                createNewPage();
            }
        } else {
            setValidationErrors(error);
        }
    }

    function createNewPage() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/pages/create',
            {
                pageName: pageTitle,
                path: '',
                dbName: props.dbName,
                workflowState: getInitialWorkflowState('pages', pageTitle, 'Page'),
                pageData: [],
                pageInfo: {},
                section: [],
                version: 0,
                lang: '',
                userPermissons: '',
                masterTemplate: selectedMasterTemplate?._id,
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

    function duplicatePage() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/pages/duplicate',
            {
                pageId: props.duplicatePageId,
                dbName: props.dbName,
                pageName: pageTitle,
                masterTemplate: selectedMasterTemplate?._id,
                pageWorkflow: getInitialWorkflowState(
                    'pages',
                    pageTitle,
                    'Page',
                    `Duplicate page from ${props.duplicatePageTitle}`
                ),
            },
            httpHeaders
        )
            .then((res) => {
                if (res && res.data) {
                    props.onSubmitSuccess();
                }
            })
            .catch((err) => {
                console.log('error', err);
            });
    }

    function handleClose() {
        setShowPopUp(false);
    }

    function getAddPageHeaderTitle() {
        if (props.isDuplicatePage) {
            return 'Duplicate Page';
        } else {
            return 'Create New Page';
        }
    }

    return (
        <>
            <Modal show={showPopUp} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select a Master Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div
                            className="list-group list-template-select"
                            id="list-tab"
                            role="tablist"
                        >
                            {templates.map((templateItem: any, index) => {
                                let active = index === 0 ? ' active' : '';
                                return (
                                    <a
                                        className={'btn btn-primary btn-block' + active}
                                        key={templateItem._id}
                                        data-toggle="list"
                                        role="tab"
                                        onClick={() => setSelectedMasterTemplate(templateItem)}
                                    >
                                        {templateItem.title}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
            <div
                style={{
                    width: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '50px',
                }}
            >
                <h2>{getAddPageHeaderTitle()}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="page">Add Page Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="page"
                            placeholder="Enter Page Name"
                            value={pageTitle}
                            ref={callbackRef}
                            onChange={(e) => setPageTitle(e.target.value)}
                        />
                        <ValidationMessageComponent validationErrors={validationErrors} />
                        <br />
                        {!props.isDuplicatePage && (
                            <>
                                <label htmlFor="template">Selected Template</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="template"
                                    defaultValue={selectedMasterTemplate?.title}
                                    disabled
                                />
                            </>
                        )}
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
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddPageComponent;
