import { ResponseDataModel, ConfirmationDataModel, InformationDataModel } from './sharedModels';
import WorkflowStateModel from '../../../shared/models/workflow-models/WorkflowStateModel';
import LanguageModel from '../../../shared/models/LanguageModel';

export interface FormDataObjTypes {
    formTitle: string;
    customCollection: string;
}

export interface FormModel {
    _id?: string;
    title: string;
    customCollection: string;
    customCollectionName: string;
    sections: FormSectionModel[];
    version: number;
    userPermissons: string;
    workflowState?: WorkflowStateModel;
    workflowStateId?: string;
    createdBy: string;
    modifiedBy: string;
}

export interface StylesModel {
    classes: string;
}

export interface FieldValidationsModel {
    required: boolean;
    islocalized: boolean;
    min: string;
    max: string;
    ext: string;
}
export interface SettingsModel {
    validations: FieldValidationsModel | undefined;
}

export interface FromFieldUiPropertiesModel {
    classes?: string;
}

export interface FromFieldLabelUiPropertiesModel {
    classes?: string;
}

export interface UiPropertiesModel {
    field: FromFieldUiPropertiesModel;
    label: FromFieldLabelUiPropertiesModel;
}
export interface FormSectionModel {
    sectionId: string;
    sectionStyles: StylesModel;
    device: string;
    columns: formColumnModel[];
}

export interface formColumnModel {
    columnId: string;
    columnSize: number;
    activeStatus: boolean;
    columnStyles: StylesModel;
    compType: string;
    mappingField: string;
    label: any;
    settings: SettingsModel;
    uiProperties: UiPropertiesModel;
}

export interface FormEditorPropTypes {
    editMode: boolean;
    selectedForm: FormModel;
    languages: LanguageModel[];
    setResponseData: React.Dispatch<React.SetStateAction<ResponseDataModel | undefined>>;
    setConfirmationData: React.Dispatch<React.SetStateAction<ConfirmationDataModel | undefined>>;
    setInformationData: React.Dispatch<React.SetStateAction<InformationDataModel | undefined>>;
    setSelectedForm: React.Dispatch<React.SetStateAction<FormModel | undefined>>;
}

export interface FormLabelsEditorPropTypes {
    editMode: boolean;
    selectedForm: FormModel;
    languages: LanguageModel[];
    labelValues: any;
    setResponseData: React.Dispatch<React.SetStateAction<ResponseDataModel | undefined>>;
    setConfirmationData: React.Dispatch<React.SetStateAction<ConfirmationDataModel | undefined>>;
    setInformationData: React.Dispatch<React.SetStateAction<InformationDataModel | undefined>>;
    setLabelValues: React.Dispatch<React.SetStateAction<any>>;
    setSelectedForm: React.Dispatch<React.SetStateAction<FormModel | undefined>>;
}

export interface SideBarDragAndDropPropTypes {
    selectedForm: FormModel;
    selectedLanguage: LanguageModel;
    setSelectedForm: React.Dispatch<React.SetStateAction<FormModel | undefined>>;
    setConfirmationData: React.Dispatch<React.SetStateAction<ConfirmationDataModel | undefined>>;
}

export interface SectionItemComponentPropType {
    sectionId: string;
    columns: formColumnModel[];
    selectedLanguage: LanguageModel;
    sectionIndex: number;
    selectedForm: FormModel;
    setSelectedForm: React.Dispatch<React.SetStateAction<FormModel | undefined>>;
    setConfirmationData: React.Dispatch<React.SetStateAction<ConfirmationDataModel | undefined>>;
}

export interface ColumnItemComponentPropType {
    columnId: string;
    label: string;
    columnIndex: number;
    activeStatus: boolean;
    compType: string;
    selectedForm: FormModel;
    setSelectedForm: React.Dispatch<React.SetStateAction<FormModel | undefined>>;
    setConfirmationData: React.Dispatch<React.SetStateAction<ConfirmationDataModel | undefined>>;
}
