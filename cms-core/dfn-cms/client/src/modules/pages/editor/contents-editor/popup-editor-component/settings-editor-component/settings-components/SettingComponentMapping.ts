import DropDownComponent from './setting-drop-down-component';
import DropDownSelectComponent from './setting-drop-down-select/DropDownSelectComponent';
import SettingMultiSelect from './setting-multi-select/SettingMultiSelect';
import NumericUpDownComponent from './setting-numeric-up-down-component';
import SettingShortTextComponent from './setting-short-text-component';
import SettingSwitchComponent from './setting-switch-component';
import SettingColorPickerComponent from './setting-color-picker-component';
import SettingCustomCollectionComponent from './setting-custom-collection-component';
import ImageGalleryComponent from './setting-image-gallery/ImageGalleryComponent';

const settingComponentMapping: { [key: string]: any } = {
    dropDown: DropDownComponent,
    numberInput: NumericUpDownComponent,
    textInput: SettingShortTextComponent,
    toggleSwitch: SettingSwitchComponent,
    collectionDropDownSelect: DropDownSelectComponent,
    multiSelect: SettingMultiSelect,
    colorPicker: SettingColorPickerComponent,
    customCollectionOptionSelect: SettingCustomCollectionComponent,
    imageGallery: ImageGalleryComponent,
};

export default settingComponentMapping;
