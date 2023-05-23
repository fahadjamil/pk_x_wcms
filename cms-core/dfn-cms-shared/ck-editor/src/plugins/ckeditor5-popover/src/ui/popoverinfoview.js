import View from '@ckeditor/ckeditor5-ui/src/view';

import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';

import pencilIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';
import deleteIcon from '../../theme/icons/delete.svg';

import DivView from './divview';

export default class ViewPopup extends View {
    constructor(locale) {
        super(locale);

        this.lblPopover = new DivView(locale);
        this.lblPopover.extendTemplate({
            attributes: {
                class: ['ckpro-popover-info-lblPopover']
            }
        });
        this.editButtonView = this._createButton(locale.t('Edit'), pencilIcon, 'ckpro-popover-info-btnEdit', 'edit');
        this.cancelButtonView = this._createButton(locale.t('Cancel'), cancelIcon, 'ckpro-popover-info-btnCancel', 'cancel');
        this.deleteButtonView = this._createButton(locale.t('Delete'), deleteIcon, 'ckpro-popover-info-btnDelete', 'delete');

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
            tag: 'div',
            attributes: {
                class: ['ckpro-popover-info']
            },
            children: [
                this.lblPopover,
                this.editButtonView,
                this.deleteButtonView,
                this.cancelButtonView
            ]
        });
    }

    render() {
        super.render();

        const childViews = [
            this.lblPopover,
            this.editButtonView,
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
        button.delegate('execute').to(this, eventName);
        return button;
    }
}