import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

export default WrappedComponent =>
    class extends Component {
        static propTypes = {
            type: PropTypes.string,
            required: PropTypes.bool
        };

        onChange = value => {
            const { onChange, input } = this.props;

            input.onChange(value);
            onChange && onChange(value);
        }

        render() {
            const { label, required, meta: { invalid, submitFailed, error }} = this.props;
            const showError = invalid && submitFailed;

            return <Form.Item
                label={label ? <div dangerouslySetInnerHTML={{ __html: label }} /> : null}
                colon={false}
                required={required}
                validateStatus={showError ? 'error' : null}
                help={showError ? error : null}>
                <WrappedComponent {...this.props} onChange={this.onChange} />
            </Form.Item>;
        }
    };
