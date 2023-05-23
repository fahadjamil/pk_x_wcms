import React, { useEffect } from 'react';
import DropDownContainerPropType from '../models/DropDownContainerPropType';
import DropDownComponent from './DropDownComponent';
import { getComponentLabel } from '../../UiComponentsUtils';
import { useState } from 'react';
import { getAuthorizationHeader } from '../../../utils/AuthorizationUtils';
import Axios from 'axios';

function DropDownContainerCustCollection(props: DropDownContainerPropType) {
    const { id, name, value, label, type, dropDownListContent, fieldIndex, dataKey, language } =
        props;
    const [selectedvalue, setselectedvalue] = useState(value);
    const [dropDownContentsList, setDropDownContentsList] = useState<any>(undefined);

    useEffect(() => {
        let isMounted: boolean = true;

        if (dropDownListContent) {
            const { itemList, selectedCollection } = dropDownListContent;

            if (itemList && itemList.length > 0) {
                setDropDownContentsList(itemList);
            }

            if (selectedCollection) {
                if (!dropDownContentsList) {
                    getSelectedCustomCollectionData(selectedCollection);
                }
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

    function getSelectedCustomCollectionData(selectedCollection) {
        const headerParameter = { collection: selectedCollection };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/all', httpHeaders)
            .then((response) => {
                const { data, status } = response;

                if (status === 200) {
                    if (data && Array.isArray(data) && data.length > 0) {
                        if (language) {
                            const optionsData = data.map((item) => {
                                const { active, _id, fieldData } = item;

                                if (active) {
                                    return fieldData[language.langKey]?.entry_name;
                                }
                            });

                            setDropDownContentsList(optionsData);
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onValuechangeHandler = (e) => {
        setselectedvalue(e.target.value);
        props.onValueChange({ [dataKey]: e.target.value }, language.langKey);
    };
    const isAutofocus: boolean = fieldIndex === 0 ? true : false;

    return (
        <>
            <div className="form-group">
                <label htmlFor={id}>
                    {label ? label : getComponentLabel(dataKey, language.language)}
                </label>
                <DropDownComponent
                    id={id}
                    name={name}
                    type={type}
                    value={selectedvalue}
                    isRequired={false}
                    isAutofocus={isAutofocus}
                    dropDownListContent={dropDownContentsList}
                    onValueChange={onValuechangeHandler}
                />
            </div>
        </>
    );
}

export default DropDownContainerCustCollection;
