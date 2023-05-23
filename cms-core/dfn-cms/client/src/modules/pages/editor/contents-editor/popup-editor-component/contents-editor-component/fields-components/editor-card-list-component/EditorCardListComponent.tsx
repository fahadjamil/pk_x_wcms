import React, { useEffect, useState } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';

function EditorCardListComponent(props: FieldComponetModel) {
    const { componentSettings, languageData, initialValue, dataKey } = props;
    const { cardsPerRow, collection, recordsLimit, viewMoreLink } = componentSettings;

    const featureList = {
        image: 'Card Image',
        title: 'Card Title',
        text: 'Card Text',
        link: 'Link',
    };

    const [uiConfigs, setUiConfigs] = useState<any>({});
    const [featureConfigs, setFeatureConfigs] = useState<any>({});

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && componentSettings && Object.keys(componentSettings.length > 0)) {
            const { collection } = componentSettings;

            if (collection && Object.keys(collection.length > 0)) {
                const { value } = collection;
                const { fieldsList } = value;
                let configs: any = {
                    features: [],
                };

                if (fieldsList && Object.keys(fieldsList).length !== 0) {
                    Object.keys(fieldsList).forEach((fieldList, fieldIndex) => {
                        let feature: any = {
                            featureId: fieldList + '-' + fieldIndex,
                            featureName: fieldList,
                            featureDisplayName: fieldList.toUpperCase(),
                        };
                        configs.features.push(feature);
                    });
                }

                setUiConfigs(configs);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [componentSettings]);

    useEffect(() => {
        if (initialValue) {
            languageData.forEach((langData, langDataIndex) => {
                const { langKey } = langData;
                props.onValueChange({ [dataKey]: initialValue[langKey] }, langKey);
                setFeatureConfigs(initialValue[langKey]);
            });
        }
    }, []);

    const handleValueChanges = (value, key, displayName) => {
        const features = {
            [key]: {
                mappingField: value,
                displayName: displayName,
            },
        };

        const updatedFeatures = {
            ...featureConfigs,
            features: {
                ...featureConfigs.features,
                ...features,
            },
        };

        languageData.forEach((langData, langDataIndex) => {
            const { langKey } = langData;
            props.onValueChange({ cardList: updatedFeatures }, langKey);
        });

        setFeatureConfigs(updatedFeatures);
    };

    if (collection) {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-center">Features</h5>
                    <div className="row mt-2 mb-2">
                        <div className="col-md-3 offset-md-3">
                            <strong>Feature</strong>
                        </div>
                        <div className="col-md-3">
                            <strong>Mapping Field</strong>
                        </div>
                    </div>
                    {featureList &&
                        Object.entries(featureList).map(([key, value], featureIndex) => {
                            return (
                                <div className="row" key={`${key}-${featureIndex}`}>
                                    <div className="col-md-3 offset-md-3">
                                        <div className="form-group">
                                            <label htmlFor={key}>{value}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <select
                                                className="form-control form-control-sm"
                                                id={key}
                                                value={
                                                    featureConfigs?.features
                                                        ? featureConfigs.features[key]
                                                            ? featureConfigs.features[key]
                                                                  .mappingField
                                                            : ''
                                                        : ''
                                                }
                                                onChange={(event) => {
                                                    const selectedValue = event.target.value;

                                                    handleValueChanges(selectedValue, key, value);
                                                }}
                                            >
                                                <option disabled value="">
                                                    -- select an option --
                                                </option>

                                                {uiConfigs &&
                                                    uiConfigs.features &&
                                                    uiConfigs.features.map(
                                                        (configFeature, configFeatureIndex) => {
                                                            const {
                                                                featureId,
                                                                featureName,
                                                                featureDisplayName,
                                                            } = configFeature;

                                                            return (
                                                                <option
                                                                    value={featureName}
                                                                    key={featureId}
                                                                >
                                                                    {featureDisplayName}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }

    return (
        <div className="alert alert-warning" role="alert">
            Please select a collection from component settings.
        </div>
    );
}

export default EditorCardListComponent;
