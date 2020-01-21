import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { Field } from 'react-final-form';
import uniqid from 'uniqid';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import cx from 'classnames';

import ImageUploader from './ImageUploader';
import styles from '../../css/multipleField.scss';
import MceEditor from './MceEditor';
import Input from './Input';

export default class Multiple extends Component {
    static defaultProps = {
        editor: true
    };

    addItem = () => {
        const { fields, variantPlaceholder } = this.props;

        fields.push({
            label: `${variantPlaceholder} ${fields.length}`,
            id: uniqid('radio_option_')
        });
    }

    onDragEnd = result => {
        if (!result.destination) {
            return;
        }

        this.props.fields.move(result.source.index, result.destination.index);
    }

    render() {
        const { label, fields, editor } = this.props;

        return <Form.Item
            label={label}>
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId='multiple'>
                    { provided =>
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            { fields.map((name, index) =>
                                <Draggable key={fields.value[index].id} draggableId={fields.value[index].id} index={index}>
                                    { dragProvided =>
                                        <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                                            <div className={cx(styles.item, 'multiple-field-item', { [styles.itemHasImage]: !!fields.value[index].image })}>
                                                <div className={cx(styles.dragHandler, 'multiple-field-drag-handler')} {...dragProvided.dragHandleProps}>
                                                    <i className='fa fa-reorder' />
                                                </div>
                                                <div className={cx(styles.itemContent, 'multiple-field-item-content')}>
                                                    <Field
                                                        name={`${name}.label`}
                                                        component={editor ? MceEditor : Input}
                                                        short />
                                                    { editor &&
                                                        <Field
                                                            name={`${name}.image`}
                                                            component={ImageUploader} />
                                                    }
                                                    { fields.length > 1 &&
                                                        <Button ghost type='danger' icon='delete' onClick={() => fields.remove(index)} />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Draggable>
                            )}
                            { provided.placeholder }
                        </div>
                    }
                </Droppable>
            </DragDropContext>
            <Button icon='plus' onClick={this.addItem}>Добавить</Button>
        </Form.Item>;
    }
}
