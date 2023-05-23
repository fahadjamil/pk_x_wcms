import Command from '@ckeditor/ckeditor5-core/src/command';
import Popover from './popover';

export default class InsertPopover extends Command {
    constructor(editor) {
        super(editor);

        this.set("isPopover", false);
    }

    refresh() {
        const model = this.editor.model;
        const mDocument = model.document;

        const mSelectedElement = mDocument.selection.getSelectedBlocks().next().value;

        if (isImageAllowed(mSelectedElement, model.schema)) {
            this.value = mSelectedElement.getAttribute('popover');
            this.isEnabled = model.schema.checkAttribute(mSelectedElement, 'popover');
            this.isPopover = mSelectedElement.hasAttribute('popover');
        }
        else {
            this.value = mDocument.selection.getAttribute('popover');
            this.isEnabled = model.schema.checkAttributeInSelection(mDocument.selection, 'popover');
            this.isPopover = mDocument.selection.hasAttribute('popover');
        }
    }

    execute(params) {
        const content = params && params.content ? params.content : "";
        const isSubmit = params && params.isSubmit;
        const isToolbar = params && params.isToolbar;

        const editor = this.editor;
        const model = editor.model;
        const mSelection = model.document.selection;

        editor.model.change(mWriter => {
            if (mSelection.isCollapsed) {
                const position = mSelection.getFirstPosition();

                if (mSelection.hasAttribute('popover')) {
                    const popoverRange = findAttributeRange(position, 'popover', mSelection.getAttribute('popover'), model);
                    mWriter.setAttribute('popover', content, popoverRange);
                    mWriter.setSelection(mWriter.createPositionAfter(popoverRange.end.nodeBefore));
                }
                else { // select the word that the cursor is inside
                    const wordRange = findWordRangeInModel(position, model);
                    if (!wordRange) {
                        return;
                    }
                    mWriter.setAttribute('popover', content, wordRange);
                    mWriter.setSelection(mWriter.createPositionAfter(wordRange.end.nodeBefore));
                }

                //mWriter.setSelectionAttribute("popover", true); // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_writer-mWriter.html#function-setSelectionAttribute
            }
            else {
                if (isSubmit) {
                    const ranges = editor.model.schema.getValidRanges(mSelection.getRanges(), "popover"); // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_schema-Schema.html#function-getValidRanges

                    for (const range of ranges) {
                        mWriter.setAttribute("popover", content, range);
                    }
                }
                else {
                    if (mSelection.hasAttribute('popover')) {
                        const popoverValue = mSelection.getAttribute('popover');
                        const firstPosition = mSelection.getFirstPosition();
                        const lastPosition = mSelection.getLastPosition();
                        const popoverRange = findAttributeRange(firstPosition, 'popover', mSelection.getAttribute('popover'), model);

                        const maxLeft = firstPosition.path[1] < popoverRange.start.path[1] ? firstPosition : popoverRange.start;
                        const maxRight = lastPosition.path[1] > popoverRange.end.path[1] ? lastPosition : popoverRange.end;
                        const newPopoverRange = mWriter.createRange(maxLeft, maxRight);

                        mWriter.setAttribute('popover', mSelection.getAttribute('popover'), newPopoverRange);

                        mWriter.setSelection(mWriter.createPositionAfter(newPopoverRange.end.nodeBefore));
                    }
                    else {
                        const ranges = editor.model.schema.getValidRanges(mSelection.getRanges(), "popover"); // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_schema-Schema.html#function-getValidRanges

                        for (const range of ranges) {
                            mWriter.setAttribute("popover", content, range);
                        }
                    }
                }
            }
        });
    }
}

function findAttributeRange(position, attributeName, value, model) {
    let popoverActorStart = findBound(true);
    let popoverActorEnd = findBound(false);
    let attributeRange = model.createRange(
        popoverActorStart,
        popoverActorEnd
    )

    return attributeRange;

    function findBound(lookBack) {
        /*
         * position.textNode : returns text node instance in which this position is placed or null if the position is not in a text node
         * position.nodeBefore : node directly before this position or null if this position is in a text node
         */

        let node = position.textNode || (lookBack ? position.nodeBefore : position.nodeAfter);

        let lastNode = null;

        while (node && node.getAttribute(attributeName) == value) {
            lastNode = node;
            node = lookBack ? node.previousSibling : node.nextSibling;
        }

        return lastNode ? model.createPositionAt(lastNode, lookBack ? 'before' : 'after') : position;
    }
}

function findWordRangeInModel(mPosition, model) {
    let textNode = mPosition.textNode;
    if (!textNode) {
        return null;
    }
    const text = textNode.data;

    const offsetInTextNode = mPosition.offset - textNode.startOffset;
    const wordLeft = text.slice(0, offsetInTextNode + 1).search(/\S+$/);
    const whiteSpacePositionAfterOffsetInTextNode = text.slice(offsetInTextNode).search(/\s/);

    var wordRight = -1;
    if (whiteSpacePositionAfterOffsetInTextNode < 0) {
        wordRight = text.length;
    }
    else {
        wordRight = offsetInTextNode + whiteSpacePositionAfterOffsetInTextNode;
    }

    if (wordLeft < 0 || !(wordLeft < wordRight)) {
        return null;
    }

    const word = text.slice(wordLeft, wordRight);

    var offsetInParentLeft = textNode.startOffset + wordLeft;
    var offsetInParentRight = textNode.startOffset + wordRight;

    const leftPosition = model.createPositionAt(textNode.parent, offsetInParentLeft);
    const rightPosition = model.createPositionAt(textNode.parent, offsetInParentRight);

    const wordRange = model.createRange(leftPosition, rightPosition);

    return wordRange;
}

/**
 * Returns true if mElement is an image and allows the popover attribute
 */
function isImageAllowed(mElement, schema) {
    if (!mElement) {
        return false;
    }

    return mElement.is('element', 'image') && schema.checkAttribute('image', 'popover');
}