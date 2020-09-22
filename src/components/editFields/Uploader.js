import React, { Component, Fragment } from 'react';
import { Button, Upload } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import withFieldWrapper from '../../hocs/withFieldWrapper';
import withFileUrlContext from '../../hocs/withFileUrlContext';
import { getUrl } from '../../utils/files';

class Uploader extends Component {
    state = {
        error: false,
        uploading: false
    };

    reader = new FileReader();

    beforeUpload = file => {
        this.reader.readAsDataURL(file);
        this.reader.onload = () => this.props.onChange({
            body: this.reader.result,
            name: file.name
        });

        return false;
    }

    onChange = info => {
        const { status, response, name } = info.file;

        switch (status) {
            case 'uploading':
                this.setState({ uploading: true });
                break;
            case 'done':
                this.props.onChange({ id: response.id, name });
                this.state.error && this.setState({ error: false, uploading: false });
                break;
            case 'error':
                this.setState({ error: true, uploading: false });
                break;
            default:
                return;
        }
    }

    delete = () => this.props.onChange(null);

    render() {
        const { input: { value }, uploadUrl, uploadImages, accept, withoutUrl } = this.props;
        const props = uploadUrl && (!withoutUrl || uploadImages) ? {
            action: getUrl(uploadUrl),
            onChange: this.onChange
        } : {
            beforeUpload: this.beforeUpload
        };

        return value ?
            <Fragment>
                <span style={{ marginRight: 15 }}>{ value.name }</span>
                <Button danger onClick={this.delete}>
                    <DeleteOutlined /> Удалить
                </Button>
            </Fragment> :
            <Fragment>
                <Upload
                    {...props}
                    accept={accept}
                    showUploadList={false}
                    disabled={this.state.uploading}>
                    <Button loading={this.state.uploading} icon={<UploadOutlined />}>
                        Загрузить файл
                    </Button>
                </Upload>
                { this.state.error && <div style={{ color: 'red' }}>Не удалось загрузить файл</div> }
            </Fragment>;
    }
}

export default withFieldWrapper(withFileUrlContext(Uploader));
