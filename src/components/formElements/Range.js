import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider, InputNumber } from 'antd';
import cx from 'classnames';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import Editor from './Editor';
import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/range.scss';

class Range extends Component {
    static propTypes = {
        step: PropTypes.number,
        minValue: PropTypes.number,
        maxValue: PropTypes.number,
        fieldName: PropTypes.string,
        minLabel: PropTypes.PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
        maxLabel: PropTypes.PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ])
    };

    static defaultProps = {
        input: {}
    };

    onChange = value => {
        const { onChange } = this.props;

        onChange && onChange(value);
    }

    render() {
        const { step, minValue, maxValue, minLabel, maxLabel, disabled, input: { value }, isEditor, onChange } = this.props;

        return <div>
            <Slider
                min={minValue}
                max={maxValue}
                value={value || minValue}
                step={step}
                marks={{
                    [minValue]: {
                        label: isEditor ? <Editor {...this.props} path='minLabel' short /> : minLabel
                    },
                    [maxValue]: {
                        label: isEditor ? <Editor {...this.props} path='maxLabel' short /> : maxLabel
                    }
                }}
                disabled={disabled}
                onChange={this.onChange}
            />
            { isEditor &&
                <div className={cx(styles.rangeSettings, 'range-settings')}>
                    <InputNumber className={cx(styles.minValueInput, 'min-value-input')} value={minValue} onChange={v => onChange('minValue', v)} />
                    <span className={cx(styles.stepInput, 'step-input')}>Шаг: <InputNumber value={step} onChange={v => onChange('step', v)} /></span>
                    <InputNumber className={cx(styles.maxValueInput, 'max-value-input')} value={maxValue} onChange={v => onChange('maxValue', v)} />
                </div>
            }
        </div>;
    }
}

export default withElementWrapper(Range);
export const RangeField = withFieldWrapper(Range);
