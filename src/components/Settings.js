import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import { Form as FormComponent, Button } from 'antd';

import Switch from './editFields/Switch';
import ColorPicker from './editFields/ColorPicker';

export default class Settings extends Component {
    render() {
        const { settings, onSubmit } = this.props;

        return <Form
            onSubmit={onSubmit}
            initialValues={settings}
            render={({ handleSubmit }) =>
                <FormComponent onFinish={handleSubmit}>
                    <Field
                        name='everyQuestionSubmit'
                        component={Switch}
                        label='Показывать кнопку ответа после каждого вопроса' />
                    <Field
                        name='pages'
                        component={Switch}
                        label='Выводить каждый вопрос на отдельной странице' />
                    <Field
                        name='pageColor'
                        component={ColorPicker}
                        label='Цвет страницы' />
                    <Button
                        type='primary'
                        htmlType='submit'>
                        Сохранить
                    </Button>
                </FormComponent>
            } />;
    }
}
