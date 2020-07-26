import React, { Component } from 'react';
import { path, pathOr } from 'ramda';

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
        if (path(['url', 'name'], prev) !== path(['url', 'name'], this.props)) {
            this.getHeight();
        }
    }

    getHeight = () => {
        const { downloadUrl } = this.props;
        const url = pathOr({}, ['url'], this.props);

        if (url) {
            const img = new Image();
            img.src = url.id ? downloadUrl(url.id) : url.body;
            img.onload = () => {
                const height = this.container.clientWidth < img.width ?
                    (((this.container.clientWidth * 100) / img.width) * img.height) / 100 :
                    img.height;

                this.setState({
                    height,
                    coverHeight: this.container.clientWidth > img.width  ?
                        (((this.container.clientWidth * 100) / img.width) * img.height) / 100 :
                        height
                });
            };
        } else {
            this.setState({ height: 0, coverHeight: 0 });
        }
    }

    render() {
        const { cover, repeat, downloadUrl } = this.props;
        const url = pathOr({}, ['url'], this.props);

        return url ? <div ref={node => this.container = node}
            className='imageElement'
            style={{
                width: '100%',
                height: cover ? this.state.coverHeight : this.state.height,
                backgroundImage: `url('${url.id ? downloadUrl(url.id) : url.body}')`,
                backgroundSize: cover ? 'cover' : 'contain',
                backgroundRepeatX: repeat ? 'repeat' : 'no-repeat'
            }} /> : null;
    }
}

export default withElementWrapper(ImageComponent);
