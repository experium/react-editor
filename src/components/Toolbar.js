import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import cx from 'classnames';

import styles from '../css/toolbar.scss';
import ComponentsContext from '../contexts/ComponentsContext';

export default class Toolbar extends Component {
    static propTypes = {
        items: PropTypes.array
    };

    renderToolbarList = items => {
        return items.map((item, index) =>
            <Draggable
                key={item.type}
                draggableId={item.type}
                index={index}>
                { (provided, snapshot) =>
                    <Fragment>
                        <li
                            className={cx(styles.draggableToolbarItemWrapper, 'draggable-toolbar-item-wrapper', { [styles.draggingToolbarItemWrapper]: !snapshot.isDragging })}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <div className={cx(styles.draggableToolbarItem, 'draggable-toolbar-item')} onClick={() => this.props.addItem(item.type)}>
                                <i className={`fa fa-${item.icon}`} />{ item.name }
                            </div>
                        </li>
                        { snapshot.isDragging &&
                            <div className={cx(styles.draggableToolbarItemWrapper, 'draggable-toolbar-item-wrapper')}>
                                <div className={cx(styles.draggableToolbarItem, 'draggable-toolbar-item')}>
                                    <i className={`fa fa-${item.icon}`} /> { item.name }
                                </div>
                            </div>
                        }
                    </Fragment>
                }
            </Draggable>
        );
    }

    render() {
        return (
            <div className={cx(styles.toolbar, 'toolbar')}>
                <h4>Панель элементов</h4>
                <Droppable droppableId='toolbar' isDropDisabled type='common'>
                    { provided =>
                        <ul ref={provided.innerRef}>
                            <ComponentsContext.Consumer>{ this.renderToolbarList }</ComponentsContext.Consumer>
                            <div style={{ display: 'none' }}>{ provided.placeholder }</div>
                        </ul>
                    }
                </Droppable>
            </div>
        );
    }
}
