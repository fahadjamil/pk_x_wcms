import React, { useState, useEffect } from 'react';
import DefaultPropTypeModel from '../../models/DefaultPropTypeModel';

function TableDropDownComponent(props: DefaultPropTypeModel) {
    const {
        columnId,
        labelName,
        id,
        cmpData,
        dependentField,
        fieldName,
        dependingFieldValues,
        langKey,
        data,
    } = props;
    const cmpDataLists = cmpData ? Object.keys(cmpData) : [];
    const dependingFieldValuesLists = dependingFieldValues ? Object.keys(dependingFieldValues) : [];
    const [dropDownSelectedValue, setDropDownSelectedValue] = useState<string>(data);
    const [hasDependingValue, setHasDependingValue] = useState<boolean>(false);
    const [dependingValue, setDependingValue] = useState<string>('');
    const defaultNestedProperties: string[] = ['mappingField'];

    useEffect(() => {
        if (data && data != '') {
            if (dependentField !== '') {
                props.setDependentFieldValuesFromChild({
                    [`${columnId}-${dependentField}`]: data,
                });
            }
        }
        return () => {};
    }, [data]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && dependingFieldValuesLists) {
            dependingFieldValuesLists.forEach((dependingFieldValue, dependingFieldValueIndex) => {
                const response = `${columnId}-${fieldName}`;

                if (response === dependingFieldValue) {
                    setHasDependingValue(true);
                    setDependingValue(dependingFieldValues[response]);
                }
            });
        }
        return () => {
            isMounted = false;
        };
    }, [dependingFieldValues]);

    const handleValueChanges = (event) => {
        const value = event.target.value;

        setDropDownSelectedValue(value);
        props.onValueChange(columnId, fieldName, value, langKey);

        if (dependentField !== '') {
            props.setDependentFieldValuesFromChild({
                [`${columnId}-${dependentField}`]: value,
            });
        }
    };

    const hasInnerObjects = (property: string) => {
        if (typeof cmpData[property] === 'object') {
            return true;
        }

        return false;
    };

    const isDefaultNestedProperty = () => {
        if (defaultNestedProperties.includes(fieldName)) {
            return true;
        }

        return false;
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>{labelName}</label>
                <select
                    className="form-control"
                    id={id}
                    value={dropDownSelectedValue}
                    onChange={handleValueChanges}
                >
                    <option disabled value="">
                        -- select an option --
                    </option>
                    {cmpDataLists &&
                        cmpDataLists.length !== 0 &&
                        cmpDataLists.map((cmpDataList, index) => {
                            // If cmpData object contains nested objects
                            if (hasInnerObjects(cmpDataList) && !isDefaultNestedProperty()) {
                                // If there is no option which to select amoung objects
                                if (!hasDependingValue) {
                                    return (
                                        <React.Fragment
                                            key={`tableDropDown--${index}`}
                                        ></React.Fragment>
                                    );
                                } else {
                                    if (cmpDataList === dependingValue) {
                                        const childObjProp: any = Object.entries(
                                            cmpData[cmpDataList]
                                        );

                                        if (childObjProp.length !== 0) {
                                            return childObjProp.map(([key, value]) => {
                                                return (
                                                    <option
                                                        key={`tableDropDown-${key}-${index}`}
                                                        value={key}
                                                    >
                                                        {value}
                                                    </option>
                                                );
                                            });
                                        } else {
                                            return (
                                                <React.Fragment
                                                    key={`tableDropDown---${index}`}
                                                ></React.Fragment>
                                            );
                                        }
                                    }
                                }
                            } else {
                                return (
                                    <option key={`tableDropDown-${index}`} value={cmpDataList}>
                                        {typeof cmpData[cmpDataList] === 'string'
                                            ? cmpData[cmpDataList]
                                            : cmpDataList.toLocaleUpperCase()}
                                    </option>
                                );
                            }
                        })}
                </select>
            </div>
        </>
    );
}

export default TableDropDownComponent;
