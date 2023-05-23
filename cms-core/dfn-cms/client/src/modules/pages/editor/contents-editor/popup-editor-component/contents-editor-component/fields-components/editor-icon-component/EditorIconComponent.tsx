// TODO: Rename this file as EditorMediaComponent
import React, { useEffect, useState } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';
import { v1 as uuidv1 } from 'uuid';
import ExternalIconComponent from '../../../../../../../shared/ui-components/input-fields/external-icon-component/ExternalIconComponent';

function EditorMediaComponent(props: FieldComponetModel) {
    const { language, langKey } = props.language;
    const dbname = props.dbName;
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
            };

            setMediaData(props.initialValue[langKey]);
            props.onValueChange({ [props.dataKey]: mediaData }, langKey);
            setSelectedFile(fileObj.fileName);
        }
    }, [props.initialValue]);

    useEffect(() => {
        props.onValueChange({ [props.dataKey]: mediaData }, langKey);
    }, [mediaData]);

    const handleValueChange = (event: any) => {
        let fileObj = {
            fileName: event.fileName,
            filePath: event.filePath,
        };

        const { fileName, filePath, ...mediaDataUpdate } = mediaData;

        setMediaData({
            ...mediaDataUpdate,
            ...fileObj,
        });
        props.onValueChange({ [props.dataKey]: mediaData }, langKey);
        setSelectedFile(fileObj.fileName);
        setshowPopUp(false);
    };

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
                <label htmlFor={`imageBoundUrl${langKey}`}>Icon Bound URL/Link - {language}</label>
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
                    <>
                        <object
                            type="image/svg+xml"
                            data={'/api/page-data/getImage/' + dbname + '/' + selectedFile}
                            width="48"
                            height="48"
                            style={{
                                pointerEvents: 'none',
                            }}
                        ></object>
                    </>
                )}
            </div>

            <ExternalIconComponent
                showPopUp={showPopUp}
                modalTitle="Select an icon"
                handleClose={handleClose}
                handleValueChange={handleValueChange}
            />
        </>
    );
}

export default EditorMediaComponent;
