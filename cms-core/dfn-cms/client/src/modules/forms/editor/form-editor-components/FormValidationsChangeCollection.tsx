import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import masterRepository from '../../../shared/repository/MasterRepository';
import InformationModal from '../../../shared/ui-components/modals/information-modal';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';

function FormValidationsChangeCollection(props) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedvalue, setselectedvalue] = useState(props.value);
    const [dropDownContentsList, setDropDownContentsList] = useState<any>([]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getCustomCollectionTypes();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && props.value && props.value != '') {
            setselectedvalue(props.value);
        }

        return () => {
            isMounted = false;
        };
    }, [props.value]);

    function getCustomCollectionTypes() {
        const headerParameter = {
            collection: 'custome-types',
            searchQuery: 'Posts',
            user: masterRepository.getCurrentUser().userName,
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                const { data, status } = response;

                if (status === 200) {
                    if (data && Array.isArray(data) && data.length > 0) {
                        const optionsData = data.map((item) => {
                            const { collectionType, menuName, customeCollectionName } = item;

                            if (collectionType === 'Posts') {
                                return {
                                    key: customeCollectionName,
                                    value: menuName,
                                };
                            }
                        });

                        setDropDownContentsList((dropDownContentsList) => [
                            ...dropDownContentsList,
                            ...optionsData,
                        ]);
                    }
                }
            })
            .then(() => {
                const headerParameter = {
                    collection: 'custome-types',
                    searchQuery: 'Documents',
                    user: masterRepository.getCurrentUser().userName,
                };
                const httpHeaders = getAuthorizationHeader(headerParameter);

                Axios.get('/api/custom-collections/types', httpHeaders)
                    .then((response) => {
                        const { data, status } = response;

                        if (status === 200) {
                            if (data && Array.isArray(data) && data.length > 0) {
                                const optionsData = data.map((item) => {
                                    const { collectionType, menuName, customeCollectionName } =
                                        item;

                                    if (collectionType === 'Documents') {
                                        return {
                                            key: customeCollectionName,
                                            value: menuName,
                                        };
                                    }
                                });

                                setDropDownContentsList((dropDownContentsList) => [
                                    ...dropDownContentsList,
                                    ...optionsData,
                                ]);
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleConfirme() {
        const validations = {
            ...props.validations,
            [props.columnId]: {
                ...props.validations[props.columnId],
                [props.validation]: selectedvalue,
            },
        };

        props.setValidations(validations);
        setIsModalOpen(false);
    }

    return (
        <>
            <button className="btn btn-sm btn-secondary" onClick={() => setIsModalOpen(true)}>
                Change Custom Collection
            </button>
            {isModalOpen && (
                <InformationModal
                    modalTitle="Change Custom Collection"
                    show={isModalOpen}
                    size="md"
                    submitBtnText="Save"
                    centered={true}
                    handleClose={() => setIsModalOpen(false)}
                    handleConfirme={handleConfirme}
                >
                    <div className="form-row">
                        <select
                            className="form-control"
                            value={selectedvalue || ''}
                            onChange={(event) => setselectedvalue(event.target.value)}
                        >
                            <option value="" disabled>
                                -- select an option --
                            </option>
                            {dropDownContentsList &&
                                dropDownContentsList.length !== 0 &&
                                dropDownContentsList.map((dropDownItem, index) => {
                                    const { key, value } = dropDownItem;

                                    return (
                                        <option
                                            key={`forms-validations-custom-collections-drop-down-${index}-${key}`}
                                            value={key || ''}
                                        >
                                            {value || ''}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                </InformationModal>
            )}
        </>
    );
}

export default FormValidationsChangeCollection;
