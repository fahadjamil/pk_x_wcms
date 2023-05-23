import React, { useRef } from 'react';
import styled from 'styled-components';
import { FormEditorPropTypes } from '../shared/models/editorModels';
import { FormComponent } from 'ui-components';
import PESectionSettings from './../../shared/resources/PageEditor-Section-Settings';
import PESectionEdit from './../../shared/resources/PageEditor-Section-Edit';
import FormSettingsComponent from './form-editor-components/FormSettingsComponent';
import EditFormComponent from './form-editor-components/EditFormComponent';

const FormRow = styled.div`
    border: 1px dashed rgb(213, 218, 223);
    padding-top: 5px;
    padding-bottom: 5px;
    position: relative;
    border-radius: 4px;
`;

const FormEditSection = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.375rem 0.5rem;
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
    font-size: 11px;
    opacity: 0;
    transition: opacity 0.3s;
    &:hover {
        opacity: 1;
        transition: opacity 0.3s;
    }
`;

const FormBadge = styled.span`
    color: #606b8c;
    border-radius: 4px !important;
    font-family: Poppins;
    font-weight: 400;
    letter-spacing: 0.5px;
    background: #eee;
    float: left;
    font-size: 11px;
    top: 1px;
    position: relative;
    margin-right: 6px;
`;

const FormSettingsIcon = styled.span`
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.3s;
    margin-right: 6px;
    float: left;
    &:hover {
        opacity: 1;
    }
`;

const FormEditIcon = styled.span`
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.3s;
    margin-right: 6px;
    float: left;
    &:hover {
        opacity: 1;
    }
`;

function FormEditorComponent(props: FormEditorPropTypes): JSX.Element {
    const formSettingsComponentRef: any = useRef();
    const EditFormComponentRef: any = useRef();

    function changeFormSettings() {
        if (props.editMode) {
            props.setInformationData({
                modalTitle: 'Form Settings',
                show: true,
                size: 'xl',
                submitBtnText: 'Save',
                body: (
                    <FormSettingsComponent
                        ref={formSettingsComponentRef}
                        {...props}
                    ></FormSettingsComponent>
                ),
                handleClose: () => {
                    props.setInformationData(undefined);
                },
                handleConfirme: () => {
                    if (formSettingsComponentRef?.current?.handleConfirme) {
                        formSettingsComponentRef.current.handleConfirme();
                    }
                    props.setInformationData(undefined);
                },
            });
        }
    }

    function editForm() {
        if (props.editMode) {
            props.setInformationData({
                modalTitle: 'Edit Form',
                show: true,
                size: 'xl',
                submitBtnText: 'Save',
                body: <EditFormComponent ref={EditFormComponentRef} {...props}></EditFormComponent>,
                handleClose: () => {
                    props.setInformationData(undefined);
                },
                handleConfirme: () => {
                    if (EditFormComponentRef?.current?.handleConfirme) {
                        EditFormComponentRef.current.handleConfirme();
                    }
                    props.setInformationData(undefined);
                },
            });
        }
    }

    return (
        <div className="container-fluid" style={{ backgroundColor: 'white' }}>
            <div className="row">
                {!props.editMode && props.languages && props.languages[0] && (
                    <div className="col-md-8 offset-md-2 mt-3 mb-3 ">
                        <FormComponent
                            selectedForm={props.selectedForm}
                            lang={props.languages[0]}
                        />
                    </div>
                )}
                {props.editMode && props.languages && props.languages[0] && (
                    <FormRow className="offset-md-1 col-md-10 mt-3 mb-3 ">
                        <FormEditSection>
                            <FormBadge className="badge">Form</FormBadge>
                            <FormSettingsIcon onClick={changeFormSettings}>
                                <PESectionSettings
                                    width="20px"
                                    height="20px"
                                    title="Form Settings"
                                />
                            </FormSettingsIcon>
                            <FormEditIcon onClick={editForm}>
                                <PESectionEdit width="20px" height="20px" title="Form Edit" />
                            </FormEditIcon>
                        </FormEditSection>
                        <div className="mt-4">
                            <FormComponent
                                selectedForm={props.selectedForm}
                                lang={props.languages[0]}
                            />
                        </div>
                    </FormRow>
                )}
            </div>
        </div>
    );
}

export default React.memo(FormEditorComponent);
