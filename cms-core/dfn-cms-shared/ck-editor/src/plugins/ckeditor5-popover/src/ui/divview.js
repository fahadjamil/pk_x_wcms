import View from '@ckeditor/ckeditor5-ui/src/view';

import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';

export default class DivView extends View {
    constructor(locale) {
        super(locale);

        this.set('value'); // make the div value observable
        this.set('id');
        this.set('hasError');
        this.set('isEmpty', true); // observable flag set to true then there are no content

        this.focusTracker = new FocusTracker();
        this.bind('isFocused').to(this.focusTracker); // isFocused is an observable flag set to true then the div is focused

        const bind = this.bindTemplate;

        this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ckpro-popover-div',
                    bind.if('isFocused', 'ck-input_focused'),
                    bind.if('isEmpty', 'ck-input-text_empty'),
                    bind.if('hasError', 'ck-error')
                ],
                id: bind.to('id'),
                tabindex: 1
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

    focus() {
        this.element.focus();
    }

    _setDomElementValue(value) {
        this.element.innerHTML = (!value && value !== 0) ? '' : value;
    }

    _updateIsEmpty() {
        this.isEmpty = !this.element.value;
    }
}
