import React, { Component, Fragment } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from 'antd';
import cx from 'classnames';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import withFileUrlContext from '../../hocs/withFileUrlContext';
import styles from '../../css/pdf.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export class PdfComponent extends Component {
    state = {
        numPages: null,
        pageNumber: 1
    };

    onLoadSuccess = ({ numPages }) => this.setState({ numPages, pageNumber: 1 });

    back = () => this.setState(prev => ({ pageNumber: prev.pageNumber - 1 }));

    next = () => this.setState(prev => ({ pageNumber: prev.pageNumber + 1 }));

    renderPdf = () => {
        const { file, width } = this.props;
        const fileUrl = file.id ? downloadUrl(file.id) : file.body;
        const { pageNumber, numPages } = this.state;

        return <div className={cx(styles.pdf, 'pdf-component')}>
            <div className={cx(styles.pdfPageButtons, 'pdf-page-buttons')}>
                <Button.Group>
                    <Button icon='left' onClick={this.back} disabled={pageNumber < 2} />
                    <Button icon='right' onClick={this.next} disabled={pageNumber >= numPages} />
                </Button.Group>
            </div>
            <Document
                file={fileUrl}
                onLoadSuccess={this.onLoadSuccess}>
                <Page pageNumber={pageNumber} width={width || 450} />
            </Document>
            <div className={cx(styles.pdfFooter, 'pdf-footer')}>
                { pageNumber } / { numPages }
            </div>
        </div>;
    }

    render() {
        const { file } = this.props;

        return file ? this.renderPdf() : null;
    }
}

export default withElementWrapper(withFileUrlContext(PdfComponent));
