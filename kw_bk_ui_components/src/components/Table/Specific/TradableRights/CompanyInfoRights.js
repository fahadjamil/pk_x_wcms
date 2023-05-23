import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../../../config/path';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { useURLparam } from '../../../../customHooks/useURLparam';
import { setLanguage } from '../../../../helper/metaData';

const Div = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Title = styled.div`
    font-size: 24px;
    font-weight: 700;
`;

const Logo = styled.div`
    max-height: 100px;
    max-width: 200px;
`;

export const CompanyInfoRights = (props) => {
    const { data, commonConfigs, lang } = props;
    const [dataObject, setDataObject] = useState({});
    const symID = useURLparam();

    useEffect(() => {
        let params = handleParams(symID);
        if (symID) {
            Axios.get(marketBackEndProxyPass(), {
                params: { RT: 3517, L: setLanguage(lang), SYMC: params[0] },
            }).then((res) => {
                if (res.data) {
                    setDataObject(res.data['Company Summary'][0]);
                }
            });
        }
    }, [symID]);

    const handleParams = (params) => {
        let fields = params && params.split('-');
        return fields;
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Tradable Rights Summary Tab" />
    ) : (
        <Div>
            <Title>
                {dataObject && dataObject.companyName ? dataObject && dataObject.companyName : ''}
            </Title>
            <Logo>
                {dataObject && dataObject.ImageName ? (
                    <img
                        src={'https://cis.boursakuwait.com.kw/logo/' + dataObject.ImageName}
                        style={{ maxWidth: '200px', maxHeight: '100px' }}
                        alt={dataObject && dataObject.ImageName}
                    />
                ) : (
                    <Fragment />
                )}
            </Logo>
        </Div>
    );
};
