import React from 'react';
import InternalMediaPropTypeModel from '../models/InternalMediaPropTypeModel';

function InternalMediaComponent(props: InternalMediaPropTypeModel) {
    const { id, label, name, ext, selectedFile } = props;

    const handleValueChange = (event) => {
        props.handleValueChange(event);
    };

    return (
        <>
            <div className="custom-file mb-3">
                <input
                    id={id}
                    key={id}
                    name={name}
                    type="file"
                    className="custom-file-input"
                    accept={ext ? ext : ''}
                    onChange={handleValueChange}
                    onClick={(event: any) => {
                        event.target.value = null;
                    }}
                />
                <label htmlFor={id} className="custom-file-label">
                    {selectedFile
                        ? selectedFile.name
                            ? selectedFile.name
                            : selectedFile
                        : 'Choose File'}
                </label>
            </div>
            {/* <div>
                {selectedFile !== '' && <img src="fi-cnsuxt-upload-solid.jpg" alt="Uploaded !" />}
            </div> */}
        </>
    );
}

export default InternalMediaComponent;
