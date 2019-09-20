import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';

import withFieldWrapper from '../../hocs/withFieldWrapper';

class InputComponent extends Component {
    onChange = e => this.props.onChange(e.target.value);

    onChangeNumber = value => this.props.onChange(value);

    render() {
        const { input: { value }, number, min, max } = this.props;

        return number ?
            <InputNumber
                value={value}
                onChange={this.onChangeNumber}
                min={min}
                max={max} /> :
            <Input
                value={value}
                onChange={this.onChange} />;
    }
}

export default withFieldWrapper(InputComponent);
