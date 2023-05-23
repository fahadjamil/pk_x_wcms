import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import NewsResult from './NewsResult';
import { DatePickerComponent } from '../DatePicker/DatePickerComponent';
import { dateForURL, setLanguage } from '../../helper/metaData';

const StyledKeywordSearch = styled.input`
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1rem;
    padding: 6px 12px;
    background-color: #fff;
    color: #000;
    border: 1px solid #aeaeae;
    border-radius: 0.3rem;
    display: inline-block;
    position: relative;
    width: 85%;
`;
const StyledSearchButton = styled.button`
    padding: 6px 80px;
    background: ${(props) => (props.otc ? '#133A5B' : '#c6974b')};
    border: none;
    margin-top: 20px;
`;

const SearchBtnWrapper = styled.div`
    text-align: start;
`;

export const NewsSearch = (props) => {
    const dataSource = props.dataSource;
    const newsType = props.newsType || null;
    const symc = props.symc || null;
    const rt = props.RT;
    const fid = props.FID || null;
    const otc = props.otc || false;

    const { lang, showResultsOnInitialLoad } = props;
    const [keywords, setKeywords] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [showResults, setShowResults] = useState(showResultsOnInitialLoad ? true : false);
    const [reqParams, setReqParams] = useState({
        RT: rt,
        L: setLanguage(lang),
        SYMC: symc,
        FID: fid,
    });

    const onSearch = () => {
        console.table({
            keyword: keywords,
            toDate: toDate,
            fromDate: fromDate,
        });
        setReqParams(generateParams());
        setShowResults(true);
    };

    const generateParams = () => {
        let paramsObj = {
            RT: rt,
            L: setLanguage(lang),
            FID: fid,
        };

        if (keywords) {
            paramsObj.T = encodeURI(keywords);
        }
        if (newsType) {
            paramsObj.NEWSTYPE = newsType;
        }
        if (symc) {
            paramsObj.SYMC = symc;
        }
        if (fromDate) {
            paramsObj.SD = dateForURL(fromDate);
        }
        if (toDate) {
            paramsObj.ED = dateForURL(toDate);
        }

        return paramsObj;
    };

    const changeToDate = (date) => {
        setToDate(date);
    };
    const changeFromDate = (date) => {
        setFromDate(date);
    };

    return (
        <div>
            <div className="row mb-3">
                {props.showKeywordSearch ? (
                    <div className="col-md-6 my-2">
                        <label for="keywordSearch" className="mr-2 w-100">
                            {lang.langKey == 'EN' ? 'Search' : 'بحث'}{' '}
                        </label>
                        <StyledKeywordSearch
                            id="keywordSearch"
                            type="text"
                            placeholder={lang.langKey == 'EN' ? 'Enter Keywords' : ''}
                            onChange={(e) => setKeywords(e.target.value)}
                        ></StyledKeywordSearch>
                    </div>
                ) : (
                    <React.Fragment></React.Fragment>
                )}

                <div className="col-md-3 my-2">
                    <DatePickerComponent
                        data={{
                            data: { title: lang.langKey == 'EN' ? 'From Date' : 'من' },
                            styles: {},
                            settings: {
                                callBack: changeFromDate,
                                disableFutureDates: { value: true },
                                fullWidthTitle: { value: true },
                            },
                        }}
                    />
                </div>

                <div className="col-md-3 my-2">
                    <DatePickerComponent
                        data={{
                            data: { title: lang.langKey == 'EN' ? 'To Date' : 'الى' },
                            styles: {},
                            settings: {
                                callBack: changeToDate,
                                disableFutureDates: { value: true },
                                fullWidthTitle: { value: true },
                            },
                        }}
                    />
                </div>

                <SearchBtnWrapper className="col-md-12 my-2">
                    <StyledSearchButton
                        className={`btn btn-secondary `}
                        onClick={() => onSearch()}
                        otc={otc}
                    >
                        {' '}
                        {lang.langKey == 'EN' ? 'Search' : 'بحث'}
                    </StyledSearchButton>
                </SearchBtnWrapper>
            </div>

            {showResults ? (
                <NewsResult
                    dataSource={dataSource}
                    reqParams={reqParams}
                    lang={lang}
                    showTicker={props.displayTicker}
                />
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </div>
    );
};
