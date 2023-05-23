import React, { useEffect, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { merge } from 'lodash';
import FieldComponetModel from '../../models/FieldComponentModel';
import TableComponentMapping from './components/TableComponentMapping';

function EditorTableComponent(props: FieldComponetModel) {
    const { contentUiSettings, componentSettings, languageData } = props;
    const { setting } = contentUiSettings;
    const defaultLangKey = 'EN';
    const settingsList = Object.keys(setting);
    const [dependentFieldValues, setDependentFieldValues] = useState<any>({});
    const [uiConfigs, setUiConfigs] = useState<any>({});

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && componentSettings && Object.keys(componentSettings.length > 0)) {
            const { collection, uiConfigs } = componentSettings;
            if (uiConfigs) {
                setUiConfigs(uiConfigs);
            } else {
                if (collection && Object.keys(collection.length > 0)) {
                    const { value } = collection;
                    const { fieldsList } = value;
                    let configs: any = {
                        columns: [],
                    };

                    if (fieldsList && Object.keys(fieldsList).length !== 0) {
                        Object.keys(fieldsList).forEach((fieldList, fieldIndex) => {
                            let column: any = {
                                columnId: uuidv1(),
                                columnDisplayName: fieldList.toUpperCase(),
                            };
                            configs.columns.push(column);
                        });
                    }

                    setUiConfigs(configs);
                }
            }
        }

        return () => {
            isMounted = false;
        };
    }, [componentSettings]);

    const setDependentFieldValuesFromChild = (newState) => {
        setDependentFieldValues((state) => {
            return { ...state, ...newState };
        });
    };

    const onValueChange = (columnId: string, key: string, value: string, languageKey: string) => {
        const preState = uiConfigs;

        preState.columns.forEach((column, columnIndex) => {
            if (column.columnId === columnId) {
                if (languageKey) {
                    let configs = {
                        [key]: {
                            [languageKey]: value,
                        },
                    };

                    preState.columns[columnIndex] = merge(column, configs);
                } else {
                    languageData &&
                        languageData.map((langData, langDataIndex) => {
                            const { langKey } = langData;
                            let configs = {
                                [key]: {
                                    [langKey]: value,
                                },
                            };
                            preState.columns[columnIndex] = merge(column, configs);
                        });
                }
            }
        });

        props.onValueChange({ uiConfigs: preState });
        setUiConfigs(preState);
    };

    const addNewColumn = (columnIndex) => {
        let configs = uiConfigs;
        if (configs) {
            let newColumn = {
                columnId: uuidv1(),
                columnDisplayName: '',
            };

            configs.columns.splice(columnIndex + 1, 0, newColumn);
        }

        setUiConfigs(configs);
        props.onValueChange({ uiConfigs: configs });
    };

    if (uiConfigs) {
        if (uiConfigs.columns) {
            return uiConfigs.columns.map((column, columnIndex) => {
                const { collection, uiConfigs } = componentSettings;
                const { columnId, columnName, dataType, mappingField, columnDisplayName } = column;
                const value = collection ? collection.value : {};

                return (
                    <React.Fragment key={columnId}>
                        <strong>{`Column - ${columnIndex + 1}`}</strong>
                        <div className="row">
                            {settingsList &&
                                settingsList.map((settingList, settingListIndex) => {
                                    const { configs, values } = setting[settingList];
                                    const {
                                        field,
                                        isLanguageWiseContentPresent,
                                        labelName,
                                        dataSource,
                                        dependentFieldName,
                                    } = configs;

                                    if (isLanguageWiseContentPresent) {
                                        return (
                                            <div
                                                className="col-md"
                                                key={`field-${settingList}-${settingListIndex}`}
                                            >
                                                {languageData &&
                                                    languageData.map((langData, langDataIndex) => {
                                                        const { language, langKey } = langData;
                                                        const TableMappingComponent =
                                                            TableComponentMapping[field];
                                                        const id = `field-${settingList}-${settingListIndex}-${langKey}`;
                                                        const data =
                                                            column[settingList] &&
                                                            column[settingList][langKey]
                                                                ? column[settingList][langKey]
                                                                : '';
                                                        let cmpData: any;

                                                        if (dataSource === '') {
                                                            cmpData = values ? values : {};
                                                        } else {
                                                            const response = dataSource.split('.');

                                                            cmpData = value[response[1]];
                                                        }

                                                        return (
                                                            <div className="row" key={id}>
                                                                <div className="col-md-12">
                                                                    <TableMappingComponent
                                                                        columnId={columnId}
                                                                        firstParam={columnIndex}
                                                                        fieldName={settingList}
                                                                        labelName={`${labelName}-${language}`}
                                                                        id={id}
                                                                        cmpData={cmpData}
                                                                        dependentField={
                                                                            dependentFieldName
                                                                        }
                                                                        onValueChange={
                                                                            onValueChange
                                                                        }
                                                                        addNewColumn={addNewColumn}
                                                                        dependingFieldValues={
                                                                            dependentFieldValues
                                                                        }
                                                                        langKey={langKey}
                                                                        setDependentFieldValuesFromChild={
                                                                            setDependentFieldValuesFromChild
                                                                        }
                                                                        data={data}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        );
                                    } else {
                                        const TableMappingComponent = TableComponentMapping[field];
                                        const id = `field-${settingList}-${settingListIndex}`;
                                        const data =
                                            column[settingList] &&
                                            column[settingList][defaultLangKey]
                                                ? column[settingList][defaultLangKey]
                                                : '';

                                        let cmpData: any;

                                        if (dataSource === '') {
                                            cmpData = values ? values : {};
                                        } else {
                                            const response = dataSource.split('.');

                                            cmpData = value[response[1]];
                                        }

                                        return (
                                            <div className="col-md" key={id}>
                                                <TableMappingComponent
                                                    columnId={columnId}
                                                    firstParam={columnIndex}
                                                    fieldName={settingList}
                                                    labelName={labelName}
                                                    id={id}
                                                    cmpData={cmpData}
                                                    dependentField={dependentFieldName}
                                                    dependingFieldValues={dependentFieldValues}
                                                    onValueChange={onValueChange}
                                                    handleClick={addNewColumn}
                                                    langKey={undefined}
                                                    setDependentFieldValuesFromChild={
                                                        setDependentFieldValuesFromChild
                                                    }
                                                    data={data}
                                                />
                                            </div>
                                        );
                                    }
                                })}
                        </div>
                        <hr />
                    </React.Fragment>
                );
            });
        } else {
            return <></>;
        }
    } else {
        return <></>;
    }
}

export default EditorTableComponent;
