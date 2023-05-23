import React from 'react';

export const TitleParagraphComponent = (params) => {
    const { data } = params.data;
    let title,
        description: any = {};

    if (data !== undefined) {
        title = data.title;
    }

    if (data !== undefined) {
        description = {
            __html: data.description
        }
    }

    return (
        <div>
            <h4>{title}</h4>
            <div dangerouslySetInnerHTML={description}></div>
        </div>
    );
};
