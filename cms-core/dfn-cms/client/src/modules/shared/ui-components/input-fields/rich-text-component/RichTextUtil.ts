export function getRichTextComponentConfiguration(dbName: string, languageKey: string) {
    const config = {
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            ],
        },
        simpleUpload: {
            uploadUrl: '/api/ck-editor/image/upload',
            headers: {
                dbName: dbName,
            },
        },
        language: {
            content: languageKey ? languageKey : 'en',
        },
        placeholder: 'Enter your content here...',
        link: {
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file',
                    },
                },
                openInNewTab: {
                    mode: 'manual',
                    label: 'Open in a new tab',
                    defaultValue: true, // This option will be selected by default.
                    attributes: {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                    },
                },
            },
        },
        image: {
            styles: [
                'alignLeft', 'alignCenter', 'alignRight'
            ],

            resizeOptions: [
                {
                    name: 'imageResize:original',
                    label: 'Original',
                    value: null
                },
                {
                    name: 'imageResize:50',
                    label: '50%',
                    value: '50'
                },
                {
                    name: 'imageResize:75',
                    label: '75%',
                    value: '75'
                }
            ],

            toolbar: [
                'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                // '|',
                // 'imageResize',
                '|',
                'imageTextAlternative'
            ]
        }
    };

    return config;
}
