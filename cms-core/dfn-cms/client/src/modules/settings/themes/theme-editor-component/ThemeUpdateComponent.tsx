import Axios from 'axios';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import RadioButtonComponent from './RadioButtonComponent';

function ThemeUpdateComponent(props) {
    const [initialValue, setInitialValue] = useState(props.initialValue);
    let theme = props.data;
    const pageId = props.data._id;
    let index = props.meta.index;
    let key = props.meta.key;
    let section = props.meta.section;
    const database = props.website;
    let radioItems = props.itemsList;

    const handleValueChange = (event: any) => {
        const value = event.target.value;
        setInitialValue(value);
        theme[section][key][index].value = value;
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
            <RadioButtonComponent
                items={radioItems}
                selectedValue={initialValue}
                isCustom={props.isCustom}
                data={props}
                meta={props.meta}
                onChange={handleValueChange}
            />
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

export default connect(mapStateToProps)(ThemeUpdateComponent);
