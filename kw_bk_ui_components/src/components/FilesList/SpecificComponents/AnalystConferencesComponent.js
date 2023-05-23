import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { SummaryFileList } from '../FilesListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { useURLparam } from '../../../customHooks/useURLparam';

const AvailabilityDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const AnalystConferenceComponent = (props) => {
    const { commonConfigs, lang, data } = props;
    const [summaryFiles, setSummaryList] = useState([]);
    const [visible, setVisible] = useState(false);
    const symID = useURLparam();
    const [dataUnavailable, setDataUnavailable] = useState(false);

    useEffect(() => {
        if (symID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3549,
                    L: setLanguage(lang),
                    T: 2,
                },
            }).then((res) => {
                let visible = res.data.filter((x) => x.Stk == symID);
                if (visible.length > 0) {
                    setVisible(true);
                }
            });

            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3511,
                    SYMC: symID,
                    L: setLanguage(lang),
                },
            })
                .then((res) => {
                    processListAnnually(res.data);
                    if (res && res.data && Array.isArray(res.data) && res.data.length == 0) {
                        setDataUnavailable(true);
                    }
                })
                .catch(() => console.log('Fetch Failed'));
        }
    }, [symID]);

    const handlePeriods = (period) => {
        switch (period) {
            case 1:
                return 13;
            case 2:
                return 14;
            case 3:
                return 15;
            case 4:
                return 16;

            default:
                break;
        }
    };

    const processListAnnually = (listArr) => {
        let yearsArr = [];
        let newArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.AnalystConferenceYear);
            });

        listArr.forEach((element) => {
            let obj = {
                period: handlePeriods(element.AnalystConferenceQrter),
                year: element.AnalystConferenceYear,
                postDate: element.PostedDate,
                newsId: element.NewsID,
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
                data: objArr,
            };
            lastArr.push(data);
        }
        lastArr.sort((a, b) => b.year - a.year);
        setSummaryList(lastArr);
    };

    return (
        <Fragment>
            {commonConfigs && commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Analyst Conference" />
            ) : (
                <Fragment>
                    {visible || dataUnavailable ? (
                        <AvailabilityDiv>
                            {lang.langKey == 'EN' ? 'Data Not Available' : 'البيانات غير متاحة'}
                        </AvailabilityDiv>
                    ) : (
                        <SummaryFileList
                            summaryList={summaryFiles}
                            type={3}
                            path="mdb_link"
                            lang={lang.langKey}
                        />
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};
