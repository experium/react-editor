import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import Player from 'react-player';
import cx from 'classnames';

import { withElementWrapper } from '../../hocs/withElementWrapper';
import styles from '../../css/video.scss';

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
        const { src, isEditor, isDraggingOver, width, height } = this.props;

        return <div className={cx(styles.video, 'video')}>
            { isEditor &&
                <Input
                    value={src}
                    onChange={this.onChange}
                    placeholder='Вставьте ссылку на видео с youtube' />
            }
            { src ?
                <div className={cx(styles.videoWrapper, 'video-wrapper', { 'dragging-over': isDraggingOver })}>
                    <Player url={src} width={width} height={height} />
                </div> : null
            }
        </div>;
    }
}

export default withElementWrapper(Video);
