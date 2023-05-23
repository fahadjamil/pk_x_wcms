import React, { Fragment } from 'react';
import styled from 'styled-components';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';

const Table = styled.table`
    width: 500px;
    table-layout: fixed;
`;

const THead = styled.thead``;

const TBody = styled.tbody``;
const TFoot = styled.tfoot``;

const Tr = styled.tr`
    border-bottom: 1px solid black;
`;

const BodyTr = styled.tr`
    border-bottom: 1px solid black;
`;

const BodyTd = styled.td`
    padding: 20px;
`;

const Th = styled.th`
    padding: 20px;
`;

const Td = styled.td`
    padding: 15px;
    border: 1px solid black;
`;

const DateSpan = styled.div`
    font-size: 12px;
`;

const Icon = styled.div`
    padding-left: 15px;
`;

const EmptyIcon = styled.div`
    padding-left: 20px;
`;

export const MarketReportComponent = ({ reports, language }) => {
    const renderRows = (list) => {
        return (
            <TBody>
                {list.map((item, key) => {
                    let DecriptionIcon: any = IconColumnsFormattingMap['financialDescriptionIcon'];
                    let BkPdf: any = IconColumnsFormattingMap['bkPdfIcon'];
                    return (
                        <BodyTr key={key}>
                            <BodyTd>{item.market}</BodyTd>
                            <BodyTd>
                                {item.pm.type ? (
                                    <a
                                        href={`/${language}/market/reports#${item.pm.type}-${item.pm.market}`}
                                        target="_blank"
                                    >
                                        <Icon>
                                            <BkPdf
                                                width="35"
                                                height="35"
                                                color="#000000"
                                            />
                                        </Icon>
                                    </a>
                                ) : (
                                    <EmptyIcon> - </EmptyIcon>
                                )}

                                <DateSpan>{item.pm.date}</DateSpan>
                            </BodyTd>
                            <BodyTd>
                                {item.pm.type ? (
                                    <a
                                        href={`/${language}/market/reports#${item.mm.type}-${item.mm.market}`}
                                        target="_blank"
                                    >
                                        <Icon>
                                            <BkPdf
                                                width="35"
                                                height="35"
                                                color="#000000"
                                            />
                                        </Icon>
                                    </a>
                                ) : (
                                    <EmptyIcon> - </EmptyIcon>
                                )}

                                <DateSpan>{item.mm.date}</DateSpan>
                            </BodyTd>
                            <BodyTd>
                                {item.as.type ? (
                                    <a
                                        href={`/${language}/market/reports#${item.as.type}-${item.as.market}`}
                                        target="_blank"
                                    >
                                        <Icon>
                                            <BkPdf
                                                width="35"
                                                height="35"
                                                color="#000000"
                                            />
                                        </Icon>
                                    </a>
                                ) : (
                                    <EmptyIcon> - </EmptyIcon>
                                )}

                                <DateSpan>{item.as.date}</DateSpan>
                            </BodyTd>
                        </BodyTr>
                    );
                })}
            </TBody>
        );
    };

    return (
        <Table>
            <THead>
                <Tr>
                    <Th>{language == 'en' || language == 'EN' ? 'Report Name' : 'اسم التقرير'}</Th>
                    <Th>{language == 'en' || language == 'EN' ? 'Premier Market' : 'السوق الأول'}</Th>
                    <Th>{language == 'en' || language == 'EN' ? 'Main Market' : 'السوق الرئيسي'}</Th>
                    <Th>{language == 'en' || language == 'EN' ? 'All Shares' : 'مؤشر السوق العام'}</Th>
                </Tr>
            </THead>
            <Fragment>{renderRows(reports)}</Fragment>
        </Table>
    );
};
