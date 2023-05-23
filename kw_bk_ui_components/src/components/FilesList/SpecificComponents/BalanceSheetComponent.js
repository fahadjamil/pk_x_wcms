import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage } from '../../../helper/metaData';
import { useURLparam } from '../../../customHooks/useURLparam';
import { marketBackEndProxyPass } from '../../../config/path';
import styled from 'styled-components';

const AvailabilityDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const BalanceSheetComponent = (props) => {
    const { commonConfigs, lang, data } = props;
    const [summaryFiles, setSummaryList] = useState([]);
    const [dataUnavailable, setDataUnavailable] = useState(false);
    const symID = useURLparam();
    const baseUrlPdf =
        data && data.settings && data.settings.inputVal.value ? data.settings.inputVal.value : '';

    useEffect(() => {
        // Axios.get('http://192.168.14.102:8081/bk/ClientServices?RT=3502&SYMC=101&L=E').then((res) => {
        //     processAccordingToLang(res.data.dataFields);
        // });
        if (symID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3502,
                    SYMC: symID,
                    L: setLanguage(lang),
                },
            })
                .then((res) => {
                    processAccordingToLang(res.data.dataFields);

                    if (
                        res &&
                        res.data &&
                        res.data.dataFields &&
                        Array.isArray(res.data.dataFields) &&
                        res.data.dataFields.length == 0
                    ) {
                        setDataUnavailable(true);
                    }
                })
                .catch(() => setDataUnavailable(true));
        }
    }, [symID]);

    const handleQuartelyList = (listArr) => {
        let yearsArr = [];
        let newArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.year);
            });

        listArr.forEach((element) => {
            let obj = {
                period: element.period,
                year: element.year,
                postDate: element.activatedDate ? element.activatedDate : '',
                link: element.fileName,
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
        setSummaryList(lastArr);
    };

    // Process response
    const processAccordingToLang = (listArr) => {
        const arabicArr = [];
        const englishArr = [];

        listArr.forEach((element) => {
            if (element.period >= 5 && element.period <= 8) {
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

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Balance Sheet" />
            ) : dataUnavailable ? (
                <AvailabilityDiv>
                    {lang.langKey == 'EN' ? 'Data Not Available' : 'البيانات غير متاحة'}
                </AvailabilityDiv>
            ) : (
                <SummaryFileList
                    summaryList={summaryFiles}
                    type={3}
                    special="statement"
                    lang={lang.langKey}
                    path="mdb_pdf"
                />
            )}
        </Fragment>
    );
};
