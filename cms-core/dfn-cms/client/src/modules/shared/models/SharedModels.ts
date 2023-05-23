export interface ConfirmationDataModel {
    modalTitle: string;
    show: boolean;
    size?: string;
    body: JSX.Element;
    handleClose: () => void;
    handleConfirme: () => void;
}
