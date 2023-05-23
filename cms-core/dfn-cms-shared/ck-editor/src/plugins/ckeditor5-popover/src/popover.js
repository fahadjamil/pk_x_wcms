import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import PopoverEditing from './popoverediting';
import PopoverUI from './popoverui';

export default class Popover extends Plugin {
    static get requires() {
        return [PopoverEditing, PopoverUI];
    }

    static get pluginName() {
        return 'Popover';
    }

    init() {
    }
}