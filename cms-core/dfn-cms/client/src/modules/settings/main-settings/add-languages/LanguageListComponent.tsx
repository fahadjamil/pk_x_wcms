import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectWebsite } from '../../../redux/action';
import { LanguageDirections } from '../../../shared/config/LanguageDirections';
import LanguageModel from '../../../shared/models/LanguageModel';
import AddLanguagesPopupComponent from './AddLanguagesPopupComponent';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import PESectionSettings from '../../../shared/resources/PageEditor-Section-Settings';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete'
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';

interface LanguageListComponentModel {
    websiteObj: any;
}

function LanguageListComponent(props: LanguageListComponentModel) {
    const [websiteLanguageList, setWebsiteLanguageList] = useState<LanguageModel[]>();
    const [isAddLanguagePopupOpen, setIsAddLanguagePopupOpen] = useState<boolean>(false);
    const [isDeleteConfirmationPopupOpen, setIsDeleteConfirmationPopupOpen]= useState<boolean>(false);
    const [deleteLanguageIndex, setDeleteLanguageIndex] = useState(-1);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.websiteObj._id) {
            getwebSite();
        }
    }, [props.websiteObj]);

    function getwebSite() {
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
        };

        Axios.get(`/api/websites/${props.websiteObj._id}`, httpHeaders)
            .then((result) => {
                if (result && result.data && result.data.languages) {
                    setWebsiteLanguageList(result.data.languages);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function saveWebsiteLanguages() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/websites/languages/update',
            { id: props.websiteObj._id, languages: websiteLanguageList },
            httpHeaders
        )
            .then((result) => {
                if(result && result.status === 200){
                    const { languages, ...websiteObj } = props.websiteObj;
                    const updatedWebsite = { ...websiteObj, languages: websiteLanguageList };

                    dispatch(selectWebsite(updatedWebsite));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function closeAddLanguagePopupComponent() {
        setIsAddLanguagePopupOpen(false);
    }

    function onSubmitLanguageData(data) {
        let direction = LanguageDirections.ltr;

        if (data.isLeftToRight) {
            direction = LanguageDirections.ltr;
        } else {
            direction = LanguageDirections.rtl;
        }

        const lang: LanguageModel = {
            language: data.language,
            langKey: getLanguageKey(data.language),
            direction: direction,
        };
        websiteLanguageList?.push(lang);
        setWebsiteLanguageList(websiteLanguageList);
        setIsAddLanguagePopupOpen(false);
    }

    function getLanguageKey(language: string) {
        if (language && language.length >= 2) {
            const languageKey = language.substring(0, 2).toLowerCase();
            return languageKey;
        } else {
            return 'gl';
        }
    }

    function deleteLanguageItem(index: number) {
        //Do not remove last language item
        if (websiteLanguageList && websiteLanguageList.length === 1) {
            return;
        }

        if (index > -1 && websiteLanguageList && websiteLanguageList.length > index) {
            websiteLanguageList.splice(index, 1);
            setWebsiteLanguageList([...websiteLanguageList]);
        }
    }

    function isSelectedLeftToRight(direction: string) {
        return direction === LanguageDirections.ltr;
    }

    function onChangeDirection(index: number) {
        if (index > -1 && websiteLanguageList && websiteLanguageList.length > index) {
            if (isSelectedLeftToRight(websiteLanguageList[index].direction)) {
                websiteLanguageList[index].direction = LanguageDirections.rtl;
            } else {
                websiteLanguageList[index].direction = LanguageDirections.ltr;
            }

            setWebsiteLanguageList([...websiteLanguageList]);
        }
    }

    function getDeleteConfirmationText(deleteIndex: number){
        let deleteLanguage = '';
        if(deleteIndex > -1 && websiteLanguageList && websiteLanguageList.length> deleteIndex){
            deleteLanguage = websiteLanguageList[deleteIndex].language;
        }

        return `Are you sure you want to delete ${deleteLanguage} language?`;
    }

    return (
        <div className="">  
            <div className="row">
            <div className="col-12">
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <thead>
                        <tr>
                            <th>Language</th>
                            <th className="text-right">left to right</th>
                            <th className="text-right">
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm mr-3"
                                onClick={() => {
                                    setIsAddLanguagePopupOpen(true);
                                }}
                            >
                                Add New Language
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    saveWebsiteLanguages();
                                }}
                            >
                                Save
                            </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {websiteLanguageList &&
                        websiteLanguageList.map((languageModel, index) => {
                            return (
                                <tr
                                    key={`LanguageList${languageModel.language}`}
                                    className=""
                                >
                                        <td>{languageModel.language}</td>
                                        <td  className="text-right">
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id={languageModel.langKey}
                                                    checked={isSelectedLeftToRight(
                                                        languageModel.direction
                                                    )}
                                                    onChange={() => {
                                                        onChangeDirection(index);
                                                    }}
                                                ></input>
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor={languageModel.langKey}
                                                ></label>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <span
                                                onClick={() => {
                                                    setDeleteLanguageIndex(index);
                                                    setIsDeleteConfirmationPopupOpen(true);
                                                }}
                                            
                                            >
                                                <PESectionDelete width="20px" height="20px" />
                                            </span>
                                            
                                        </td>
                                </tr>
                            );
                        })}
                    </tbody>   
                </table>
                <ConfirmationModal
                    modalTitle="Delete Language"
                    show={isDeleteConfirmationPopupOpen}
                    handleClose={() => {
                        setDeleteLanguageIndex(-1);
                        setIsDeleteConfirmationPopupOpen(false);
                    }}
                    handleConfirme={() => {
                        deleteLanguageItem(deleteLanguageIndex);
                        setDeleteLanguageIndex(-1);
                        setIsDeleteConfirmationPopupOpen(false);
                    }}
                >
                    <p>{getDeleteConfirmationText(deleteLanguageIndex)}</p>
                </ConfirmationModal>
                </div>
            </div>
       
            <AddLanguagesPopupComponent
                showPopup={isAddLanguagePopupOpen}
                onClosePopup={closeAddLanguagePopupComponent}
                onSubmitData={onSubmitLanguageData}
                websiteLanguageList={websiteLanguageList}
            />
            
        </div>
    );
}

export default LanguageListComponent;
