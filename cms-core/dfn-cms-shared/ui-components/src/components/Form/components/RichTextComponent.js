import React from 'react';
// import Loadable from 'react-loadable';
import Loadable from '@loadable/component';

// function Loading() {
//     return <div>Loading...</div>;
// }

// const LoadableRichText = Loadable({
//     //import your loader with the full name of the js file
//     loader: () => import('./RichTextLoadableComponent.js'),
//     loading: Loading,
// });

const LoadableEditor = Loadable(() => import('./RichTextLoadableComponent.js'));

function RichTextComponent(props) {
    return (
        <React.Fragment>
            <LoadableEditor {...props} />
        </React.Fragment>
    );
}

export default RichTextComponent;
