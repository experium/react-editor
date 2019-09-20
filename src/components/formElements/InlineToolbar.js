import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getSelectionCoords, findEntityInSelection } from '../../utils/editor';
import LinkInput from './LinkInput';
import styles from '../../css/editorToolbar.scss';

const INLINE_STYLES = [
    { label: 'B', style: 'BOLD', inline: true },
    { label: 'I', style: 'ITALIC', inline: true },
    { label: 'U', style: 'UNDERLINE', inline: true }
];

const BLOCK_STYLES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: <i className='fa fa-list-ul' />, style: 'unordered-list-item' },
    { label: <i className='fa fa-list-ol' />, style: 'ordered-list-item' },
    { label: <i className='fa fa-align-left' />, style: 'left' },
    { label: <i className='fa fa-align-right' />, style: 'right' },
    { label: <i className='fa fa-align-center' />, style: 'center' }
];

export default class InlineToolbar extends Component {
    static propTypes = {
        editorState: PropTypes.object,
        selectionRange: PropTypes.object,
        onToggle: PropTypes.func,
        show: PropTypes.bool,
        short: PropTypes.bool
    };

    onMouseDown = (e, type) => {
        e.preventDefault();
        this.props.onToggle(type.style, type.inline);
    }

    openLinkEditor = e => {
        e.preventDefault();
        this.props.toggleLinkToolbar(true);
    }

    getPositionData = () => {
        const { selectionRange } = this.props;

        if (selectionRange) {
            return getSelectionCoords(this.toolbar, selectionRange);
        }

        return {};
    }

    render() {
        const { editorState, show, short, linkToolbar } = this.props;
        const currentStyle = editorState.getCurrentInlineStyle();
        const positionData = this.getPositionData();
        const LIST = short ? INLINE_STYLES : [...INLINE_STYLES, ...BLOCK_STYLES];
        const blockStyle = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType();

        return <div
            ref={node => this.toolbar = node}
            className={cx(styles.toolbar, 'toolbar', { [styles.showToolbar]: show })}
            style={positionData.coords}>
            <div className={cx(styles.toolbarItems, 'toolbar-items')}>
                { linkToolbar ? <LinkInput {...this.props} /> :
                    <Fragment>
                        { LIST.map(type =>
                            <li
                                key={type.style}
                                className={cx(styles.toolbarItem, 'toolbar-item', {
                                    [styles[type.style.toLowerCase()]]: true,
                                    [styles.active]: currentStyle.has(type.style) || type.style === blockStyle
                                })}
                                onMouseDown={e => this.onMouseDown(e, type)}>
                                { type.label }
                            </li>
                        )}
                        <li
                            className={cx(styles.toolbarItem, 'toolbar-item', {
                                active: !!findEntityInSelection(editorState, 'LINK')
                            })}
                            onMouseDown={this.openLinkEditor}>
                            <i className='fa fa-link' />
                        </li>
                    </Fragment>
                }
                <div className={cx(styles.toolbarItemsArrow, 'toolbar-items-arraow')} style={{ left: positionData.arrowPosition }} />
            </div>
        </div>;
    }
}
