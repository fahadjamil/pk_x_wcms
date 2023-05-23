import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { useURLparam } from '../../../customHooks/useURLparam';
import styled from 'styled-components';

const AvailabilityDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const CorporateProfitComponent = (props) => {
    const { commonConfigs, lang, data } = props;
    const [summaryFiles, setSummaryList] = useState([]);
    const symID = useURLparam();
    const baseUrlPdf = (data && data.settings && data.settings.inputVal.value) || '';
    const [dataUnavailable, setDataUnavailable] = useState(false);

    useEffect(() => {
        if (symID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3501,
                    SYMC: symID,
                    L: setLanguage(lang),
                },
            })
                .then((res) => {
                    processListAnnually(res.data.dataFields);
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

    const removeDuplicates = (arr) =>
        arr.reduce((arr, item) => {
            let exists = !!arr.find((x) => x.period === item.period);
            if (!exists) {
                arr.push(item);
            }
            return arr;
        }, []);

    // Process response
    const processListAnnually = (listArr) => {
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
                link: element.fileName,
                postDate: element.activatedDate ? element.activatedDate : '',
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
            {commonConfigs && commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Coporate Profile" />
            ) : dataUnavailable ? (
                <AvailabilityDiv>
                    {lang.langKey == 'EN' ? 'Data Not Available' : 'البيانات غير متاحة'}
                </AvailabilityDiv>
            ) : (
                <SummaryFileList
                    summaryList={summaryFiles}
                    type={3}
                    path="mdb_pdf"
                    baseUrl={baseUrlPdf}
                    lang={lang.langKey}
                />
            )}
        </Fragment>
    );
};
