import React, { Component } from 'react';
import { RichUtils } from 'draft-js';
import onClickOutside from 'react-onclickoutside';
import cx from 'classnames';

import { extendSelectionByData, findEntityInSelection, createEntity, removeEntity, getEditorData, getEntities } from '../../utils/editor';
import styles from '../../css/editorToolbar.scss';

class LinkInput extends Component {
    constructor(props) {
        super(props);

        this.entity = findEntityInSelection(props.editorState, 'LINK');
        this.state = {
            href: this.entity !== null ? this.entity.entity.data.href : ''
        };
    }

    componentWillMount() {
        const { editorState, onChange } = this.props;

        if (this.entity !== null) {
            this.editorStateBackup = extendSelectionByData(
                editorState,
                getEntities(editorState, 'LINK', this.entity.entityKey)
            );
        } else {
            this.editorStateBackup = editorState;
        }

        onChange(RichUtils.toggleInlineStyle(this.editorStateBackup, 'SELECTED'));
    }

    componentWillUnmount() {
        this.props.onChange(this.editorStateBackup);
    }

    handleClickOutside = () => this.props.toggleLinkToolbar(false);

    applyValue = () => {
        const { href } = this.state;
        const { contentState } = getEditorData(this.editorStateBackup);
        if (this.entity === null) {
            this.editorStateBackup = createEntity(
                this.editorStateBackup,
                'LINK',
                { href }
            );
        } else {
            contentState.mergeEntityData(this.entity.entityKey, { href });
        }
        this.props.toggleLinkToolbar(false);
    };

    remove = () => {
        this.editorStateBackup = removeEntity(this.editorStateBackup, 'LINK');
        this.props.toggleLinkToolbar(false);
    };

    render() {
        return <li className={cx(styles.toolbarLinkContainer, 'toolbar-link-container')}>
            <input type='text' placeholder='http://example.com' value={this.state.href} onChange={e => this.setState({ href: e.target.value })} />
            <button onClick={this.applyValue}><i className='fa fa-check-circle' /></button>
            { this.entity !== null && <button onClick={this.remove}><i className='fa fa-times-circle' /></button> }
        </li>;
    }
}

export default onClickOutside(LinkInput);
