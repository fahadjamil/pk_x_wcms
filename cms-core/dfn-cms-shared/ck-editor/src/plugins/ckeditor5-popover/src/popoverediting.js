import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import Position from '@ckeditor/ckeditor5-engine/src/model/position';

import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertPopover from './insertpopovercommand';
import DeletePopover from './deletepopovercommand';
import theme from '../theme/popover.css';

export default class PopoverEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.editor.model.schema.extend('$text', { allowAttributes: "popover" });
        this.editor.model.schema.setAttributeProperties("popover", {
            isFormatting: true,
            copyOnEnter: true
        });

        this._defineConverters();

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            (evt, data) => {
                if (data.viewPosition && data.viewPosition.parent && data.viewPosition.parent._textData == "POPOVER") {
                    const mElmPopover = data.mapper.toModelElement(data.viewPosition.parent.parent);
                    data.modelPosition = new Position(mElmPopover, [0]);
                    evt.stop();
                }
            }
        );

        this.editor.commands.add('insertPopover', new InsertPopover(this.editor));
        this.editor.commands.add('deletePopover', new DeletePopover(this.editor));
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('dataDowncast').attributeToElement({
            model: 'popover',
            view: (content, { writer }) => {
                const ckPopoverClass = content ? "bk-tooltip" : "bk-tooltip-none";
                const popoverElement = writer.createAttributeElement('span', { 'data-ckpro-popover': content, class: ckPopoverClass });
                return popoverElement;
            }
        });

        conversion.for('editingDowncast').attributeToElement({
            model: 'popover',
            view: (content, { writer }) => {
                const ckPopoverClass = content ? "ckpro-popover" : "ckpro-popover-empty";
                const popoverElement = writer.createAttributeElement('span', { content, class: ckPopoverClass });
                writer.setCustomProperty('ckpro', 'popover', popoverElement); // custom properties are NOT rendered to DOM, so here I just set a custom property on the popoverElement with the key 'popover' and the value true (that way I can always ask if this element is a popover eg. on viewToModelPosition)

                return popoverElement; 
            }
        });

        conversion.for('upcast').elementToAttribute({
            view: {
                name: 'span',
                attributes: {
                    'data-ckpro-popover': true
                }
            },
            model: {
                key: 'popover',
                value: viewElement => viewElement.getAttribute('data-ckpro-popover')
            }
        });
    }
}