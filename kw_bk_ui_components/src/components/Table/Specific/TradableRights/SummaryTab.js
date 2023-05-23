import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../../../config/path';
import { useURLparam } from '../../../../customHooks/useURLparam';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { setLanguage } from '../../../../helper/metaData';
import { IconColumnsFormattingMap } from '../../../../util/IconColumnsFormattingMap';
import { displayFormat } from '../../../../helper/date';

const Div = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 20px;
`;

const ChildDiv = styled.div`
    width: 20%;
`;

const Title = styled.div`
    text-align: center;
    margin-bottom: 5px;
    font-weight: bold;
`;

const Data = styled.div`
    text-align: center;
`;

const LinkDiv = styled.div`
    display: flex;
    color: #c6974b;
`;

const HyperLink = styled.a`
    margin-right: 5px;
    color: #c6974b;
`;

export const TradableRightsSummaryTab = (props) => {
    const { data, commonConfigs, lang } = props;
    const [dataObject, setDataObject] = useState({});
    const symID = useURLparam();
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const DownloadIcon = IconColumnsFormattingMap['pdfIconGold'];

    useEffect(() => {
        let params = handleParams(symID);
        if (symID) {
            Axios.get(marketBackEndProxyPass(), {
                params: { RT: 3574, L: setLanguage(lang), SYMC: params[1] },
            }).then((res) => {
                if (res.data) {
                    setDataObject(res.data[0]);
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
        <Fragment>
            <Div>
                <ChildDiv>
                    <Title>{convertByLang('اسم الشركة', 'Company Name ')}</Title>
                    <Data>{dataObject && dataObject.CompanyName}</Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>
                        {convertByLang('ISIN Number (الخاص بحقوق الاولوية)', 'ISIN Code')}
                    </Title>
                    <Data>{dataObject && dataObject.ISIN}</Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>{convertByLang('سعر الاكتتاب', 'Subscription Price')}</Title>
                    <Data>{dataObject && dataObject.SubscriptionPrice}</Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>
                        {convertByLang('حجم الحقوق المطروحة للاكتتاب', 'Offering Size (Volume)')}
                    </Title>
                    <Data>{dataObject && dataObject.OfferSize}</Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>
                        {convertByLang('نسبة زيادة راس المال', 'Capital Increase Percentage')}
                    </Title>
                    <Data>{dataObject && dataObject.Ratio}</Data>
                </ChildDiv>
            </Div>
            <Div>
                <ChildDiv>
                    <Title>
                        {convertByLang('قيمة الاسهم المطروحة للاكتتاب', 'Offering Size (Value)')}
                    </Title>
                    <Data>{dataObject && dataObject.TotValOfferedShares}</Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>{convertByLang('تاريخ  الاستحقاق', 'Record Date')}</Title>
                    <Data>
                        {dataObject &&
                            dataObject.EligibilityDate &&
                            displayFormat(dataObject.EligibilityDate)}
                    </Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>{convertByLang('فترة التداول', 'Trading Period')}</Title>
                    <Data>{dataObject && dataObject.TradingPeriod}</Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>
                        {convertByLang('فترة الاكتتاب في حقوق الاولوية', 'Rights Issue Duration')}
                    </Title>
                    <Data>{dataObject && dataObject.SubscriptionPeriod}</Data>
                </ChildDiv>
                <ChildDiv>
                    <Title>{convertByLang('تاريخ التخصيص', 'Allocation Date')}</Title>
                    <Data>
                        {dataObject &&
                            dataObject.AllocationDate &&
                            displayFormat(dataObject.AllocationDate)}
                    </Data>
                </ChildDiv>
            </Div>
            <Div>
                {dataObject && dataObject.LPO ? (
                    <LinkDiv>
                        <DownloadIcon height={48} width={48} />{' '}
                        <HyperLink
                            href={'https://docs.boursakuwait.com.kw/LPO/' + dataObject.LPO}
                            target="_blank"
                        >
                            {convertByLang('نشرة الاكتتاب', 'Company Prospects')}
                        </HyperLink>
                    </LinkDiv>
                ) : (
                    <React.Fragment />
                )}
            </Div>
        </Fragment>
    );
};
