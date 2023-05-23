import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { SummaryFileList } from '../../FilesList/FilesListComponent';

export const MarketSummaryReportList = (props) => {
    const { lang ,data } = props;
    const [reportList, setReportList] = useState([]);

    // m = monthly , y = annual
    let mode =  (data.settings && data.settings.period && data.settings.period.value) || 'm';
    const setPeriod = (element) => {
        let MonthValue = parseInt(element.Month);
        switch (MonthValue) {
            case 3:
                return 1;
            case 6:
                return 2;
            case 9:
                return 4;
            case 12:
                return element.Type === 4 ? 5 : 7;
            default:
                return 0;
        }
    };

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3571,
                CT: mode === 'm' ? 1 : 2,
            },
        }).then((res) =>
            processList(res.data.filter((data) => (mode == 'm' ? data.Type === 3 : data.Type != 3)))
        );
    }, []);
    const processList = (dataArr) => {
        console.table(dataArr);
        let yearsArr = [];
        dataArr && dataArr.map((report) => yearsArr.push(report.Year));

        let uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);

        let newArr = [];

        const setDate = (element) => {
            let dateObject = { year: element.Year, month: null, quarter: null };
            if (mode == 'm') {
                return {
                    ...dateObject,
                    month: parseInt(element.Month),
                };
            } else if (element.Type === 4) {
                return {
                    ...dateObject,
                    quarter: element.Month / 3,
                };
            } else {
                return dateObject;
            }
        };

        dataArr.forEach((element) => {
            let obj = {
                period: mode === 'm' ? parseInt(element.Month) : setPeriod(element),
                year: element.Year,
                postDate: element.TransactionDate && element.TransactionDate.toString(),
                date: setDate(element),
            };
            newArr.push(obj);
        });

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
        setReportList(lastArr);
    };
    return (
        <div>
           
            <SummaryFileList
                summaryList={reportList}
                type={mode == 'm' ? 2 : 1}
                path="mrktSumReport"
                lang={lang.langKey}
            />
        </div>
    );
};
