import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ComponentsConfiguration as ComponenetModels } from 'ui-components';

import ColumnModel, {
    InnerColumnsModel,
    InnerSectionsModel,
} from '../../../shared/models/page-data-models/ColumnModel';
import PageModel from '../../../shared/models/page-data-models/PageModel';
import SectionModel from '../../../shared/models/page-data-models/SectionModel';
import TemplateModel from '../../../shared/models/TemplateModel';
import { getComponentModel } from '../PagesPreviewUtils';
import {
    ColumnItem,
    ColumnsList,
    ComponentItem,
    ComponentsList,
    InnerColumnItem,
    InnerSectionItem,
    InnerSectionsList,
    MainSectionsList,
    MainSectionsListContainer,
    SectionItem,
    templateNavigatorStyles,
} from './NavigatorPanelComponentStyles';

const InnerColumnUiComponent = (props) => {
    const { column, innerColumn, componentClick } = props;
    return (
        <ComponentItem
            key={`innerColumns${column.columnId}${innerColumn.columnId}`}
            onClick={(event: any) => {
                event.preventDefault();
                componentClick(innerColumn, column);
            }}
        >
            {innerColumn?.compType === '' ? 'INNER COLUMN' : innerColumn?.compType.toUpperCase()}
        </ComponentItem>
    );
};

const InnerColumnComponent = (props) => {
    const { innerSection, innerSectionIndex, innerColumn, column, componentClick } = props;

    return (
        <Draggable draggableId={innerSection.sectionId} index={innerSectionIndex}>
            {(provided, snapshot) => (
                <InnerColumnItem
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                    onClick={(event: any) => {
                        event.preventDefault();
                        componentClick(innerColumn, column);
                    }}
                >
                    <span
                        {...provided.dragHandleProps}
                        style={{
                            display: 'block',
                        }}
                    >
                        {innerSection?.columns[0].compType === ''
                            ? 'INNER COLUMN'
                            : innerSection?.columns[0].compType.toUpperCase()}
                    </span>
                </InnerColumnItem>
            )}
        </Draggable>
    );
};

const InnerSectionComponent = (props) => {
    const { innerSection, innerSectionIndex, column, componentClick } = props;

    return (
        <Draggable draggableId={innerSection?.sectionId} index={innerSectionIndex}>
            {(provided, snapshot) => (
                <InnerSectionItem
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <span
                        {...provided.dragHandleProps}
                        style={{
                            display: 'block',
                        }}
                    >
                        {`InnerSection - ${innerSectionIndex + 1}`}
                    </span>
                    <ComponentsList>
                        {innerSection?.columns.map(
                            (innerColumn: InnerColumnsModel, innerColumnIndex: number) => {
                                const { columnId } = innerColumn;
                                return (
                                    <InnerColumnUiComponent
                                        innerColumn={innerColumn}
                                        column={column}
                                        componentClick={componentClick}
                                        key={columnId}
                                    />
                                );
                            }
                        )}
                    </ComponentsList>
                </InnerSectionItem>
            )}
        </Draggable>
    );
};

const InnerSectionsGeneratorComponent = (props) => {
    const { innerSection, column, componentClick } = props;

    if (innerSection.length === 0) {
        return (
            <InnerSectionItem
                onClick={(event: any) => {
                    event.preventDefault();
                    console.log(
                        'Column has no any inner sections. Show add component and add section buttons to open up relevant modals.'
                    );
                }}
            />
        );
    }

    if (innerSection.length === 1) {
        const { columns, sectionId } = innerSection[0];

        // If inner section has only one column
        if (columns.length === 0) {
            console.log('Inner section has no any inner columns');
        }

        if (columns.length === 1) {
            return (
                <InnerColumnComponent
                    innerSection={innerSection[0]}
                    innerSectionIndex={0}
                    column={column}
                    innerColumn={columns[0]}
                    componentClick={componentClick}
                ></InnerColumnComponent>
            );
        }

        return (
            <InnerSectionComponent
                innerSection={innerSection[0]}
                innerSectionIndex={0}
                column={column}
                componentClick={componentClick}
            ></InnerSectionComponent>
        );
    }

    return (
        <>
            {innerSection.map((section, innerSectionIndex) => {
                const { sectionId, columns } = section;

                if (columns.length === 0) {
                    console.log('Inner section has no any inner columns');
                }

                if (columns.length === 1) {
                    return (
                        <InnerColumnComponent
                            innerSection={section}
                            innerSectionIndex={innerSectionIndex}
                            column={column}
                            innerColumn={columns[0]}
                            componentClick={componentClick}
                            key={sectionId}
                        ></InnerColumnComponent>
                    );
                }

                return (
                    <InnerSectionComponent
                        innerSection={section}
                        innerSectionIndex={innerSectionIndex}
                        column={column}
                        componentClick={componentClick}
                        key={sectionId}
                    ></InnerSectionComponent>
                );
            })}
        </>
    );
};

const MainSectionComponent = (props) => {
    const { section, index, layoutSection, componentClick } = props;

    return (
        <Draggable draggableId={section.sectionId + layoutSection} index={index}>
            {(provided, snapshot) => (
                <SectionItem
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <span
                        className="dragable__header"
                        {...provided.dragHandleProps}
                        style={{
                            display: 'block',
                        }}
                        data-toggle="collapse"
                        data-parent={'#level-${index + 1}'}
                        href={'#child-0${index + 1}'}
                    >
                        {`Section - ${index + 1}`}
                    </span>
                    <ColumnsList>
                        {section &&
                            section.columns &&
                            section.columns.map((column: ColumnModel, columnIndex: number) => {
                                const { section, columnId } = column;

                                return (
                                    <ColumnItem key={columnId}>
                                        <span
                                            className="dragable__header"
                                            {...provided.dragHandleProps}
                                            style={{
                                                display: 'block',
                                            }}
                                            data-toggle="collapse"
                                            data-parent={'#level-${index + 1}'}
                                            href={'#child-0${index + 1}-0${ColumnIndex + 1}'}
                                        >
                                            {`Column - ${columnIndex + 1}`}
                                        </span>
                                        <Droppable
                                            droppableId={columnId + layoutSection}
                                            type={`innerSectionItem_${layoutSection}`}
                                        >
                                            {(provided, snapshot) => (
                                                <InnerSectionsList
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    isDraggingOver={snapshot.isDraggingOver}
                                                >
                                                    <InnerSectionsGeneratorComponent
                                                        innerSection={section}
                                                        column={column}
                                                        componentClick={componentClick}
                                                    />
                                                    {provided.placeholder}
                                                </InnerSectionsList>
                                            )}
                                        </Droppable>
                                    </ColumnItem>
                                );
                            })}
                    </ColumnsList>
                </SectionItem>
            )}
        </Draggable>
    );
};

function NavigatorPanelComponent(props: any) {
    const page: PageModel = props.page;
    const template: TemplateModel = props.template;
    const contentData = props.contentData;

    const componentClick = (innerColumn: InnerColumnsModel, column: ColumnModel) => {
        const componentModelCopy = getComponentModel(innerColumn, ComponenetModels, contentData);

        // If a component already added to the inner column section - open Editor component
        if (componentModelCopy) {
            if (props.onComponentClick) {
                props.onComponentClick(innerColumn, componentModelCopy, column);
            }
        } else {
            // Else open Component list
            if (props.onComponentClick) {
                props.onComponentClick(innerColumn, null, column);
            }
        }
    };

    if (page && page.section) {
        return (
            <DragDropContext onDragEnd={props.onDragEnd}>
                <MainSectionsListContainer>
                    <Droppable
                        droppableId={page._id}
                        type="sectionItem"
                        className="nav nav-stacked"
                    >
                        {(provided, snapshot) => (
                            <MainSectionsList
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                                className="sample-001"
                            >
                                {page.section.map((section: SectionModel, index: number) => {
                                    const { sectionId } = section;

                                    return (
                                        <MainSectionComponent
                                            key={sectionId}
                                            section={section}
                                            index={index}
                                            layoutSection=""
                                            componentClick={componentClick}
                                        />
                                    );
                                })}
                                {provided.placeholder}
                            </MainSectionsList>
                        )}
                    </Droppable>
                </MainSectionsListContainer>
            </DragDropContext>
        );
    } else if (template && template.header.section && template.footer.section) {
        return (
            <>
                <span style={templateNavigatorStyles}> Header</span>
                <DragDropContext onDragEnd={props.onDragEnd}>
                    <MainSectionsListContainer className="sample-002">
                        <Droppable
                            droppableId={template._id}
                            type="sectionItem_header"
                            className="sample-003"
                        >
                            {(provided, snapshot) => (
                                <MainSectionsList
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    isDraggingOver={snapshot.isDraggingOver}
                                    className="sample-004"
                                >
                                    {template.header.section.map(
                                        (section: SectionModel, index: number) => {
                                            const { sectionId } = section;

                                            return (
                                                <MainSectionComponent
                                                    key={sectionId}
                                                    section={section}
                                                    index={index}
                                                    layoutSection="_header"
                                                    componentClick={componentClick}
                                                />
                                            );
                                        }
                                    )}
                                    {provided.placeholder}
                                </MainSectionsList>
                            )}
                        </Droppable>
                    </MainSectionsListContainer>
                </DragDropContext>

                <hr />
                <span style={templateNavigatorStyles}> Footer</span>
                <DragDropContext onDragEnd={props.onDragEnd}>
                    <MainSectionsListContainer className="sample-005">
                        <Droppable
                            droppableId={template._id}
                            type="sectionItem_footer"
                            className="sample-006"
                        >
                            {(provided, snapshot) => {
                                return (
                                    <MainSectionsList
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        isDraggingOver={snapshot.isDraggingOver}
                                        className="sample-007"
                                    >
                                        {template.footer.section.map(
                                            (section: SectionModel, index: number) => {
                                                const { sectionId } = section;

                                                return (
                                                    <MainSectionComponent
                                                        key={sectionId}
                                                        section={section}
                                                        index={index}
                                                        layoutSection="_footer"
                                                        componentClick={componentClick}
                                                    />
                                                );
                                            }
                                        )}
                                        {provided.placeholder}
                                    </MainSectionsList>
                                );
                            }}
                        </Droppable>
                    </MainSectionsListContainer>
                </DragDropContext>
            </>
        );
    } else {
        return <></>;
    }
}

export default NavigatorPanelComponent;
