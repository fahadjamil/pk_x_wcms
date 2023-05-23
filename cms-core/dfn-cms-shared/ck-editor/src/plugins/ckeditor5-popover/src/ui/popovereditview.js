import View from '@ckeditor/ckeditor5-ui/src/view';

import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';

import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';
import deleteIcon from '../../theme/icons/delete.svg';

import TextareaView from './textareaview';

export default class PopoverEditView extends View {
    constructor(locale) {
        super(locale);

        this.params;

        this.tbPopover = new TextareaView(locale);
        this.tbPopover.placeholder = 'popover content';

        this.tbPopover.extendTemplate({
            attributes: {
                class: ['ckpro-popover-edit-tbPopover']
            }
        });

        this.saveButtonView = this._createButton(locale.t('Save'), checkIcon, 'ckpro-popover-edit-btnSave');
        this.saveButtonView.type = 'submit';

        this.deleteButtonView = this._createButton(locale.t('Delete'), deleteIcon, 'ckpro-popover-edit-btnDelete', 'delete');

        this.cancelButtonView = this._createButton(locale.t('Cancel'), cancelIcon, 'ckpro-popover-edit-btnCancel', 'cancel');

        this.keystrokes = new KeystrokeHandler();

        this.focusTracker = new FocusTracker();
        this._focusables = new ViewCollection();
        this._focusCycler = new FocusCycler({
            focusables: this._focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                focusPrevious: 'shift + tab',
                focusNext: 'tab'
            }
        });

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ckpro-popover-edit'],
                tabindex: '-1' // https://github.com/ckeditor/ckeditor5-link/issues/90
            },
            children: [
                this.tbPopover,
                this.saveButtonView,
                this.deleteButtonView,
                this.cancelButtonView
            ]
        });
    }
    
    render() {
        super.render();

        submitHandler({
            view: this
        });

        const childViews = [
            this.tbPopover,
            this.saveButtonView,
            this.deleteButtonView,
            this.cancelButtonView
        ];

        childViews.forEach(v => {
            this._focusables.add(v);
            this.focusTracker.add(v.element);
        });

        this.keystrokes.listenTo(this.element);
    }

    _createButton(label, icon, className, eventName) {
        const button = new ButtonView(this.locale); 
        button.set({
            label,
            icon,
            tooltip: true
        });

        button.extendTemplate({
            attributes: {
                class: [className]
            }
        });

        if (eventName) {
            button.delegate('execute').to(this, eventName);
        }

        return button;
    }
}