import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, without, dissoc, insert, pathOr, identical, equals, isNil, propEq, find, concat } from 'ramda';
import uniqid from 'uniqid';

import { reorder } from '../utils/dnd';
import EditModalContext from '../contexts/EditModalContext';
import COMPONENTS_DEFAULTS from '../constants/componentsDefaults';
import ComponentsContext from '../contexts/ComponentsContext';

export default WrappedComponent =>
    class extends Component {
        static propTypes = {
            data: PropTypes.object
        };

        static defaultProps = {
            placeholder: 'вариант',
            components: []
        };

        constructor(props) {
            super(props);

            const { items = [], elements = {}, common = {} } = props.data || {};

            this.state = {
                items,
                elements,
                common
            };
        }

        getSnapshotBeforeUpdate(prevProps, prevState) {
            return !equals(prevState, this.state);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (snapshot) {
                const { onChange } = this.props;
                onChange && onChange(this.state.items.length ? this.state : null);
            }
        }

        reorder = (startIndex, endIndex) => {
            this.setState(prev => ({
                items: reorder(prev.items, startIndex, endIndex)
            }));
        }

        add = (type, index) => {
            const id = uniqid();
            const defaultProps = pathOr({}, ['props'], find(propEq('type', type), this.getComponents()));

            this.setState(prev => ({
                items: insert(isNil(index) ? prev.items.length : index, id, prev.items),
                elements: assocPath([id], { type, ...defaultProps }, prev.elements),
                openedEditModal: id
            }));
        }

        addCopy = item => {
            const id = uniqid();

            this.setState(prev => ({
                items: insert(prev.items.length, id, prev.items),
                elements: assocPath([id], item, prev.elements)
            }));
        }

        edit = (id, prop, content) => {
            this.setState(prev => ({
                elements: assocPath([id, ...prop.split('.').map(i => identical(NaN, +i) ? i : +i)], content, prev.elements)
            }));
        }

        editAllItem = (id, props) => {
            this.setState(prev => ({
                elements: assocPath([id], {...prev.elements[id], ...props}, prev.elements)
            }));
        }

        remove = id => {
            this.setState(prev => ({
                items: without([id], prev.items),
                elements: dissoc(id, prev.elements)
            }));
        }

        copy = id => {
            this.props.onCopy(this.state.elements[id]);
        }

        setOpenedEditModal = openedEditModal => this.setState({ openedEditModal });

        getComponents = () => {
            const { placeholder, components, getComponents } = this.props;

            const items = concat(COMPONENTS_DEFAULTS(placeholder), components);

            return getComponents ? getComponents(items) : items;
        }

        editCommon = common => this.setState({ common });

        render() {
            const props = {
                items: this.state.items,
                elements: this.state.elements,
                commonSettings: this.state.common,
                reorderItems: this.reorder,
                editItem: this.edit,
                editAllItem: this.editAllItem,
                removeItem: this.remove,
                copyItem: this.props.onCopy ? this.copy : undefined,
                addItem: this.add,
                addCopy: this.addCopy,
                editCommonSettings: this.editCommon
            };

            return <EditModalContext.Provider value={{
                opened: this.state.openedEditModal,
                setOpened: this.setOpenedEditModal
            }}>
                <ComponentsContext.Provider value={this.getComponents()}>
                    <WrappedComponent {...this.props} {...props} />
                </ComponentsContext.Provider>
            </EditModalContext.Provider>;
        }
    };
