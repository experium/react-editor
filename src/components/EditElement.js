import React, { Component } from 'react';
import { find, propEq, path, omit } from 'ramda';
import { Form, Field } from 'react-final-form';
import { Form as FormComponent, Button, Popconfirm } from 'antd';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import cx from 'classnames';
import { createGlobalStyle } from 'styled-components';

import styles from '../css/editor.scss';
import formBuilderStyles from '../css/formBuilder.scss';
import FileUrlContext from '../contexts/FileUrlContext';
import FormField from './FormField';
import Input from './editFields/Input';
import MceEditor from './editFields/MceEditor';
import Multiple from './editFields/Multiple';
import Switch from './editFields/Switch';
import withComponentsContext from '../hocs/withComponentsContext';
import Uploader from './editFields/Uploader';
import RadioButtons from './editFields/RadioButtons';

const FIELDS = {
    editor: MceEditor,
    input: Input,
    multiple: Multiple,
    switch: Switch,
    uploader: Uploader,
    radiobuttons: RadioButtons
};

const GlobalStyle = createGlobalStyle`
    .tox-notifications-container {
        display: none;
    }
    .tox-tinymce-inline {
        z-index: 1000;
    }
`;

class EditElement extends Component {
    renderPreview = item => {
        const { components } = this.props;
        const options =  find(propEq('type', item.type), components);
        const { staticContent, formComponent: Component } = options;

        return staticContent ?
            <FileUrlContext.Consumer>
                {fileContext => (
                    <Component {...item} {...fileContext} id='preview' />
                )}
            </FileUrlContext.Consumer> :
            <FormField
                key={JSON.stringify(omit(['correct'], item))}
                id={item.allowCorrect ? 'correct' : 'preview'}
                isField={!!item.allowCorrect}
                item={item}
                options={options}
                fieldType={item.type}
                component={Component}
                preview
                view={false} />;
    }

    render() {
        const { item, placeholder, onSubmit, components, onCancel } = this.props;
        const { fields = [], hidePreview } = find(propEq('type', item.type), components);

        return <div className={cx(formBuilderStyles.experiumPlayerBuilder, 'experium-player-builder')}>
            <GlobalStyle />
            <Form
                onSubmit={onSubmit}
                initialValues={item}
                mutators={arrayMutators}
                render={({ handleSubmit, values }) =>
                    <div className={cx(styles.editor, item.type, 'edit-element')}>
                        <div className={cx(styles.editorCol, 'edit-element-col', { [styles.editorColHidePreview]: hidePreview })}>
                            <FormComponent onFinish={handleSubmit}>
                                <div className={cx(styles.editorFields, 'edit-element-fields')}>
                                    { fields.map(item => (path(['props', 'cond'], item) ? item.props.cond(values) : true) && FIELDS[item.type] ?
                                        (item.fieldArray ?
                                            <FieldArray
                                                key={`field-${item.prop}`}
                                                name={item.prop}
                                                component={FIELDS[item.type]}
                                                label={item.label}
                                                description={item.description}
                                                variantPlaceholder={placeholder}
                                                {...(item.props || {})} /> :
                                            <Field
                                                key={`field-${item.prop}`}
                                                name={item.prop}
                                                component={FIELDS[item.type]}
                                                label={item.label}
                                                placeholder={placeholder}
                                                {...(item.props || {})}
                                                hidePreview={hidePreview} />
                                        ) : null
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
                        { !hidePreview &&
                            <div className={cx(styles.editorPreviewCol, 'edit-element-preview-col experium-player-elements')}>
                                { this.renderPreview(values) }
                            </div>
                        }
                    </div>
                } />
        </div>;
    }
}

export default withComponentsContext(EditElement);
