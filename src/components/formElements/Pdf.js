import React, { Component, Fragment } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Spin, Modal } from 'antd';
import cx from 'classnames';
import { pathOr, range, filter } from 'ramda';
import { LeftOutlined, RightOutlined, FullscreenOutlined } from '@ant-design/icons';

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
        pageNumber: 1,
        fullScreen: false,
        loaded: false
    };

    componentDidUpdate(prev) {
        if (this.props.file && !prev.file) {
            this.setState({ loaded: false });
        }
    }

    onLoadSuccess = ({ numPages }) => this.setState({ numPages, pageNumber: 1, loaded: true });

    back = () => this.setState(prev => ({ pageNumber: prev.pageNumber - 1 }));

    next = () => this.setState(prev => ({ pageNumber: prev.pageNumber + 1 }));

    getWidth = () => {
        return this.props.width || (this.pageRef ? this.pageRef.ref.clientWidth : 450);
    }

    openFullPdf = () => {
        this.setState({ fullScreen: true });
    }

    closeFullPdf = () => {
        this.setState({ fullScreen: false });
    }

    getPages = () => {
        const { pageNumber, numPages } = this.state;
        const pages = range(pageNumber - 2, pageNumber + 3);

        return this.props.allPages ? range(1, numPages + 1) : filter(num => num > 0 && num < numPages + 1, pages);
    }

    renderPdf = () => {
        const { file, downloadUrl, allPages } = this.props;
        const fileUrl = file.id ? downloadUrl(file.id) : file.body;
        const { pageNumber, numPages, loaded } = this.state;
        const pages = this.getPages();

        return <div className={cx(styles.pdf, 'pdf-component')}>
            <div className={cx(styles.pdfPageButtons, 'pdf-page-buttons')}>
                <Button.Group>
                    { !allPages &&
                        <Fragment>
                            <Button icon={<LeftOutlined />} onClick={this.back} disabled={pageNumber < 2} />
                            <Button icon={<RightOutlined />} onClick={this.next} disabled={pageNumber >= numPages} />
                        </Fragment>
                    }
                    <Button icon={<FullscreenOutlined />} onClick={this.openFullPdf} />
                </Button.Group>
            </div>
            <div style={{ minHeight: pathOr(0, ['ref', 'clientHeight'], this.pageRef) }}>
                <Document
                    ref={node => this.pdf = node}
                    file={fileUrl}
                    onLoadSuccess={this.onLoadSuccess}
                    loading={<Spinner />}>
                    { pages.map(p =>
                        <div key={`page-${p}`} style={{ display: (p === pageNumber || allPages) ? 'block' : 'none' }}>
                            <Page
                                ref={p === pageNumber ? (node => this.pageRef = node) : null}
                                pageNumber={p}
                                width={this.getWidth()}
                                loading={<Spinner />} />
                        </div>
                    )}
                </Document>
                <Modal
                    className={cx(styles.pdfFullView, 'pdf-fullview')}
                    visible={this.state.fullScreen}
                    closable={false}
                    footer={<Button onClick={this.closeFullPdf}>Закрыть</Button>}
                    width='100%'
                    destroyOnClose>
                    <iframe height='100%' width='100%' scrolling='no' frameBorder="0" src={fileUrl}></iframe>
                </Modal>
            </div>
            { !allPages && loaded &&
                <div className={cx(styles.pdfFooter, 'pdf-footer')}>
                    { pageNumber } / { numPages }
                </div>
            }
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
