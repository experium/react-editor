import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button } from 'antd';
import uniqid from 'uniqid';
import { append, remove, path, propEq, find, any, memoizeWith, identity } from 'ramda';
import cx from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/options.scss';
import { shuffle } from '../../utils/methods';
import Editor from './Editor';

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
        const { isEditor, disabled, correct, allowCorrect, input: { value }, options, downloadUrl } = this.props;
        const selected = value === option.id;
        const isCorrect = option.id === correct;
        const hasImages = any(o => o.image, options);

        return <Draggable key={option.id} draggableId={option.id} index={index} isDragDisabled={!isEditor}>
            { provided =>
                <div ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                    <div className={cx(styles.optionItem, 'option-item', { 'option-item-correct': allowCorrect && isCorrect })}>
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
                            <Radio
                                value={option.id}
                                className={disabled ? cx({
                                    'correct': (correct ? selected && isCorrect : selected),
                                    'incorrect': (correct ? selected && !isCorrect : false)
                                }) : null}>
                                { !isEditor && <span className={styles.optionLabel} dangerouslySetInnerHTML={{ __html: option.label }} /> }
                            </Radio>
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

    renderRadioButtons() {
        const { options, allowShuffle, isEditor } = this.props;
        const items = allowShuffle && !isEditor ? this.getShuffleOptions(options) : options;

        return items.map(this.renderRadio);
    }

    render() {
        const { input: { value }, disabled, isEditor, correct, options, id, inline } = this.props;

        return <div>
            <Radio.Group
                className={cx({ [styles.inlineOptions]: inline, elementEditor: isEditor })}
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
