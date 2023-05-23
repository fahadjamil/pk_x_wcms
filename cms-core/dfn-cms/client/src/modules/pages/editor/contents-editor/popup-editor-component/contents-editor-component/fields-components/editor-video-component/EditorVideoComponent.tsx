import React, { useEffect, useState } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';
import PopupVideoGallery from './PopupVideoGallery';

function EditorVideoComponent(props: FieldComponetModel) {
    const { language, langKey } = props.language;
    const [isShowPopupVideoGallery, setIsShowPopupVideoGallery] = useState<boolean>(false);
    const [mediaData, setMediaData] = useState<object>({});
    const [externalURL, setExternalURL] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (props.initialValue) {
            let initialValueLangData = props.initialValue[langKey];

            let fileObj = {
                fileName: initialValueLangData ? initialValueLangData.fileName : '',
                filePath: initialValueLangData ? initialValueLangData.filePath : '',
                thumbnailFileName: initialValueLangData
                    ? initialValueLangData.thumbnailFileName
                    : '',
                thumbnailFileURI: initialValueLangData ? initialValueLangData.thumbnailFileURI : '',
                isExternalUrl: initialValueLangData ? initialValueLangData.isExternalUrl : false,
            };

            if (initialValueLangData?.isExternalUrl) {
                setExternalURL(initialValueLangData.filePath);
            }

            setMediaData(props.initialValue[langKey]);
            props.onValueChange({ [props.dataKey]: mediaData }, langKey);
            setSelectedFile(fileObj.thumbnailFileURI);
        }
    }, [props.initialValue]);

    useEffect(() => {
        props.onValueChange({ [props.dataKey]: mediaData }, langKey);
    }, [mediaData]);

    function handleShowPopupVideoGallery() {
        setIsShowPopupVideoGallery(true);
    }

    function handleClosePopupVideoGallery() {
        setIsShowPopupVideoGallery(false);
    }

    function onVideoSelect(data) {
        let fileObj = {
            fileName: data.fileName,
            filePath: data.filePath,
            thumbnailFileName: data.thumbFileName,
            thumbnailFileURI: data.thumbFilePath,
            isExternalUrl: false,
        };

        setMediaData(fileObj);
        props.onValueChange({ [props.dataKey]: fileObj }, langKey);
        setSelectedFile(data.thumbFilePath);
        setIsShowPopupVideoGallery(false);
        setExternalURL('');
    }

    function handleExternalURLValueChanges(event) {
        const url = event.target.value;
        let fileObj = {
            fileName: '',
            filePath: url,
            thumbnailFileName: '',
            thumbnailFileURI: '',
            isExternalUrl: true,
        };

        setMediaData(fileObj);
        props.onValueChange({ [props.dataKey]: fileObj }, langKey);
        setExternalURL(url);
        setSelectedFile(undefined);
    }

    return (
        <>
            <div className="custom-file mb-3">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleShowPopupVideoGallery}
                >
                    Choose Video - {language}
                </button>
            </div>
            {selectedFile && (
                <div className="mb-3">
                    <img src={selectedFile} alt="Image" className="img-fluid" />
                </div>
            )}
            <div className="mb-3">
                <label htmlFor={`embedUrl${langKey}`}>Add External URL/Link - {language}</label>
                <input
                    type="url"
                    className="form-control"
                    id={`embedUrl${langKey}`}
                    value={externalURL}
                    onChange={handleExternalURLValueChanges}
                />
            </div>
            {isShowPopupVideoGallery && (
                <PopupVideoGallery
                    isShowPopupVideoGallery={isShowPopupVideoGallery}
                    handleClosePopupVideoGallery={handleClosePopupVideoGallery}
                    onVideoSelect={onVideoSelect}
                />
            )}
        </>
    );
}

export default EditorVideoComponent;
