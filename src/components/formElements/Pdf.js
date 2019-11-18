import React, { Component, Fragment } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Spin } from 'antd';
import cx from 'classnames';
import { pathOr } from 'ramda';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import withFileUrlContext from '../../hocs/withFileUrlContext';
import styles from '../../css/pdf.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Spinner = () =>
    <div className={cx(styles.pdfSpin, 'pdf-spin')}>
        <Spin />
    </div>;

class PdfField extends Component {
    state = {
        numPages: null,
        pageNumber: 1
    };

    onLoadSuccess = ({ numPages }) => this.setState({ numPages, pageNumber: 1 });

    back = () => this.setState(prev => ({ pageNumber: prev.pageNumber - 1 }));

    next = () => this.setState(prev => ({ pageNumber: prev.pageNumber + 1 }));

    getWidth = () => {
        return this.props.width || (this.pageRef ? this.pageRef.ref.clientWidth : 450);
    }

    renderPdf = () => {
        const { file, downloadUrl } = this.props;
        const fileUrl = file.id ? downloadUrl(file.id) : file.body;
        const { pageNumber, numPages } = this.state;

        return <div className={cx(styles.pdf, 'pdf-component')}>
            <div className={cx(styles.pdfPageButtons, 'pdf-page-buttons')}>
                <Button.Group>
                    <Button icon='left' onClick={this.back} disabled={pageNumber < 2} />
                    <Button icon='right' onClick={this.next} disabled={pageNumber >= numPages} />
                </Button.Group>
            </div>
            <div style={{ minHeight: pathOr(0, ['ref', 'clientHeight'], this.pageRef) }}>
                <Document
                    ref={node => this.pdf = node}
                    file={fileUrl}
                    onLoadSuccess={this.onLoadSuccess}
                    loading={<Spinner />}>
                    <Page
                        ref={node => this.pageRef = node}
                        pageNumber={pageNumber}
                        width={this.getWidth()}
                        loading={<Spinner />} />
                </Document>
            </div>
            <div className={cx(styles.pdfFooter, 'pdf-footer')}>
                { pageNumber } / { numPages }
            </div>
        </div>;
    }

    render() {
        const { file, label } = this.props;

        return <Fragment>
            <div dangerouslySetInnerHTML={{ __html: label }} />
            { file ? this.renderPdf() : null }
        </Fragment>;
    }
}

export const PdfComponent = withFileUrlContext(PdfField);

export default withElementWrapper(PdfComponent);
