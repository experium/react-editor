# React editor

## `<FormBuilder />`

Form editor component

### FormBuilder Props

- `components`: custom form editor [fields](#form-editor-field).
- `getComponents`: map form editor fields.
- `data`: form editor data.
- `showSimple`: form editor correct field values.
- `uploadUrl`: form editor url for file upload.
- `downloadUrl`: form editor url for file download.
- `uploadImages`: form editor upload by url images for options.
- `placeholder`: default text string for new items in radio buttons and checkboxes.
- `onChange`: `onChange` handler will be called when form data will be changed.
- `onCopy`: `onCopy` handler will be called when copy element.
- `onPreviewOpen`: `onPreviewOpen` handler will be called when preview modal will be opened.
- `onPreviewClose`: `onPreviewClose` handler will be called when preview modal will be closed.

### Form editor fields

```js
const formEditorItems = [
    {
        type: 'Editor',
        name: 'Текст',
        icon: 'font',
        renderInfo: props => props.content,
        component: Editor,
        formComponent: EditorComponent,
        props: {
            content: ''
        },
        staticContent: true,
        fields: [
            { type: 'editor', label: 'Текст', prop: 'content' }
        ]
    }
];
```

- `type`: type of item. Must be unique.
- `name`: text in toolbar.
- `icon`: icon in toolbar. Use fontawesome version 4.
- `renderInfo`: function renders data in draggable row.
- `component`: component which will be respresent in draggable row.
- `formComponent`: component which will be respresent in form.
- `props`: field props.
- `staticContent`: `true` if field isn't changable.
- `fields`: [array of fields](#edit-modal-field-types), which will be shown in field edit modal.

#### Edit modal field types

- `editor`: text editor field.
- `multiple`: field for multiple items such as radio buttons and checkboxes.
- `input`: input field.
- `switch`: switch field.

## `<FormGenerator />`

- `values`: form values.
- `data`: form editor data.
- `onSubmit`: `onSubmit` handler will be called when a user submits the form and all validation passes.
