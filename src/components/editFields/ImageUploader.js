import React, { Component, Fragment } from 'react';
import { Upload, Button, Icon } from 'antd';
import cx from 'classnames';

import styles from '../../css/imageUploader.scss';

export default class ImageUploader extends Component {
    reader = new FileReader();

    beforeUpload = file => {
        this.reader.readAsDataURL(file);
        this.reader.onload = () => this.props.input.onChange({
            name: file.name,
            data: this.reader.result
        });

        return false;
    }

    remove = () => this.props.input.onChange(null);

    render() {
        const { value, onChange } = this.props.input;

        return <Fragment>
            <Upload
                accept='image/*'
                beforeUpload={this.beforeUpload}
                fileList={[]}>
                <Button icon='file-image' />
            </Upload>
            { value &&
                <div className={cx(styles.imageInfo, 'image-uploader-info')}>
                    <div className={cx(styles.image, 'image-uploader-img')} style={{ backgroundImage: `url('${value.data}')` }} />
                    { value.name }
                    <Icon className={cx(styles.imageRemoveBtn, 'image-uploader-remove-btn')} type='close' onClick={this.remove} />
                </div>
            }
        </Fragment>;
    }
}
