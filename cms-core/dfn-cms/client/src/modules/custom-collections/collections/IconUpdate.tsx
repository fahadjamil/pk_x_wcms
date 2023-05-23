import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Resizer from 'react-image-file-resizer';
import { connect } from 'react-redux';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';

function IconUpdate(props) {
    const targetDatabase = props.website;
    const [selectedFile, setSelectedFile] = useState('');
    const [enableButton, setEnableButton] = useState(false);

    useEffect(() => {
        return () => {};
    }, []);

    function onChangeHandler(event) {
        setSelectedFile(event.target.files);
        setEnableButton(true);
    }

    function handleReplace() {
        const data = new FormData();
        if (selectedFile.length != 0) {
            for (var x = 0; x < selectedFile.length; x++) {
                data.append('file', selectedFile[x]);
            }
            data.set('dbName', targetDatabase);

            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            // const jwt = localStorage.getItem('jwt-token');
            // const httpHeaders = {
            //     headers: {
            //         Authorization: jwt,
            //     },
            // };
            Axios.post('/api/custom-collections/icons/upload', data, httpHeaders).then((res) => {
                if (res.statusText === 'OK') {
                    props.onSave();
                }
            });
        }
    }

    return (
        <div>
            <Form noValidate>
                <div className="row">
                    <div className="col-sm-9">
                        <input
                            key="MediaIconUpload"
                            type="file"
                            name="MediaIconUpload"
                            id="MediaIconUpload"
                            className="custom-file-input"
                            onChange={(e) => onChangeHandler(e)}
                            onClick={(event: any) => {
                                event.target.value = null;
                            }}
                            required
                            accept=".svg"
                        />
                        <label htmlFor="MediaIconUpload" className="custom-file-label">
                            {props.selectedIcon ? props.selectedIcon : 'Replace Icon'}
                        </label>
                    </div>
                    <div className="col-sm-3">
                        <button
                            type="button"
                            className="btn btn-success btn-block"
                            onClick={(e) => {
                                handleReplace();
                            }}
                            disabled={!enableButton}
                        >
                            Replace
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(IconUpdate);
