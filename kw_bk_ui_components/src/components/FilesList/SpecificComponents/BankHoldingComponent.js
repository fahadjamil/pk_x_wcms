import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { holdingReportSummeryUrl } from '../../../config/path';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { SummaryFileList } from '../FilesListComponent';

export const BankHoldingComponent = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        Axios.get(holdingReportSummeryUrl(), {
            params: {
                lang: lang.langKey,
            },
        }).then((res) => {
            handleReport(res.data);
        });
    }, []);

    const handleReport = (list) => {
        let yearsArr = [];
        let newArr = [];

        list &&
            list.map((item) => {
                yearsArr.push(item.year);
            });

        list.forEach((element) => {
            for (let index = 0; index < element.months.length; index++) {
                let month = !isNaN(element.months[index]) ? parseInt(element.months[index]) : '';
                let obj = {
                    period: month,
                    year: element.year,
                    link: element.year + month,
                    postDate: element.postDate ? element.postDate : ''
                };
                newArr.push(obj);
            }
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
                data: objArr,
            };
            lastArr.push(data);
        }
        lastArr.sort((a, b) => b.year - a.year);
        setTableData(lastArr);
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Bank Holding Component"/>
            ) : (
                <SummaryFileList summaryList={tableData} type={2} path="app_link" lang={lang.langKey} />
            )}
        </Fragment>
    );
};
