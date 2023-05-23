import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';

export const NormalMarketSize = (props) => {
    const { commonConfigs, lang } = props;
    const convertByLang = (arText, enText) => lang.langKey ==='AR' ? arText : enText;

    const [tableData, setTableData] = useState([]);

    useEffect(()=>{
        Axios.get(marketBackEndProxyPass(),{
            params:{
                RT: 3548,
                L: setLanguage(lang)
            }
        }).then( res =>{
            if(res.length !==0){
                let sortedData = res.data.sort((a,b)=>{
                    if (b.Stk ==null || isNaN(b.Stk)) {
                        return 1;
                    } else if (a.Stk == null || isNaN(a.Stk)) {
                        return 0;
                    } else {
                        return parseInt(a.Stk)- parseInt(b.Stk);
                    }
                });
                setTableData(sortedData);
            }
        });
    },[]);

    let componentSettingsNormalMarketSize = {
        columns: [
            {
                columnName: convertByLang("رقم السهم","Sec. Code"),
                dataType: "text",
                mappingField: "Stk",
              },
              {
                columnName: convertByLang("اسم السهم","Ticker"),
                dataType: "ticker",
                mappingField: "DisplayTicker",
              },
              {
                columnName: convertByLang("الإسم","Name"),
                dataType: "text",
                mappingField: "Name",
              },
              {
                columnName: convertByLang("رقم ISIN","ISIN code"),
                dataType: "text",
                mappingField: "ISINCode",
              },
        
              {
                columnName: convertByLang("الكمية الدنيا للأسهم (NMS)","Normal Market Size (NMS)"),
                dataType: "text",
                mappingField: "Nms",
              },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Normal Market Size"></SpecificPreviewComponent>
    ) : (
        <TableUiComponent componentSettings={componentSettingsNormalMarketSize}></TableUiComponent>
    );
};


