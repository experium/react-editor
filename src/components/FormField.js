import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { Form as FormComponent } from 'antd';
import { isNil } from 'ramda';

import withFileUrlContext from '../hocs/withFileUrlContext';

const required = value => !value ? 'Обязательно для заполнения' : undefined;
const incorrect = (value, correct) => value !== correct ? 'Неправильный ответ' : undefined;

class FormField extends Component {
    static propTypes = {
        item: PropTypes.object,
        options: PropTypes.object,
        component: PropTypes.func,
        value: PropTypes.any,
        id: PropTypes.string,
        fieldType: PropTypes.string,
        preview: PropTypes.bool,
        view: PropTypes.bool
    };

    renderField = () => {
        const { id, component: Component, item, options, fieldType, value, view, noCheckCorrect, downloadUrl } = this.props;
        const disabled = !isNil(value) || view;

        return <Field
            name={id}
            component={Component}
            validate={value => disabled ? undefined : (
                (item.required && (options.requiredValidator ? options.requiredValidator(value, item) : required(value)))
                || (!noCheckCorrect && item.allowCorrect && (
                    options.correctValidator ? options.correctValidator(value, item.correct, item) : incorrect(value, item.correct)
                ))
                || undefined
            )}
            fieldType={fieldType}
            id={id}
            disabled={disabled}
            downloadUrl={downloadUrl}
            {...item}
            allowCorrect={!noCheckCorrect && item.allowCorrect} />;
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
