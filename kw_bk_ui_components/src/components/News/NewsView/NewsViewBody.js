import React from 'react';
import styled from 'styled-components';

const NewsText = styled.p`
    white-space: pre;
    white-space: pre-wrap;
    white-space: pre-line;
`;
const NewsViewBody = (params) => {
    const { pdf, text } = params;

    const trimmedPdf = pdf && pdf.trim(); //handling strings with spaces from MBE
    const pdfFullUrl = `https://cis.boursakuwait.com.kw/Portal/NewsPDF/${trimmedPdf}`;
    return (
        <div>
            <NewsText>{text}</NewsText>
            {trimmedPdf ? (
                <object data={pdfFullUrl} type="application/pdf" width="100%" height="1000px">
                    <iframe src={pdfFullUrl} width="100%" height="1000px"></iframe>
                </object>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </div>
    );
};

export default NewsViewBody;
