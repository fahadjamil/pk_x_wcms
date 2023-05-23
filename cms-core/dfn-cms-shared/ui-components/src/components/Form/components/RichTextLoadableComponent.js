import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function RichTextLoadableComponent({ id, label, value, uiProperties, handleRichTextValueChanges }) {
    const defaultConfig = {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            ],
        },
        placeholder: 'Enter your content here...',
    };

    function handleValueChanges(event, editor) {
        handleRichTextValueChanges(editor, id);
    }

    if (id && label) {
        return (
            <React.Fragment>
                <label htmlFor={id} className={uiProperties.label.classes || ''}>
                    {label}
                </label>
                <CKEditor
                    className={uiProperties.field.classes || ''}
                    editor={ClassicEditor}
                    data={value || ''}
                    config={defaultConfig}
                    disabled={false}
                    placeholder={label}
                    onInit={undefined}
                    onBlur={undefined}
                    onFocus={undefined}
                    onError={undefined}
                    onChange={handleValueChanges}
                />
            </React.Fragment>
        );
    }

    return <React.Fragment></React.Fragment>;
}

export default RichTextLoadableComponent;
