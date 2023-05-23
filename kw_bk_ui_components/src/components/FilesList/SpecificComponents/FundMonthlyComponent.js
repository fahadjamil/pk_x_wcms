import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { useURLparam } from '../../../customHooks/useURLparam';

export const FundMonthlyInfoComponent = (props) => {
    const { data,commonConfigs, lang } = props;
    const [summaryFiles, setSummaryList] = useState([]);
    const FID = useURLparam();
    const baseUrlPdf = data && data.settings && data.settings.inputVal.value ?  data.settings.inputVal.value : '';

    useEffect(() => {
        // Axios.get('http://192.168.14.102:8081/bk/ClientServices?RT=3503&FID=23').then((res) => {
        //     handleDataSet(res.data.dataFields);
        // })
        if (FID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3503,
                    FID: FID,
                    L: setLanguage(lang),
                },
            })
                .then((res) => {
                    handleDataSet(res.data.dataFields);
                })
                .catch(() => console.log('Fetch Failed'));
         }
    }, [FID]);

    const handleDataSet = listArr => {
        let yearsArr = [];
        let newArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.year);
            });

        listArr.forEach((element) => {
            let obj = {
                period: element.month,
                year: element.year,
                link: element.fileName,
                postDate: element.activatedDate ? element.activatedDate : ''
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
        setSummaryList(lastArr);
    }

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Fund Monthly Information" />
            ) : (
                <SummaryFileList summaryList={summaryFiles} type={2} lang={lang.langKey} path="mdb_pdf" baseUrl={baseUrlPdf}/>
            )}
        </Fragment>
    );
};
