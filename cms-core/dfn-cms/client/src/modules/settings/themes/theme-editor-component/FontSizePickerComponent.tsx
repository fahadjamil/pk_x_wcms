import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';

function FontSizePickerComponent(props) {
    const [fontSize, setFontSize] = useState(props.size);
    let theme = props.data;
    const pageId = props.data._id;
    let index = props.meta.index;
    let key = props.meta.key;
    let section = props.meta.section;
    const database = props.website;

    const handleValueChange = (event: any) => {
        const size = event.target.value;
        setFontSize(size);
        theme[section][key][index].value = size;
        props.onUpdate(theme[section]);
        const { _id, ...themeData } = theme;

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/theme/update',
            {
                collection: 'themes',
                dbName: database,
                pageId: pageId,
                themeData: themeData,
            },
            httpHeaders
        )
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <input
                type="range"
                value={fontSize}
                min="8"
                max="48"
                // style={{ maxWidth: '300px' }}
                className="form-control-range"
                id="formControlRange"
                onChange={handleValueChange}
            ></input>
            <br />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
    };
};

export default connect(mapStateToProps)(FontSizePickerComponent);
