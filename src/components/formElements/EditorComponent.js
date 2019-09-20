import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, RichUtils, CompositeDecorator } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { path, identical, without, contains } from 'ramda';
import cx from 'classnames';

import InlineToolbar from './InlineToolbar';
import { getSelectionRange, getBlockAlignment, styleWholeSelectedBlocksModifier, confirmLink, removeLink, findEntities } from '../../utils/editor';
import Link from './Link';
import styles from '../../css/editorToolbar.scss';

const ALIGNMENTS = ['left', 'right', 'center'];

export default class EditorComponent extends Component {
    static defaultProps = {
        isEditor: PropTypes.bool,
        onChange: PropTypes.func,
        short: PropTypes.bool
    };

    static defaultProps = {
        path: 'content'
    };

    constructor(props) {
        super(props);

        const value = path(props.path.split('.').map(i => identical(NaN, +i) ? i : +i), props);

        this.state = {
            showToolbar: false,
            linkToolbar: false,
            selectionRange: null,
            editorState: !props.isEditor ? null : value ?
                EditorState.createWithContent(stateFromHTML(value)) :
                EditorState.createEmpty()
        };
    }

    componentDidMount() {
        this.props.isEditor && this.onChange(
            EditorState.set(this.state.editorState, {
                decorator: new CompositeDecorator([
                    {
                        strategy: (contentBlock, callback, contentState) => {
                            return findEntities('LINK', contentBlock, callback, contentState);
                        },
                        component: Link
                    }
                ])
            })
        );
    }

    onChange = editorState => {
        const html = stateToHTML(editorState.getCurrentContent(), {
            inlineStyleFn: styles => {
                const textAlign = styles.filter((value) => contains(value, ['center', 'left', 'right'])).first();

                return textAlign ? {
                    element: 'p',
                    style: {
                        textAlign
                    }
                } : null;
            }
        });

        this.setState({ editorState }, () => {
            if (!editorState.getSelection().isCollapsed()) {
                const selectionRange = getSelectionRange();

                if (!selectionRange) {
                    !this.state.linkToolbar && this.setState({ showToolbar: false });
                    return;
                }

                this.setState({
                    showToolbar: true,
                    selectionRange
                });
            } else {
                this.setState({ showToolbar: false, linkToolbar: false });
            }
        });
        this.props.onChange(this.props.path, html);
    }

    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.onChange(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    toggleInlineStyle = (style, inline) => {
        const { editorState } = this.state;
        const newState = style === 'link' ?
            (inline ? confirmLink(editorState, inline) : removeLink(editorState)) :
            contains(style, ALIGNMENTS) ? styleWholeSelectedBlocksModifier(editorState, style, without([style], ALIGNMENTS)) :
            inline ? RichUtils.toggleInlineStyle(editorState, style) :
            RichUtils.toggleBlockType(editorState, style);

        this.onChange(newState);
    }

    blockStyleFn = block => {
        let alignment = getBlockAlignment(block);

        if (!block.getText()) {
            const previousBlock = this.state.editorState.getCurrentContent().getBlockBefore(block.getKey());

            if (previousBlock) {
                alignment = getBlockAlignment(previousBlock);
            }
        }

        return `alignment--${alignment}`;
    }

    toggleLinkToolbar = linkToolbar => this.setState({ linkToolbar, showToolbar: linkToolbar });

    render() {
        const { isEditor, path, short, staticContent } = this.props;
        const { editorState, showToolbar, selectionRange, linkToolbar } = this.state;

        return isEditor ?
            <div ref={node => this.container = node} className={cx(styles.editorContainer, 'editor-container', { [styles.block]: staticContent })}>
                <InlineToolbar
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                    onChange={this.onChange}
                    selectionRange={selectionRange}
                    show={showToolbar}
                    linkToolbar={linkToolbar}
                    toggleLinkToolbar={this.toggleLinkToolbar}
                    short={short} />
                <div className={cx(styles.editorWrapper, 'editor-wrapper')} onClick={() => this.editor.focus()}>
                    <Editor
                        ref={node => this.editor = node}
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        placeholder='Введите ваш текст...'
                        handleKeyCommand={this.handleKeyCommand}
                        blockStyleFn={this.blockStyleFn} />
                </div>
            </div> : <div dangerouslySetInnerHTML={{ __html: this.props[path] }} />;
    }
}
