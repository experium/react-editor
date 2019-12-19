import React, { Component } from 'react';
import { find, propEq } from 'ramda';
import { Form, Field } from 'react-final-form';
import { Form as FormComponent, Button, Popconfirm } from 'antd';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import cx from 'classnames';

import styles from '../css/editor.scss';
import formBuilderStyles from '../css/formBuilder.scss';
import FormField from './FormField';
import Input from './editFields/Input';
import MceEditor from './editFields/MceEditor';
import Multiple from './editFields/Multiple';
import Switch from './editFields/Switch';
import withComponentsContext from '../hocs/withComponentsContext';
import Uploader from './editFields/Uploader';

const FIELDS = {
    editor: MceEditor,
    input: Input,
    multiple: Multiple,
    switch: Switch,
    uploader: Uploader
};

class EditElement extends Component {
    renderPreview = item => {
        const { components } = this.props;
        const { staticContent, formComponent: Component } = find(propEq('type', item.type), components);

        return staticContent ?
            <Component {...item} id='preview' /> :
            <FormField
                id='preview'
                item={item}
                fieldType={item.type}
                component={Component}
                preview
                view={false} />;
    }

    render() {
        const { item, placeholder, onSubmit, components, onCancel } = this.props;
        const { fields = [] } = find(propEq('type', item.type), components);

        return <div className={cx(formBuilderStyles.experiumPlayerBuilder, 'experium-player-builder')}>
            <Form
                onSubmit={onSubmit}
                initialValues={item}
                mutators={arrayMutators}
                render={({ handleSubmit, values }) =>
                    <div className={cx(styles.editor, item.type, 'edit-element')}>
                        <div className={cx(styles.editorCol, 'edit-element-col')}>
                            <FormComponent onSubmit={handleSubmit}>
                                <div className={cx(styles.editorFields, 'edit-element-fields')}>
                                    { fields.map(item =>
                                        item.fieldArray ?
                                            <FieldArray
                                                key={`field-${item.prop}`}
                                                name={item.prop}
                                                component={FIELDS[item.type]}
                                                label={item.label}
                                                variantPlaceholder={placeholder}
                                                {...(item.props || {})} /> :
                                            <Field
                                                key={`field-${item.prop}`}
                                                name={item.prop}
                                                component={FIELDS[item.type]}
                                                label={item.label}
                                                placeholder={placeholder}
                                                {...(item.props || {})} />
                                    )}
                                </div>
                                <div className={cx(styles.editorFooter, 'edit-element-footer')}>
                                    <Button.Group>
                                        <Button type='primary' htmlType='submit'>
                                            Сохранить
                                        </Button>
                                        <Popconfirm
                                            title='Вы уверены, что хотите отменить все изменения?'
                                            okText='Да'
                                            cancelText='Нет'
                                            onConfirm={onCancel}>
                                            <Button>
                                                Отмена
                                            </Button>
                                        </Popconfirm>
                                    </Button.Group>
                                </div>
                            </FormComponent>
                        </div>
                        <div className={cx(styles.editorPreviewCol, 'edit-element-preview-col')}>
                            { this.renderPreview(values) }
                        </div>
                    </div>
                } />
        </div>;
    }
}

export default withComponentsContext(EditElement);
