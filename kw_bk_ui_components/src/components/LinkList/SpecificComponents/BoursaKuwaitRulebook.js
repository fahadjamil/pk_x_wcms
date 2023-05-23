import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { LinkListComponent } from '../LinkListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const BoursaKuwaitRulebook = (props) => {
    const { commonConfigs } = props;
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        const httpHeader = {
            params : {
                key: 'rule_book'
            }
        }
        Axios.get('/api/getSampleResponse', httpHeader).then((res) => {
            setLinkList(res.data)
        })
    }, [])

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Boursa Kuwait Rule Book" />
            ) : (
                <LinkListComponent
                    horizontalLine={true}
                    bullets={false}
                    icon="pdf"
                    path={'local'}
                    listData={linkList}
                />
            )}
        </Fragment>
    );
};
