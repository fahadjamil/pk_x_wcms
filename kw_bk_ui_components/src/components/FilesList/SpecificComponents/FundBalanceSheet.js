import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage } from '../../../helper/metaData';
import { useURLparam } from '../../../customHooks/useURLparam';
import { marketBackEndProxyPass } from '../../../config/path';

export const FundBalanceSheet = props => {
    const { commonConfigs, lang, data } = props;
    const [summaryFiles, setSummaryList] = useState([]);
    const symID = useURLparam();
    const baseUrlPdf = data && data.settings && data.settings.inputVal.value ?  data.settings.inputVal.value : '';

    useEffect(() => {
        // Axios.get('http://192.168.14.102:8081/bk/ClientServices?RT=3504&FID=38&L=E').then((res) => {
        //     processAccordingToLang(res.data.dataFields);
        // });
        if (symID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3504,
                    FID: symID,
                    L: setLanguage(lang),
                },
            })
                .then((res) => {
                    processAccordingToLang(res.data.dataFields);
                })
                .catch(() => console.log('Fetch Failed'));
         }
    }, [symID]);


    const processAccordingToLang = (listArr) => {
        const arabicArr = [];
        const englishArr = [];

        listArr.forEach((element) => {
            if (element.period >= 20 && element.period <= 23) {
                arabicArr.push(element);
            } else {
                englishArr.push(element);
            }
        });

        if (setLanguage(lang) == 'e' || setLanguage(lang) == 'E') {
            handleQuartelyList(englishArr);
        } else {
            handleQuartelyList(arabicArr);
        }
    };

    const removeDuplicates = (arr) =>
    arr.reduce((arr, item) => {
        let exists = !!arr.find((x) => x.period === item.period);
        if (!exists) {
            arr.push(item);
        }
        return arr;
    }, []);

    const handleQuartelyList = (listArr) => {
        let newArr = [];
        let yearsArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.year);
            });

        listArr.forEach((element) => {
            let obj = {
                period: element.period,
                year: element.year,
                link: element.fileName,
                postDate: element.activatedDate ? element.activatedDate : '',
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
            let afterDuplicates = removeDuplicates(objArr);
            const data = {
                year: uniqueYears[i],
                data: afterDuplicates,
            };
            lastArr.push(data);
        }
        lastArr.sort((a, b) => b.year - a.year);
        setSummaryList(lastArr);
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Balance Sheet" />
            ) : (
            <SummaryFileList
                summaryList={summaryFiles}
                type={3}
                special="fund_balance"
                lang={lang.langKey}
                path="mdb_pdf"
                baseUrl={baseUrlPdf}
            />
            )}
        </Fragment>
    );
}