import React, { useEffect, useState } from 'react';
import { InternalMediaComponent } from '../../../../shared/ui-components/input-fields/internal-media-component';
import InformationModal from '../../../../shared/ui-components/modals/information-modal';
import validator from '../../../../shared/utils/Validator';

const staticResourceSchema = {
    fileName: {
        type: 'string',
        optional: true,
        pattern: /^$|^[a-zA-Z0-9-_.]+$/g,
        messages: {
            stringPattern: 'Invalid characters in file name. Please use a valid file name.',
        },
    },
    fileSize: {
        type: 'number',
        optional: true,
        positive: true,
        messages: {
            numberPositive: 'Uploaded file size is 0 bytes. Please upload valid file.',
        },
    },
};

interface PropType {
    show: boolean;
    website: string;
    handleClose: any;
    handleConfirme: any;
}

function AddResourceComponent(props: PropType) {
    const { show, handleClose, handleConfirme } = props;
    const [resourceType, setResourceType] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [fileSize, setFileSize] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<any>(undefined);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true);
    const [addResourceFormValidationMsgs, setAddResourceFormValidationMsgs] =
        useState<any>(undefined);
    const staticResourceValidatorKey = 'staticResourceValidator';

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            validator.setValidatorSchema(staticResourceValidatorKey, staticResourceSchema);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setResourceType('');
            setFileSize('');
            setFileName('');
            setUploadedFile(undefined);
        }
        return () => {
            isMounted = false;
        };
    }, [show]);

    const handleSubmit = () => {
        const data: any = new FormData();
        data.append('file', uploadedFile);
        data.append('fileType', resourceType);
        data.append('website', props.website);
        data.append('fileName', fileName);
        data.append('fileSize', fileSize);

        handleConfirme(data);
    };

    const validateFileName = (fileName) => {
        const data = { fileName: fileName };
        const [isValid, error] = validator.validateData(staticResourceValidatorKey, data);

        if (isValid) {
            setIsAddButtonDisabled(false);
            return true;
        } else {
            const updatedError: any = {};

            error.forEach((errorItem, errorIndex) => {
                const { field, message } = errorItem;
                updatedError.status = 'failed';
                updatedError.msg = message;
            });

            setAddResourceFormValidationMsgs(updatedError);
            setIsAddButtonDisabled(true);

            return false;
        }
    };

    const validateFileSize = (size) => {
        const data = { fileSize: size };
        const [isValid, error] = validator.validateData(staticResourceValidatorKey, data);

        if (isValid) {
            setIsAddButtonDisabled(false);
            return true;
        } else {
            const updatedError: any = {};

            error.forEach((errorItem, errorIndex) => {
                const { field, message } = errorItem;
                updatedError.status = 'failed';
                updatedError.msg = message;
            });

            setAddResourceFormValidationMsgs(updatedError);
            setIsAddButtonDisabled(true);

            return false;
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const { name, size } = file;

            if (validateFileName(name) && validateFileSize(size)) {
                const str = name.split('.');
                const type = str[str.length - 1];

                setFileName(name);
                setResourceType(type);
                setFileSize(`${Math.ceil(parseInt(size) / 1024)} KB`);
                setUploadedFile(file);
            }
        }
    };

    return (
        <React.Fragment>
            <InformationModal
                modalTitle="Add New Resource"
                show={show}
                size="lg"
                handleClose={handleClose}
                handleConfirme={handleSubmit}
                submitBtnText="Add"
                disabled={isAddButtonDisabled}
            >
                {addResourceFormValidationMsgs &&
                    addResourceFormValidationMsgs.status === 'failed' && (
                        <div
                            className="alert alert-danger alert-dismissible fade show mt-2"
                            role="alert"
                        >
                            <strong>Failed!</strong> {addResourceFormValidationMsgs.msg}
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}
                <div className="form-group mb-0">
                    <InternalMediaComponent
                        id="resourceFile"
                        label="Upload Resource"
                        name="resourceFile"
                        selectedFile={uploadedFile ? uploadedFile : undefined}
                        handleValueChange={handleFileUpload}
                    />
                </div>
                <div className="alert alert-info" role="alert">
                    Please upload folders as .zip file format.
                </div>
                {uploadedFile && (
                    <div className="row">
                        <div className="col-md-6">
                            <p>
                                <strong>{fileName ? `File Name: ${fileName}` : ''}</strong>
                            </p>
                            <p>{fileSize ? `File Size: ${fileSize}` : ''}</p>
                            <p>{resourceType ? `File Type: ${resourceType}` : ''}</p>
                        </div>
                        <div className="col-md-6">FILE TYPE ICON</div>
                    </div>
                )}
            </InformationModal>
        </React.Fragment>
    );
}

export default AddResourceComponent;
