import React from 'react';
import styled from 'styled-components';
import SideBarMenuComponent from '../../shared/ui-components/SideBarMenuComponent';
import { SideBarContentPropTypes } from './models/sharedModels';
import SideBarDragAndDropComponent from './../editor/form-editor-components/SideBarDragAndDropComponent';

const BackToFormsButton = styled.button`
    color: rgb(66, 165, 245);
    height: 50px;
    &:hover {
        color: rgb(66, 165, 245);
    }
`;
const AddNewFormButton = styled.button`
    color: #42a5f5;
    border: solid 1px #42a5f5;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    &:hover {
        color: #42a5f5;
    }
`;

function SideBarContentComponent(props: SideBarContentPropTypes) {
    function handleAddNewForm() {
        props.setActiveComponent('addForm');

        if (props.editMode) {
            props.setEditMode(false);
        }
    }

    function handleBackToForms() {
        props.setConfirmationData({
            modalTitle: 'Discard Changes',
            show: true,
            body: (
                <div className="alert alert-warning" role="alert">
                    Are you sure you want to discard the changes?
                </div>
            ),
            handleClose: () => {
                props.setConfirmationData(undefined);
            },
            handleConfirme: backToForms,
        });
    }

    function backToForms() {
        props.setConfirmationData(undefined);
        props.setEditMode(false);

        if (props.selectedForm) {
            props.getSelectedFormItem(props.selectedForm);
        }
    }

    return (
        <>
            {props.editMode && (
                <div>
                    <BackToFormsButton className="btn float-left" onClick={handleBackToForms}>
                        Back To Forms
                    </BackToFormsButton>
                </div>
            )}
            <div>
                <AddNewFormButton className="btn btn-block" onClick={handleAddNewForm}>
                    Add New Form
                </AddNewFormButton>
            </div>
            {!props.editMode && (
                <div className="mt-3">
                    <SideBarMenuComponent
                        menuData={props.menuData}
                        activeMenuItemID={props.activeMenuItemID}
                        onMenuClicked={props.onMenuItemClicked}
                        setActiveMenuItemID={props.setActiveMenuItemID}
                    />
                </div>
            )}
            {props.editMode && props.selectedForm && (
                <div className="mt-3">
                    <SideBarDragAndDropComponent
                        selectedForm={props.selectedForm}
                        selectedLanguage={props.languages[0]}
                        setSelectedForm={props.setSelectedForm}
                        setConfirmationData={props.setConfirmationData}
                    />
                </div>
            )}
        </>
    );
}

export default SideBarContentComponent;
