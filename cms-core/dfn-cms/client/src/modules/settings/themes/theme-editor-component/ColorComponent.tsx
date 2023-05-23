import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ColorPickerComponent from '../../../shared/ui-components/input-fields/color-picker-component';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';

const SelectedColor = styled.button`
    max-width: 50px;
    min-width: 50px;
    background-color: ${(props) => props.color};
`;

const Modal = styled.div`
    max-width: 250px;
`;

function ColorComponent(props: any) {
    let theme = props.data;
    const pageId = props.data._id;
    let index = props.meta.index;
    let key = props.meta.key;
    let section = props.meta.section;
    let initial = props.color ? props.color : theme.colors.primary;
    let db = props.website;
    const [background, setBackground] = useState(initial);

    useEffect(() => {
        setBackground(initial);
    }, [initial]);

    const handleChangeComplete = (color) => {
        setBackground(color.hex);
        theme[section][key][index].value = color.hex;
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
                dbName: db,
                pageId: pageId,
                themeData: themeData,
            },
            httpHeaders
        )
            .then((response) => {})
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <ColorPickerComponent
                defaultValue={background}
                section={section}
                theme={theme}
                isAddPicker={props.isAddPicker}
                onChangeComplete={handleChangeComplete}
            ></ColorPickerComponent>
            <br />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(ColorComponent);
