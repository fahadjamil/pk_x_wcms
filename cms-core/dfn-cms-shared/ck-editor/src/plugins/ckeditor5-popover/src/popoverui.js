import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';

import PopoverEditView from './ui/popovereditview';
import PopoverInfoView from './ui/popoverinfoview';

import iconPopover from '../theme/icons/popover.svg';

export default class PopoverUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('popover', locale => {
            const btn = new ButtonView(locale);
            btn.set({
                label: t('Popover'),
                withText: false,
                tooltip: true,
                icon: iconPopover
            });

            const insertPopover = editor.commands.get('insertPopover');
            btn.bind('isEnabled').to(insertPopover, 'isEnabled');
            btn.bind('isOn').to(insertPopover, 'isPopover');

            this.listenTo(btn, 'execute', () => {
                const isPopover = this.editor.model.document.selection.hasAttribute('popover');
                const content = isPopover ? this.editor.model.document.selection.getAttribute('popover') : '';

                editor.execute('insertPopover', { content, isToolbar: true });

                const isNew = !isPopover; 
                this._showUI({ view: 'editView', isNew });
            });

            return btn;
        });

        this._balloon = editor.plugins.get(ContextualBalloon);
        this._editView = this._createEditView();
        this._infoView = this._createInfoView();

        editor.editing.view.addObserver(ClickObserver);
        this._enableUserBalloonInteractions();
    }

    _createEditView() {
        const editor = this.editor;
        const editView = new PopoverEditView(editor.locale);

        const insertPopover = editor.commands.get('insertPopover');
        editView.tbPopover.bind('value').to(insertPopover, 'value');

        editView.keystrokes.set('Esc', (data, cancel) => {
            this._hideUI();
            cancel();
        });

        this.listenTo(editView, 'submit', () => {
            const popoverContent = editView.tbPopover.element.value;
            editor.execute('insertPopover', { content: popoverContent, isSubmit: true });
            this._hideUI();
        });

        this.listenTo(editView, 'delete', () => {
            this.editor.execute('deletePopover');
            this._hideUI();
        });

        this.listenTo(editView, 'cancel', () => {
            var isNew = editView.params && editView.params.isNew;
            if (isNew) {
                editView.params.isNew = false;
                this.editor.execute('deletePopover');
            }
            this._hideUI();
        });

        return editView;
    }

    _createInfoView() {
        const editor = this.editor;
        const infoView = new PopoverInfoView(editor.locale)

        const insertPopover = editor.commands.get('insertPopover');
        infoView.lblPopover.bind('value').to(insertPopover, 'value');

        infoView.keystrokes.set('Esc', (data, cancel) => {
            this._hideUI();
            cancel();
        });

        this.listenTo(infoView, 'edit', () => { // then the infoView.editButtonView is clicked it will fire 'edit' on the infoView
            this._balloon.remove(this._infoView);
            this._balloon.add({
                view: this._editView,
                position: this._getBalloonPositionData()
            });

            //this._editView.tbPopover.select();
            this._editView.tbPopover.focus();
        });

        this.listenTo(infoView, 'delete', () => {
            this.editor.execute('deletePopover');
            this._hideUI();
        });

        this.listenTo(infoView, 'cancel', () => {
            this._hideUI();
        });

        return infoView;
    }

    _showUI(params) {
        const editor = this.editor;
        const command = editor.commands.get('insertPopover');

        const vElmPopover = this._getSelectedPopoverElement();
        if (!vElmPopover) {
            return;
        }

        const popoverValue = vElmPopover.getAttribute('content');
        const viewToOpen = params && params.view ? params.view : popoverValue ? 'infoView' : 'editView';
        const isNew = params && params.isNew;

        if (viewToOpen == 'infoView') {
            showInfoView(this);
        }
        else {
            showEditView(this);
        }

        function showEditView(popoverUI) {
            if (popoverUI._balloon.hasView(popoverUI._editView)) {
                return;
            }

            popoverUI._balloon.add({
                view: popoverUI._editView,
                position: popoverUI._getBalloonPositionData()
            });

            popoverUI._editView.tbPopover.focus();

            popoverUI._editView.params = { isNew };
        }

        function showInfoView(popoverUI) {
            if (popoverUI._balloon.hasView(popoverUI._infoView)) { return; }

            popoverUI._balloon.add({
                view: popoverUI._infoView,
                position: popoverUI._getBalloonPositionData()
            });

            popoverUI._infoView.lblPopover.focus();
        }
    }

    _hideUI() {
        if (this._balloon.hasView(this._editView)) {
            this._editView.saveButtonView.focus();
            this._balloon.remove(this._editView);
        }

        if (this._balloon.hasView(this._infoView)) {
            this._balloon.remove(this._infoView);
        }

        this.editor.editing.view.focus(); 
    }
 
    _enableUserBalloonInteractions() {
        const viewDocument = this.editor.editing.view.document;

        this.listenTo(viewDocument, 'click', () => {
            const vElmPopover = this._getSelectedPopoverElement();
            if (vElmPopover) {
                this._showUI();
            }
        });

        clickOutsideHandler({
            emitter: this._editView,
            activator: () => this._balloon.visibleView === this._editView || this._balloon.visibleView == this._infoView,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI()
        });
    }

    _getSelectedPopoverElement() {
        const view = this.editor.editing.view;
        const vSelection = view.document.selection;

        if (vSelection.isCollapsed) {
            let vElmPopover = findPopoverElementAncestor(vSelection.getFirstPosition());
            return vElmPopover;
        }
        else {
            const range = vSelection.getFirstRange().getTrimmed();
            const startPopover = findPopoverElementAncestor(range.start);
            const endPopover = findPopoverElementAncestor(range.end);

            /* only return a vElmPopover if it is fully selected AND if it is the only element selected */
            if (!startPopover || startPopover != endPopover) { // if no vElmPopover is in selection OR there are multiple vElmPopover in selection
                return null;
            }

            if (view.createRangeIn(startPopover).getTrimmed().isEqual(range)) { // only return a vElmPopover if it is exactly selected
                return startPopover;
            }
            else {
                return null;
            }
        }
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        const vElmPopover = this._getSelectedPopoverElement();

        const target = vElmPopover ?
            // When selection is inside popover element, then attach panel to this element.
            view.domConverter.mapViewToDom(vElmPopover) :
            // Otherwise attach panel to the selection.
            view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

        return { target };
    }
}

function findPopoverElementAncestor(position) {
    return position.getAncestors().find(ancestor => {
        return ancestor.is('attributeElement') && ancestor.getCustomProperty('ckpro') == 'popover';
    });
}

function findWordRangeInView(view) {
    const vPosition = view.document.selection.getFirstPosition();
    const vElmParent = vPosition.parent;
    if (!vElmParent.is('text')) {
        return null;
    }

    const text = vElmParent._textData;

    const offset = vPosition.offset;

    /*    Javascript Regex :
        * \s : matches a single white space character including space, tab, form feed, line feed and other Unicode spaces. Example : /\s\wMANY/ matches " bar" in "foo bar".
        * \S : matches a single character other then white space. Example : \/S\wMANY/ matches "foo" in "foo bar".
        * + : matches the preceding item 1 or more times. + is a 'greedy' quantifier, but can be made non-greedy by postfixing with ?.
        * $ : end of input.
        */

    var left = text.slice(0, offset + 1).search(/\S+$/); // position of word characters that ends with 'end of input', eg. "this is a sentence".search(/\S+$/) will return 10 - the index of sentence (since sentenceANDendOfInput is the first match)
    var whiteSpacePositionAfterOffset = text.slice(offset).search(/\s/);

    var right = -1;
    if (whiteSpacePositionAfterOffset < 0) { // if no white space was found after offset, .search() returns -1
        right = text.length;
    }
    else {
        right = offset + whiteSpacePositionAfterOffset;
    }

    var word = text.slice(left, right);

    const leftPosition = view.createPositionAt(vElmParent, left);
    const rightPosition = view.createPositionAt(vElmParent, right);

    const wordRange = view.createRange(leftPosition, rightPosition);

    return wordRange;
}