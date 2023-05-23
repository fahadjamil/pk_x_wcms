import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import PageSettingModel from '../../../../../../../shared/models/page-data-models/PageSettingModel';
import MultiSelectComponent from '../../../../../../../shared/ui-components/input-fields/multi-select-component/MultiSelectComponent';
import { getAuthorizationHeader } from '../../../../../../../shared/utils/AuthorizationUtils';
import SettingExternalDataSourceModel from '../../models/SettingExternalDataSourceModel';
import SettingModel from '../../models/SettingModel';

interface DropDownContentModel {
    uniqueId: string;
    label: string;
    value: any;
}

function SettingMultiSelect(props: SettingModel) {
    const [dropDownListContent, setDropDownListContent] = useState<DropDownContentModel[]>([]);
    const [dropDownSelectedIndexes, setDropDownSelectedIndexes] = useState<DropDownContentModel[]>([]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            generateDropDownData();
        }
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            submitValueChange(dropDownSelectedIndexes, props.externalDataSource?.externalParams);
        }
        return () => {
            isMounted = false;
        };
    }, [dropDownSelectedIndexes]);

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
        if (
            contentList &&
            contentList.length !== 0 &&
            initialSetting &&
            initialSetting.value &&
            initialSetting.value.length > 0
        ) {
            let initialDataIndexes = [];
            initialDataIndexes = initialSetting.value;

            if (initialDataIndexes.length > 0) {
                setDropDownSelectedIndexes(initialDataIndexes);
            }
        }
    }

    function getDataFromExternalSource(externalSource: SettingExternalDataSourceModel) {
        const headerParameter = { ...externalSource.request.params };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get(externalSource.request.url, httpHeaders)
            .then((response) => {
                if (response && response.data && response.data.length !== 0) {
                    let dropDownList: DropDownContentModel[] = [];

                    response.data.forEach((dataDocument) => {
                        let settingValue = undefined;

                        // Set value mapping field in component configuration file.
                        if (externalSource.valueMapping && externalSource.valueMapping !== '') {
                            settingValue = dataDocument[externalSource.valueMapping];
                        } else {
                            settingValue = dataDocument;
                        }

                        const dropDownItem: DropDownContentModel = {
                            uniqueId: dataDocument[externalSource.uniqueKeyMapping],
                            label: dataDocument[externalSource.displayNameMapping],
                            value: settingValue,
                        };

                        dropDownList.push(dropDownItem);
                    });
                    
                    setDropDownListContent(dropDownList);
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
                    label: data.displayValue,
                    value: data.value,
                };

                dropDownList.push(dropDownItem);
            });

            setDropDownListContent(dropDownList);
            setInitialValue(dropDownList, props.initialSettingsValue);
        }
    }

    function submitValueChange(
        indexes: DropDownContentModel[],
        externalParams: any
    ) {
        if (props.onValueSelected) {
            let settingData: any = {
                [props.dataKey]: {
                    value: indexes,
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
        <div className="form-group">
            <label htmlFor={props.dataKey}>{props.displayTitle}</label>
            <MultiSelectComponent
                options={dropDownListContent}
                value={dropDownSelectedIndexes}
                onChange={setDropDownSelectedIndexes}
            />
        </div>
    );
}

export default SettingMultiSelect;
