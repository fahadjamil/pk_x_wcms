import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import moment from 'moment';
import { ReactGraph } from './Common/ReactGraph';
import { marketBackEndProxyPass } from '../../config/path';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';

const Row = styled.div`
    display: flex;
`;

const Chart = styled.div`
    margin: 10px;
    width: 70px;
    height: 70px;
`;
const Content = styled.span`
    margin: 10px;
`;
const Title = styled.span`
    color: rgb(197 148 75);
    font-family: Tajawal, sans-serif !important;
    font-size: 16px;
    font-weight: 700;
`;

const Value = styled.div`
    color: #4b4c4d;
    font-size: 16px;
    font-weight: 700;
    font-family: Tajawal, sans-serif !important;
    margin-bottom: 10px;
    margin-top: 10px;
`;
const VariationDivUp = styled.div`
    color: #4c7f58;
    font-weight: bold;
    font-family: Tajawal, sans-serif !important;
`;

const VariationDivDown = styled.div`
    color: #a3621;
    font-weight: bold;
    font-family: Tajawal, sans-serif !important;
`;

const VariationDivNoChange = styled.div`
    color: gray;
    font-weight: bold;
    font-family: Tajawal, sans-serif !important;
`;

const Percentage = styled.span`
    margin-left: 10px;
`;

const Icon = styled.span`
    margin-right: 10px;
`;

const intZero = 0;

export const EconomicIndicatorReact = (props) => {
    const { commonConfigs, lang, data } = props;
    const [indicatorArr, setIndicatorArr] = useState([]);
    const [indicator, setIndicator] = useState({});
    const [minimumY, setMinimumY] = useState();
    const [maximumY, setMaximumY] = useState();
    const indicatorIndex = data.settings.collection.value;

    useEffect(() => {
        // Axios.get('http://192.168.14.102:8081/bk/ClientServices?RT=3521').then((res) => {
        //     handleIndicatorArr(res.data);
        // });
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3521},
        }).then((res) => {
            handleIndicatorArr(res.data);
        });
        // Axios.get('http://192.168.14.102:8081/bk/ClientServices?RT=3521&R=1').then((res) => {
        //     handleIndicator(res.data);
        // });
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3521, R: 1},
        }).then((res) => {
            handleIndicator(res.data);
        });
        minimumYAxis();
    }, []);

    const minimumYAxis = () => {
        if (indicatorIndex == 'KOP') {
            setMinimumY(34);
            setMaximumY(60);
        } else if (indicatorIndex == 'CPI') {
            setMinimumY(100);
            setMaximumY(120);
        } else {
            setMinimumY(30000);
            setMaximumY(50000);
        }

    }

    const handlePercentage = (value) => {
        let Pchg = '';
        if (value > intZero) {
            Pchg = '+' + value + '%';
        } else if (value < intZero) {
            Pchg = '-' + value + '%';
        } else {
            Pchg = value + '%';
        }

        return Pchg;
    };

    const roundOff = (value) => {
        let roundedValue = Math.round(value * 100) / 100;
        return roundedValue;
    };

    const handleIndicator = (data) => {
        let obj = {};
        if (indicatorIndex == 'KOP') {
            obj = {
                Chg: data.KOP[0].Chg,
                Date: data.KOP[0].Date,
                Pchg: handlePercentage(roundOff(data.KOP[0].Pchg)),
                Value: data.KOP[0].Value,
            };
        } else if (indicatorIndex == 'CPI') {
            obj = {
                Chg: data.CPI[0].Chg,
                Date: data.CPI[0].Date,
                Pchg: handlePercentage(roundOff(data.CPI[0].Pchg)),
                Value: data.CPI[0].Value,
            };
        } else {
            obj = {
                Chg: data.GDP[0].Chg,
                Date: data.GDP[0].Date,
                Pchg: handlePercentage(roundOff(data.GDP[0].Pchg)),
                Value: data.GDP[0].Value,
            };
        }

        setIndicator(obj);
    };

    const handleIndicatorArr = (data) => {
        let obj = {};
        let finalArr = [];
        if (indicatorIndex == 'KOP') {
            data.KOP.forEach((element) => {
                obj = {
                    Chg: element.Chg,
                    Date: element.Date,
                    Pchg: element.Pchg,
                    Value: element.Value,
                };
                finalArr.push(obj);
            });
        } else if (indicatorIndex == 'CPI') {
            data.CPI.forEach((element) => {
                obj = {
                    Chg: element.Chg,
                    Date: element.Date,
                    Pchg: element.Pchg,
                    Value: element.Value,
                };
                finalArr.push(obj);
            });
        } else {
            data.GDP.forEach((element) => {
                obj = {
                    Chg: element.Chg,
                    Date: element.Date,
                    Pchg: element.Pchg,
                    Value: element.Value,
                };
                finalArr.push(obj);
            });
        }

        finalArr.sort((a, b) => a.Date - b.Date);
        setIndicatorArr(finalArr);
    };

    const renderTitle = () => {
        let title = '';
        if (indicatorIndex == 'KOP') {
            title = lang.langKey == 'EN' ? 'Kuwait Oil Price (USD)' : 'سعر النفط الكويتي (USD)';
        } else if (indicatorIndex == 'CPI') {
            title = lang.langKey == 'EN' ? 'CPI' : 'مؤشر أسعار المستهلك';
        } else {
            title = lang.langKey == 'EN' ? 'GDP (KD)' : 'الناتج المحلي الإجمالي (د.ك)';
        }

        return title;
    };

    const renderVariationDiv = (Chg, Pchg) => {
        let UpArrow = IconColumnsFormattingMap['marketUp'];
        let DownArrow = IconColumnsFormattingMap['marketDown'];
        let NochangeIcon = IconColumnsFormattingMap['marketNoChange'];

        if (Chg > intZero) {
            return (
                <VariationDivUp>
                    <Icon>
                        <UpArrow height={22} width={22} />
                    </Icon>{' '}
                    <span>{Chg}</span>
                    <Percentage>{Pchg}</Percentage>
                </VariationDivUp>
            );
        } else if (Chg < intZero) {
            return (
                <VariationDivDown>
                    <Icon>
                        <DownArrow height={22} width={22} />
                    </Icon>{' '}
                    <span>{Chg}</span>
                    <Percentage>{Pchg}</Percentage>
                </VariationDivDown>
            );
        } else {
            return (
                <VariationDivNoChange>
                    <Icon>
                        <NochangeIcon height={22} width={22} />
                    </Icon>{' '}
                    <span>{Chg}</span>
                    <Percentage>{Pchg}</Percentage>
                </VariationDivNoChange>
            );
        }
    };

    return (
        <Fragment>
            <Row>
                <Chart>
                    <ReactGraph data={indicatorArr} dataKey={'Value'} xAxis={'Date'} minimumY={minimumY} maximumY={maximumY}/>{' '}
                </Chart>
                <Content>
                    <Title> {renderTitle()} </Title>
                    <Value> {indicator && indicator.Value}</Value>
                    {renderVariationDiv(indicator && indicator.Chg, indicator && indicator.Pchg)}
                </Content>
            </Row>
        </Fragment>
    );
};
