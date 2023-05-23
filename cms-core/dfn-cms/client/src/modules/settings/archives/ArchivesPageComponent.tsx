import React, { useEffect, useState } from 'react';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../../shared/utils/AuthorizationUtils';
import { getUserName } from '../../shared/utils/UserUtils';
import { getFormattedDateTimeString } from '../../shared/utils/DateTimeUtil';
import ArchiveCommonModel from './models/ArchiveCommonModel';
import Axios from 'axios';
import { DatePickerComponent } from '../../shared/ui-components/input-fields/date-picker-component';
import MultiSelect from 'react-multi-select-component';
import MasterRepository from '../../shared/repository/MasterRepository';
import ConfirmationModal from '../../shared/ui-components/modals/confirmation-modal';

export default function ArchivesPageComponent(props) {
    const [archives, setArchives] = useState<ArchiveCommonModel[]>([]);
    const database = props.website;
    const [typesSelected, setTypesSelected] = useState<any>([]);
    const [titleAdded, setTitleAdded] = useState('');
    const [toDate, setToDate] = useState<Date>(new Date());
    const [fromDate, setFromDate] = useState<Date>(
        new Date(toDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    );
    const [isInitial, setIsInitial] = useState<boolean>(true);
    const [isArchiveDeleteConfirmationModalOpen, setArchiveDeleteConfirmationModalOpen] =
        useState<boolean>(false);
    const [isArchiveCheckoutConfirmationModalOpen, setArchiveCheckoutConfirmationModalOpen] =
        useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>({});

    const typeOptions = [
        { label: 'Page 📄', value: 'Page' },
        { label: 'Template 📃', value: 'Template' },
        { label: 'Banner 📹', value: 'Banner' },
        { label: 'Tree', value: 'Tree' },
    ];

    useEffect(() => {
        setTypesSelected(typeOptions);
        getAllArchives();
    }, [database]);

    function getAllArchives() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        let archiveSearch = {
            searchQ: getSearchQuery(),
            dbName: database,
        };

        Axios.post('/api/archives/data', archiveSearch, httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setArchives(result.data);
                    setIsInitial(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getSearchQuery() {
        return {
            // passing all types by default
            ...(typesSelected.length === 0 &&
                isInitial && {
                    types: typeOptions.map(({ value }) => value),
                }),
            ...(typesSelected.length > 0 && {
                types: typesSelected.map(({ value }) => value),
            }),
            ...(titleAdded.length > 0 && { title: titleAdded }),
            ...(fromDate && { fromDate: formattedSelectedFromDate(fromDate) }),
            ...(toDate && { toDate: formattedSelectedToDate(toDate) }),
        };
    }

    function formattedSelectedFromDate(date) {
        const newDate = new Date();

        if (date && date.setHours) {
            date.setHours(0, 0, 0, 0);
            return date;
        }

        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }

    function formattedSelectedToDate(date) {
        const newDate = new Date();

        if (date && date.setHours) {
            date.setHours(23, 59, 59, 59);
            return date;
        }

        newDate.setHours(23, 59, 59, 59);
        return newDate;
    }

    const checkOut = () => {
        let item = selectedItem;

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        if(item && item.workflowState){
            let newWorkFlowState = item.workflowState;
            newWorkFlowState['state'] = 'initial';
            newWorkFlowState['modifiedBy'] = MasterRepository.getCurrentUser().docId;
            newWorkFlowState['modifiedDate'] = new Date();
            newWorkFlowState['comment'] = `${item.type} - ${
                item.pageName ? item.pageName : item.title
            } is checked out from archive.`;
    
            item['workflowState'] = newWorkFlowState;
        }
        
        Axios.post(
            '/api/archives/checkout',
            {
                dbName: database,
                archiveData: item,
            },
            httpHeaders
        )
            .then((result) => {
                setArchiveCheckoutConfirmationModalOpen(false);
                getAllArchives();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteArchive = async () => {
        let item = selectedItem;

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/archives/delete',
            {
                dbName: database,
                archiveData: item,
            },
            httpHeaders
        )
            .then((result) => {
                setArchiveDeleteConfirmationModalOpen(false);
                getAllArchives();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function getArchives() {
        let itemCount = 0;
        return (
            <>
                {archives &&
                    archives.map((item, index) => {
                        // const { deleted } = item;

                        itemCount++;
                        return (
                            <tr key={String(index)}>
                                <td>{itemCount}</td>
                                <td>{item.type || ' '}</td>
                                <td>{item.title ? item.title : item.pageName || ' '}</td>
                                <td className="d-flex align-items-center justify-content-left">
                                    <span className="badge badge-danger">Deleted</span>
                                </td>
                                <td>
                                    {item.workflowState
                                        ? getUserName(item.workflowState.createdBy)
                                        : ''}{' '}
                                </td>
                                <td>{item.deleted ? getUserName(item.deleted.deletedBy) : ''} </td>
                                <td>
                                    {item.deleted
                                        ? getFormattedDateTimeString(item.deleted.deletedDate)
                                        : ''}{' '}
                                </td>
                                {/* <td>
                                    {item.workflowState
                                        ? getFormattedDateTimeString(
                                              item.workflowState.modifiedDate
                                          )
                                        : ''}{' '}
                                </td> */}
                                <td className="text-right">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setArchiveCheckoutConfirmationModalOpen(true);
                                        }}
                                    >
                                        Checkout
                                    </button>
                                    &nbsp;
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setArchiveDeleteConfirmationModalOpen(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
            </>
        );
    }

    function getArchiveDeleteModalTitle() {
        let title: string = '';

        if (selectedItem) {
            title = `Delete ${selectedItem.type} - ${
                selectedItem.title ? selectedItem.title : selectedItem.pageName
            }`;
        }

        return title;
    }

    function getArchiveCheckoutModalTitle() {
        let title: string = '';

        if (selectedItem) {
            title = `Checkout ${selectedItem.type} - ${
                selectedItem.title ? selectedItem.title : selectedItem.pageName
            }`;
        }

        return title;
    }

    return (
        <div>
            {' '}
            <h5>Archives</h5>
            <br />
            <div className="row align-items-center">
                <div className="col-3 form-group">
                    <label className="">From:</label>
                    <DatePickerComponent
                        wrapperClassName="w-100"
                        handleValueChange={(date) => {
                            setFromDate(date);
                        }}
                        selected={fromDate}
                    />
                </div>
                <div className="col-3 form-group">
                    <label className="">To:</label>
                    <DatePickerComponent
                        wrapperClassName="w-100"
                        handleValueChange={(date) => {
                            setToDate(date);
                        }}
                        selected={toDate}
                    />
                </div>
                <div className="col-2 form-group">
                    <label className="">Type:</label>
                    <MultiSelect
                        className="multi-select"
                        options={typeOptions}
                        value={typesSelected}
                        onChange={setTypesSelected}
                        labelledBy={'Select'}
                    />
                </div>
                <div className="col-3 form-group">
                    <label className="">Title:</label>
                    <input
                        className="form-control"
                        onChange={(e) => setTitleAdded(e.target.value)}
                        value={titleAdded}
                    />
                </div>
                <div className="col-1 form-group pt-4">
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={getAllArchives}
                    >
                        Search
                    </button>
                </div>
            </div>
            <div id="audit-data" className="row">
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>type</th>
                            <th>title</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Deleted By</th>
                            <th>Deleted Date</th>
                            {/* <th>Modified Date</th> */}
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody style={{}}>{getArchives()}</tbody>
                </table>
            </div>
            {isArchiveDeleteConfirmationModalOpen && (
                <ConfirmationModal
                    modalTitle={getArchiveDeleteModalTitle()}
                    show={isArchiveDeleteConfirmationModalOpen}
                    handleClose={() => {
                        setArchiveDeleteConfirmationModalOpen(false);
                    }}
                    handleConfirme={deleteArchive}
                >
                    <p>"Are you sure you want to delete this archive?"</p>
                </ConfirmationModal>
            )}
            {isArchiveCheckoutConfirmationModalOpen && (
                <ConfirmationModal
                    modalTitle={getArchiveCheckoutModalTitle()}
                    show={isArchiveCheckoutConfirmationModalOpen}
                    handleClose={() => {
                        setArchiveCheckoutConfirmationModalOpen(false);
                    }}
                    handleConfirme={checkOut}
                >
                    <p>"Are you sure you want to checkout this archive?"</p>
                </ConfirmationModal>
            )}
        </div>
    );
}
