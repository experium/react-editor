import React, { Component } from 'react';
import ComponentsContext from '../contexts/ComponentsContext';

export default WrappedComponent =>
    class ComponentsContextWrapper extends Component {
        render() {
            return <ComponentsContext.Consumer>
                { components => <WrappedComponent {...this.props} components={components} /> }
            </ComponentsContext.Consumer>;
        }
    };
