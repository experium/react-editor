import React, { Component, Fragment } from 'react';
import { Upload, Button } from 'antd';
import cx from 'classnames';
import { CloseOutlined, FileImageOutlined } from '@ant-design/icons';

import styles from '../../css/imageUploader.scss';

import withFileUrlContext from '../../hocs/withFileUrlContext';
import { getUrl } from '../../utils/files';

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
            <Button icon={<FileImageOutlined />} />
        </Upload>
    )

    renderRequestUploader = () => (
        <Upload
            showUploadList={false}
            accept='image/*'
            action={getUrl(this.props.uploadUrl)}
            onChange={this.onChange}>
            <Button style={{ color: this.state.error ? 'red' : '' }} icon={<FileImageOutlined />} />
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
                    <CloseOutlined className={cx(styles.imageRemoveBtn, 'image-uploader-remove-btn')} onClick={this.remove} />
                </div>
            }
        </Fragment>;
    }
}

export default withFileUrlContext(ImageUploader);
