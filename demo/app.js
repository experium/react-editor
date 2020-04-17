import React from 'react';
import ReactDOM from 'react-dom';
import { FormBuilder } from '../src/index';

ReactDOM.render(
    <FormBuilder
        uploadUrl='/api/files'
        downloadUrl={id => `/api/files/${id}/view`}
        uploadImages={true}
        placeholder='Тестовый выбор'
    />,
    document.getElementById('root')
);
