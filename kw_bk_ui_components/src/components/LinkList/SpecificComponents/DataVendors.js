import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { LinkListComponent } from '../LinkListComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const DataVendors = (props) => {
    const { commonConfigs } = props;
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        const httpHeader = {
            params : {
                key: 'data_vendors'
            }
        }
        Axios.get('/api/getSampleResponse', httpHeader).then((res) => {
            setLinkList(res.data)
        })
    }, [])

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Data Vendors" />
            ) : (
                <LinkListComponent
                    horizontalLine={true}
                    bullets={true}
                    icon="pdf"
                    path={'local'}
                    listData={linkList}
                />
            )}
        </Fragment>
    );
};
