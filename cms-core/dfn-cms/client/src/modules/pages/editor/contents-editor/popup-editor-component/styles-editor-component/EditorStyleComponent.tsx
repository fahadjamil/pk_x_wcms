import React, { forwardRef, useImperativeHandle } from 'react';
import BaseComponentStyleModel from './models/BaseComponentStyleModel';
import FieldComponentStyleModel from './models/FieldComponentStyleModel';
import BaseComponentModel from '../../models/BaseComponentModel';
import FieldStyleComponentMapping from './styles-components/FieldStyleComponentMapping';
import { cloneDeep } from 'lodash';
import { StyleConfigModels, StyleConfigMappingModels } from 'ui-components';
import { createComponentStyleState } from '../../../../../shared/utils/EditorUtils';

interface EditorStyleComponentModel {
    baseComponentData: BaseComponentModel;
    theme: any;
}

const EditorStyleComponent = forwardRef((props: EditorStyleComponentModel, ref) => {
    const { styles } = StyleConfigModels;
    const { fieldStyles, componentStyles } = StyleConfigMappingModels;
    const stylesList = Object.keys(styles);
    const styledFields = Object.keys(fieldStyles);
    let baseComponentStyleState = {};
    let componentStyleState = createComponentStyleState(
        props.baseComponentData,
        styles,
        fieldStyles,
        stylesList,
        styledFields,
        componentStyles
    );

    useImperativeHandle(ref, () => ({
        onSubmitClicked() {
            const data = cloneDeep({ ...baseComponentStyleState });
            baseComponentStyleState = {};

            return data;
        },
    }));

    const setBaseComponentState = (state: any, dataKey: any, styleType: any) => {
        const dataKeys = Object.keys(baseComponentStyleState);

        if (dataKeys.length === 0 || !dataKeys.includes(dataKey)) {
            baseComponentStyleState = {
                ...baseComponentStyleState,
                ...state,
            };
        } else {
            baseComponentStyleState = {
                ...baseComponentStyleState,
                [dataKey]: {
                    ...baseComponentStyleState[dataKey],
                    ...state[dataKey],
                },
            };
        }
    };

    if (componentStyleState) {
        const { compFields, componentStyles, compId } = componentStyleState;

        return (
            <>
                <div className="container mt-3">
                    <div id="accordion">
                        {compFields.map((compField, index) => {
                            const { style, fieldType, dataKey, initialStyleConfigs } = compField;
                            const styleProps = Object.keys(style);

                            return (
                                <div className="card mb-3" key={`${compId}-${fieldType}-${dataKey}`}>
                                    <div
                                        className="card-header"
                                        id={`heading-${compId}-${fieldType}`}
                                    >
                                        <button
                                            className="btn btn-link"
                                            data-toggle="collapse"
                                            data-target={`#collapse-${compId}-${fieldType}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse-${compId}-${fieldType}`}
                                        >
                                            {dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                                        </button>
                                    </div>

                                    <div
                                        id={`collapse-${compId}-${fieldType}`}
                                        className="collapse show"
                                        aria-labelledby={`heading-${compId}-${fieldType}`}
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            {styleProps.map((styleProp, index) => {
                                                const styleVal = style[styleProp];
                                                const FieldStyleComponent =
                                                    FieldStyleComponentMapping[styleProp];

                                                return (
                                                    <div key={styleProp} className="container">
                                                        <FieldStyleComponent
                                                            dataKey={dataKey}
                                                            styleType={styleProp}
                                                            styleConfigurations={styleVal}
                                                            styleData={
                                                                initialStyleConfigs[styleProp]
                                                            }
                                                            theme={props.theme}
                                                            onValueChange={setBaseComponentState}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {componentStyles.map((compStyle, index) => {
                            const { style, fieldType, dataKey, initialStyleConfigs } = compStyle;
                            const styleProps = Object.keys(style);

                            return (
                                <div className="card mb-3" key={`${compId}-${fieldType}-${dataKey}`}>
                                    <div
                                        className="card-header"
                                        id={`heading-${compId}-${fieldType}`}
                                    >
                                        <button
                                            className="btn btn-link"
                                            data-toggle="collapse"
                                            data-target={`#collapse-${compId}-${fieldType}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse-${compId}-${fieldType}`}
                                        >
                                            Component Style
                                        </button>
                                    </div>

                                    <div
                                        id={`collapse-${compId}-${fieldType}`}
                                        className="collapse show"
                                        aria-labelledby={`heading-${compId}-${fieldType}`}
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            {styleProps.map((styleProp, index) => {
                                                const styleVal = style[styleProp];
                                                const FieldStyleComponent =
                                                    FieldStyleComponentMapping[styleProp];

                                                return (
                                                    <div key={styleProp} className="container">
                                                        <FieldStyleComponent
                                                            dataKey={dataKey}
                                                            styleType={styleProp}
                                                            styleConfigurations={styleVal}
                                                            styleData={
                                                                initialStyleConfigs[styleProp]
                                                            }
                                                            theme={props.theme}
                                                            onValueChange={setBaseComponentState}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
});

export default EditorStyleComponent;
