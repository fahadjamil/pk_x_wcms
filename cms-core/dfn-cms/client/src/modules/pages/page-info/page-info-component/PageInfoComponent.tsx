import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Axios from 'axios';
import useForceUpdate from 'use-force-update';
import LanguageModel from '../../../shared/models/LanguageModel';
import PageModel from '../../../shared/models/page-data-models/PageModel';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import validator from '../../../shared/utils/Validator';
import { pageInfoSchema } from '../../PagesValidationSchemas';
import { GetValidationMessages } from '../../PagesUtils';
import errorCodes from '../../../shared/config/ErrorCodes.json';

interface PropType {
    data: PageModel;
    dbName: string;
    isUnlinkedPage: boolean;
    languages: LanguageModel[];
}

const PageInfoComponent = forwardRef((props: PropType, ref) => {
    const initialState: any = {
        pageName: '',
        externalCSS: [''],
        externalJS: [''],
        metaData: {
            applicationName: '',
            author: '',
            description: '',
            viewPort: '',
            keywords: '',
        },
    };
    const { data, dbName, isUnlinkedPage } = props;
    const { pageInfo, pageName, masterTemplate, path, isHomePage, isSearchDisabled } = data;
    const metaInfo: any = pageInfo ? Object.keys(pageInfo) : [];
    const { languages } = props;
    const activePageMetaInfo = metaInfo.length !== 0 ? pageInfo : initialState;
    activePageMetaInfo.pageName = pageName;
    activePageMetaInfo.path = path ? path : '';
    activePageMetaInfo.masterTemplate = masterTemplate ? masterTemplate : '';
    activePageMetaInfo.isHomePage = isHomePage ? isHomePage : false;
    activePageMetaInfo.isSearchDisabled = isSearchDisabled ? isSearchDisabled : false;

    const [pageMetaInfo, setPageMetaInfo] = useState<any>(activePageMetaInfo);
    const [templates, setTemplates] = useState([]);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const forceUpdate = useForceUpdate();
    const pageInfoValidatorKey = 'pageInfoValidator';

    useImperativeHandle(ref, () => ({
        handlePageInfoSubmit() {
            if (props.data) {
                const {
                    pageName,
                    path,
                    metaData,
                    masterTemplate,
                    externalJS,
                    externalCSS,
                } = pageMetaInfo;

                const submitData = {
                    pageName: pageName,
                    masterTemplate: masterTemplate,
                    path: path,
                    externalCSS: externalCSS,
                    externalJS: externalJS,
                    applicationName: metaData.applicationName,
                    author: metaData.author,
                    description: metaData.description,
                    keywords: metaData.keywords,
                    viewPort: metaData.viewPort,
                };

                const [isValid, error] = validator.validateData(pageInfoValidatorKey, submitData);

                if (isValid) {
                    return { ...pageMetaInfo, status: 'valid' };
                } else {
                    const updatedError = {};

                    error.forEach((errorItem, errorIndex) => {
                        const { field, message } = errorItem;
                        updatedError[field] = [];
                        updatedError[field].push(message);
                    });

                    setValidationErrors(updatedError);

                    return {
                        status: 'invalid',
                        msg: 'Please fix the validation errors in the page info.',
                    };
                }
            }

            return { status: 'empty' };
        },
    }));

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllTemplates();
            validator.setValidatorSchema(pageInfoValidatorKey, pageInfoSchema);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const handleTopLevelValueChanges = (event: any) => {
        event.preventDefault();
        let key: any = event.target.name;
        let value: any = event.target.value;

        setPageMetaInfo((prevState) => {
            return { ...prevState, [key]: value };
        });
    };

    const handlePageTitleValueChange = (event: any, lang: LanguageModel) => {
        event.preventDefault();
        let value: any = event.target.value;
        const langKey = lang.langKey.toLowerCase();

        setPageMetaInfo((prevState) => {
            let { pageTitle, ...pageInfo } = prevState;

            if (pageTitle === undefined) {
                pageTitle = { [langKey]: value };
            } else {
                pageTitle[langKey] = value;
            }

            return { ...pageInfo, pageTitle };
        });
    };

    const handleIsHomPageValueChange = (event: any) => {
        let key: any = event.target.name;
        let value: any = event.target.checked;

        setPageMetaInfo((prevState) => {
            return { ...prevState, [key]: value };
        });
    };

    const handleErrorCodeValueChange = (event: any) => {
        let key: any = event.target.name;
        let value: any = event.target.value;

        setPageMetaInfo((prevState) => {
            return { ...prevState, [key]: value, path: value };
        });
    };

    const handleSubLevelValueChanges = (event: any, category: any) => {
        event.preventDefault();
        let key: any = event.target.name;
        let value: any = event.target.value;

        setPageMetaInfo((prevState) => {
            return {
                ...prevState,
                ...{
                    [category]: {
                        ...prevState[category],
                        [key]: value,
                    },
                },
            };
        });
    };

    const handleArrayFieldValueChanges = (event: any, index: number) => {
        event.preventDefault();
        let key: any = event.target.name;
        let value: any = event.target.value;

        setPageMetaInfo((prevState) => {
            let state = prevState;

            state[key].splice(index, 1, value);
            return state;
        });
        forceUpdate();
    };

    const addNewCSSItem = (index: number) => {
        setPageMetaInfo((prevState) => {
            let state = prevState;
            state['externalCSS'].splice(index + 1, 0, '');
            return state;
        });
        forceUpdate();
    };

    const addNewJSItem = (index: number) => {
        setPageMetaInfo((prevState) => {
            let state = prevState;
            state['externalJS'].splice(index + 1, 0, '');
            return state;
        });
        forceUpdate();
    };

    const getTextBoxWithAddButton = (
        label: string,
        id: string,
        name: string,
        addNewItem: any,
        index: number
    ) => {
        return (
            <>
                <div className="form-group col-md-11">
                    <label htmlFor={id}>{label}</label>
                    <input
                        type="text"
                        className="form-control"
                        id={id}
                        placeholder={label}
                        name={name}
                        value={pageMetaInfo[name][index]}
                        onChange={(event) => {
                            handleArrayFieldValueChanges(event, index);
                        }}
                    />
                    <GetValidationMessages
                        validationErrors={
                            validationErrors && validationErrors[`${name}[${index}]`]
                                ? validationErrors[`${name}[${index}]`]
                                : []
                        }
                    />
                </div>
                <div className="form-group col-md-1 d-flex align-items-end">
                    <span
                        className="btn btn-primary btn-block"
                        onClick={() => {
                            addNewItem(index);
                        }}
                    >
                        <svg
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                            className="bi bi-plus"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
                            />
                            <path
                                fillRule="evenodd"
                                d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
                            />
                        </svg>
                    </span>
                </div>
            </>
        );
    };

    const generateExternalCssFields = () => {
        let fieldListLength: number = pageMetaInfo.externalCSS.length;
        const elements: any = [];

        if (fieldListLength === 0) {
            fieldListLength = 1;
        }

        for (let index = 0; index < fieldListLength; index++) {
            elements.push(
                <React.Fragment key={`css-${index}`}>
                    {getTextBoxWithAddButton(
                        `External CSS ${index + 1}`,
                        `externalCSS${index + 1}`,
                        'externalCSS',
                        addNewCSSItem,
                        index
                    )}
                </React.Fragment>
            );
        }

        return elements;
    };

    const generateExternalJsFields = () => {
        let fieldListLength: number = pageMetaInfo.externalJS.length;
        const elements: any = [];

        if (fieldListLength === 0) {
            fieldListLength = 1;
        }

        for (let index = 0; index < fieldListLength; index++) {
            elements.push(
                <React.Fragment key={`js-${index}`}>
                    {getTextBoxWithAddButton(
                        `External JS ${index + 1}`,
                        `externalJS${index + 1}`,
                        'externalJS',
                        addNewJSItem,
                        index
                    )}
                </React.Fragment>
            );
        }

        return elements;
    };

    function getAllTemplates() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: dbName,
        //     },
        // };

        Axios.get('/api/templates', httpHeaders)
            .then((result) => {
                setTemplates(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getErrorCodeSlectedValue() {
        if (pageMetaInfo.isHomePage) {
            return '';
        } else if (pageMetaInfo.errorCode) {
            return pageMetaInfo.errorCode;
        } else {
            return '';
        }
    }

    function isErrorMappedPage() {
        if (pageMetaInfo.errorCode && pageMetaInfo.errorCode !== '') {
            return true;
        } else {
            return false;
        }
    }

    const handleIsDisabledSearchValueChange = (event: any) => {
        let key: any = event.target.name;
        let value: any = event.target.checked;

        setPageMetaInfo((prevState) => {
            return { ...prevState, [key]: value };
        });
    };

    return (
        <div className="col-md">
            <h3>Page Info</h3>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isHomePage"
                                    name="isHomePage"
                                    checked={pageMetaInfo.isHomePage}
                                    onChange={(event) => {
                                        handleIsHomPageValueChange(event);
                                    }}
                                />
                                <label className="form-check-label" htmlFor="isHomePage">
                                    Home Page
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isSearchDisabled"
                                    name="isSearchDisabled"
                                    checked={pageMetaInfo.isSearchDisabled}
                                    onChange={(event) => {
                                        handleIsDisabledSearchValueChange(event);
                                    }}
                                />
                                <label className="form-check-label" htmlFor="isSearchDisabled">
                                    Disable Search
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="errorTemplate">Error Code</label>
                                <select
                                    className="form-control"
                                    id="errorTemplate"
                                    value={getErrorCodeSlectedValue()}
                                    name="errorCode"
                                    onChange={(event) => {
                                        if (isUnlinkedPage && !pageMetaInfo.isHomePage) {
                                            handleErrorCodeValueChange(event);
                                        }
                                    }}
                                    disabled={!isUnlinkedPage || pageMetaInfo.isHomePage === true}
                                >
                                    <option value="">None</option>
                                    {errorCodes.errorCodes.map((errorConfig, index) => {
                                        const { error, displayValue } = errorConfig;
                                        return (
                                            <option key={'error-' + error} value={error}>
                                                {displayValue}
                                            </option>
                                        );
                                    })}
                                </select>
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.masterTemplate
                                            ? validationErrors.masterTemplate
                                            : []
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pageName">Page Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="pageName"
                                    placeholder="Page Name"
                                    name="pageName"
                                    value={pageMetaInfo.pageName}
                                    onChange={(event) => {
                                        handleTopLevelValueChanges(event);
                                    }}
                                />
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.pageName ? validationErrors.pageName : []
                                    }
                                />
                            </div>
                            {languages &&
                                languages.map((lang) => {
                                    return (
                                        <div
                                            key={`PageTitleKey${lang.langKey}`}
                                            className="form-group"
                                        >
                                            <label
                                                htmlFor={`pageTitle${lang.langKey.toLowerCase()}`}
                                            >
                                                Page Title {lang.language}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`pageTitle${lang.langKey.toLowerCase()}`}
                                                placeholder={`Page Title ${lang.language}`}
                                                name="pageTitle"
                                                value={
                                                    pageMetaInfo.pageTitle
                                                        ? pageMetaInfo.pageTitle[
                                                              lang.langKey.toLowerCase()
                                                          ]
                                                        : ''
                                                }
                                                onChange={(event) => {
                                                    handlePageTitleValueChange(event, lang);
                                                }}
                                            />
                                            <GetValidationMessages validationErrors={[]} />
                                        </div>
                                    );
                                })}
                            <div className="form-group">
                                <label htmlFor="masterTemplate">Master Template</label>
                                <select
                                    className="form-control"
                                    id="masterTemplate"
                                    value={pageMetaInfo.masterTemplate}
                                    name="masterTemplate"
                                    onChange={(event) => {
                                        handleTopLevelValueChanges(event);
                                    }}
                                >
                                    <option disabled value="">
                                        -- select an option --
                                    </option>
                                    {templates &&
                                        templates.map((template, index) => {
                                            const { _id, title } = template;
                                            return (
                                                <option key={'masterTemplate-' + index} value={_id}>
                                                    {title}
                                                </option>
                                            );
                                        })}
                                </select>
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.masterTemplate
                                            ? validationErrors.masterTemplate
                                            : []
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pagePath">Page Path</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="pagePath"
                                    placeholder={
                                        pageMetaInfo.isHomePage === true ? 'Home Page' : 'Page Path'
                                    }
                                    name="path"
                                    value={
                                        pageMetaInfo.isHomePage === true ? '' : pageMetaInfo.path
                                    }
                                    onChange={(event) => {
                                        if (
                                            isUnlinkedPage &&
                                            !pageMetaInfo.isHomePage &&
                                            !isErrorMappedPage()
                                        ) {
                                            handleTopLevelValueChanges(event);
                                        }
                                    }}
                                    disabled={
                                        !isUnlinkedPage ||
                                        pageMetaInfo.isHomePage === true ||
                                        isErrorMappedPage()
                                    }
                                />
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.path ? validationErrors.path : []
                                    }
                                />
                            </div>
                            <hr />
                            <h5>External CSS</h5>
                            <div className="form-row">
                                {generateExternalCssFields()}
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.externalCSS
                                            ? validationErrors.externalCSS
                                            : []
                                    }
                                />
                            </div>
                            <hr />
                            <h5>External JS</h5>
                            <div className="form-row">
                                {generateExternalJsFields()}
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.externalJS
                                            ? validationErrors.externalJS
                                            : []
                                    }
                                />
                            </div>
                            <hr />
                            <h5>Meta data</h5>
                            <div className="form-group">
                                <label htmlFor="applicationName">Application Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="applicationName"
                                    placeholder="Application Name"
                                    name="applicationName"
                                    value={pageMetaInfo.metaData.applicationName || ''}
                                    onChange={(event) => {
                                        handleSubLevelValueChanges(event, 'metaData');
                                    }}
                                />
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.applicationName
                                            ? validationErrors.applicationName
                                            : []
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="author">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="author"
                                    placeholder="Author"
                                    name="author"
                                    value={pageMetaInfo.metaData.author || ''}
                                    onChange={(event) => {
                                        handleSubLevelValueChanges(event, 'metaData');
                                    }}
                                />
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.author ? validationErrors.author : []
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    placeholder="Description"
                                    name="description"
                                    value={pageMetaInfo.metaData.description || ''}
                                    onChange={(event) => {
                                        handleSubLevelValueChanges(event, 'metaData');
                                    }}
                                ></textarea>
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.description
                                            ? validationErrors.description
                                            : []
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="viewPort">View Port</label>
                                <textarea
                                    className="form-control"
                                    id="viewPort"
                                    placeholder="View Port"
                                    name="viewPort"
                                    value={pageMetaInfo.metaData.viewPort || ''}
                                    onChange={(event) => {
                                        handleSubLevelValueChanges(event, 'metaData');
                                    }}
                                ></textarea>
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.viewPort ? validationErrors.viewPort : []
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="keywords">Keywords</label>
                                <textarea
                                    className="form-control"
                                    id="keywords"
                                    placeholder="Keywords"
                                    name="keywords"
                                    value={pageMetaInfo.metaData.keywords || ''}
                                    onChange={(event) => {
                                        handleSubLevelValueChanges(event, 'metaData');
                                    }}
                                ></textarea>
                                <GetValidationMessages
                                    validationErrors={
                                        validationErrors?.keywords ? validationErrors.keywords : []
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PageInfoComponent;
