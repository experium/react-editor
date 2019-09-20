import React from 'react';

export default ({ contentState, entityKey, children }) => {
    const { value } = contentState.getEntity(entityKey).getData();

    return <a href={value}>{ children }</a>;
};
