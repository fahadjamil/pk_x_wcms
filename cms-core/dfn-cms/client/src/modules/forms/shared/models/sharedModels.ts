import { FormModel } from './editorModels';
import MainMenuModel from '../../../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../../../shared/models/side-bar-menu-models/SubMenuModel';
import WorkflowStateModel from '../../../shared/models/workflow-models/WorkflowStateModel';
import LanguageModel from '../../../shared/models/LanguageModel';

export interface SideBarContentPropTypes {
    editMode: boolean;
    selectedForm: FormModel | undefined;
    menuData: MainMenuModel[];
    activeMenuItemID: string;
    selectedFormWorkflowState: WorkflowStateModel | undefined;
    languages: LanguageModel[];
    setActiveMenuItemID: React.Dispatch<React.SetStateAction<string>>;
    setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
    setSelectedForm: React.Dispatch<React.SetStateAction<FormModel | undefined>>;
    onMenuItemClicked: (
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: FormModel
    ) => void;
    setConfirmationData: React.Dispatch<React.SetStateAction<ConfirmationDataModel | undefined>>;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    getSelectedFormItem: (formObject: FormModel | undefined) => void;
}

export interface ResponseDataModel {
    status: string;
    msg: string;
}

export interface AllFormsModel {
    action: string;
    allFromsData: FormModel[];
}

export interface ConfirmationDataModel {
    modalTitle: string;
    show: boolean;
    size?: string;
    body: JSX.Element;
    handleClose: () => void;
    handleConfirme: () => void;
}

export interface InformationDataModel {
    modalTitle: string;
    show: boolean;
    size?: string;
    submitBtnText: string;
    body: JSX.Element;
    handleClose: () => void;
    handleConfirme: () => void;
}
