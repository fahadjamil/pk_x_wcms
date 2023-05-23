import React, {Fragment} from 'react';
import { MarketReportData} from "../Table/Specific/MarketReport/MarketReportData";
import styled from "styled-components";
import { IconColumnsFormattingMap} from "../../util/IconColumnsFormattingMap";
import { displayFormat} from "../../helper/date";
import { figureFormat} from "../../helper/number";
import { SpecificPreviewComponent } from "../SpecificPreviewComponent";

export const MarketReportSummary = (props) => {
    const { commonConfigs, lang } = props;
    const marketSummaryData =  MarketReportData(props, 'Market Summary');
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const RowData = styled.div`
        display: flex;
        width: 100%;
        justify-content: space-around;
        align-content: center
        font-family: Tajawal, sans-serif !important;
        margin: 10px;
    `;

    const RowTitle = styled.div`
        display: flex;
        width: 100%;
        height: 48px;
        font-family: Tajawal, sans-serif !important;
        background-color: #c6974b;
        padding-top: 6px;
        padding-bottom: 6px;
        justify-content: flex-start;
    `;

    const Content = styled.div`
        margin: 10px;
        color: #4b4c4d;
    `;

    const Title = styled.span`
        font-size: 16px;
    `;

    const Value = styled.div`
        font-weight: 700;
        margin-bottom: 10px;
        margin-top: 10px;
    `;

    const Market = styled.span`
        margin-left: 20px;
        margin-right: 20px;
        color: #fff;
    `;

    const Price = styled.span`
        color: #4b4c4d;
    `;

    const VariationDivUp = styled.div`
        margin: 10px;
        color: #4c7f58;
        font-weight: bold;
    `;

    const VariationDivDown = styled.div`
        margin: 10px;
        color: #a31621;
        font-weight: bold;
    `;

    const VariationDivNoChange = styled.div`
        margin: 10px;
        color: gray;
        font-weight: bold;
    `;

    const Icon = styled.span`
        ${(props) => (props.isArabic  ? 'margin-left: 10px;' : 'margin-right: 10px;')}
    `;

    const Date = styled.div`
        color: #fff;
        padding-top: .4rem;
    `;

    const renderVariationDiv = (Change, price) => {
        let UpArrow = IconColumnsFormattingMap['marketUp'];
        let DownArrow = IconColumnsFormattingMap['marketDown'];
        let NochangeIcon = IconColumnsFormattingMap['marketNoChange'];

        if (Change > 0) {
            return (
                <VariationDivUp className="mx-0">
                    <Icon isArabic={lang.langKey === 'AR'} className="align-top">
                        <UpArrow height={20} width={20} />
                    </Icon>{' '}
                    <Price className="text-lg">{price}</Price>
                </VariationDivUp>
            );
        } else if (Change < 0) {
            return (
                <VariationDivDown className="mx-0">
                    <Icon isArabic={lang.langKey === 'AR'} className="align-top">
                        <DownArrow height={20} width={20} />
                    </Icon>{' '}
                    <Price className="text-lg">{price}</Price>
                </VariationDivDown>
            );
        } else {
            return (
                <VariationDivNoChange className="mx-0">
                    <Icon isArabic={lang.langKey === 'AR'} className="align-top">
                        <NochangeIcon height={20} width={20} />
                    </Icon>{' '}
                    <Price className="text-lg">{price}</Price>
                </VariationDivNoChange>
            );
        }
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Report Summary" />
    ) :  (
        <Fragment>
            <RowTitle>
                <Market className="text-2xl font-bold">{marketSummaryData.MktName ? marketSummaryData.MktName : ''}</Market>
                <Date className="text-lg font-bold">{marketSummaryData.TransactionDate ? displayFormat(String(marketSummaryData.TransactionDate)) : '' }</Date>
            </RowTitle>

            <RowData>
                <Content className="text-right">
                    <Title className="text-sm"> {convertByLang('الصفقات', 'Trades')}</Title>
                    <Value className="text-lg"> {marketSummaryData.NoOfTrades ? figureFormat(marketSummaryData.NoOfTrades) : ''} </Value>
                </Content>
                <Content className="text-right">
                    <Title className="text-sm"> {convertByLang('القيمة المتداولة', 'Value Traded')}</Title>
                    <Value className="text-lg"> {marketSummaryData.Turnover ? figureFormat(marketSummaryData.Turnover) : ''} </Value>
                </Content>
                <Content className="text-right">
                    <Title className="text-sm"> {convertByLang('حجم التداول', 'Volume')}</Title>
                    <Value className="text-lg"> {marketSummaryData.Volume ? figureFormat(marketSummaryData.Volume) : ''} </Value>
                </Content>
                <Content className="text-right">
                    <Title className="text-sm"> {convertByLang('المؤشر', 'Index')}</Title>
                    {marketSummaryData.Index ? renderVariationDiv(marketSummaryData.Change, figureFormat(marketSummaryData.Index)) : ''}
                </Content>
                <Content className="text-right">
                    <Title className="text-sm"> {convertByLang('رسملة السوق', 'Market Cap')}</Title>
                    <Value className="text-lg"> {marketSummaryData.MarketCap ? figureFormat(marketSummaryData.MarketCap) : ''} </Value>
                </Content>
            </RowData>
        </Fragment>
    );
};