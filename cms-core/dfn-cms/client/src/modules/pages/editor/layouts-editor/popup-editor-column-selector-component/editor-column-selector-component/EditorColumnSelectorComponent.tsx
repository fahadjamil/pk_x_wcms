import React from 'react';
import { IconColumnsMap, SectionsConfigurations } from 'ui-components';
import { SectionStructureModel } from '../../models/SectionStructureModel';

interface EditorColumnSelectorComponentModel {
    onColumnSelect: any;
}

function EditorColumnSelectorComponent(props: EditorColumnSelectorComponentModel) {
    const resetBackground = (event) => {
        event.target.style.fill = '#d5dadf';
    };

    const changeBackground = (event) => {
        event.target.style.fill = 'black';
    };

    const getComponent = (section: SectionStructureModel) => {
        const IconComp: any = IconColumnsMap[section.displayImage];

        return (
            <div className="col-6 col-md-2 mt-5" key={section.sectionTypeId}>
                <span
                    className="d-inline-block"
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        props.onColumnSelect && props.onColumnSelect(section);
                    }}
                >
                    {IconComp && (
                        <IconComp
                            width="100%"
                            height="60px"
                            fill="#d5dadf"
                            onMouseEnter={changeBackground}
                            onMouseLeave={resetBackground}
                        />
                    )}
                </span>
            </div>
        );
    };

    if (SectionsConfigurations) {
        return (
            <>
                {SectionsConfigurations.sectionTypes.map(
                    (section: SectionStructureModel, index: number) => {
                        return getComponent(section);
                    }
                )}
            </>
        );
    } else {
        return <></>;
    }
}

export default EditorColumnSelectorComponent;
