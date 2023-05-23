import React, { memo, useState, Fragment, useEffect } from 'react';
import { IconResourcesMap } from '../../util/IconResourcesMap';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';
import styled from 'styled-components';
import * as constants from './consts';
import FileCard from './FileListMobile/FileCard';
import { useUserAgent } from '../../customHooks/useUserAgent';
import { getShortFullDate, getArabicShortFullDate } from '../../helper/date';

const Table = styled.table`
    width: 900px;
    table-layout: fixed;
`;

const THead = styled.thead``;

const TBody = styled.tbody``;
const TFoot = styled.tfoot``;

const Tr = styled.tr``;

const BodyTr = styled.tr`
    border-bottom: 1px solid black;
`;

const BodyTd = styled.td`
    padding: 15px;
`;

const Th = styled.th`
    padding: 15px;
    border-bottom: 1px solid black;
`;

const Td = styled.td`
    padding: 15px;
    border: 1px solid black;
`;

const Title = styled.div`
    font-size: 12px;
`;

const TableA = styled.a`
    background: #fff !important;
`;

const IconDate = styled.p`
    font-size: 0.7em;
    margin-top: 5px;
    color: #435058;
`;

const IconWrapper = styled.span`
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    float: left;
`;

const IconWrapperAr = styled.span`
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    float: right;
`;

export const SummaryFileList = memo(
    ({ summaryList, lang, type, path, baseUrl, reportTitle, special }) => {
        const [filesList, setFilesList] = useState([]);
        const isMobile = useUserAgent();
        useEffect(() => {
            if (summaryList) {
                setHeader();
            }
        }, [summaryList]);

        // Set headers to specific files - start
        const setHeader = () => {
            let list = summaryList;
            let obj = {};

            if (type == '1') {
                obj.data = constants.reportsHeader;
            } else if (type == '2') {
                obj.data = constants.monthlyHeader;
            } else if (type == '3') {
                obj.data = constants.annualHeader;
            } else {
                obj.data = [];
            }
            obj.header = true;
            list.unshift(obj);
            setFilesList(list);
        };
        // Set headers to specific files - end

        // Set title according to specific lists - start
        const setTitle = (title) => {
            switch (title) {
                case '1':
                    return 'Market Summary';
                case '2':
                    return 'Summary Chart';
                case '3':
                    return 'Summary by Sector';
                case '4':
                    return 'Market Report Details';
                default:
                    break;
            }
        };
        // Set title according to specific lists - end

        // Set paths to pdfs or pages -start
        const setPathToLink = (path, document) => {
            // const { baseUrl, lang } = props;
            let language = lang.toLowerCase();
            let link = '';
            if (path == 'mdb_link') {
                link = `/${language}/news/view#${document}`;
            } else if (path == 'appServer') {
                link = `/api/documents/boursa/${document}`;
            } else if (path == 'mdb_pdf') {
                link = baseUrl
                    ? `${baseUrl}/${document}`
                    : `https://cis.boursakuwait.com.kw/Portal/FData/${document}`;
            } else if (path == 'mbe') {
                link = `/${language}/summary-by-sector/view#${document}`;
            } else if (path == 'app_link') {
                link = `/${language}/bank-holding-report-view#${document}`;
            } else if (path == 'mrktSumReport') {
                link = `/${language}/market-summary-report?year=${document.year}${
                    document.month ? `&month=${document.month}` : ''
                }${document.quarter ? `&quarter=${document.quarter}` : ''}`;
            } else if (path == 'mrktSumReportbyCompany') {
                link = `/${language}/market-summary-by-company?year=${document.year}${
                    document.month ? `&month=${document.month}` : ''
                }${document.quarter ? `&quarter=${document.quarter}` : ''}`;
            } else {
                link = document;
            }
            return link;
        };
        // Set paths to pdfs or pages - end

        // Months in text - start
        const processMonth = (month) => {
            return constants.months.map((item, key) => {
                if (item.id == month) {
                    if (lang == 'en' || lang == 'EN') {
                        return item.titleE;
                    } else {
                        return item.titleA;
                    }
                }
            });
        };
        // Months in text - end

        // Render Title - start
        const renderTitle = (year) => {
            return (
                <BodyTd>
                    {year} {reportTitle ? <Title>{setTitle(reportTitle)}</Title> : <Fragment />}
                </BodyTd>
            );
        };
        // Render Title - end

        const sortData = (data) => {
            //Only for monthly list - start
            if (
                (data && data.length < 12 && type == '4') ||
                (data && data.length < 12 && type == '2')
            ) {
                let monthsExisting = [];
                let year = '';
                data.forEach((element) => {
                    let obj = {
                        month: element.period,
                        year: element.year,
                    };
                    monthsExisting.push(obj);
                    year = element.year;
                });

                let map = {};
                constants.months.forEach((i) => (map[i.id] = false));
                monthsExisting.forEach((i) => map[i.month] === false && (map[i.month] = true));
                let jsonArray = Object.keys(map).map((k) => ({ month: k, matched: map[k] }));

                for (let index = 0; index < jsonArray.length; index++) {
                    if (jsonArray[index].matched == false) {
                        let newObj = {
                            entry_name: '',
                            link: '',
                            period: jsonArray[index].month,
                            year: year,
                        };
                        data.push(newObj);
                    }
                }
            }
            //Only for monthly list - end

            //Only for Annual list - start
            if (type == '1' && data && data.length < 7) {
                let quartersExisting = [];
                let year = '';

                data.forEach((element) => {
                    let obj = {
                        quarter: element.period,
                        year: element.year,
                    };
                    quartersExisting.push(obj);
                    year = element.year;
                });

                let map = {};
                constants.quarters.forEach((i) => (map[i.id] = false));
                quartersExisting.forEach(
                    (i) => map[i.quarter] === false && (map[i.quarter] = true)
                );
                let jsonArray = Object.keys(map).map((k) => ({ quarter: k, matched: map[k] }));

                for (let index = 0; index < jsonArray.length; index++) {
                    if (jsonArray[index].matched == false) {
                        let newObj = {
                            entry_name: '',
                            link: '',
                            period: jsonArray[index].quarter,
                            year: year,
                        };
                        data.push(newObj);
                    }
                }
            } else if (type == '3' && data.length < 4 && special == 'statement') {
                let quartersExisting = [];
                let year = '';

                data.forEach((element) => {
                    let obj = {
                        quarter: element.period,
                        year: element.year,
                    };
                    quartersExisting.push(obj);
                    year = element.year;
                });

                let map = {};
                if (lang == 'en' || lang == 'EN') {
                    constants.financialStatementEng.forEach((i) => (map[i.id] = false));
                } else {
                    constants.financialStatementAr.forEach((i) => (map[i.id] = false));
                }

                quartersExisting.forEach(
                    (i) => map[i.quarter] === false && (map[i.quarter] = true)
                );
                let jsonArray = Object.keys(map).map((k) => ({ quarter: k, matched: map[k] }));
                for (let index = 0; index < jsonArray.length; index++) {
                    if (jsonArray[index].matched == false) {
                        let newObj = {
                            entry_name: '',
                            fileName: '',
                            period: jsonArray[index].quarter,
                            year: year,
                        };
                        data.push(newObj);
                    }
                }
                data.sort((a, b) => b.period - a.period);
            } else if (type == '3' && data.length < 4 && special == 'fund_balance') {
                let quartersExisting = [];
                let year = '';

                data.forEach((element) => {
                    let obj = {
                        quarter: element.period,
                        year: element.year,
                    };
                    quartersExisting.push(obj);
                    year = element.year;
                });

                let map = {};
                if (lang == 'en' || lang == 'EN') {
                    constants.fundBalanceSheetEng.forEach((i) => (map[i.id] = false));
                } else {
                    constants.fundBalanceSheetAr.forEach((i) => (map[i.id] = false));
                }

                quartersExisting.forEach(
                    (i) => map[i.quarter] === false && (map[i.quarter] = true)
                );
                let jsonArray = Object.keys(map).map((k) => ({ quarter: k, matched: map[k] }));
                for (let index = 0; index < jsonArray.length; index++) {
                    if (jsonArray[index].matched == false) {
                        let newObj = {
                            entry_name: '',
                            fileName: '',
                            period: jsonArray[index].quarter,
                            year: year,
                        };
                        data.push(newObj);
                    }
                }
            } else if (type == '3' && data.length < 4) {
                let quartersExisting = [];
                let year = '';

                data.forEach((element) => {
                    let obj = {
                        quarter: element.period,
                        year: element.year,
                    };
                    quartersExisting.push(obj);
                    year = element.year;
                });

                let map = {};
                constants.annuals.forEach((i) => (map[i.id] = false));
                quartersExisting.forEach(
                    (i) => map[i.quarter] === false && (map[i.quarter] = true)
                );
                let jsonArray = Object.keys(map).map((k) => ({ quarter: k, matched: map[k] }));

                for (let index = 0; index < jsonArray.length; index++) {
                    if (jsonArray[index].matched == false) {
                        let newObj = {
                            entry_name: '',
                            fileName: '',
                            period: jsonArray[index].quarter,
                            year: year,
                        };
                        data.push(newObj);
                    }
                }
            }
            //Only for Annual list - end
            let sortedData = sortAccordingToPeriod(data, special);
            return removeDuplicates(sortedData);
        };

        const sortAccordingToPeriod = (arr, type) => {
            if (type == 'statement') {
                return arr.sort((a, b) => b.period - a.period);
            } else {
                return arr.sort((a, b) => a.period - b.period);
            }
        };

        // Render cells
        const renderCell = (data) => {
            // console.log('dataFinal', dataFinal);
            let dataFinal = sortData(data);

            return (
                <Fragment>
                    {dataFinal.map((cell, key) => {
                        // any additions to be added to getDataForCard function as well - for mobile cards layout
                        let document =
                            cell.file ||
                            cell.link ||
                            cell.report ||
                            cell.document ||
                            cell.fileName ||
                            cell.newsId ||
                            cell.date;

                        return (
                            <BodyTd key={key}>
                                {document ? (
                                    <TableA href={setPathToLink(path, document)} target="_blank">
                                        {type != '4' ? (
                                            <Fragment>
                                                {path == 'appServer' || path == 'mdb_pdf'
                                                    ? renderIcon(cell)
                                                    : renderIcon(cell)}
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                {document ? (
                                                    <Fragment>
                                                        {cell.quarter
                                                            ? cell.quarter
                                                            : processMonth(cell.period)}
                                                    </Fragment>
                                                ) : (
                                                    ''
                                                )}
                                            </Fragment>
                                        )}
                                    </TableA>
                                ) : (
                                    '-'
                                )}
                            </BodyTd>
                        );
                    })}
                </Fragment>
            );
        };

        // Remove duplicate records - start
        const removeDuplicates = (arr) =>
            arr.reduce((arr, item) => {
                let exists = !!arr.find((x) => x.period === item.period);
                if (!exists) {
                    arr.push(item);
                }
                return arr;
            }, []);
        // Remove duplicate records - end

        // Render body - start
        const renderBody = (item, key) => {
            return (
                <TBody>
                    <BodyTr key={key}>
                        {renderTitle(item.year)}
                        {renderCell(item.data)}
                    </BodyTr>
                </TBody>
            );
        };
        // Render body - end

        // Render icon - start
        const renderIcon = (cell) => {
            let BkPdf = IconColumnsFormattingMap['bkPdfIcon'];
            let BkUrl = IconColumnsFormattingMap['boursaUrlIcon'];
            return (
                <Fragment>
                    {lang == 'en' || lang == 'EN' ? (
                        <IconWrapper>
                            {path == 'mdb_link' || path == 'app_link' ? (
                                <BkUrl width="23" height="26" />
                            ) : (
                                <BkPdf width="23" height="26" />
                            )}
                            <IconDate>
                                {cell.postDate &&
                                    (lang == 'en' || lang == 'EN'
                                        ? getShortFullDate(cell.postDate)
                                        : getArabicShortFullDate(cell.postDate))}
                            </IconDate>
                        </IconWrapper>
                    ) : (
                        <IconWrapperAr>
                            {path == 'mdb_link' || path == 'app_link' ? (
                                <BkUrl width="23" height="26" />
                            ) : (
                                <BkPdf width="23" height="26" />
                            )}
                            <IconDate>
                                {cell.postDate &&
                                    (lang == 'en' || lang == 'EN'
                                        ? getShortFullDate(cell.postDate)
                                        : getArabicShortFullDate(cell.postDate))}
                            </IconDate>
                        </IconWrapperAr>
                    )}
                </Fragment>
            );
        };
        // Render icon - end

        const renderFileCards = () => {
            let rawData = filesList && filesList.filter((files) => !files.header);
            rawData;
            let sortedData = rawData.map((files) => ({
                title: files.year,
                data: getDataForCard(files.data),
            }));

            return sortedData.map((card) => (
                <FileCard
                    cardTitle={card.title}
                    cardData={card.data}
                    cardSize={card.data.length}
                    lang={lang}
                ></FileCard>
            ));
        };

        const getDataForCard = (cardData) => {
            let sortedData = sortData(cardData);
            let titles = [];
            if (type == '1') {
                titles = constants.reportsHeader;
            } else if (type == '2') {
                titles = constants.monthlyHeader;
            } else if (type == '3') {
                titles = constants.annualHeader;
            }

            return sortedData.map((card, index) => {
                let document =
                    card.file ||
                    card.link ||
                    card.report ||
                    card.document ||
                    card.fileName ||
                    card.newsId ||
                    card.date;
                return {
                    title:
                        lang == 'en' || lang == 'EN' ? titles[index].titleE : titles[index].titleA,
                    link: document ? setPathToLink(path, document) : false,
                    date: card.postDate,
                };
            });
        };
        return (
            <div>
                {isMobile ? (
                    <Fragment>{renderFileCards()}</Fragment>
                ) : (
                    <Table>
                        {filesList.map((item, key) => {
                            return (
                                <Fragment key={key}>
                                    {item.header ? (
                                        <THead>
                                            <Tr key={key}>
                                                {type != '4' ? (
                                                    <Th>
                                                        {lang == 'en' || lang == 'EN'
                                                            ? 'Year'
                                                            : 'عام'}
                                                    </Th>
                                                ) : (
                                                    <Fragment />
                                                )}
                                                {item.data.map((i, key) => (
                                                    <Th key={key}>
                                                        {lang == 'en' || lang == 'EN'
                                                            ? i.titleE
                                                            : i.titleA}
                                                    </Th>
                                                ))}
                                            </Tr>
                                        </THead>
                                    ) : (
                                        renderBody(item, key)
                                    )}
                                </Fragment>
                            );
                        })}
                    </Table>
                )}
            </div>
        );
    }
);
