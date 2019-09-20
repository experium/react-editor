import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'antd';
import { find, propEq } from 'ramda';
import cx from 'classnames';

import EditElement from '../components/EditElement';
import styles from '../css/sortableRow.scss';
import EditModalContext from '../contexts/EditModalContext';
import withComponentsContext from './withComponentsContext';

export default WrappedComponent => {
    class ElementWrapper extends Component {
        static propTypes = {
            removeItem: PropTypes.func,
            editItem: PropTypes.func,
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            simpleView: PropTypes.bool
        };

        static defaultProps = {
            simpleView: true
        };

        renderComponent = (staticContent, ableCorrect) => {
            const { editItem, id } = this.props;

            return <WrappedComponent
                {...this.props}
                onChange={(prop, content) => editItem(id, prop, content)}
                isEditor
                disabled={!ableCorrect}
                staticContent={staticContent} />;
        }

        renderLabel = () => {
            const { id, editItem } = this.props;
            const EditorComponent = require('../components/formElements/EditorComponent');

            return <EditorComponent
                {...this.props}
                path='label'
                short
                onChange={(prop, content) => editItem(id, prop, content)}
                isEditor />;
        }

        onSubmit = values => {
            this.props.editAllItem(this.props.id, values);
        }

        render() {
            const { removeItem, id, type, dragHandleProps, placeholder, simpleView, item, components } = this.props;
            const { staticContent, ableCorrect, renderInfo, name, icon } = find(propEq('type', type), components);

            return <div className={cx(styles.sortableRowWrapper, 'sortable-row-wrapper')}>
                <div className={cx(styles.sortableRow, 'sortable-row')}>
                    <EditModalContext.Consumer>
                        { ({ setOpened }) =>
                            <button className={cx(styles.toolbarEditBtn, 'toolbar-edit-btn')} onClick={() => setOpened(id)}>
                                <i className='fa fa-edit'></i>
                            </button>
                        }
                    </EditModalContext.Consumer>
                    <button className={cx(styles.toolbarRemoveBtn, 'toolbar-remove-btn')} onClick={() => removeItem(id)}>
                        <i className='fa fa-remove'></i>
                    </button>
                    <div {...dragHandleProps} className={cx(styles.sortableRowDragHandle, 'sortable-row-drag-handle')}>
                        <i className='fa fa-reorder' />
                    </div>
                    <div className={cx(styles.sortableRowContent, 'sortable-row-content')}>
                        { simpleView ?
                            <div>
                                <div>{ renderInfo && <div className={cx(styles.sortableRowInfo, 'sortable-row-info')}>{ renderInfo(item) }</div> }</div>
                                <div className={cx(styles.sortableRowContentInfo, 'sortable-row-content-info')}><i className={`fa fa-${icon}`} />{ name }</div>
                            </div> : (
                                staticContent ?
                                    this.renderComponent(staticContent, ableCorrect) :
                                    <Form.Item
                                        label={this.renderLabel()}
                                        colon={false}>
                                        { this.renderComponent(staticContent, ableCorrect) }
                                    </Form.Item>
                            )
                        }
                    </div>
                </div>
                <EditModalContext.Consumer>
                    { ({ opened, setOpened }) =>
                        <Modal
                            title={name}
                            visible={id === opened}
                            onCancel={() => setOpened(null)}
                            style={{ minWidth: 1000 }}
                            destroyOnClose
                            footer={null}>
                            <EditElement
                                item={item}
                                placeholder={placeholder}
                                onSubmit={values => {
                                    this.onSubmit(values);
                                    setOpened(null);
                                }} />
                        </Modal>
                    }
                </EditModalContext.Consumer>
            </div>;
        }
    }

    return withComponentsContext(ElementWrapper);
};
