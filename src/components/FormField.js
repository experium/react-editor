import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { Form as FormComponent } from 'antd';
import { isNil } from 'ramda';

import withFileUrlContext from '../hocs/withFileUrlContext';

class FormField extends Component {
    static propTypes = {
        item: PropTypes.object,
        component: PropTypes.func,
        value: PropTypes.any,
        id: PropTypes.string,
        fieldType: PropTypes.string,
        preview: PropTypes.bool,
        view: PropTypes.bool
    };

    renderField = () => {
        const { id, component: Component, item, fieldType, value, view, downloadUrl } = this.props;
        const disabled = !isNil(value) || view;

        return <Field
            name={id}
            component={Component}
            validate={value => item.required && !value ? 'Это поле обязательно для заполнения' : undefined}
            fieldType={fieldType}
            id={id}
            disabled={disabled}
            downloadUrl={downloadUrl}
            {...item} />;
    }

    render() {
        const { isField } = this.props;

        return isField ?
            this.renderField() :
            <Form
                className='form-generator'
                onSubmit={() => {}}
                subscription={{ submitting: true, submitFailed: true, error: true}}
                render={({ handleSubmit }) =>
                    <FormComponent onFinish={handleSubmit}>
                        { this.renderField() }
                    </FormComponent>
                } />;
    }
}

export default withFileUrlContext(FormField);
