import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import PageSettingModel from '../../../../../../../shared/models/page-data-models/PageSettingModel';
import DropDownContainerComponent from '../../../../../../../shared/ui-components/input-fields/drop-down-component';
import { getAuthorizationHeader } from '../../../../../../../shared/utils/AuthorizationUtils';
import SettingExternalDataSourceModel from '../../models/SettingExternalDataSourceModel';
import SettingModel from '../../models/SettingModel';

interface DropDownContentModel {
    uniqueId: string;
    displayText: string;
    value: any;
}

function SettingDropDownComponent(props: SettingModel) {
    const [dropDownListContent, setDropDownListContent] = useState<DropDownContentModel[]>([]);
    const [dropDownSelectedIndex, setDropDownSelectedIndex] = useState(-1);

    useEffect(() => {
        generateDropDownData();
    }, []);

    function generateDropDownData() {
        //Priority for external data source
        if (
            props.externalDataSource &&
            props.externalDataSource.request &&
            props.externalDataSource.request.url &&
            props.externalDataSource.request.url !== ''
        ) {
            getDataFromExternalSource(props.externalDataSource);
        } else if (props.settingData && props.settingData.length !== 0) {
            getDataFromSettingData(props.settingData);
        }
    }

    function setInitialValue(
        contentList: DropDownContentModel[],
        initialSetting: PageSettingModel
    ) {
        if (contentList && contentList.length !== 0 && initialSetting && initialSetting.uniqueId) {
            let initialDataIndex = -1;
            initialDataIndex = contentList.findIndex(
                (content) => content.uniqueId === initialSetting.uniqueId
            );

            if (initialDataIndex > -1) {
                setDropDownSelectedIndex(initialDataIndex);
                submitValueChange(
                    contentList,
                    initialDataIndex,
                    props.externalDataSource?.externalParams
                );
            }
        } else if (props.initialSettingsValue && props.initialSettingsValue.value) {
            setDropDownSelectedIndex(props.initialSettingsValue.value - 1);
        }
    }

    function getDataFromExternalSource(externalSource: SettingExternalDataSourceModel) {
        const headerParameter = { ...externalSource.request.params };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.dbName,
        //         ...externalSource.request.params,
        //     },
        // };

        Axios.get(externalSource.request.url, httpHeaders)
            .then((response) => {
                if (response && response.data && response.data.length !== 0) {
                    let dropDownList: DropDownContentModel[] = [];

                    response.data.forEach((dataDocument) => {
                        let settingValue = undefined;

                        if (externalSource.valueMapping && externalSource.valueMapping !== '') {
                            settingValue = dataDocument[externalSource.valueMapping];
                        } else {
                            settingValue = dataDocument;
                        }

                        const dropDownItem: DropDownContentModel = {
                            uniqueId: dataDocument[externalSource.uniqueKeyMapping],
                            displayText: dataDocument[externalSource.displayNameMapping],
                            value: settingValue,
                        };

                        dropDownList.push(dropDownItem);
                    });

                    setDropDownListContent((prevData) => dropDownList);
                    setInitialValue(dropDownList, props.initialSettingsValue);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getDataFromSettingData(settingData) {
        if (settingData && settingData.length !== 0) {
            let dropDownList: DropDownContentModel[] = [];

            settingData.forEach((data) => {
                const dropDownItem: DropDownContentModel = {
                    uniqueId: data.uniqueKey,
                    displayText: data.displayValue,
                    value: data.value,
                };

                dropDownList.push(dropDownItem);
            });

            setDropDownListContent((prevData) => dropDownList);
            setInitialValue(dropDownList, props.initialSettingsValue);
        }
    }

    function onSelectedIndexChanged(index: number) {
        if (index > -1) {
            setDropDownSelectedIndex(index);
            submitValueChange(dropDownListContent, index, props.externalDataSource?.externalParams);
        }
    }

    function submitValueChange(
        contentList: DropDownContentModel[],
        index: number,
        externalParams: any
    ) {
        if (props.onValueSelected) {
            let settingData: any = {
                [props.dataKey]: {
                    uniqueId: contentList[index].uniqueId,
                    value: contentList[index].value,
                },
            };

            if (externalParams) {
                settingData = {
                    [props.dataKey]: {
                        ...settingData[props.dataKey],
                        externalParams: externalParams,
                    },
                };
            }

            props.onValueSelected(settingData);
        }
    }

    return (
        <>
            <DropDownContainerComponent
                id="dropDownControl"
                name="dropDownControl"
                label={props.displayTitle}
                type="number"
                value={dropDownSelectedIndex}
                dropDownListContent={dropDownListContent}
                onValueChange={(e) => {
                    onSelectedIndexChanged(parseInt(e.target.value));
                }}
                dataKey={props.displayTitle}
            />
        </>
    );
}

export default SettingDropDownComponent;
