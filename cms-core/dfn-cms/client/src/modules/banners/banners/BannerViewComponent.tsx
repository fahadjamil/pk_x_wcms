import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import LanguageModel from '../../shared/models/LanguageModel';
import BannerContentModel from '../models/BannerContentModel';
import BannerDataModel from '../models/BannerDataModel';
import AddBannerDetailsPopupComponent from './AddBannerDetailsPopupComponent';
import PESectionEdit from '../../shared/resources/PageEditor-Section-Edit';
import PESectionSettings from '../../shared/resources/PageEditor-Section-Settings';
import PESectionDelete from '../../shared/resources/PageEditor-Section-Delete';
import ConfirmationModal from '../../shared/ui-components/modals/confirmation-modal';
import WorkflowComponent from '../../workflows/WorkflowComponent';
import BannerHistoryComponent from './BannerHistoryComponent';
import WorkflowStateModel from '../../shared/models/workflow-models/WorkflowStateModel';
import { getInitialWorkflowState, getUpdatedWorkflowState } from '../../shared/utils/WorkflowUtils';
import { WorkflowsStatus } from '../../shared/config/WorkflowsStatus';
import MasterRepository from '../../shared/repository/MasterRepository';
import { ParagraphComponent } from 'ui-components';

interface BannerViewComponentModel {
    bannerData: BannerDataModel;
    dbName: string;
    supportLanguages: LanguageModel[];
    workflowStateId: any;
    onDeleteBanner: any;
}

interface SelectedBannerDataModel {
    dataIndex: number;
    data: {
        [key: string]: BannerContentModel;
    };
}

function BannerViewComponent(props: BannerViewComponentModel) {
    const [currentBanner, setCurrentBanner] = useState<BannerDataModel>(props.bannerData);
    const [isAddDetailPopupOpen, setIsAddDetailPopupOpen] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageModel>(
        props.supportLanguages[0]
    );
    const [selectedBannerData, setSelectedBannerData] = useState<SelectedBannerDataModel>();
    const [isImageDeleteConfirmPopupOpen, setIsImageDeleteConfirmPopupOpen] = useState<boolean>(
        false
    );
    const [deleteImageIndex, setDeleteImageIndex] = useState(-1);
    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);
    const [
        selectedBannerWorkflowState,
        setSelectedBannerWorkflowState,
    ] = useState<WorkflowStateModel>();
    const [isEmptyWorkflow, setIsEmptyWorkflow] = useState<boolean>(false);
    let bannerId = props.bannerData.id ? props.bannerData.id : '';
    const [
        isBannerDeleteConfirmationModalOpen,
        setBannerDeleteConfirmationModalOpen,
    ] = useState<boolean>(false);
    const [deletedBannerId, setDeletedBannerId] = useState<string>('');

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getSelectedBannerWorkflowState(props?.workflowStateId);
        }

        return () => {
            isMounted = false;
        };
    }, [bannerId]);

    function getUpdatedBanner() {
        const jwt = localStorage.getItem('jwt-token');

        const headerParameter = { id: props.bannerData.id };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/banners/banner', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    const { _id, ...bannerData } = result.data;

                    let bannerModel: BannerDataModel = {
                        id: _id,
                        ...bannerData,
                    };

                    setCurrentBanner(bannerModel);
                    getSelectedBannerWorkflowState(result.data.workflowStateId);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function updateBanner(banner: BannerDataModel) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        if (selectedBannerWorkflowState && selectedBannerWorkflowState.id) {
            const resetWorkflow = getUpdatedWorkflowState(
                WorkflowsStatus.initial,
                selectedBannerWorkflowState,
                'Banner edit & save as darft',
                'banners'
            );
            onWorkflowSubmited(resetWorkflow);
        }

        banner.workflowState = getInitialWorkflowState('banners', props.bannerData.title, 'Banner');

        Axios.post(
            '/api/banners/update',
            {
                id: props.bannerData.id,
                bannerData: banner,
                dbName: props.dbName,
            },
            httpHeaders
        )
            .then((response) => {
                getUpdatedBanner();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleDropDownOnchange(event) {
        if (props.supportLanguages && event && event.target && event.target.value) {
            const selectdLanguageItem = props.supportLanguages.find(
                (langItem) => langItem.langKey === event.target.value
            );

            if (selectdLanguageItem) {
                setSelectedLanguage(selectdLanguageItem);
            }
        }
    }

    function closeAddDetailPopupComponent() {
        setSelectedBannerData((prev) => undefined);
        setIsAddDetailPopupOpen(false);
    }

    function onSubmitBannerData(data, initialDataIndex) {
        setIsAddDetailPopupOpen(false);

        if (data) {
            Object.keys(data).forEach((langKey) => {
                const bannerContent: BannerContentModel = {
                    title: data[langKey].title,
                    imagePath: data[langKey].imagePath,
                    boundUrl: data[langKey].boundUrl,
                    thumbnail: data[langKey].thumbnail,
                    bannerText: data[langKey].bannerText,
                };

                if (currentBanner.bannerData[langKey] === undefined) {
                    currentBanner.bannerData[langKey] = [];
                }

                if (initialDataIndex === -1) {
                    currentBanner.bannerData[langKey].push(bannerContent);
                } else if (
                    initialDataIndex > -1 &&
                    initialDataIndex < currentBanner.bannerData[langKey].length
                ) {
                    currentBanner.bannerData[langKey][initialDataIndex] = bannerContent;
                }
            });

            // submitting the banner on save click
            // updateBanner(currentBanner);
        }
    }

    function onDeleteBanner(ImageIndex) {
        if (ImageIndex > -1) {
            //Remove images from all languages
            props.supportLanguages.forEach((langItem) => {
                currentBanner.bannerData[langItem.langKey].splice(ImageIndex, 1);
            });

            // submitting the banner on save click
            // updateBanner(currentBanner);
        }
    }

    function onImageSelected(banerDataIndex: number) {
        if (banerDataIndex > -1) {
            if (banerDataIndex > -1) {
                if (props.supportLanguages && currentBanner && currentBanner.bannerData) {
                    let initialData: SelectedBannerDataModel = { dataIndex: -1, data: {} };

                    props.supportLanguages.forEach((langItem) => {
                        if (currentBanner.bannerData[langItem.langKey].length > banerDataIndex) {
                            initialData.data[langItem.langKey] =
                                currentBanner.bannerData[langItem.langKey][banerDataIndex];
                        }
                        initialData.dataIndex = banerDataIndex;
                    });

                    setSelectedBannerData((prevdata) => initialData);
                    setIsAddDetailPopupOpen(true);
                }
            }
        }
    }

    function showBannerImages() {
        if (
            currentBanner &&
            currentBanner.bannerData[selectedLanguage.langKey] &&
            currentBanner.bannerData[selectedLanguage.langKey].length !== 0
        ) {
            return currentBanner.bannerData[selectedLanguage.langKey].map((banner, index) => {
                //const paragraphComponentData = { data: { styles: undefined, data: { paragraph: banner.bannerText } } };
                let cleanText = '';
                if(banner.bannerText && banner.bannerText != ''){
                    //cleanText = banner.bannerText.replace(/(<([^>]+)>)/gi, " ");
                    //cleanText = banner.bannerText.replace(/((<)\w+(>))/gi, "<p>");
                    //cleanText = cleanText.replace(/((<\/)\w+(>))/gi, "</p>");

                    cleanText = banner.bannerText.replace(/<[a-z](?:[^>"']|"[^"]*"|'[^']*')*>/gi, "<p>");
                    cleanText = cleanText.replace(/<\/[a-z](?:[^>"']|"[^"]*"|'[^']*')*>/gi, "</p>");
                }

                const paragraphComponentData = { data: { styles: undefined, data: { paragraph: cleanText } } };

                return (
                    <tr key={`bannerImage-${index}`} className="row mb-3">
                        <td className="col-3">
                            <img
                                className="img-fluid"
                                src={banner.imagePath}
                                alt="BannerImage"
                                style={{ width: 'auto', height: '10rem' }}
                            />
                        </td>
                        <td className="col-2">
                            <span>{banner.title}</span>
                        </td>
                        <td className="col-6">
                          <ParagraphComponent {...paragraphComponentData}/>
                        </td>
                        <td className="col-1 text-right">
                            <PESectionEdit
                                className="mr-2"
                                width="20px"
                                height="20px"
                                onClick={() => onImageSelected(index)}
                            />
                            <PESectionDelete
                                width="20px"
                                height="20px"
                                disabled={isEnable('/api/banners/update')}
                                onClick={() => {
                                    setDeleteImageIndex(index);
                                    setIsImageDeleteConfirmPopupOpen(true);
                                }}
                            />
                        </td>
                    </tr>
                );
            });
        } else {
            return <></>;
        }
    }

    function getSelectedBannerWorkflowState(bannerWorkflowDocId) {
        if (bannerWorkflowDocId) {
            const headerParameter = { id: bannerWorkflowDocId };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            setIsEmptyWorkflow(false);

            Axios.get('/api/workflow/state', httpHeaders)
                .then((result) => {
                    if (result && result.data) {
                        const { _id, ...workFlowStateData } = result.data;
                        const workflowState: WorkflowStateModel = { id: _id, ...workFlowStateData };
                        setSelectedBannerWorkflowState(workflowState);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setIsEmptyWorkflow(true);
            setSelectedBannerWorkflowState(undefined);
        }
    }

    function onWorkflowSubmited(updatedWorkflowState: WorkflowStateModel) {
        setSelectedBannerWorkflowState(updatedWorkflowState);
        updateBannerWorkflow(updatedWorkflowState);
    }

    function updateBannerWorkflow(updatedWorkflowState) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/workflow/banners/update',
            {
                pageId: bannerId,
                dbName: props.dbName,
                pageWorkflow: updatedWorkflowState,
            },
            httpHeaders
        )
            .then((res) => {})
            .catch((err) => {
                console.log('error', err);
            });
    }

    function bannerCheckedOut() {
        getUpdatedBanner();
    }

    function getBannerDeleteModalTitle() {
        let title: string = '';

        if (deletedBannerId && deletedBannerId !== '') {
            if (deletedBannerId === currentBanner?.id) {
                title = `Delete Banner - ${currentBanner?.title}`;
            }
        }

        return title;
    }

    function deleteCurrentBanner(bannerId: string) {
        setBannerDeleteConfirmationModalOpen(true);
        setDeletedBannerId(bannerId);
    }

    async function handleBannerDeteleConfimation() {
        try {
            if (currentBanner && deletedBannerId === currentBanner.id) {
                const headerParameter = {
                    bannerId: deletedBannerId,
                    workflowId: currentBanner?.workflowStateId,
                    deletedBy: MasterRepository.getCurrentUser().docId,
                };

                const payload = getAuthorizationHeaderForDelete(headerParameter);

                const result = await Axios.delete('/api/banners/delete', payload);
            }
            props.onDeleteBanner();
        } catch (error) {
            // setIsLoaded(false);
            // setError(error);
            console.log(error);
        }
    }

    return (
        <>
            <div className="page__content__container pt-0">
                <div className="page__toolbar__container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="input-group mb-3">
                                {!isShowHistory && (
                                    <>
                                        <select
                                            className="custom-select"
                                            onChange={handleDropDownOnchange}
                                        >
                                            {props.supportLanguages.map((languageItem, index) => {
                                                return (
                                                    <option
                                                        key={languageItem.langKey}
                                                        value={languageItem.langKey}
                                                    >
                                                        {languageItem.language}
                                                    </option>
                                                );
                                            })}
                                        </select>

                                        <div className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setSelectedBannerData((prev) => undefined);
                                                    setIsAddDetailPopupOpen(true);
                                                }}
                                            >
                                                Add Image
                                            </button>
                                        </div>
                                    </>
                                )}
                                <div className="nav btn-toolbar" id="banner-nav-tab" role="tablist">
                                    {isShowHistory && (
                                        <a
                                            className={`btn btn-primary nav-item nav-link ${
                                                isShowHistory ? '' : ''
                                            }`}
                                            id="banner-nav-view-tab"
                                            data-toggle="tab"
                                            href="#banner-nav-view"
                                            role="tab"
                                            aria-controls="banner-nav-view"
                                            aria-selected="true"
                                            onClick={() => {
                                                setIsShowHistory(false);
                                            }}
                                        >
                                            Banner View
                                        </a>
                                    )}
                                    <a
                                        className={`btn btn-primary nav-item nav-link ${
                                            isShowHistory ? 'active' : ''
                                        }`}
                                        id="banner-nav-history-tab"
                                        data-toggle="tab"
                                        href="#banner-nav-history"
                                        role="tab"
                                        aria-controls="banner-nav-history"
                                        aria-selected="false"
                                        onClick={() => {
                                            setIsShowHistory(true);
                                        }}
                                    >
                                        History
                                    </a>
                                </div>
                            </div>
                        </div>

                        {isEmptyWorkflow && (
                            <div className="col-md-4">
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                    <div className="btn-toolbar ml-1 mr-2">
                                        <button
                                            type="button"
                                            className="btn btn-tertiary mr-2"
                                            data-toggle="modal"
                                            data-target="#PopupWorkflowModal"
                                        >
                                            Workflow
                                            <span className="ml-1 mr-2">
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: '#28a745',
                                                        color: '#ffffff',
                                                    }}
                                                >
                                                    Approved
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isEmptyWorkflow && (
                            <div className="col-md-4">
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                    <WorkflowComponent
                                        selectedWorkflowState={selectedBannerWorkflowState}
                                        onSubmitWorkflow={onWorkflowSubmited}
                                        dbName={props.dbName}
                                        currentPageId={bannerId}
                                        isShowCurrentFlow
                                        collectionName="banners"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="col-3 text-right">
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={() => {
                                    updateBanner(currentBanner);
                                }}
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary "
                                onClick={() => {
                                    deleteCurrentBanner(bannerId);
                                }}
                            >
                                Delete Banner
                            </button>
                        </div>

                        <AddBannerDetailsPopupComponent
                            showPopup={isAddDetailPopupOpen}
                            onClosePopup={closeAddDetailPopupComponent}
                            supportLanguages={props.supportLanguages}
                            onSubmitData={onSubmitBannerData}
                            initialBannerData={selectedBannerData}
                            dbName={props.dbName}
                        />
                        <ConfirmationModal
                            modalTitle="Delete Banner Image"
                            show={isImageDeleteConfirmPopupOpen}
                            handleClose={() => {
                                setDeleteImageIndex(-1);
                                setIsImageDeleteConfirmPopupOpen(false);
                            }}
                            handleConfirme={() => {
                                onDeleteBanner(deleteImageIndex);
                                setDeleteImageIndex(-1);
                                setIsImageDeleteConfirmPopupOpen(false);
                            }}
                        >
                            <p>Are you sure you want to delete banner image?</p>
                        </ConfirmationModal>

                        {isBannerDeleteConfirmationModalOpen && (
                            <ConfirmationModal
                                modalTitle={getBannerDeleteModalTitle()}
                                show={isBannerDeleteConfirmationModalOpen}
                                handleClose={() => {
                                    setBannerDeleteConfirmationModalOpen(false);
                                }}
                                handleConfirme={handleBannerDeteleConfimation}
                            >
                                <p>"Are you sure you want to delete this banner?"</p>
                            </ConfirmationModal>
                        )}
                    </div>

                    <>
                        <div className="tab-content" id="banner-nav-tabContent">
                            <div
                                className="tab-pane fade active show"
                                id="banner-nav-view"
                                role="tabpanel"
                                aria-labelledby="banner-nav-view-tab"
                            >
                                <table className="table-borderless table-hover tbl-thm-01 table col-12">
                                    <thead>
                                        <tr className="row">
                                            <th className="col-3"> Image </th>
                                            <th className="col-2"> Title </th>
                                            <th className="col-6"> Text Content </th>
                                            <th className="col-1 text-right"> Actions </th>
                                        </tr>
                                    </thead>
                                    <tbody>{showBannerImages()}</tbody>
                                </table>
                            </div>

                            <div
                                className="tab-pane fade"
                                id="banner-nav-history"
                                role="tabpanel"
                                aria-labelledby="banner-nav-history-tab"
                            >
                                <div className="mt-4">
                                    <BannerHistoryComponent
                                        database_name={props.dbName}
                                        bannerId={props.bannerData.id}
                                        workflowStatus={props.bannerData.id}
                                        checkOutHandlder={bannerCheckedOut}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </>
    );
}

export default BannerViewComponent;
