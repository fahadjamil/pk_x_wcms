import Command from '@ckeditor/ckeditor5-core/src/command';

export default class DeletePopover extends Command {
    execute() {
        const editor = this.editor;
        const mSelection = this.editor.model.document.selection;

        editor.model.change(mWriter => {
            const rangesToUnPopover = mSelection.isCollapsed ?
                [findAttributeRange(
                    mSelection.getFirstPosition(),
                    'popover',
                    mSelection.getAttribute('popover'),
                    this.editor.model
                )] :
                editor.model.schema.getValidRanges(mSelection.getRanges(), 'popover');

            for (const range of rangesToUnPopover) {
                let rangeStart = range.start; 
                let rangeEnd = range.end
                let rangeStartRoot = rangeStart.root;
                let rangeStartPath = rangeStart.path;
                mWriter.removeAttribute('popover', range); 
            }
        });
    }
}

function findAttributeRange(mPosition, attributeName, attributeValue, model) {
    let leftBound = findBound(true);
    let rightBound = findBound(false);
    let attributeRange = model.createRange(
        leftBound,
        rightBound
    )

    return attributeRange;

    function findBound(lookback) {
        let node = mPosition.textNode || (lookback ? mPosition.nodeBefore : mPosition.nodeAfter);

        let refNode = null;

        while (node && node.getAttribute(attributeName) == attributeValue) {
            refNode = node;
            node = lookback ? node.previousSibling : node.nextSibling;
        }

        let boundPosition = null;
        if (refNode) {
            boundPosition = model.createPositionAt(refNode, (lookback ? 'before' : 'after'));
        }
        else {
            boundPosition = mPosition;
        }

        return boundPosition;
    }
}