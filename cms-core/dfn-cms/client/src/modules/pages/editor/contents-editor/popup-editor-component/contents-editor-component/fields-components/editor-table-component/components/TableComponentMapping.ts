import TableDropDownComponent from './table-drop-down-component';
import TableShortTextComponent from './table-short-text-component';
import ButtonContainerComponent from '../../../../../../../../shared/ui-components/input-fields/button-component';

const TableComponentMapping: { [key: string]: any } = {
    dropDown: TableDropDownComponent,
    shortText: TableShortTextComponent,
    button: ButtonContainerComponent,
};

export default TableComponentMapping;
