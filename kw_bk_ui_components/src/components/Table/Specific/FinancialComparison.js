import React, {useState, useEffect} from 'react';
import {TableUiComponent} from '../TableComponent';
import {SpecificPreviewComponent} from '../../SpecificPreviewComponent';
import {_getHeaderIndexList, setLanguage} from '../../../helper/metaData';
// import MultiSelect from 'react-multi-select-component';
import Select from 'react-select';
import Axios from 'axios';
import styled from 'styled-components';
import { oldMarketBackEndProxyPass, marketBackEndProxyPass } from "../../../config/path";

const SelectDiv = styled.div`
        width: 80%;
        padding: 15px;
    `;
const Row = styled.div`
        display: flex;
        align-items: center;
    `;
const Button = styled.button`
    border-radius: 5px;
`;

export const FinancialComparison = (props) => {
    const {commonConfigs, lang} = props;

    const selectionLimit = 3;
    const decimalPlaces = 2;

    const [companyList, setCompanyList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedCompanyData, setSelectedCompanyData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [headData, setHeadData] = useState([]);

    const rows = ['name','shortDesc','FTLF', 'ITLI', 'OTLO', 'ATOT', 'QTCO', 'STLD', 'QTLE', 'LTLL', 'TIAT', 'CIAC'];
    const reqs = ['BAL', 'INC', 'CAS'];

    // const customValueRenderer = (selected, _options) => {
    //     if (selected.length === selectionLimit) {
    //         let notSelected = _options.filter(n => !selected.includes(n));
    //         notSelected.filter((n) => {
    //             n.disabled = true;
    //         });
    //     }
    //     if (selected.length < selectionLimit) {
    //         _options.filter((n) => {
    //             n.disabled = false;
    //         });
    //         if (selected.length === 0) {
    //             return (lang.langKey == 'EN' ? 'Select Upto 3 items' : 'اختر 3 شركات كحد أعلى' );
    //         }
    //     }
    // };


    useEffect(() => { // company list for table data
        Axios.get(
            oldMarketBackEndProxyPass(
            ),{ params:
                    {
                        UID:'3166765',
                        SID:'3090B191-7C82-49EE-AC52-706F081F265D',
                        L: lang.langKey,
                        UNC:0,
                        UE: 'KSE',
                        H: 1,
                        M: 1,
                        RT: 303,
                        SRC: 'KSE',
                        AS: 1
                    }},
        ).then(
                (res) => {

                    let filteredRegularSymbol= res.data.DAT.TD.filter(
                        (participant) =>
                            participant.split('|')[1].split('`')[1] == 'R'
                    );

                    let headerFields = ['SYMBOL_DESCRIPTION','SHRT_DSC','COMPANY_CODE'];
                    let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);
                    let tempComp = [];

                    filteredRegularSymbol.forEach((item) => {
                    let temparr = item.split('|');
                    let obj = {
                        label: `${temparr[symHedIdxList.COMPANY_CODE]} - ${temparr[symHedIdxList.SHRT_DSC]} - ${temparr[symHedIdxList.SYMBOL_DESCRIPTION]}`,
                        value: temparr[symHedIdxList.COMPANY_CODE],
                        shortDesc: temparr[symHedIdxList.SHRT_DSC],
                        name: temparr[symHedIdxList.SYMBOL_DESCRIPTION]

                    };
                    tempComp.push(obj);
                });
                setCompanyList(tempComp);
            }
        )
    }, []);

    const showTable = function (selected) { // get the table data
        let promisesReq = [];

        const dataObj = [];
        if (selected.length != 0) {

            let cols = [{
                name: (lang.langKey == 'EN' ? 'Financial data' : 'البيانات المالية'),
                mapID: 'header',
                dataType: 'text'
            }];

            selected.forEach((i) => {
                cols.push({name: i.value, mapID: i.value, dataType: 'number'});
            });

            setColumns(cols);

            selected.forEach((item) => {

                reqs.forEach((req) => {
                    promisesReq.push(Axios.get(marketBackEndProxyPass(), {
                            params: {
                                A: 1,
                                NY: 1,
                                RT: 3500,
                                SYMC: item.value,
                                SID: req,
                            },
                        })
                    );
                });
            });

            Axios.all(promisesReq).then(Axios.spread((...responses) => {

                selected.forEach(item => {

                    let tempObj = [
                        {
                            msgID: 'name',
                            value: item.name,
                            row: item.value
                        },
                        {
                            msgID: 'shortDesc',
                            value: item.shortDesc,
                            row: item.value
                        },
                    ];
                    let headObj = [
                        {
                            msgID: 'name',
                            value: (lang.langKey == 'EN' ? 'Name' : 'الإسم'),
                            row: 'header'
                        },
                        {
                            msgID: 'shortDesc',
                            value: (lang.langKey == 'EN' ? 'Ticker' : 'اسم السهم'),
                            row: 'header'
                        }
                    ];

                    reqs.forEach(req => {
                        let currentRes = responses.filter((i) => {
                            return (i.config.params.SYMC === item.value) && (req === i.config.params.SID);
                        })[0];

                        const sample = currentRes.data.headerFields;

                        let filterArray = sample.filter((item) => {
                            return rows.includes(item.msgID)
                        });

                        let tempData = Object.values(currentRes.data.dataFields)[0].filter((item) => {
                            return rows.includes(item.msgId);
                        });

                        filterArray.forEach((i) => {
                            let temp = {
                                msgID: i.msgID,
                                value: (lang.langKey == 'EN' ? i.msgNameEng : i.msgNameAr),
                                row: 'header'
                            };
                            headObj.push(temp);
                            if (headObj.length === 10) {
                                setHeadData(headObj);
                            }
                        });

                        tempData.forEach((i) => {
                            let temp = {
                                msgID: i.msgId,
                                value: parseFloat(i.msgValue).toFixed(decimalPlaces),
                                row: i.stkCode
                            };
                            tempObj.push(temp);
                            if (tempObj.length === 10) {
                                dataObj.push(tempObj);
                            }
                        });

                    });
                });

                setSelectedCompanyData(dataObj);
            })).catch(errors => {
                console.log('promise errors',errors);
            })
        }

    };

    useEffect(() => { //arrange data for table and columns

        let colArray = [];
        columns.forEach((item) => {
            let tCol = {
                columnName: item.name,
                mappingField: item.mapID,
                dataType: item.dataType
            };
            colArray.push(tCol);
        });

        let allRows = [];
        allRows.push(headData);

        selectedCompanyData.forEach((item) => {
            allRows.push(item);
        });

        if(selected.length >1){
            allRows.push(calcAvarage(selectedCompanyData,selectedCompanyData.length));
            colArray.push({columnName: (lang.langKey == 'EN' ? 'Average' : 'معدل'), mappingField: 'avarage', dataType: 'number'});
            setTableColumns(colArray);
        }else{
            setTableColumns(colArray);
        }

        let array = [];
        rows.forEach((name)=>{
            let arr = {};
            allRows.forEach((item) => {

                item.filter((i)=>{
                    if(i.msgID===name){
                        arr[i.row]=i.value
                    }
                })
            });
            array.push({fieldData: arr});
        });

        setTableData(array);

    }, [selectedCompanyData]);

    const DisableOptions = ()=>{
        console.log('onchange selected',selected);
        if(selected){
            if (selected.length === selectionLimit) {
                return true;
            }
            return false;
        }
    };

    const calcAvarage = function (companyList, length) { //create the avarage column and calculate the general avarage

        let dataList = [
            {name: 'name', value: ''},
            {name: 'shortDesc', value: ''},
            {name: 'FTLF', value: 0.0},
            {name: 'ITLI', value: 0.0},
            {name: 'OTLO', value: 0.0},
            {name: 'ATOT', value: 0.0},
            {name: 'QTCO', value: 0.0},
            {name: 'STLD', value: 0.0},
            {name: 'QTLE', value: 0.0},
            {name: 'LTLL', value: 0.0},
            {name: 'TIAT', value: 0.0},
            {name: 'CIAC', value: 0.0}
        ];

        let arrNew = [];
        dataList.forEach((i) => {
            let obj = {};
            companyList.forEach((element) => {
                let tempVal = element.filter((e) => {
                    return (e.msgID === i.name)
                })[0].value;
                i.value = i.value + parseFloat(tempVal);
                obj[i.name] = i.value;
            });
            arrNew.push({msgID :i.name , value: isNaN(i.value) ? '-' :(i.value/length).toFixed(decimalPlaces) , row: 'avarage' });
        });

        return arrNew;
    };

    const FinacialComparisonTable = {
        columns: tableColumns,
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
    };

    return commonConfigs.isPreview ? (
            <SpecificPreviewComponent title="Financial Comparison" />
        ) : (
        <div>
            <Row>
                <SelectDiv>
                    <Select
                        options={companyList} // Options to display in the dropdown
                        onChange={setSelected} // Function will trigger on select event
                        value={selected}
                        showCheckbox={true}
                        selectionLimit={selectionLimit}
                        closeOnSelect={false}
                        isMulti ={true}
                        isOptionDisabled={DisableOptions}
                        isSearchable={true}
                        placeholder={lang.langKey == 'EN' ? 'Select Upto 3 items' : 'اختر 3 شركات كحد أعلى' }
                    ></Select>
                </SelectDiv>
                <Button onClick={() => showTable(selected)}>{lang.langKey == 'EN' ? 'Compare' : 'مقارنة'}</Button>
            </Row>
            <TableUiComponent
                componentSettings={FinacialComparisonTable}
            ></TableUiComponent>
        </div>
    );
};
