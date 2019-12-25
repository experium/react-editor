import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Form as FormComponent } from 'antd';
import { find, propEq, any, toPairs, concat, filter, addIndex } from 'ramda';
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
        preview: PropTypes.bool,
        values: PropTypes.object,
        view: PropTypes.bool
    };

    static defaultProps = {
        data: {},
        values: {},
        components: []
    };

    state = {
        page: 0
    };

    onSubmit = values => {
        this.props.onSubmit && this.props.onSubmit(values);
    }

    getComponents = placeholder => {
        return concat(COMPONENTS_DEFAULTS(placeholder), this.props.components);
    }

    goBack = () => this.setState(prev => ({ page: prev.page - 1 }));

    goNext = () => this.setState(prev => ({ page: prev.page + 1 }));

    renderFooter = (staticContent, index, invalid) => {
        const { data: { common = {}, items }} = this.props;
        const { page } = this.state;

        return <Button.Group>
            { common.pages && page > 0 &&
                <Button
                    htmlType='submit'
                    onClick={!invalid ? this.goBack : null}>
                    Назад
                </Button>
            }
            { ((!staticContent && common.everyQuestionSubmit) || (common.pages ? page : index) === items.length - 1) &&
                <Button
                    htmlType='submit'
                    type='primary'>
                    Сохранить
                </Button>
            }
            { common.pages && page < items.length - 1 &&
                <Button
                    htmlType='submit'
                    onClick={!invalid ? this.goNext : null}>
                    Вперед
                </Button>
            }
        </Button.Group>;
    }

    renderRow = (id, index, invalid) => {
        const { data: { elements = {}, common = {}, items }, preview, values, view, placeholder } = this.props;
        const item = elements[id];
        const { staticContent, fieldType, formComponent: Component } = find(propEq('type', item.type), this.getComponents(placeholder));

        return <Row key={`row-${id}`}>
            <Col>
                { staticContent ?
                    <Component {...item} id={id} /> :
                    <FormField
                        id={id}
                        item={item}
                        fieldType={fieldType}
                        component={Component}
                        value={values[id]}
                        preview={preview}
                        view={view}
                        isField />
                }
            </Col>
            { this.renderFooter(staticContent, index, invalid) }
        </Row>;
    }

    hasFields = () => {
        const { elements = {} } = this.props.data;

        return any(([, item]) => !find(propEq('type', item.type), this.getComponents(placeholder)).staticContent, toPairs(elements));
    }

    render() {
        const { data: { items = [], common = {} }, uploadUrl, downloadUrl, values } = this.props;
        const { page } = this.state;

        return <div className={cx(styles.experiumPlayerBuilder, 'experium-player-builder')} style={{ background: common.pageColor || 'transparent', padding: 15 }}>
            <ComponentsContext.Provider value={this.getComponents()}>
                <FileUrlContext.Provider value={{
                    uploadUrl,
                    downloadUrl
                }}>
                    <Form
                        className='formGenerator'
                        onSubmit={this.onSubmit}
                        initialValues={values}
                        subscription={{ submitting: true, submitFailed: true, invalid: true }}
                        render={({ handleSubmit, invalid }) =>
                            <FormComponent onSubmit={handleSubmit}>
                                <DragDropContext>
                                    { addIndex(filter)((item, index) =>
                                        common.pages ? index === page : true, items).map((row, index) => this.renderRow(row, index, invalid)
                                    )}
                                </DragDropContext>
                            </FormComponent>
                        } />
                </FileUrlContext.Provider>
            </ComponentsContext.Provider>
        </div>;
    }
}
