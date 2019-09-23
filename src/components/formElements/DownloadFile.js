import React, { Component, Fragment } from 'react';
import { Button } from 'antd';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import withFileUrlContext from '../../hocs/withFileUrlContext';

class DownloadFileComponent extends Component {
    render() {
        const { label, downloadUrl, file } = this.props;

        return <Fragment>
            <div dangerouslySetInnerHTML={{ __html: label }} />
            { file &&
                <Button
                    style={{ margin: '10px 0' }}
                    icon='download'
                    target='_blank'
                    href={file.id ? downloadUrl(file.id) : file.body}
                    download>
                    Скачать
                </Button>}
        </Fragment>;
    }
}

export const DownloadFile = withFileUrlContext(DownloadFileComponent);
export default withElementWrapper(withFileUrlContext(DownloadFileComponent));
