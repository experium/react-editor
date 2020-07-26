import React from 'react';
import ReactDOM from 'react-dom';

import { FormBuilder } from '../src/index';

const saveState = !!window.location.search;
const state = localStorage.getItem('editor:data');

ReactDOM.render(
    <FormBuilder
        uploadUrl='/api/files'
        downloadUrl={id => `/api/files/${id}/view`}
        uploadImages={true}
        placeholder='Тестовый выбор'
        submitText='Отправить'
        data={saveState && state ? JSON.parse(state) : undefined}
        onChange={data => saveState && localStorage.setItem('editor:data', JSON.stringify(data))}
    />,
    document.getElementById('root')
);
