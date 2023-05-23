import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURLCollections } from '../../../config/path';

export const ArchiveReports = (props) => {
    const { data, commonConfigs, lang } = props;
    const [filesListAnnual, setFilesListAnnual] = useState([]);
    const [fileListMonthly, setFileListMonthly] = useState([]);

    useEffect(() => {
        mapParams(data.settings.collection.value);
    }, []);

    const processListAnnually = (listArr) => {
        let yearsArr = [];
        let newArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.year.trim());
            });

        listArr.forEach((element) => {
            let period = !isNaN(element.period) ? parseInt(element.period) : '';
            let obj = {
                entry_name: element.entry_name,
                link: element.report,
                period: period,
                year: element.year.trim(),
                postDate: element.postDate ? element.postDate : '',
            };
            newArr.push(obj);
        });

        let uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);
        // let finalYears = uniqueYears.slice(0, 5);
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
        setFilesListAnnual(lastArr);
    };

    const processListMonthly = (listArr) => {
        let newArr = [];
        let yearsArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.year.trim());
            });

        listArr.forEach((element) => {
            let period = !isNaN(element.month) ? parseInt(element.month) : '';
            let obj = {
                entry_name: element.entry_name,
                link: element.report,
                period: period,
                year: element.year.trim(),
                postDate: element.postDate ? element.postDate : '',
            };
            newArr.push(obj);
        });

        let uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);
        // let finalYears = uniqueYears.slice(0, 5);

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
        setFileListMonthly(lastArr);
    };

    const mapParams = (key) => {
        switch (key) {
            case 1:
                handleReports('ms');
                break;
            case 2:
                handleReports('sbs');
                break;
            case 3:
                handleReports('mrd');
                break;
            default:
                break;
        }
    };

    const handleReports = (report) => {
        let obj = {};
        let monthly = '';
        let annually = '';
        if (report == 'ms') {
            monthly = 'docs-market-summary-monthly-reports-archive';
            annually = 'docs-market-summary-annual-reports-archive';
        } else if (report == 'sbs') {
            monthly = 'docs-summary-by-sector-monthly-reports-archive';
            annually = 'docs-summary-by-sector-annual-reports-archive';
        } else if (report == 'mrd') {
            monthly = 'docs-summary-by-company-monthly-reports-archive';
            annually = 'docs-summary-by-company-annual-reports-archive';
        }

        obj = { monthly, annually };
        handleAPICall(obj);
    };

    const handleAPICall = (params) => {
        const header1 = {
            params: {
                collection: params.annually,
                lang: lang.langKey,
            },
        };
        const header2 = {
            params: {
                collection: params.monthly,
                lang: lang.langKey,
            },
        };
        Axios.get(appServerURLCollections(), header1).then(
            (res) => {
                let newArr = [];
                res.data.map((item) => {
                    newArr.push(item.fieldData);
                });
                processListAnnually(newArr);
            }
        );
        Axios.get(appServerURLCollections(), header2).then(
            (res) => {
                let newArr = [];
                res.data.map((item) => {
                    newArr.push(item.fieldData);
                });
                processListMonthly(newArr);
            }
        );
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Archive Reports" />
            ) : (
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
                                {lang.langKey === 'EN' ? 'Monthly Report' : 'التقارير الشهرية'}
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
                                {lang.langKey === 'EN' ? 'Annual Report' : 'التقارير السنوية'}
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
                                summaryList={fileListMonthly}
                                type={2}
                                reportTitle={data.settings.collection.value}
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
                                summaryList={filesListAnnual}
                                type={1}
                                reportTitle={data.settings.collection.value}
                                path="appServer"
                                lang={lang.langKey}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};
