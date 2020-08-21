import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import cx from 'classnames';
import { find, propEq, path } from 'ramda';

import styles from '../css/formBuilder.scss';
import withComponentsContext from '../hocs/withComponentsContext';

class Container extends Component {
    static propTypes = {
        items: PropTypes.array,
        reorderItems: PropTypes.func,
        editItem: PropTypes.func,
        removeItem: PropTypes.func,
        elements: PropTypes.object,
        placeholder: PropTypes.string
    };

    renderItem = (id, dragHandleProps, isDraggingOver) => {
        const { removeItem, editItem, elements, placeholder, simpleView, editAllItem, components } = this.props;
        const item = path([id], elements);
        const element = find(propEq('type', item.type), components);

        if (!element) {
            return null;
        }

        const Component = element.component;

        return <Component
            {...item}
            item={item}
            id={id}
            removeItem={removeItem}
            editItem={editItem}
            editAllItem={editAllItem}
            dragHandleProps={dragHandleProps}
            placeholder={placeholder}
            isDraggingOver={isDraggingOver}
            simpleView={simpleView} />;
    }

    render() {
        const { items } = this.props;

        return <div className={cx(styles.reactFormBuilderPreview, 'react-form-builder-preview pull-left')}>
            <div className={cx(styles.droppableContainer, 'droppable-container')}>
                <Droppable droppableId='droppable' type='common'>
                    { (provided, snapshot) =>
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            { items.map((id, index) =>
                                <Draggable
                                    key={id}
                                    draggableId={id}
                                    index={index}>
                                    { provided =>
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}>
                                            { this.renderItem(id, provided.dragHandleProps, snapshot.isDraggingOver) }
                                        </div>
                                    }
                                </Draggable>
                            )}
                            { provided.placeholder }
                        </div>
                    }
                </Droppable>
            </div>
        </div>;
    }
}

export default withComponentsContext(Container);
