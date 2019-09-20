import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button } from 'antd';
import uniqid from 'uniqid';
import { append, remove, path, propEq, find, any } from 'ramda';
import cx from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import withElementWrapper from '../../hocs/withElementWrapper';
import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/options.scss';
import { shuffle } from '../../utils/methods';

class RadioButtons extends Component {
    static propTypes = {
        options: PropTypes.array,
        input: PropTypes.object,
        isEditor: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        input: {},
        options: []
    };

    onChange = e => {
        const { onChange, isEditor } = this.props;
        const { value } = e.target;

        isEditor ?
            onChange('correct', value) :
            onChange(value);
    }

    removeItem = index => {
        const { options, onChange } = this.props;

        onChange('options', remove(index, 1, options));
    }

    addItem = () => {
        const { options, onChange, placeholder } = this.props;
        const option = {
            label: `${placeholder} ${options.length}`,
            id: uniqid('radio_option_')
        };

        onChange('options', append(option, options));
    }

    renderRadio = (option, index) => {
        const { isEditor, disabled, correct, input: { value }, options } = this.props;
        const selected = value === option.id;
        const hasImages = any(o => o.image, options);

        return <Draggable key={option.id} draggableId={option.id} index={index} isDragDisabled={!isEditor}>
            { provided =>
                <div ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                    <div className={cx(styles.optionItem, 'option-item')}>
                        { isEditor &&
                            <div className={cx(styles.optionReorder, 'option-reorder')} {...provided.dragHandleProps}>
                                <i className='fa fa-reorder' />
                            </div>
                        }
                        <div className={cx({ [styles.contentWithImage]: hasImages })}>
                            { option.image &&
                                <div className={styles.image} style={{ backgroundImage: `url('${option.image.data}')` }} />
                            }
                            <Radio
                                value={option.id}
                                className={disabled ? cx({
                                    'correct': (correct ? selected && option.id === correct : selected),
                                    'incorrect': (correct ? selected && option.id !== correct : false)
                                }) : null}>
                                { !isEditor && <span className={styles.optionLabel} dangerouslySetInnerHTML={{ __html: option.label }} /> }
                            </Radio>
                            { isEditor &&
                                <Fragment>
                                    <Editor
                                        {...this.props}
                                        path={`options.${index}.label`}
                                        short />
                                    <Button
                                        className={cx(styles.optionRemoveBtn, 'option-remove-btn')}
                                        ghost
                                        icon='remove'
                                        size='small'
                                        type='danger'
                                        shape='circle'
                                        onClick={() => this.removeItem(index)} />
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
            }
        </Draggable>;
    }

    renderRadioButtons() {
        const { options, allowShuffle, isEditor } = this.props;
        const items = allowShuffle && !isEditor ? shuffle(options) : options;

        return items.map(this.renderRadio);
    }

    render() {
        const { input: { value }, disabled, isEditor, correct, options, id, inline } = this.props;

        return <div>
            <Radio.Group
                className={cx({ [styles.inlineOptions]: inline })}
                onChange={this.onChange}
                value={isEditor ? correct : value}
                disabled={disabled}>
                <Droppable droppableId={id} type={`field_${id}`}>
                    { provided =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            { this.renderRadioButtons() }
                            { provided.placeholder }
                        </div>
                    }
                </Droppable>
            </Radio.Group>
            { isEditor &&
                <div>
                    <Button
                        className={cx(styles.optionAddBtn, 'option-add-btn')}
                        ghost
                        type='primary'
                        shape='circle'
                        icon='plus'
                        size='small'
                        onClick={this.addItem} />
                </div>
            }
            { !!(disabled && correct && correct !== value) &&
                <div className={cx(styles.correctAnswers, 'correct-answers')}>
                    <b>Правильный ответ: </b>
                    <span dangerouslySetInnerHTML={{ __html: path(['label'], find(propEq('id', correct), options)) }} />
                </div>
            }
        </div>;
    }
}

export default withElementWrapper(RadioButtons);
export const RadioButtonsField = withFieldWrapper(RadioButtons);
