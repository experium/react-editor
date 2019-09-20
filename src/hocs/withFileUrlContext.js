import React, { Component } from 'react';

import FileUrlContext from '../contexts/FileUrlContext';

export default WrappedComponent =>
    class FileUrlContextWrapper extends Component {
        render() {
            return <FileUrlContext.Consumer>
                { ({ uploadUrl, downloadUrl }) =>
                    <WrappedComponent
                        {...this.props}
                        uploadUrl={uploadUrl}
                        downloadUrl={downloadUrl} />
                    }
            </FileUrlContext.Consumer>;
        }
    };
