import React from 'react';
import PropTypes from 'prop-types';
const fs = require('fs');
const parse = require('html-react-parser');

export default function HTML(props) {
    let headerLinksCmpList = [];
    let bodyLinksCmpList = [];

    const staticResourcesLinks = fs.readFileSync('static-resources.txt', 'utf8');

    if (staticResourcesLinks && staticResourcesLinks.length > 0) {
        const staticResourcesLinksObj = JSON.parse(staticResourcesLinks);
        const { headerLinks, bodyLinks } = staticResourcesLinksObj;

        if (headerLinks) {
            const { links } = headerLinks;
            headerLinksCmpList = parse(links);
        }

        if (bodyLinks) {
            const { links } = bodyLinks;
            bodyLinksCmpList = parse(links);
        }
    }

    return (
        <html {...props.htmlAttributes}>
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {props.headComponents}
                {headerLinksCmpList}
            </head>
            <body {...props.bodyAttributes}>
                {props.preBodyComponents}
                <div key={`body`} id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
                {props.postBodyComponents}
                {bodyLinksCmpList}
                <div id="ua-cms-root"></div>
            </body>
        </html>
    );
}

HTML.propTypes = {
    htmlAttributes: PropTypes.object,
    headComponents: PropTypes.array,
    bodyAttributes: PropTypes.object,
    preBodyComponents: PropTypes.array,
    body: PropTypes.string,
    postBodyComponents: PropTypes.array,
};
