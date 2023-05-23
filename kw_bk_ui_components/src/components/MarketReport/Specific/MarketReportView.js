import React, { Fragment, useState, useEffect } from 'react';
import Axios from 'axios';
import { MarketReportComponent } from '../MarketReport';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage } from '../../../helper/metaData';
import { marketBackEndProxyPass } from '../../../config/path';
import { displayFormat } from '../../../helper/date';

export const MarketReportView = (props) => {
    const { commonConfigs, lang } = props;
    const [list, setReportList] = useState([]);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3523,
                L: setLanguage(lang),
            },
        })
            .then((res) => {
                handleDataObject(res.data);
            })
            .catch(() => console.log('Fetch Failed'));
    }, []);

    // Handle report type - Start
    const handleType = type => {
        let reportType = "";
        if (type == 1) {
            reportType = 'daily';
        } else if (type == 2) {
            reportType = 'weekly';
        } else if (type == 3) {
            reportType = 'monthly';
        } else if (type == 4) {
            reportType = 'quarterly';
        }
        return reportType;
    }
    // Handle report type - End

    // Handle common object for all markets - Start
    const handleInnerObject = obj => {
        let reportType = handleType(obj.type);
        let finalObj = {
            market: obj.title,
            pm: {
                "report": "Premier Market",
                "date": obj.pm ? displayFormat(obj.pm) : "",
                "type": reportType,
                "market": "premier"
            },
            mm: {
                "report": "Main Market",
                "date": obj.mm ? displayFormat(obj.mm) : "",
                "type": reportType,
                "market": "main"
            },
            as: {
                "report": "All Shares",
                "date": obj.as ? displayFormat(obj.as) : "",
                "type": reportType,
                "market": "all"
            }
        }
        return finalObj;
    }
    // Handle common object for all markets - End

    // Process Daily, Weekly, Monthly, Quartely arrays - Start
    const processArray = (arr,title) => {
        let dateP = "";
        let dateM = "";
        let dateA = "";
        let type = "";

        arr.forEach(element => {
            type = element.DateType;
            if (element.MarketType == "P") {
                dateP = element.TransactionDate;
            } else if (element.MarketType == "M") {
                dateM = element.TransactionDate;
            } else {
                dateA = element.TransactionDate;
            }
        });

        let newObj = {
            pm: dateP ? dateP : "",
            mm: dateM ? dateM : "",
            as: dateA ? dateA : "",
            type: type,
            title: title
        };
        return newObj;
    }
    // Process Daily, Weekly, Monthly, Quartely arrays - End

    // Create data object - Start
    const handleDataObject = data => {
        let arrD = [];
        let arrW = [];
        let arrM = [];
        let arrQ = [];
        let arr = []

        data.forEach(element => {
            if (element.DateType == 1) {
               arrD.push(element);
            } else if (element.DateType == 2) {
                arrW.push(element);
            } else if (element.DateType == 3) {
                arrM.push(element); 
            } else {
                arrQ.push(element); 
            }  
        });

        let objD =  handleDaily(arrD);
        let objW =  handleWeekly(arrW);
        let objM =  handleMonthly(arrM);
        let objQ =  handleQuartely(arrQ);
        arr.push(objD, objW, objM, objQ);
        setReportList(arr);
    }
    // Create data object - End

    // Create daily object - Start
    const handleDaily = daily => {
        let title = lang.langKey == 'en' || lang.langKey == 'EN' ? "Daily Report" : "التقرير اليومي";
        let newObj = processArray(daily,title);
        let obj = handleInnerObject(newObj);
        return obj;
    }
    // Create daily object - End

    // Create weekly object - Start
    const handleWeekly = weekly => {
        let title = lang.langKey == 'en' || lang.langKey == 'EN' ? "Weekly Report" : "التقرير الأسبوعي";
        let newObj = processArray(weekly,title)
        let obj = handleInnerObject(newObj);
        return obj;
    }
    // Create weekly object - End

    // Create monthly object - Start
    const handleMonthly = monthly => {
        let title = lang.langKey == 'en' || lang.langKey == 'EN' ? "Monthly Report" : "التقرير الشهري";
        let newObj = processArray(monthly,title)
        let obj = handleInnerObject(newObj);
        return obj;
    }
    // Create monthly object - End

    // Create quartely object - Start
    const handleQuartely = quartely => {
        let title = lang.langKey == 'en' || lang.langKey == 'EN' ? "Quartely Report" : "التقرير الربع سنوي";
        let newObj = processArray(quartely,title)
        let obj = handleInnerObject(newObj);
        return obj;
    }
    // Create quartely object - End

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Market Reports" />
            ) : (
                <MarketReportComponent reports={list} language={lang.langKey.toLowerCase()}/>
            )}
        </Fragment>
    );
};
