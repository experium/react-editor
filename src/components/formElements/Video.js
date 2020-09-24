import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import Player from 'react-player';
import cx from 'classnames';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import styles from '../../css/video.scss';

class VideoPlayer extends Component {
    state = {
        minWidth: 0
    };

    componentDidMount() {
        this.setSize();
        window.addEventListener('resize', this.setSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setSize);
    }

    setSize = () => {
        const minWidth = this.container.clientWidth;
        const minHeight = (9 * minWidth) / 16;
        const height = this.props.height || (this.props.width && (this.props.width / 3)) || minHeight;

        this.setState({
            minWidth,
            minHeight: this.props.responsive ?
                (((100 * minWidth) / minWidth) * minHeight) / 100
                : (((100 * minWidth) / (this.props.width || minWidth)) * height) / 100
        });
    }

    render() {
        const { isDraggingOver, width, height, responsive, src } = this.props;
        const useMinSizes = responsive || !(width || height) || (width > this.state.minWidth);

        return <div className={cx({ 'dragging-over': isDraggingOver })} style={{ marginBottom: 15 }} ref={node => this.container = node}>
            <Player url={src} width={useMinSizes ? this.state.minWidth : width} height={useMinSizes ? this.state.minHeight : height} controls />
        </div>;
    }
}

export class Video extends Component {
    static propTypes = {
        src: PropTypes.string,
        isEditor: PropTypes.bool,
        isDraggingOver: PropTypes.bool
    };

    static defaultProps = {
        src: ''
    };

    onChange = e => {
        this.props.onChange('src', e.target.value);
    }

    render() {
        const { src, isEditor, isDraggingOver, responsive, width, height } = this.props;

        return <div className={cx(styles.video, 'video')}>
            { isEditor &&
                <Input
                    value={src}
                    onChange={this.onChange}
                    placeholder='Вставьте ссылку на видео с youtube' />
            }
            { src ? (
                <VideoPlayer
                    isDraggingOver={isDraggingOver}
                    responsive={responsive}
                    width={width}
                    height={height}
                    src={src}
                />
            ) : null}
        </div>;
    }
}

export default withElementWrapper(Video);
