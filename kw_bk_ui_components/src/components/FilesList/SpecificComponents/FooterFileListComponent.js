import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURLCollections } from '../../../config/path';

const Special = styled.div`
    display: flex;
`;

const Title = styled.div`
    font-size: 20px;
`;
const Section = styled.div`
    margin-right: 10px;
    margin-bottom: 30px;
`;

export const FooterFileListComponent = (props) => {
    const { data, commonConfigs, lang } = props;
    const [pledgeList, setPledgeFiles] = useState([]);
    const [specificList, setSpecificList] = useState([]);

    useEffect(() => {
        handleAPI(data.settings.collection.value);
    }, []);

    const handleAPI = (val) => {
        if (val == 1) {
            handleOtherList('docs-pledge-of-listed-securities');
        } else if (val == 2) {
            handleOtherList('docs-active-and-inactive-trading-accounts');
        } else {
            handleSpecificList();
        }
    };

    const handleOtherList = (urlTail) => {
        const httpHeader = {
            params: {
                lang: lang.langKey,
                collection: urlTail,
            },
        };

        Axios.get(appServerURLCollections(), httpHeader).then((res) => {
            let newArr = [];
            res.data.map((item) => {
                newArr.push(item.fieldData);
            });
            processList(newArr);
        });
    };

    const handleSpecificList = () => {
        const httpHeader1 = {
            params: {
                lang: lang.langKey,
                collection: 'docs-monthly-trading-volumes',
            },
        };

        const httpHeader2 = {
            params: {
                lang: lang.langKey,
                collection: 'docs-year-to-date-trading-volumes',
            },
        };

        Axios.get(appServerURLCollections(), httpHeader1).then((res) => {
            let newArr = [];
            res.data.map((item) => {
                newArr.push(item.fieldData);
            });
            processList(newArr);
        });

        Axios.get(appServerURLCollections(), httpHeader2).then((res) => {
            let newArr = [];
            res.data.map((item) => {
                newArr.push(item.fieldData);
            });
            processSpecificList(newArr);
        });
    };

    const processSpecificList = (listArr) => {
        let newArr = [];
        let yearsArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.year);
            });

        listArr.forEach((element) => {
            let period = !isNaN(element.month) ? parseInt(element.month) : '';
            let obj = {
                entry_name: element.entry_name,
                link: element.document,
                period: period,
                year: element.year,
                postDate: element.postedDate ? element.postedDate : '',
            };
            newArr.push(obj);
        });

        let uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);
        //let uniqueYears = uniqueYears.slice(0, 5);

        const lastArr = [];
        for (let i = 0; i < uniqueYears.length; i++) {
            const objArr = [];
            for (let j = 0; j < newArr.length; j++) {
                if (uniqueYears[i] === newArr[j].year) {
                    objArr.push(newArr[j]);
                } else {
                    continue;
                }
            }
            const data = {
                year: uniqueYears[i],
                data: objArr,
            };
            lastArr.push(data);
        }
        lastArr.sort((a, b) => b.year - a.year);
        setSpecificList(lastArr);
    };

    const processList = (listArr) => {
        let newArr = [];
        let yearsArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.year);
            });

        listArr.forEach((element) => {
            let period = !isNaN(element.month) ? parseInt(element.month) : '';
            let obj = {
                entry_name: element.entry_name,
                link: element.document,
                period: period,
                year: element.year,
            };
            newArr.push(obj);
        });

        const uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);
        //let uniqueYears = uniqueYears.slice(0, 5);

        const lastArr = [];
        for (let i = 0; i < uniqueYears.length; i++) {
            const objArr = [];
            for (let j = 0; j < newArr.length; j++) {
                if (uniqueYears[i] === newArr[j].year) {
                    objArr.push(newArr[j]);
                } else {
                    continue;
                }
            }
            const data = {
                year: uniqueYears[i],
                data: objArr,
            };
            lastArr.push(data);
        }
        lastArr.sort((a, b) => b.year - a.year);
        setPledgeFiles(lastArr);
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Analysis" />
            ) : (
                <Fragment>
                    {data.settings.collection.value == 3 ? (
                        <div className="container">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a
                                        className="nav-link active"
                                        id="home-tab"
                                        data-toggle="tab"
                                        href="#monthly"
                                        role="tab"
                                        aria-controls="home"
                                        aria-selected="true"
                                    >
                                        {lang.langKey === 'EN'
                                            ? 'Monthly Trading Volumes'
                                            : 'حجم التداول الشهري فى بورصة الكويت'}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="contact-tab"
                                        data-toggle="tab"
                                        href="#annual"
                                        role="tab"
                                        aria-controls="contact"
                                        aria-selected="false"
                                    >
                                        {lang.langKey === 'EN'
                                            ? 'Year to Date Trading Volumes'
                                            : 'حجم التداول منذ بداية العام'}
                                    </a>
                                </li>
                            </ul>

                            <div className="tab-content" id="myTabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="monthly"
                                    role="tabpanel"
                                    aria-labelledby="home-tab"
                                >
                                    <SummaryFileList
                                        summaryList={pledgeList}
                                        type={2}
                                        path="appServer"
                                        lang={lang.langKey}
                                    />
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="annual"
                                    role="tabpanel"
                                    aria-labelledby="profile-tab"
                                >
                                    <SummaryFileList
                                        summaryList={specificList}
                                        type={2}
                                        path="appServer"
                                        lang={lang.langKey}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SummaryFileList
                            summaryList={pledgeList}
                            type={2}
                            path="appServer"
                            lang={lang.langKey}
                        />
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};
