// TODO: Rename this file as EditorMediaComponent
import React, { useEffect, useState } from 'react';
import ExternalMediaComponent from '../../../../../../../shared/ui-components/input-fields/external-media-component';
import FieldComponetModel from '../../models/FieldComponentModel';
import { v1 as uuidv1 } from 'uuid';

function EditorMediaComponent(props: FieldComponetModel) {
    const { language, langKey } = props.language;
    const [mediaData, setMediaData] = useState<any>({});
    const [selectedFile, setSelectedFile] = useState('');
    const [showPopUp, setshowPopUp] = useState(false);
    const [uniqueKey, setUniqueKey] = useState<string>('');

    useEffect(() => {
        if (props.initialValue) {
            setUniqueKey(uuidv1());
            let initialValueLangData = props.initialValue[langKey];

            let fileObj = {
                fileName: initialValueLangData ? initialValueLangData.fileName : '',
                filePath: initialValueLangData ? initialValueLangData.filePath : '',
                thumbnailUri: initialValueLangData ? initialValueLangData.thumbnailUri : '',
            };

            setMediaData(props.initialValue[langKey]);
            props.onValueChange({ [props.dataKey]: mediaData }, langKey);
            setSelectedFile(fileObj.thumbnailUri);
        }
    }, [props.initialValue]);

    useEffect(() => {
        props.onValueChange({ [props.dataKey]: mediaData }, langKey);
    }, [mediaData]);

    const handleValueChange = (event: any) => {
        let fileObj = {
            fileName: event.gridFsFileName,
            filePath: event.src,
            thumbnailUri: event.thumbnail,
        };

        const { fileName, filePath, thumbnailUri, ...mediaDataUpdate } = mediaData;

        setMediaData({
            ...mediaDataUpdate,
            ...fileObj,
        });
        props.onValueChange({ [props.dataKey]: mediaData }, langKey);
        setSelectedFile(event.thumbnail);
        setshowPopUp(false);
    };

    function getComponentID() {
        return 'mediaComponent' + language + props.componentKey;
    }

    function handleClose() {
        setshowPopUp(false);
    }

    function getDefaultUrlValue(languageKey: string) {
        if (mediaData && mediaData.boundUrl) {
            return mediaData.boundUrl;
        }

        return '';
    }

    function onImageBoundUrlChange(event: any, languageKey: string) {
        if (event && event.target && event.target.value) {
            if (mediaData) {
                const { boundUrl, ...mediaDataUpdate } = mediaData;
                setMediaData({
                    ...mediaDataUpdate,
                    boundUrl: event.target.value,
                });
            }
        }

        props.onValueChange(mediaData, langKey);
    }

    return (
        <>
            <div className="custom-file mb-3">
                <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#PageImagePopUp123"
                    onClick={(e) => {
                        setshowPopUp(true);
                    }}
                >
                    Choose File - {language}
                </button>
            </div>
            <div className="mb-3">
                <label htmlFor={`imageBoundUrl${langKey}`}>Image Bound URL/Link - {language}</label>
                <input
                    key={uniqueKey + langKey + 'Url'}
                    type="url"
                    className="form-control"
                    id={`imageBoundUrl${langKey}`}
                    defaultValue={getDefaultUrlValue(langKey)}
                    onChange={(event) => onImageBoundUrlChange(event, langKey)}
                />
            </div>
            <div>
                {selectedFile && selectedFile !== '' && (
                    <img src={selectedFile} alt="Image" className="img-fluid" />
                )}
            </div>

            <ExternalMediaComponent
                showPopUp={showPopUp}
                modalTitle="Select an image"
                handleClose={handleClose}
                handleValueChange={handleValueChange}
            />
        </>
    );
}

export default EditorMediaComponent;
