import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Form as FormComponent } from 'antd';
import { find, propEq, any, toPairs, concat, filter, addIndex, path, pathOr } from 'ramda';
import { DragDropContext } from 'react-beautiful-dnd';
import cx from 'classnames';
import { Form } from 'react-final-form';

import COMPONENTS_DEFAULTS from '../constants/componentsDefaults';
import FormField from './FormField';
import FileUrlContext from '../contexts/FileUrlContext';
import styles from '../css/formBuilder.scss';
import ComponentsContext from '../contexts/ComponentsContext';

export class FormGenerator extends Component {
    static propTypes = {
        data: PropTypes.object,
        onSubmit: PropTypes.func,
        renderFooter: PropTypes.func,
        preview: PropTypes.bool,
        values: PropTypes.object,
        components: PropTypes.array,
        view: PropTypes.bool
    };

    static defaultProps = {
        data: {},
        values: {},
        disable: true,
        components: []
    };

    state = {
        page: 0
    };

    onSubmit = (values, ...props) => {
        this.props.onSubmit && this.props.onSubmit(values);
    }

    getComponents = placeholder => {
        return concat(COMPONENTS_DEFAULTS(placeholder), this.props.components);
    }

    goBack = () => this.setState(prev => ({ page: prev.page - 1 }));

    goNext = (formProps, values) => {
        this.setState(prev => ({ page: prev.page + 1 }));
        formProps.reset(values);
    }

    renderFooter = footerProps => {
        const { renderFooter, staticContent, index, invalid, formProps, formValues, handleSubmit } = footerProps;
        const { data: { common = {}, items, elements }, submitText, onHandleSubmit } = this.props;
        const { page } = this.state;

        const components = COMPONENTS_DEFAULTS().concat(this.props.components);
        const showSubmit = any(([ _, item ]) => !path(['staticContent'], find(propEq('type', item.type), components)), toPairs(elements));

        return renderFooter ? (
            renderFooter({
                ...footerProps,
                showSubmit,
                page,
                goNext: () => this.goNext(formProps, formValues),
            }, this.props)
        ) : (
            <Button.Group className='experium-player-footer'>
                { common.pages && page > 0 &&
                    <Button
                        htmlType='submit'
                        onClick={this.goBack}>
                        Назад
                    </Button>
                }
                { showSubmit && ((!staticContent && common.everyQuestionSubmit) || (common.pages ? page : index) === items.length - 1) &&
                    <Button
                        type='primary'
                        onClick={() => {
                            if (onHandleSubmit) {
                                onHandleSubmit(footerProps, this.props);
                            }
                            handleSubmit();
                        }}
                    >
                        { submitText || 'Сохранить'}
                    </Button>
                }
                { common.pages && page < items.length - 1 &&
                    <Button
                        htmlType='submit'
                        onClick={!invalid ? () => this.goNext(formProps, formValues) : null}>
                        Вперед
                    </Button>
                }
            </Button.Group>
        );
    }

    renderRow = (id, index, invalid, formProps, formValues, errors, submitFailed, handleSubmit) => {
        const { data: { elements = {} }, preview, values, view, disable, noCheckCorrect, placeholder, renderFooter } = this.props;
        const item = pathOr({}, [id], elements);
        const options = find(propEq('type', item.type), this.getComponents(placeholder));

        if (!options) {
            return null;
        }

        const { staticContent, fieldType, formComponent: Component } = options;

        return <Row
            key={`row-${id}`}
            style={item.float ? { float: item.float || 'none', width: `${item.width}%` } : undefined}
        >
            <Col span={24}>
                { staticContent ?
                    <FileUrlContext.Consumer>
                        {fileContext => <Component {...item} {...fileContext} id={id} />}
                    </FileUrlContext.Consumer> :
                    <FormField
                        id={id}
                        item={item}
                        options={options}
                        fieldType={fieldType}
                        component={Component}
                        view={view}
                        preview={preview}
                        value={disable ? path([id], values) : undefined}
                        noCheckCorrect={noCheckCorrect}
                        isField />
                }
            </Col>
            { this.renderFooter({ renderFooter, staticContent, index, invalid, formProps, formValues, errors, submitFailed, handleSubmit }) }
        </Row>;
    }

    hasFields = () => {
        const { elements = {} } = this.props.data;

        return any(([, item]) => !find(propEq('type', item.type), this.getComponents(placeholder)).staticContent, toPairs(elements));
    }

    render() {
        const { data: { items = [], common = {} }, uploadUrl, downloadUrl, uploadImages, values } = this.props;
        const { page } = this.state;

        return <div className={cx(styles.experiumPlayerBuilder, 'experium-player-builder', 'experium-player-elements')} style={{ background: common.pageColor || 'transparent', padding: 15 }}>
            <ComponentsContext.Provider value={this.getComponents()}>
                <FileUrlContext.Provider value={{
                    uploadUrl,
                    downloadUrl,
                    uploadImages,
                }}>
                    <Form
                        className='formGenerator'
                        onSubmit={this.onSubmit}
                        initialValues={values}
                        subscription={{ submitting: true, submitFailed: true, invalid: true, errors: true, values: true }}
                        render={({ handleSubmit, invalid, values, form, errors, submitFailed }) =>
                            <FormComponent onFinish={handleSubmit}>
                                <DragDropContext>
                                    { addIndex(filter)((item, index) => common.pages ? index === page : true, items)
                                        .map((row, index) => this.renderRow(row, index, invalid, form, values, errors, submitFailed, handleSubmit))
                                    }
                                </DragDropContext>
                            </FormComponent>
                        } />
                </FileUrlContext.Provider>
            </ComponentsContext.Provider>
        </div>;
    }
}
