import { EditorState, Modifier, RichUtils } from 'draft-js';

export const getSelectionRange = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;

    return selection.getRangeAt(0);
};

export const getSelectionCoords = (toolbar, selectionRange) => {
    const editorBounds = toolbar.closest('.editor-container').getBoundingClientRect();
    const rangeBounds = selectionRange.getBoundingClientRect();
    const rangeWidth = rangeBounds.right - rangeBounds.left;
    const content = toolbar.querySelector('.toolbar-items');
    const outOfViewPort = content.offsetWidth / 2 > rangeBounds.left + (rangeBounds.width / 2);

    const offsetTop = rangeBounds.top - editorBounds.top - (content.offsetHeight + 5);
    const offsetLeft = ((rangeBounds.left - editorBounds.left) + (rangeWidth / 2)) - (content.offsetWidth / 2);

    return {
        arrowPosition: outOfViewPort ? `${rangeBounds.left + (rangeBounds.width / 2)}px` : '50%',
        coords: {
            left: outOfViewPort ? -editorBounds.left : offsetLeft,
            top: offsetTop
        }
    };
};

export function getBlockAlignment(block) {
    let style = 'left';

    block.findStyleRanges(e => {
        if (e.hasStyle('center')) style = 'center';
        if (e.hasStyle('right')) style = 'right';
    });

    return style;
}

export function styleWholeSelectedBlocksModifier(editorState, style, removeStyles = []) {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const focusBlock = currentContent.getBlockForKey(selection.getFocusKey());
    const anchorBlock = currentContent.getBlockForKey(selection.getAnchorKey());
    const selectionIsBackward = selection.getIsBackward();

    let changes = {
        anchorOffset: 0,
        focusOffset: focusBlock.getLength()
    };

    if (selectionIsBackward) {
        changes = {
            focusOffset: 0,
            anchorOffset: anchorBlock.getLength()
        };
    }

    const selectWholeBlocks = selection.merge(changes);
    const modifiedContent = Modifier.applyInlineStyle(currentContent, selectWholeBlocks, style);
    const finalContent = removeStyles.reduce((content, style) => {
        return Modifier.removeInlineStyle(content, selectWholeBlocks, style);
    }, modifiedContent);

    return EditorState.push(editorState, finalContent, 'change-inline-style');
}

export function getEditorData(editorState) {
    return {
        contentState: editorState.getCurrentContent(),
        inlineStyle: editorState.getCurrentInlineStyle(),
        selectionState: editorState.getSelection(),
        hasFocus: editorState.getSelection().getHasFocus(),
        isCollapsed: editorState.getSelection().isCollapsed(),
        startKey: editorState.getSelection().getStartKey(),
        startOffset: editorState.getSelection().getStartOffset(),
        endKey: editorState.getSelection().getEndKey(),
        endOffset: editorState.getSelection().getEndOffset()
    };
}

export function extendSelectionByData(editorState, data) {
    const {
        selectionState,
        startKey,
        startOffset,
        endKey,
        endOffset
    } = getEditorData(editorState);
    let anchorKey = startKey;
    let focusKey = endKey;
    let anchorOffset = startOffset;
    let focusOffset = endOffset;

    data.forEach(({ blockKey, start, end }, key) => {
        if (key === 0) {
            anchorKey = blockKey;
            anchorOffset = start;
        }
        if (key === data.length - 1) {
            focusKey = blockKey;
            focusOffset = end;
        }
    });
    const state = Object.assign({}, anchorKey ? { anchorKey } : {}, {
        focusKey,
        anchorOffset,
        focusOffset,
        isBackward: false
    });

    const newSelectionState = selectionState.merge(state);
    return EditorState.acceptSelection(editorState, newSelectionState);
}

export function getEntitiesByBlockKey(
    editorState,
    entityType = null,
    blockKey = null
) {
    return getEntities(editorState, entityType).filter(
        entity => entity.blockKey === blockKey
    );
}

export function getEntities(
    editorState,
    entityType = null,
    selectedEntityKey = null
) {
    const { contentState } = getEditorData(editorState);
    const entities = [];
    contentState.getBlocksAsArray().forEach(block => {
        let selectedEntity = null;
        block.findEntityRanges(
            character => {
                const entityKey = character.getEntity();
                if (entityKey !== null) {
                    const entity = contentState.getEntity(entityKey);
                    if (!entityType || (entityType && entity.getType() === entityType)) {
                        if (
                            selectedEntityKey === null ||
                            (selectedEntityKey !== null && entityKey === selectedEntityKey)
                        ) {
                            selectedEntity = {
                                entityKey,
                                blockKey: block.getKey(),
                                entity: contentState.getEntity(entityKey)
                            };
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                return false;
            },
            (start, end) => {
                entities.push({ ...selectedEntity, start, end });
            }
        );
    });
    return entities;
}

export function findEntityInSelection(editorState, entityType) {
    const { startKey, startOffset, endOffset } = getEditorData(editorState);
    const entities = getEntitiesByBlockKey(editorState, entityType, startKey);
    if (entities.length === 0) return null;

    let selectedEntity = null;
    entities.forEach(entity => {
        const { blockKey, start, end } = entity;
        if (
            blockKey === startKey &&
            ((startOffset > start && startOffset < end) ||
            (endOffset > start && endOffset < end) ||
            (startOffset === start && endOffset === end))
        ) {
            selectedEntity = entity;
        }
    });

    return selectedEntity;
}

export function createEntity(editorState, entityType, data = {}) {
    const { contentState, selectionState } = getEditorData(editorState);
    const contentStateWithEntity = contentState.createEntity(
        entityType,
        'MUTABLE',
        data
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
        currentContent: Modifier.applyEntity(
            contentStateWithEntity,
            selectionState,
            entityKey
        )
    });
    return newEditorState;
}

function getSelectedBlocks(editorState) {
    const { contentState, startKey, endKey } = getEditorData(editorState);
    const blocks = [];
    let block = contentState.getBlockForKey(startKey);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        blocks.push(block);
        const blockKey = block.getKey();
        if (blockKey === endKey) {
            break;
        } else {
            block = contentState.getBlockAfter(blockKey);
        }
    }
    return blocks;
}

function getSelectedBlocksByType(editorState, blockType) {
    const {
        contentState,
        startKey,
        endKey,
        startOffset,
        endOffset
    } = getEditorData(editorState);
    const blocks = [];
    getSelectedBlocks(editorState).forEach(block => {
        const blockKey = block.getKey();
        const blockStartOffset = blockKey === startKey ? startOffset : 0;
        const blockEndOffset = blockKey === endKey ? endOffset : block.getLength();
        findEntities(
            blockType,
            block,
            (start, end) => {
                if (
                    Math.max(start, blockStartOffset) <= Math.min(end, blockEndOffset)
                ) {
                    const entityKey = block.getEntityAt(start);
                    const text = block.getText().slice(start, end);
                    const url = contentState.getEntity(entityKey).getData().url;
                    blocks.push({ text, url, block, start, end });
                }
            },
            contentState
        );
    });
    return blocks;
}

export function removeEntity(editorState, entityType) {
    const { contentState, selectionState } = getEditorData(editorState);
    const blocks = getSelectedBlocksByType(editorState, entityType);
    if (blocks.length !== 0) {
        let anchorKey;
        let focusKey;
        let anchorOffset;
        let focusOffset;
        blocks.forEach(({ block, start, end }, key) => {
            const blockKey = block.getKey();
            if (key === 0) {
                anchorKey = blockKey;
                anchorOffset = start;
            }
            if (key === blocks.length - 1) {
                focusKey = blockKey;
                focusOffset = end;
            }
        });
        const newContentState = Modifier.applyEntity(
            contentState,
            selectionState.merge({
                anchorKey,
                focusKey,
                anchorOffset,
                focusOffset,
                isBackward: false
            }),
            null
        );
        return EditorState.set(editorState, {
            currentContent: newContentState
        });
    }
}

function getEntity(character) {
    return character.getEntity();
}

function entityFilter(character, entityType, contentState) {
    const entityKey = getEntity(character);
    return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === entityType
    );
}

export function findEntities(entityType, contentBlock, callback, contentState) {
    return contentBlock.findEntityRanges(
        character => entityFilter(character, entityType, contentState),
        callback
    );
}

export function confirmLink(editorState, url) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        { url }
    );

    return EditorState.set(editorState, { currentContent: contentStateWithEntity });
}

export function removeLink(editorState) {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
        return RichUtils.toggleLink(editorState, selection, null);
    } else {
        return editorState;
    }
}
