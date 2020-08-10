import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button } from 'antd';
import { append, remove, contains, memoizeWith, identity, without, path, find, propEq, any } from 'ramda';
import uniqid from 'uniqid';
import cx from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/options.scss';
import { shuffle } from '../../utils/methods';
import Editor from './Editor';

class Checkboxes extends Component {
    static propTypes = {
        options: PropTypes.array,
        input: PropTypes.object,
        isEditor: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        input: {},
        options: [],
        correct: []
    };

    onChange = option => {
        const { onChange, isEditor } = this.props;

        isEditor ?
            onChange('correct', option.length ? option : null) :
            onChange(option.length ? option : null);
    }

    removeItem = index => {
        const { options, onChange } = this.props;

        onChange('options', remove(index, 1, options));
    }

    addItem = () => {
        const { options, onChange, placeholder } = this.props;
        const option = {
            label: `${placeholder} ${options.length}`,
            id: uniqid('checkboxes_option_')
        };

        onChange('options', append(option, options));
    }

    renderCheckbox = (option, index) => {
        const { isEditor, correct, allowCorrect, input: { value = [] }, disabled, options, downloadUrl } = this.props;
        const selected = contains(option.id, value);
        const isCorrect = contains(option.id, correct);
        const hasImages = any(o => o.image, options);

        return <Draggable key={option.id} draggableId={option.id} index={index} isDragDisabled={!isEditor}>
            { provided =>
                <div ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                    <div className={cx(styles.optionItem, 'option-item', { 'option-item-correct': (allowCorrect || disabled) && isCorrect })}>
                        { isEditor &&
                            <div className={cx(styles.optionReorder, 'option-reorder')} {...provided.dragHandleProps}>
                                <i className='fa fa-reorder' />
                            </div>
                        }
                        <div className={cx({ [styles.contentWithImage]: hasImages })}>
                            { option.image &&
                                <div
                                    className={cx(styles.image, 'option-item-image')}
                                    style={{
                                        backgroundImage: `url('${option.image.id ? downloadUrl(option.image.id) : option.image.data}')`
                                    }}
                                />
                            }
                            <Checkbox
                                value={option.id}
                                className={disabled ? cx({
                                    'correct': (correct.length ? selected && isCorrect : selected),
                                    'incorrect': (correct.length ? selected && !isCorrect : false)
                                }) : null}>
                                { !isEditor && <span className={styles.optionLabel} dangerouslySetInnerHTML={{ __html: option.label }} />}
                            </Checkbox>
                            { isEditor &&
                                <Fragment>
                                    <Button
                                        className={styles.optionRemoveBtn}
                                        ghost
                                        icon={<DeleteOutlined />}
                                        size='small'
                                        danger
                                        shape='circle'
                                        onClick={() => this.removeItem(index)} />
                                    <Editor
                                        {...this.props}
                                        path={`options.${index}.label`}
                                        short />
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
            }
        </Draggable>;
    }

    getShuffleOptions = memoizeWith(identity, options => shuffle(options))

    renderCheckboxes() {
        const { options, allowShuffle, isEditor } = this.props;
        const items = allowShuffle && !isEditor ? this.getShuffleOptions(options) : options;

        return items.map(this.renderCheckbox);
    }

    render() {
        const { input: { value = [] }, disabled, isEditor, correct, options, id, inline } = this.props;
        const incorrect = without(value, correct || []) || [];

        return <div>
            <Checkbox.Group
                className={cx({ [styles.inlineOptions]: inline })}
                onChange={this.onChange}
                value={(isEditor ? correct : value) || []}
                disabled={disabled}>
                <Droppable droppableId={id} type={`field_${id}`}>
                    { provided =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            { this.renderCheckboxes() }
                            { provided.placeholder }
                        </div>
                    }
                </Droppable>
            </Checkbox.Group>
            { isEditor &&
                <div>
                    <Button
                        className={styles.optionAddBtn}
                        ghost
                        type='primary'
                        shape='circle'
                        icon={<PlusOutlined />}
                        size='small'
                        onClick={this.addItem} />
                </div>
            }
            { !!(disabled && incorrect.length) &&
                <div className={cx('option-correct', styles.correctAnswers)}>
                    <b>Правильные ответы: </b>
                    { correct.map((id, index) =>
                        <span
                            key={`correct-${id}`}
                            dangerouslySetInnerHTML={{ __html: `${index ? ', ' : ''}${path(['label'], find(propEq('id', id), options))}` }} />
                    )}
                </div>
            }
        </div>;
    }
}

export default withElementWrapper(Checkboxes);
export const CheckboxesField = withFieldWrapper(Checkboxes);
