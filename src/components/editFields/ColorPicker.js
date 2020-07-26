import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/colorPicker.scss';

class ColorPicker extends Component {
    state = {
        open: false
    };

    onChange = ({ rgb }) => {
        this.props.onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`);
    }

    toggle = () => this.setState(prev => ({ open: !prev.open }));

    close = () => this.setState({ open: false });

    render() {
        const { input: { value }} = this.props;

        return <div>
            <div className={styles.swatch} onClick={this.toggle} pointer='true'>
                <div className={styles.color} style={{ background: value }} />
            </div>
            { this.state.open &&
                <div>
                    <div className={styles.cover} onClick={this.close} />
                    <div className={styles.popover}>
                        <ChromePicker color={value} onChangeComplete={this.onChange} />
                    </div>
                </div>
            }
        </div>;
    }
}

export default withFieldWrapper(ColorPicker);
