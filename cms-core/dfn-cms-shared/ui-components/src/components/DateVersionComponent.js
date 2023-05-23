import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function DateVersionComponent(params) {
    const [versionData, setVersionData] = useState();
    const { commonConfigs } = params;
    const { data, styles, settings } = params.data;
    const { collection } = settings;
    const { value } = collection;
    const selectedLanguage = params.lang;
    const { isEditMode, isPreview } = commonConfigs;
    let text = '';

    if (data && data.text) {
        text = data.text + ' ';
    }

    useEffect(() => {
        let isUnmounted = false;

        if (!isUnmounted) {
            getDataFromSource(isUnmounted);
        }

        return () => {
            isUnmounted = true;
        };
    }, []);

    function getDataFromSource(isUnmounted) {
        const jwt = localStorage.getItem('jwt-token');

        let requestUrl = '/api/customCollections/last/meta';
        let requestParams = { collection: value, nameSpace: params.dbName };

        if (isPreview) {
            requestUrl = '/api/custom-collections/last/meta';
            requestParams = { collection: value, dbName: params.dbName };
        }

        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: requestParams,
        };

        Axios.get(requestUrl, httpHeaders)
            .then((result) => {
                if (!isUnmounted && result && result.data) {
                    setVersionData(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getDocumentUpdatedDate() {
        if (versionData && versionData.modifiedDate) {
            if (typeof versionData.modifiedDate === 'string') {
                const dateObj = new Date(versionData.modifiedDate);
                return dateObj.toLocaleDateString();
            } else {
                return versionData.modifiedDate.toLocaleDateString();
            }
        } else {
            return '';
        }
    }

    return <div>{`${text}${getDocumentUpdatedDate()}`}</div>;
}

export default DateVersionComponent;
