import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { appServerURLCollections } from '../../../config/path';

export const BKReportsComponent = (props) => {
    const { data, commonConfigs, lang } = props;
    const [filesListAnnual, setFilesListAnnual] = useState([]);
    const [fileListMonthly, setFileListMonthly] = useState([]);
    const [servicePath, setSerivcePath] = useState('');

    useEffect(() => {
        mapParams(data.settings.collection.value);
    }, []);

    // Appserver API calls - start
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
        Axios.get(appServerURLCollections(), header1).then((res) => {
            let newArr = [];
            res.data.map((item) => {
                newArr.push(item.fieldData);
            });
            processListAnnually(newArr);
        });
        Axios.get(appServerURLCollections(), header2).then((res) => {
            let newArr = [];
            res.data.map((item) => {
                newArr.push(item.fieldData);
            });
            processListMonthly(newArr);
        });
        setSerivcePath('appServer');
    };
    // Appserver API calls - end

    const mapParams = (key) => {
        switch (key) {
            case 1:
                handleReports('ms');
                break;
            case 2:
                return 'sc';
            case 3:
                handleMarketBackendAPI();
                break;
            case 4:
                return 'mrd';
            default:
                break;
        }
    };

    // Market Backend API calls - start
    const handleMarketBackendAPI = () => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3551,
                L: setLanguage(lang),
            },
        })
            .then((res) => {
                handleSBSAnnual(res.data.Annual_Reports);
                handleSBSMonth(res.data.Monthly_Reports);
            })
            .catch(() => console.log('Fetch Failed'));
        setSerivcePath('mbe');
    };
    // Market Backend API calls - end

    // Handle periods MBE - start
    const handlePeriods = (type, value) => {
        let period = '';
        if (type == 'H' || type == 'h') {
            if (value == 1) {
                period = 3;
            } else {
                period = 6;
            }
        } else if (type == 'Q' || type == 'q') {
            if (value == 1) {
                period = 1;
            } else if (value == 2) {
                period = 2;
            } else if (value == 3) {
                period = 4;
            } else {
                period = 5;
            }
        } else {
            period = 7;
        }
        return period;
    };
    // Handle periods MBE - end

    // Summary by sector Annual using MBE - Start
    const handleSBSAnnual = (reports) => {
        processSBSAnnually(reports);
    };
    // Summary by sector Annual using MBE - Start

    // Process Summary by sector Annual - Start
    const processSBSAnnually = (listArr) => {
        let yearsArr = [];
        let newArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.Year);
            });

        listArr.forEach((element) => {
            const period = handlePeriods(element.Type, element.Value);
            let obj = {
                period: period,
                year: element.Year,
                link: element.Year + '-' + element.Type + '-' + element.Value,
                postDate: element.postedDate ? element.postedDate : '',
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
        setFilesListAnnual(lastArr);
    };
    // Process Summary by sector Annual - End

    // Summary by sector Monthly using MBE - start
    const handleSBSMonth = (reports) => {
        processSBSMonthly(reports);
    };
    // Summary by sector Monthly using MBE - end

    // Process Summary by sector Monthly - start
    const processSBSMonthly = (listArr) => {
        let yearsArr = [];
        let newArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.Year);
            });

        listArr.forEach((element) => {
            let obj = {
                period: element.Value,
                year: element.Year,
                link: element.Year + '-' + element.Type + '-' + element.Value,
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
        setFileListMonthly(lastArr);
    };
    // Process Summary by sector Monthly - end

    // Handle reports using appserver request - start
    const handleReports = (report) => {
        let obj = {};
        let monthly = '';
        let annually = '';
        if (report == 'ms') {
            monthly = 'docs-market-summary-monthly-reports';
            annually = 'docs-market-summary-annual-reports';
        }

        obj = { monthly, annually };
        handleAPICall(obj);
    };
    // Handle reports using appserver request - end

    // Process annual data array - start
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
                postDate: element.postedDate ? element.postedDate : '',
            };
            newArr.push(obj);
        });

        let uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);
        //let finalYears = uniqueYears.slice(0, 5);

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
                data: removeDuplicates(objArr),
            };
            lastArr.push(data);
        }
        lastArr.sort((a, b) => b.year - a.year);
        setFilesListAnnual(lastArr);
    };
    // Process annual data array - end

    // Process monthly data array - start
    const processListMonthly = (listArr) => {
        let yearsArr = [];
        let newArr = [];
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
                postDate: element.postedDate ? element.postedDate : '',
            };
            newArr.push(obj);
        });

        let uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);
        //let finalYears = uniqueYears.slice(0, 5);

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
                data: removeDuplicates(objArr),
            };
            lastArr.push(data);
        }
        lastArr.sort((a, b) => b.year - a.year);
        setFileListMonthly(lastArr);
    };
    // Process monthly data array - start

    const removeDuplicates = (arr) =>
        arr.reduce((arr, item) => {
            let exists = !!arr.find((x) => x.period === item.period);
            if (!exists) {
                arr.push(item);
            }
            return arr;
        }, []);

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Bourse Kuwait Reports" />
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
                                path={servicePath}
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
                                path={servicePath}
                                lang={lang.langKey}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};
