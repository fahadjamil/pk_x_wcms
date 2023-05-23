import Axios from 'axios';
import React, {useEffect, useState} from 'react';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { getFullDateText } from '../../../helper/date';
import styled from 'styled-components';
import {marketBackEndProxyPass} from "../../../config/path";
import {setLanguage} from "../../../helper/metaData";
import { useURLparam } from '../../../customHooks/useURLparam';

const Date = styled.div`
    padding : 10px;
`;
const Heading = styled.div`
    margin: 0.5rem;
    padding: 0.5rem;
    font-size: 1.5rem;
    font-weight: 400;
    color:#c5964a;
  `;

const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;
    grid-auto-rows: minmax(100px, auto);
  `;

const Link = styled.a`
    float: right;
    border: 3px solid #c5964a;
    border-radius: 10px;
    padding: 10px;
    background-color:#c5964a;
  `;

const Description1 = styled.div`
    grid-column: 2/8;
    grid-row: 2/3;
    line-height: 1.5;
  `;
const Description2 = styled.div`
  grid-column: 2/8;
  grid-row: 4/5;
  line-height: 1.5;
`;

const Description3 = styled.div`
  grid-column: 2/8;
  grid-row: 6;
  line-height: 1.5;
`;

const Btn = styled.div`
grid-column: 2/8;
grid-row: 1;
line-height: 1.5;
`;

const Blockquote = styled.blockquote`
 background-color: #FFF3CD;
 padding: 5px;
`;

export const ResearchReportsPage = (props) => {
    const { commonConfigs,lang } = props;
    let rowID = useURLparam();
    // let rowID = 20;

    const [actionData, setActionData] = useState([]);

    useEffect(() => {
        console.log('----ResearchReportSummary-api----');
        if(rowID){
            Axios.get(marketBackEndProxyPass(), {
                params: { RT: 3505, L: setLanguage(lang), ROWID: rowID },
            }).then((res) => setActionData(res.data.dataFields));
        }

    }, [rowID]);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="=Research Reports view page" />
    ) : (
        <div>
            <Heading>{actionData.reportTitle}</Heading>
            <Date>{ getFullDateText(actionData.postedDate) }</Date>
            <div>
                <Row>
                    <Btn>
                        <Link href={'https://research.boursakuwait.com.kw/Report/Files/' + actionData.fileName} tagret="_blank"> {lang.langKey === 'EN' ? 'Download' : 'تحميل'} </Link>
                    </Btn>
                    <Description1>
                        {actionData.reportBrief}
                    </Description1>
                    <Description2>
                        <Blockquote style={{backgroundColor: "#FFF3CD", padding: "5px"}}>
                            {lang.langKey === 'EN' ? 'Any reference in the reports to any specific recommendation or advice, whether financial or' +
                                'otherwise, does not constitute or imply any endorsement, recommendation, or favoring by' +
                                'Boursa Kuwait. The views and opinions of authors expressed (explicit or implicit) in the' +
                                'reports do not state or reflect those of Boursa Kuwait, and shall not be used or relied on' +
                                'for any investment decision purposes.'
                                :'أن أي إشاره في التقارير والدراسات المدرجة في الموقع و التي من الممكن أن تتضمن توصيه أو مشورة معينة ، سواء كانت مالية أو غير ذلك ، فإنها لا تشكل أو تنطوي علي أي تأييد أو توصيه أو محاباة من قبل بورصة الكويت. أن الآراء المذكورة (المعلنة أو الضمنية) في التقرير لا تذكر أو تعكس بأي شكل كان الرأي الخاص ببورصة الكويت ، ولا يجوز استخدامها أو الاعتماد عليها في إتخاذ أي من القرارات الاستثمارية.'
                            }

                        </Blockquote>
                    </Description2>
                    <Description3>
                    </Description3>
                </Row>
            </div>
        </div>
    );
};
