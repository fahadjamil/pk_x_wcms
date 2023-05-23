import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import LanguageModel from '../../../shared/models/LanguageModel';
import validator from '../../../shared/utils/Validator';

interface AddLanguagesPopupComponentModel {
    websiteLanguageList: LanguageModel[] | undefined;
    showPopup: boolean;
    onClosePopup: any;
    onSubmitData: any;
}

function AddLanguagesPopupComponent(props: AddLanguagesPopupComponentModel) {
    const [isSelectedLeftToRight, setIsSelectedLeftToRight] = useState<boolean>(true);
    const [language, setLanguage] = useState('');
    const [isMinLenthAvailable, setIsMinLenthAvailable] = useState<boolean>(true);
    const [isLanguageKeyDuplicated, setIsLanguageKeyDuplicated] = useState<boolean>(false);

    const languageValidatorKey = 'languageValidator';
    const schema = { language: { type: 'string', min: 2 }, isLeftToRight: 'boolean' };

    useEffect(() => {
        setIsSelectedLeftToRight(true);
        validator.setValidatorSchema(languageValidatorKey, schema);
    }, [props.showPopup]);

    function onTitleChange(event: any) {
        setIsMinLenthAvailable(true);
        setIsLanguageKeyDuplicated(false);
        if (event && event.target && event.target.value) {
            setLanguage(event.target.value);
        }
    }

    function getDirectionLable() {
        if (isSelectedLeftToRight) {
            return <label>Left to Right</label>;
        } else {
            return <label>Right to Left</label>;
        }
    }

    function getWarningMessage() {
        if (!isMinLenthAvailable) {
            return (
                <small className="text-danger">Text must be greater than 2 charaters long</small>
            );
        } else if (isLanguageKeyDuplicated) {
            return <small className="text-danger">Language already included</small>;
        } else {
            return <></>;
        }
    }

    function validateAndSubmitData() {
        const submitData = {
            language: language,
            isLeftToRight: isSelectedLeftToRight,
        };

        const [isValid, error] = validator.validateData(languageValidatorKey, submitData);

        if (isValid) {
            if (props.websiteLanguageList && props.websiteLanguageList.length > 0) {
                const langKey = getLanguageKey(submitData.language);
                const avialbleLanguage = props.websiteLanguageList.find((languageModel) => {
                    return langKey === languageModel.langKey.toLowerCase();
                });

                if (avialbleLanguage) {
                    setIsLanguageKeyDuplicated(true);
                } else {
                    submitLanguageData(submitData);
                }
            } else {
                submitLanguageData(submitData);
            }
        } else {
            setIsMinLenthAvailable(false);
        }
    }

    function getLanguageKey(language: string) {
        if (language && language.length >= 2) {
            const languageKey = language.substring(0, 2).toLowerCase();
            return languageKey;
        } else {
            return 'gl';
        }
    }

    function submitLanguageData(data: any) {
        if (props.onSubmitData && data) {
            props.onSubmitData(data);
        }
    }

    return (
        <Modal show={props.showPopup} onHide={props.onClosePopup} size="xl">
            <Modal.Header>
                <Modal.Title>Add Language</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="col">
                    <label htmlFor="AddLanguageName">Language</label>
                    <input
                        type="text"
                        className="form-control"
                        id="AddLanguageName"
                        onChange={onTitleChange}
                        minLength={2}
                    />
                    <div className="row">{getWarningMessage()}</div>
                    <label htmlFor="SetLanguageDirection">Language Direction</label>
                    <div className="custom-control custom-switch">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="SetLanguageDirection"
                            checked={isSelectedLeftToRight}
                            onChange={() => {
                                setIsSelectedLeftToRight((preState) => !preState);
                            }}
                        ></input>
                        <label
                            className="custom-control-label"
                            htmlFor="SetLanguageDirection"
                        ></label>
                        {getDirectionLable()}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="btn btn-secondary"
                    onClick={() => {
                        if (props.onClosePopup) {
                            props.onClosePopup();
                        }
                    }}
                >
                    Close
                </Button>
                <Button onClick={validateAndSubmitData}>Add</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddLanguagesPopupComponent;
