import React, { Component, Fragment } from 'react';
import { Upload, Button, Icon } from 'antd';
import cx from 'classnames';

import styles from '../../css/imageUploader.scss';

import withFileUrlContext from '../../hocs/withFileUrlContext';

class ImageUploader extends Component {
    state = {
        error: false,
    }

    reader = new FileReader();

    beforeUpload = file => {
        this.reader.readAsDataURL(file);
        this.reader.onload = () => this.props.input.onChange({
            name: file.name,
            data: this.reader.result
        });

        return false;
    }

    onChange = info => {
        const { status, response, name } = info.file;

        switch (status) {
            case 'done':
                this.setState({ error: false });
                this.props.input.onChange({
                    name,
                    id: response.id,
                });
                break;
            case 'error':
                this.setState({ error: true });
                break;
            default:
                return;
        }
    }

    remove = () => this.props.input.onChange(null);

    renderStaticUploader = () => (
        <Upload
            accept='image/*'
            beforeUpload={this.beforeUpload}
            fileList={[]}>
            <Button icon='file-image' />
        </Upload>
    )

    renderRequestUploader = () => (
        <Upload
            showUploadList={false}
            accept='image/*'
            action={this.props.uploadUrl}
            onChange={this.onChange}>
            <Button style={{ color: this.state.error ? 'red' : '' }} icon='file-image' />
        </Upload>
    )

    render() {
        const { uploadImages, downloadUrl } = this.props;
        const { value } = this.props.input;

        return <Fragment>
            { uploadImages ? this.renderRequestUploader() : this.renderStaticUploader() }

            { value &&
                <div className={cx(styles.imageInfo, 'image-uploader-info')}>
                    <div className={cx(styles.image, 'image-uploader-img')} style={{ backgroundImage: `url('${value.id ? downloadUrl(value.id) : value.data}')` }} />
                    { value.name }
                    <Icon className={cx(styles.imageRemoveBtn, 'image-uploader-remove-btn')} type='close' onClick={this.remove} />
                </div>
            }
        </Fragment>;
    }
}

export default withFileUrlContext(ImageUploader);
