import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { v1 as uuidv1 } from 'uuid';
import ImageComponent from '../../custom-collections/collections/media/ImageComponent';
import LanguageModel from '../../shared/models/LanguageModel';
import RichTextComponent from '../../shared/ui-components/input-fields/rich-text-component/RichTextComponent';
import { getRichTextComponentConfiguration } from '../../shared/ui-components/input-fields/rich-text-component/RichTextUtil';
import BannerContentModel from '../models/BannerContentModel';

interface AddBannerDetailsPopupComponentModel {
    supportLanguages: LanguageModel[];
    showPopup: boolean;
    onClosePopup: any;
    onSubmitData: any;
    initialBannerData?: SelectedBannerDataModel;
    dbName: string;
}

interface SelectedBannerDataModel {
    dataIndex: number;
    data: {
        [key: string]: BannerContentModel;
    };
}

function AddBannerDetailsPopupComponent(props: AddBannerDetailsPopupComponentModel) {
    const [bannerData, setBannerData] = useState<{ [key: string]: BannerContentModel }>({});
    const [isSubmitedWithoutImages, setIsSubmitedWithoutImages] = useState<boolean>(false);
    const [uniqueKey, setUniqueKey] = useState<string>('');
    const [isSelectImagePopupOpen, setIsSelectImagePopupOpen] = useState<boolean>(false);
    const [clickedImageLanguage, setClickedImageLanguage] = useState<string>('');

    useEffect(() => {
        if (props.initialBannerData && props.initialBannerData.data) {
            setUniqueKey(uuidv1());
            setBannerData(props.initialBannerData.data);
        }
    }, [props.initialBannerData]);

    function getDefaultUrlValue(languageKey: string) {
        if (bannerData && bannerData[languageKey] && bannerData[languageKey].boundUrl) {
            return bannerData[languageKey].boundUrl;
        }

        return '';
    }

    function getDefaultTitle(languageKey: string) {
        if (bannerData && bannerData[languageKey] && bannerData[languageKey].title) {
            return bannerData[languageKey].title;
        }

        return '';
    }

    function getDefaultBannerText(languageKey: string) {
        if (bannerData && bannerData[languageKey] && bannerData[languageKey].bannerText) {
            return bannerData[languageKey].bannerText;
        }

        return '';
    }

    function onAddImage(event: any, languageKey: string) {
        if (event && event.src) {
            bannerData[languageKey] = {
                ...bannerData[languageKey],
                imagePath: event.src,
                thumbnail: event.thumbnail,
            };
            setBannerData({ ...bannerData });
        }
    }

    function onImageBoundUrlChange(event: any, languageKey: string) {
        if (event && event.target && event.target.value) {
            bannerData[languageKey] = { ...bannerData[languageKey], boundUrl: event.target.value };
            setBannerData({ ...bannerData });
        }
    }

    function onTitleChange(event: any, languageKey: string) {
        if (event && event.target && event.target.value) {
            bannerData[languageKey] = { ...bannerData[languageKey], title: event.target.value };
            setBannerData({ ...bannerData });
        }
    }

    function onBannerTextChange(editor: any, languageKey: string) {
        if (editor && editor.getData) {
            bannerData[languageKey] = {
                ...bannerData[languageKey],
                bannerText: editor.getData(),
            };
            setBannerData({ ...bannerData });
        }
    }

    function validateImagesForBanners() {
        if (props.supportLanguages) {
            let isAllImagesValidated = true;

            if (bannerData) {
                props.supportLanguages.forEach((lang) => {
                    if (bannerData[lang.langKey] === undefined) {
                        isAllImagesValidated = false;
                    } else if (bannerData[lang.langKey].imagePath === undefined) {
                        isAllImagesValidated = false;
                    } else if (bannerData[lang.langKey].imagePath === '') {
                        isAllImagesValidated = false;
                    }
                });

                return isAllImagesValidated;
            }
        }

        return false;
    }

    function showSelectedImages(langKey: string) {
        if (
            bannerData &&
            bannerData[langKey] &&
            bannerData[langKey].imagePath &&
            bannerData[langKey].imagePath !== ''
        ) {
            return (
                <img
                    src={bannerData[langKey].imagePath}
                    style={{ height: '10rem', width: 'auto' }}
                    alt="Image"
                />
            );
        } else {
            if (isSubmitedWithoutImages) {
                return <small className="text-danger">Banner image required</small>;
            } else {
                return <></>;
            }
        }
    }

    return (
        <>
            <Modal
                show={props.showPopup}
                onHide={props.onClosePopup}
                size="xl"
                scrollable={true}
                autoFocus={false}
                enforceFocus={false}
            >
                <Modal.Header>
                    <Modal.Title> Add Banner Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.supportLanguages &&
                        props.supportLanguages.map((language) => {
                            return (
                                <React.Fragment key={uniqueKey + language.langKey}>
                                    <div className="form-group">
                                        <label htmlFor={`imageTitle${language.langKey}`}>
                                            Title - {language.language}
                                        </label>
                                        <input
                                            key={uniqueKey + language.langKey + 'Title'}
                                            type="url"
                                            className="form-control"
                                            id={`imageTitle${language.langKey}`}
                                            defaultValue={getDefaultTitle(language.langKey)}
                                            onChange={(event) =>
                                                onTitleChange(event, language.langKey)
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`bannerText${language.langKey}`}>
                                            Banner Text - {language.language}
                                        </label>
                                        <RichTextComponent
                                            id={`bannerText${language.langKey}`}
                                            label={`Banner Text - ${language.language}`}
                                            data={getDefaultBannerText(language.langKey)}
                                            config={getRichTextComponentConfiguration(
                                                props.dbName,
                                                language.langKey.toLowerCase()
                                            )}
                                            handleValueChange={(event, editor) => {
                                                onBannerTextChange(editor, language.langKey);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`imageBoundUrl${language.langKey}`}>
                                            Image Bound URL/Link - {language.language}
                                        </label>
                                        <input
                                            key={uniqueKey + language.langKey + 'Url'}
                                            type="url"
                                            className="form-control"
                                            id={`imageBoundUrl${language.langKey}`}
                                            defaultValue={getDefaultUrlValue(language.langKey)}
                                            onChange={(event) =>
                                                onImageBoundUrlChange(event, language.langKey)
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button
                                            type="button"
                                            data-toggle="modal"
                                            data-target={`#BannerDataEntry${language.langKey}`}
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setClickedImageLanguage(language.langKey);
                                                setIsSelectImagePopupOpen(true);
                                            }}
                                        >
                                            Choose Image - {language.language}
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        {showSelectedImages(language.langKey)}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => {
                            setBannerData((prev) => ({}));
                            setIsSubmitedWithoutImages((prev) => false);

                            if (props.onClosePopup) {
                                props.onClosePopup();
                            }
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            if (validateImagesForBanners()) {
                                if (props.onSubmitData) {
                                    const updatedData = { ...bannerData };
                                    let initialDataIndex = -1;

                                    if (props.initialBannerData) {
                                        initialDataIndex = props.initialBannerData.dataIndex;
                                    }

                                    setBannerData((prev) => ({}));
                                    setIsSubmitedWithoutImages((prev) => false);
                                    props.onSubmitData(updatedData, initialDataIndex);
                                }
                            } else {
                                setIsSubmitedWithoutImages(true);
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={isSelectImagePopupOpen}
                onHide={() => {
                    setIsSelectImagePopupOpen(false);
                }}
                size="xl"
                scrollable={true}
            >
                <Modal.Header>
                    <Modal.Title>Select a File From Here...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ImageComponent
                        IsPopup={true}
                        onImageSelect={(event) => {
                            onAddImage(event, clickedImageLanguage);
                            setIsSelectImagePopupOpen(false);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => {
                            setIsSelectImagePopupOpen(false);
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddBannerDetailsPopupComponent;
