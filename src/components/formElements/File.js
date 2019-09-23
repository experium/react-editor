import React, { Component, Fragment } from 'react';
import { Button, Icon, Upload } from 'antd';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import withFieldWrapper from '../../hocs/withFieldWrapper';
import withFileUrlContext from '../../hocs/withFileUrlContext';

class File extends Component {
    state = {
        error: false
    };

    reader = new FileReader();

    beforeUpload = file => {
        this.reader.readAsDataURL(file);
        this.reader.onload = () => this.props.onChange(this.reader.result);

        return false;
    }

    onChange = info => {
        switch (info.file.status) {
            case 'done':
                this.props.onChange(info.file.response.id);
                this.state.error && this.setState({ error: false });
                break;
            case 'error':
                this.setState({ error: true });
                break;
            default:
                break;
        }
    }

    delete = () => this.props.onChange(null);

    render() {
        const { input: { value }, uploadUrl, downloadUrl } = this.props;
        const props = uploadUrl ? {
            action: uploadUrl,
            onChange: this.onChange
        } : {
            beforeUpload: this.beforeUpload
        };

        return value ?
            <Button.Group>
                <Button download href={downloadUrl ? downloadUrl(value) : value} target='_blank'>
                    <Icon type='download' /> Скачать
                </Button>
                <Button type='danger' onClick={this.delete}>
                    <Icon type='delete' /> Удалить
                </Button>
            </Button.Group> :
            <Fragment>
                <Upload {...props} fileList={[]}>
                    <Button>
                        <Icon type='upload' /> Загрузить файл
                    </Button>
                </Upload>
                { this.state.error && <span style={{ color: 'red' }}>Не удалось загрузить файл</span> }
            </Fragment>;
    }
}

export default withElementWrapper(withFileUrlContext(File));
export const FileField = withFieldWrapper(withFileUrlContext(File));
