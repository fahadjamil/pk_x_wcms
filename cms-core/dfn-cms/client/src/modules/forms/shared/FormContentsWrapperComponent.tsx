import React from 'react';
import AddNewFormComponent from '../editor/AddNewFormComponent';
import FormContentsComponent from './FormContentsComponent';

function FormContentsWrapperComponent(props) {
    switch (props.activeComponent) {
        case 'addForm':
            return (
                <AddNewFormComponent
                    unMappedCustomCollectionsListForms={props.unMappedCustomCollectionsListForms}
                    onCancelAddForm={props.onCancelAddForm}
                    database={props.database}
                    editMode={props.editMode}
                    languages={props.languages}
                    setEditMode={props.setEditMode}
                    setAllForms={props.setAllForms}
                    setActiveComponent={props.setActiveComponent}
                    setResponseData={props.setResponseData}
                    setSelectedFormWorkflowState={props.setSelectedFormWorkflowState}
                    getCustomCollectionTypeForms={props.getCustomCollectionTypeForms}
                />
            );
        case 'editForm':
            return (
                <>
                    {props.selectedForm && (
                        <FormContentsComponent
                            editMode={props.editMode}
                            setEditMode={props.setEditMode}
                            database={props.database}
                            selectedForm={props.selectedForm}
                            selectedFormWorkflowState={props.selectedFormWorkflowState}
                            languages={props.languages}
                            setSelectedForm={props.setSelectedForm}
                            setAllForms={props.setAllForms}
                            setResponseData={props.setResponseData}
                            setConfirmationData={props.setConfirmationData}
                            setSelectedFormWorkflowState={props.setSelectedFormWorkflowState}
                            getSelectedFormItem={props.getSelectedFormItem}
                            setInformationData={props.setInformationData}
                            getCustomCollectionTypeForms={props.getCustomCollectionTypeForms}
                        />
                    )}
                </>
            );
        default:
            return null;
    }
}

export default React.memo(FormContentsWrapperComponent);
