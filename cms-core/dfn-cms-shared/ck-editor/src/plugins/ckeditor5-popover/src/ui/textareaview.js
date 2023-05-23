import View from '@ckeditor/ckeditor5-ui/src/view';

import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';

export default class TextareaView extends View {
    constructor(locale) {
        super(locale);

        this.set('value');
        this.set('id');
        this.set('placeholder');
        this.set('isReadOnly', false);
        this.set('hasError', false);

        this.focusTracker = new FocusTracker();
        this.bind('isFocused').to(this.focusTracker);
        this.set('isEmpty', true);

        const bind = this.bindTemplate;

        this.setTemplate({
            tag: 'textarea',
            attributes: {
                class: [
                    'ckpro-popover-textarea',
                    bind.if('isFocused', 'ck-input_focused'),
                    bind.if('isEmpty', 'ck-input-text_empty'),
                    bind.if('hasError', 'ck-error')
                ],
                id: bind.to('id'),
                placeholder: bind.to('placeholder'),
                readonly: bind.to('isReadOnly'),
            },
            on: { // https://ckeditor.com/docs/ckeditor5/latest/api/module_ui_template-Template.html#function-on
                input: bind.to('textarea'),
                change: bind.to(this._updateIsEmpty.bind(this))
            }
        });
    }

    render() {
        super.render();

        this.focusTracker.add(this.element);

        this._setDomElementValue(this.value);
        this._updateIsEmpty();

        this.on('change:value', (evt, name, value) => {
            this._setDomElementValue(value);
        });
    }

    select() {
        this.element.select();
    }

    focus() {
        this.element.focus();
    }

    _setDomElementValue(value) {
        this.element.value = (!value && value !== 0) ? '' : value;
    }

    _updateIsEmpty() {
        this.isEmpty = !this.element.value;
    }
}