import React, { Component } from 'react';
import { Switch } from 'antd';

import withFieldWrapper from '../../hocs/withFieldWrapper';

class SwitchComponent extends Component {
    render() {
        const { input: { value }, onChange } = this.props;

        return <Switch
            checked={!!value}
            onChange={onChange} />;
    }
}

export default withFieldWrapper(SwitchComponent);
