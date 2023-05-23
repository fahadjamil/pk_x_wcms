import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ShortTextComponent } from '../../../shared/ui-components/input-fields/short-text-component';
import AddColorComponent from './AddColorComponent';
import ColorComponent from './ColorComponent';
import FontSizePicker from './FontSizePickerComponent';
import ThemeUpdateComponent from './ThemeUpdateComponent';

const Section = styled.div`
    width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
`;

function PropertiesComponent(props) {
    const [background, setBackground] = useState();

    let sectionTitle = props.sectionName;
    let sectionType = props.type;
    const [properties, setProperties] = useState(props[sectionType]);
    const [isUpdated, setIsUpdated] = useState(false);
    // let properties = params.properties;

    let lineHeightItems = [
        { name: '1', value: '1' },
        { name: '1.25', value: '1.25' },
        { name: '1.5', value: '1.5' },
    ];

    let fontWeightItems = [
        // { name: '300', value: '300' },
        { name: '400', value: '400' },
        { name: '500', value: '500' },
        { name: '600', value: '600' },
    ];

    let fontFamilyItems = [
        { name: 'Arial', value: 'arial' },
        { name: 'Time New Roman', value: 'time new roman' },
        { name: 'Tajawal', value: 'Tajawal' },
    ];

    let propKeys: string[] = [];
    if (properties) {
        Object.keys(properties).forEach(function (key: string) {
            propKeys.push(key);
        });
    }

    useEffect(() => {
        setIsUpdated(false);
    }, [isUpdated]);

    const updateChange = (propertie) => {
        setProperties(propertie);
        setIsUpdated(true);
    };

    const typeSwitch = (prop, key, index, section) => {
        let meta = {
            key: key,
            index: index,
            section: section,
        };

        switch (prop.porpType) {
            case 'colorPicker':
                return (
                    <ColorComponent
                        color={prop.value}
                        data={props}
                        meta={meta}
                        isAddPicker={props.isAddPicker}
                        onUpdate={updateChange}
                    />
                );
            case 'fontSize':
                return (
                    <FontSizePicker
                        size={prop.value}
                        data={props}
                        meta={meta}
                        onUpdate={updateChange}
                    />
                );
            case 'lineHeight':
                return (
                    <ThemeUpdateComponent
                        initialValue={prop.value}
                        itemsList={lineHeightItems}
                        isCustom={true}
                        data={props}
                        meta={meta}
                        onUpdate={updateChange}
                    />
                );
            case 'fontWeight':
                return (
                    <ThemeUpdateComponent
                        initialValue={prop.value}
                        itemsList={fontWeightItems}
                        isCustom={true}
                        data={props}
                        meta={meta}
                        onUpdate={updateChange}
                    />
                );
            case 'fontFamily':
                return (
                    <ThemeUpdateComponent
                        initialValue={prop.value}
                        itemsList={fontFamilyItems}
                        isCustom={false}
                        data={props}
                        meta={meta}
                        onUpdate={updateChange}
                    />
                );
            case 'spacer':
                return (
                    <ShortTextComponent
                        id={key}
                        label="Spacer"
                        name={index}
                        defaultValue={prop.value}
                        isRequired={false}
                        minLength={0}
                        maxLength={524288}
                        // meta={meta}
                        handleValueChange={updateChange}
                    />
                );

            default:
                return <></>;
        }
    };

    return (
        <>
            <br />
            <div>
                <h6>{sectionTitle} Section </h6>
                <div className="accordion" id="accordionExample">
                    {propKeys.map(function (key: string, index) {
                        return (
                            <div className="card" key={index}>
                                <div className="card-header" id={'heading' + key}>
                                    <h2 className="mb-0">
                                        <button
                                            className="btn btn-link btn-block text-left"
                                            type="button"
                                            data-toggle="collapse"
                                            data-target={'#collapse' + key}
                                            aria-expanded="false"
                                            aria-controls={'collapse' + key}
                                        >
                                            {key}
                                        </button>
                                    </h2>
                                </div>

                                <div
                                    id={'collapse' + key}
                                    className="collapse"
                                    aria-labelledby={'heading' + key}
                                    data-parent="#accordionExample"
                                >
                                    <div className="card-body">
                                        {properties[key].map((property, index) => {
                                            return (
                                                <div key={index} className="row">
                                                    <span className="col-2">
                                                        {property.propertyName} :{' '}
                                                    </span>
                                                    <span className="col-2">{property.value}</span>
                                                    <span className="col-8">
                                                        {typeSwitch(
                                                            property,
                                                            key,
                                                            index,
                                                            sectionType
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {sectionTitle === 'Colors' && (
                                            // <button className="btn btn-primary">Add</button>
                                            <AddColorComponent
                                                theme={props}
                                                isAddPicker={props.isAddPicker}
                                                onUpdate={updateChange}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(PropertiesComponent);
