import React, { memo, Fragment } from 'react';
import styled from 'styled-components';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';

const Link = styled.span`
    cursor: pointer;
    background: transparent;
    text-decoration: none;
    margin: 0 1em 0 1em;
    padding: 0.25em 1em;
    display: flex;
    &:hover {
        color: white;
    }
`;

const HyperLink = styled.a`
    text-decoration: none;
    font-size: 1rem;
    color: #898989;
    font-weight: 500;
    width: calc(100% - 48px);
    &:hover {
        color: #c6974b;
    }
`;

const IconHolder = styled.img`
    margin-right: 0.5rem;
`;

const PdfHolder = styled.span`
    margin-right: 0.5rem;
    margin-left: 0.5rem;
`;

interface props {
    icon: string | null;
    link: string;
    text: string;
    path: string | null;
}

let BkPdf: any = IconColumnsFormattingMap['bkPdfIcon'];

const renderIcon = (data) => {
    if (data == null) {
        return <Fragment />;
    } else if (data == 'pdf') {
        return (
            <PdfHolder>
                <BkPdf width="48" height="48" />
            </PdfHolder>
        );
    } else {
        return <IconHolder src={data} alt="doc" width="40px"></IconHolder>;
    }
};

const LinkComponent = memo(({ icon, link, text, path }: props) => (
    <Link>
        {renderIcon(icon)}
        <HyperLink href={path != 'local' ? '/api/documents/boursa/' + link : link} target="_blank">
            {text || ''}
        </HyperLink>
    </Link>
));

export default LinkComponent;
