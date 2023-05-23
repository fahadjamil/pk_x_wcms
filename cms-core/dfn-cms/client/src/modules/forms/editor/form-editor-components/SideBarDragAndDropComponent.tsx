import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
    ColumnItemComponentPropType,
    formColumnModel,
    FormSectionModel,
    SectionItemComponentPropType,
    SideBarDragAndDropPropTypes,
} from '../../shared/models/editorModels';
import ItemHideIcon from '../../../shared/resources/ItemHideIcon';
import ItemViewIcon from '../../../shared/resources/ItemViewIcon';

const MainSectionsListContainer = styled.div`
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    min-height: auto;
    content: '01';
`;

const MainSectionsList = styled.ul`
    transition: background-color 0.2s ease;
    list-style: none;
    padding: 0;
    background-color: ${(props) => (props.isDraggingOver ? '#66bcff33' : 'none')};
    content: '02';
    border-radius: 0.25rem;
`;

const SectionItem = styled.li`
    color: #ffffffb3;
    border: ${(props) => (props.isDragging ? 'none' : 'none')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#66bcff33' : 'none')};
    content: '06';
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
`;

const ColumnsList = styled.ul`
    transition: background-color 0.2s ease;
    border: ${(props) => (props.isDragging ? '1px solid #FFF' : '1px dashed #ffffff33')};
    margin: 0.5rem;
    list-style: none;
    padding: 0;
    background-color: ${(props) => (props.isDraggingOver ? '#66bcff33' : 'none')};
    margin: 0.5rem 0;
    border-radius: 0.25rem;
`;

const ColumnItem = styled.li`
    color: #ffffffb3;
    border: ${(props) => (props.isDragging ? 'none' : 'none')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#66bcff33' : 'none')};
    content: '08';
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
`;

const FormFieldDeleteIcon = styled.span`
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    margin-right: 6px;
    float: right;
    color: #ffffffb3;
    &:hover {
        opacity: 1;
    }
`;

const ColumnItemComponent = (props: ColumnItemComponentPropType) => {
    const { columnId, label, columnIndex, activeStatus, compType } = props;

    function handleFormGroupItemDeactivation() {
        props.setConfirmationData({
            modalTitle: `Deactivate Form Item - ${label}`,
            show: true,
            body: (
                <div className="alert alert-danger" role="alert">
                    Are you sure you want to deactivate this form item?
                </div>
            ),
            handleClose: () => {
                props.setConfirmationData(undefined);
            },
            handleConfirme: deactivateFormGroupItem,
        });
    }

    function deactivateFormGroupItem() {
        props.setConfirmationData(undefined);

        const updatedForm = { ...props.selectedForm };

        const selectdColumnItem = updatedForm.sections[0].columns.find(
            (column) => column.columnId == columnId
        );

        if (selectdColumnItem) {
            selectdColumnItem.activeStatus = false;
        }

        props.setSelectedForm(updatedForm);
    }

    function handleFormGroupItemActivation() {
        props.setConfirmationData({
            modalTitle: `Activate Form Item - ${label}`,
            show: true,
            body: (
                <div className="alert alert-info" role="alert">
                    Are you sure you want to activate this form item?
                </div>
            ),
            handleClose: () => {
                props.setConfirmationData(undefined);
            },
            handleConfirme: activateFormGroupItem,
        });
    }

    function activateFormGroupItem() {
        props.setConfirmationData(undefined);

        const updatedForm = { ...props.selectedForm };

        const selectdColumnItem = updatedForm.sections[0].columns.find(
            (column) => column.columnId == columnId
        );

        if (selectdColumnItem) {
            selectdColumnItem.activeStatus = true;
        }

        props.setSelectedForm(updatedForm);
    }

    return (
        <Draggable draggableId={columnId} index={columnIndex} key={columnId}>
            {(provided, snapshot) => (
                <ColumnItem
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
                        <span
                            onClick={(e) => {
                                console.log('------------Form Item Clicked--------------');
                            }}
                        >
                            {label}
                        </span>
                        {compType !== 'recaptcha' &&
                            compType !== 'submit' &&
                            compType !== 'reset' &&
                            (activeStatus ? (
                                <FormFieldDeleteIcon
                                    className="badge badge-outline-danger badge-pill hover-child"
                                    onClick={handleFormGroupItemDeactivation}
                                >
                                    <ItemHideIcon
                                        width="18px"
                                        height="18px"
                                        title="Deactivate Form Item"
                                    />
                                </FormFieldDeleteIcon>
                            ) : (
                                <FormFieldDeleteIcon
                                    className="badge badge-outline-danger badge-pill hover-child"
                                    onClick={handleFormGroupItemActivation}
                                >
                                    <ItemViewIcon
                                        width="18px"
                                        height="18px"
                                        title="Activate Form Item"
                                    />
                                </FormFieldDeleteIcon>
                            ))}
                    </span>
                </ColumnItem>
            )}
        </Draggable>
    );
};

const SectionItemComponent = (props: SectionItemComponentPropType) => {
    const { sectionId, columns, sectionIndex, selectedLanguage } = props;

    return (
        <Draggable draggableId={sectionId} index={sectionIndex} key={sectionId}>
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
                        {`Section - ${sectionIndex + 1}`}
                    </span>
                    <Droppable droppableId={sectionId} type={`columnItem`}>
                        {(provided, snapshot) => (
                            <ColumnsList
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                {columns &&
                                    Array.isArray(columns) &&
                                    columns.length > 0 &&
                                    columns.map((column: formColumnModel, columnIndex: number) => {
                                        const { columnId, label, activeStatus, compType } = column;

                                        return (
                                            <ColumnItemComponent
                                                columnId={columnId}
                                                label={label[selectedLanguage.langKey] || ''}
                                                columnIndex={columnIndex}
                                                activeStatus={activeStatus}
                                                compType={compType}
                                                key={`column-item-${columnId}`}
                                                selectedForm={props.selectedForm}
                                                setSelectedForm={props.setSelectedForm}
                                                setConfirmationData={props.setConfirmationData}
                                            />
                                        );
                                    })}
                                {provided.placeholder}
                            </ColumnsList>
                        )}
                    </Droppable>
                </SectionItem>
            )}
        </Draggable>
    );
};

function SideBarDragAndDropComponent(props: SideBarDragAndDropPropTypes): JSX.Element | null {
    function onDragEnd(results) {
        if (props.selectedLanguage) {
            const { destination, source, draggableId, type } = results;

            // If user drops outside of the droppable zone
            if (!destination) {
                return;
            }

            // If user drops the item back into the the start position
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return;
            }

            if (type === 'columnItem') {
                const newSections: FormSectionModel[] = Array.from(props.selectedForm.sections);
                const newSection: FormSectionModel = newSections[0];
                const newColumns: formColumnModel[] = Array.from(newSection.columns);

                const newColumn: formColumnModel | undefined =
                    newColumns &&
                    newColumns.find((column, index) => {
                        return column.columnId === draggableId;
                    });

                if (newColumn) {
                    newColumns.splice(source.index, 1);
                    newColumns.splice(destination.index, 0, newColumn);
                    newSection.columns = newColumns;
                    newSections[0] = newSection;
                }

                const newSelectedForm = {
                    ...props.selectedForm,
                    sections: newSections,
                };

                props.setSelectedForm(newSelectedForm);

                return;
            }
        }
    }

    if (props.selectedLanguage) {
        const { _id, sections } = props.selectedForm;

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <MainSectionsListContainer>
                    <Droppable
                        droppableId={_id || 'forms-droppable-id'}
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
                                {sections &&
                                    Array.isArray(sections) &&
                                    sections.length > 0 &&
                                    sections.map(
                                        (section: FormSectionModel, sectionIndex: number) => {
                                            const { sectionId, columns } = section;

                                            return (
                                                <SectionItemComponent
                                                    key={`section-item-${sectionId}`}
                                                    sectionId={sectionId}
                                                    columns={columns}
                                                    selectedLanguage={props.selectedLanguage}
                                                    sectionIndex={sectionIndex}
                                                    selectedForm={props.selectedForm}
                                                    setSelectedForm={props.setSelectedForm}
                                                    setConfirmationData={props.setConfirmationData}
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
        );
    }

    return null;
}

export default SideBarDragAndDropComponent;
