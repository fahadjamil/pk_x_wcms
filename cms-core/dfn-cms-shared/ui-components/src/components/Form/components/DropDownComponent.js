import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function DropDownComponent(props) {
    const {
        id,
        label,
        value,
        dbName,
        selectedLanguage,
        settings,
        uiProperties,
        validationErrors,
        handleValueChanges,
    } = props;
    const [dropDownContentsList, setDropDownContentsList] = useState(undefined);

    useEffect(() => {
        let isMounted = true;

        if (settings) {
            const { itemList, selectedCollection } = settings;

            if (itemList && itemList.length > 0) {
                setDropDownContentsList(itemList);
            }

            if (selectedCollection && dbName) {
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
        const httpHeaders = {
            headers: {},
            params: {
                collectionName: selectedCollection,
                nameSpace: dbName,
            },
        };

        Axios.get('/api/cms/getCollectionData', httpHeaders)
            .then((response) => {
                const { data, status } = response;

                if (status === 200) {
                    if (data && Array.isArray(data) && data.length > 0) {
                        if (selectedLanguage) {
                            const optionsData = data.map((item) => {
                                const { active, _id, fieldData } = item;

                                if (active) {
                                    if (
                                        fieldData[selectedLanguage.langKey] &&
                                        fieldData[selectedLanguage.langKey].entry_name
                                    ) {
                                        return fieldData[selectedLanguage.langKey].entry_name;
                                    }
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

    if (id && label) {
        return (
            <React.Fragment>
                <label htmlFor={id} className={uiProperties.label.classes || ''}>
                    {label}
                </label>
                <select
                    className={uiProperties.field.classes || ''}
                    id={id}
                    placeholder={label}
                    value={value || ''}
                    name={id}
                    required={(settings && settings.required) || false}
                    onChange={handleValueChanges}
                >
                    <option value="">-- select an option --</option>
                    {dropDownContentsList &&
                        dropDownContentsList.length !== 0 &&
                        dropDownContentsList.map((dropDownItem, index) => {
                            return (
                                <option
                                    key={`form-drop-down-component-${index}-${dropDownItem}`}
                                    value={dropDownItem || ''}
                                >
                                    {dropDownItem ? dropDownItem : ''}
                                </option>
                            );
                        })}
                </select>
                {validationErrors && (
                    <div className="invalid-feedback d-block">
                        {validationErrors.message || 'Invalid field data'}
                    </div>
                )}
            </React.Fragment>
        );
    }

    return <React.Fragment></React.Fragment>;
}

export default DropDownComponent;
