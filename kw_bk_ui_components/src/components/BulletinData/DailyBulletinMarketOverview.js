import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { dateForURL, setLanguage } from '../../helper/metaData';
import { DatePickerComponent } from '../DatePicker/DatePickerComponent';
import { BulletinMarketOverview } from '../Table/Specific/BulletinMarketOverview';
import { ExportButton } from '../ExportPrintButtons/ExportButton';
import { PrintButton } from '../ExportPrintButtons/PrintButton';
import { researchReportViewLink, XLSX, PDF } from '../../config/constants';

const DatePickerWrapper = styled.div`
    display: flex;
    margin-bottom: 25px;
`;

const StyledButton = styled.button`
    margin-left: 10px;
    background: #c5964a;
    color: white;
    padding: 0px 10px;
    border: none;
    border-radius: 5px;
`;

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const DailyBulletinMarketOverview = (params) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [reqParams, setReqParams] = useState({});
    const handleDateChange = (newDate) => setSelectedDate(newDate);
    const [showResults, setShowResults] = useState(false);
    const { lang } = params;

    const onSearch = () => {
        setReqParams({
            RT: 3534,
            L: setLanguage(lang),
            TD: dateForURL(selectedDate),
        });
        setShowResults(true);
    };
    return (
        <div>
            <DatePickerWrapper>
                <DatePickerComponent
                    data={{
                        data: { title: lang.langKey === 'EN' ? 'Date' : 'تاريخ' },
                        styles: {},
                        settings: {
                            callBack: handleDateChange,
                        },
                    }}
                />
                <StyledButton onClick={() => onSearch()} disabled={!selectedDate}>
                    {lang.langKey === 'EN' ? 'Search' : 'بحث'}
                </StyledButton>
            </DatePickerWrapper>
            {showResults ? (
                <Fragment>
                    <ButtonDiv>
                        <ExportButton
                            title={
                                lang.langKey == 'EN' || lang.langKey == 'en'
                                    ? 'Market Overview'
                                    : ' نظرة عامة'
                            }
                            id="marketOverView"
                            orientation="l"
                            format="a4"
                            type={XLSX}
                            lang={lang.langKey}
                        />
                        <PrintButton
                            title={
                                lang.langKey == 'EN' || lang.langKey == 'en'
                                    ? 'Market Overview'
                                    : ' نظرة عامة'
                            }
                            id="marketOverView"
                            orientation="l"
                            format="a3"
                            lang={lang.langKey}
                            autoPrint={true}
                        />
                        <ExportButton
                            title={
                                lang.langKey == 'EN' || lang.langKey == 'en'
                                    ? 'Market Overview'
                                    : ' نظرة عامة'
                            }
                            id="marketOverView"
                            orientation="l"
                            format="a3"
                            type={PDF}
                            lang={lang.langKey}
                        />
                    </ButtonDiv>
                    <BulletinMarketOverview
                        reqParams={reqParams}
                        lang={lang}
                    ></BulletinMarketOverview>
                </Fragment>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </div>
    );
};
