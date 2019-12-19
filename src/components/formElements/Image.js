import React, { Component } from 'react';
import { path } from 'ramda';

import { withElementWrapper } from '../../hocs/withElementWrapper';

export class ImageComponent extends Component {
    state = {
        height: 0,
        coverHeight: 0
    };

    componentDidMount() {
        this.getHeight();
    }

    componentDidUpdate(prev) {
        if (path(['url', 'body'], prev) !== path(['url', 'body'], this.props)) {
            this.getHeight();
        }
    }

    getHeight = () => {
        const url = path(['url', 'body'], this.props);

        if (url) {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                const height = this.container.clientWidth < img.width ?
                    (this.container.clientWidth * 100 / img.width) * img.height / 100 :
                    img.height;

                this.setState({
                    height,
                    coverHeight: this.container.clientWidth > img.width  ? (this.container.clientWidth * 100 / img.width) * img.height / 100 : height
                });
            };
        } else {
            this.setState({ height: 0, coverHeight: 0 });
        }
    }

    render() {
        const { cover, repeat } = this.props;
        const url = path(['url', 'body'], this.props);

        return url ? <div ref={node => this.container = node}
            style={{
                width: '100%',
                height: cover ? this.state.coverHeight : this.state.height,
                backgroundImage: `url('${url}')`,
                backgroundSize: cover ? 'cover' : 'contain',
                backgroundRepeatX: repeat ? 'repeat' : 'no-repeat'
            }} /> : null;
    }
}

export default withElementWrapper(ImageComponent);
