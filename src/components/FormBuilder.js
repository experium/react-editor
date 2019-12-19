import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { DragDropContext } from 'react-beautiful-dnd';
import { contains, concat } from 'ramda';
import cx from 'classnames';

import Toolbar from './Toolbar';
import Container from './Container';
import withData from '../hocs/withData';
import { FormGenerator } from './FormGenerator';
import { reorder } from '../utils/dnd';
import styles from '../css/formBuilder.scss';
import Settings from './Settings';
import FileUrlContext from '../contexts/FileUrlContext';
import MceLanguageUrl from '../contexts/MceLanguageUrl';

class FormBuilderComponent extends Component {
    static propTypes = {
        addItem: PropTypes.func,
        reorderItems: PropTypes.func,
        items: PropTypes.array,
        elements: PropTypes.object,
        onPreviewOpen: PropTypes.func,
        onPreviewClose: PropTypes.func,
        placeholder: PropTypes.string
    };

    state = {
        preview: false,
        showSettings: false
    };

    openPreview = () => {
        const { onPreviewOpen } = this.props;

        this.setState({ preview: true });
        onPreviewOpen && onPreviewOpen();
    };

    closePreview = () => {
        const { onPreviewClose } = this.props;

        this.setState({ preview: false });
        onPreviewClose && onPreviewClose();
    };

    onDragEnd = result => {
        if (!result.destination) {
            return;
        }

        if (contains('field', result.type)) {
            const id = result.destination.droppableId;
            this.props.editItem(id, 'options', reorder(this.props.elements[id].options, result.source.index, result.destination.index));
            return;
        }

        if (result.source.droppableId === 'toolbar') {
            this.props.addItem(result.draggableId, result.destination.index);
        } else {
            this.props.reorderItems(result.source.index, result.destination.index);
        }
    }

    openSettings = () => this.setState({ showSettings: true });

    closeSettings = () => this.setState({ showSettings: false });

    editCommonSettings = settings => {
        this.props.editCommonSettings(settings);
        this.closeSettings();
    }

    render() {
        const { items, elements, addItem, components, commonSettings, uploadUrl, downloadUrl, mceLanguageUrl } = this.props;

        return <div className={cx(styles.experiumPlayerBuilder, 'experium-player-builder')}>
            <div className={cx(styles.reactFormBuilder, 'react-form-builder clearfix')}>
                <div className={cx(styles.reactFormBuilderPreviewBtn, 'react-form-builder-preview-btn')}>
                    <Button.Group>
                        <Button
                            type='primary'
                            onClick={this.openPreview}
                            icon='eye'>
                            Предпросмотр
                        </Button>
                        <Button
                            icon='setting'
                            onClick={this.openSettings}>
                            Настройки
                        </Button>
                    </Button.Group>
                </div>
                <FileUrlContext.Provider value={{
                    uploadUrl,
                    downloadUrl
                }}>
                    <MceLanguageUrl.Provider value={mceLanguageUrl}>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Container {...this.props} />
                            <Toolbar addItem={addItem} />
                        </DragDropContext>
                    </MceLanguageUrl.Provider>
                </FileUrlContext.Provider>
                <Modal
                    className='react-form-builder-preview-modal'
                    title='Предпросмотр'
                    visible={this.state.preview}
                    onCancel={this.closePreview}
                    destroyOnClose
                    width='100%'
                    style={{ maxWidth: 1000 }}
                    footer={null}>
                    <FormGenerator
                        data={{ items, elements, common: commonSettings }}
                        components={components}
                        uploadUrl={uploadUrl}
                        downloadUrl={downloadUrl}
                        preview />
                </Modal>
                <Modal
                    title='Настройки'
                    className='react-form-builder-settings-modal'
                    visible={this.state.showSettings}
                    onCancel={this.closeSettings}
                    destroyOnClose
                    footer={null}>
                    <Settings
                        settings={commonSettings}
                        onSubmit={this.editCommonSettings} />
                </Modal>
            </div>
        </div>;
    }
}

export const FormBuilder = withData(FormBuilderComponent);
