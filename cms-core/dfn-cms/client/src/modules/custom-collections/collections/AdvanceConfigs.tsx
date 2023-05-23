import Table from '@material-ui/core/Table/Table';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

interface IdropDownList {
    item: string;
    itemList: string[];
    onItemValueChange: any;
    onItemAddClick: any;
    setItemList: any;
}

const AdvanceConfigs = (props) => {
    const [fieldListOj, setfieldListOj] = useState({});
    const [minVal, setMinVal] = useState('0');
    const [maxVal, setMaxVal] = useState('50');
    const [ext, setExt] = useState('.pdf,.docx,.doc');
    const [item, setItem] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('');
    const [itemList, setItemList] = useState<Array<string>>([]);
    let collectionsList = [...props.collectionTypesDocs, ...props.collectionTypesPost];
    let fieldType = props.fieldsListObj.type;

    useEffect(() => {
        setfieldListOj(props.fieldsListObj);

        if (
            fieldType === 'fieldShortText' ||
            fieldType === 'fieldLongText' ||
            fieldType === 'richTextEditor' ||
            fieldType === 'email' ||
            fieldType === 'number'
        ) {
            setMinVal(props.fieldsListObj.min || '0');
            setMaxVal(props.fieldsListObj.max || '50');
        }

        if (fieldType === 'media') {
            setExt(props.fieldsListObj.ext || '.pdf,.docx,.doc');
        }

        if (fieldType === 'dropDownList') {
            if (props.fieldsListObj.itemList) {
                setItemList(props.fieldsListObj.itemList);
            }

            if (props.fieldsListObj.selectedCollection) {
                setSelectedCollection(props.fieldsListObj.selectedCollection);
            }
        }
    }, []);

    const onSaveClick = () => {
        let passObj: any = { ...fieldListOj };

        if (
            fieldType === 'fieldShortText' ||
            fieldType === 'fieldLongText' ||
            fieldType === 'richTextEditor' ||
            fieldType === 'email' ||
            fieldType === 'number'
        ) {
            passObj.max = maxVal;
            passObj.min = minVal;
        }

        if (fieldType === 'media') {
            passObj.ext = ext;
        }

        if (fieldType === 'dropDownList') {
            if (selectedCollection != '') {
                passObj.selectedCollection = selectedCollection;
                passObj.itemList = undefined;
            }

            if (itemList.length > 0) {
                passObj.itemList = itemList;
                passObj.selectedCollection = undefined;
            }
        }

        props.onClick(passObj);
    };

    return (
        <div className="col-12">
            <div className="form-group text-left">
                {(fieldType === 'fieldShortText' ||
                    fieldType === 'fieldLongText' ||
                    fieldType === 'richTextEditor' ||
                    fieldType === 'email' ||
                    fieldType === 'number') && (
                    <>
                        <MaxLenth
                            maxVal={maxVal}
                            onChange={(e) => {
                                setMaxVal(e.target.value);
                            }}
                        ></MaxLenth>
                        <MinLenth
                            minVal={minVal}
                            onChange={(e) => {
                                setMinVal(e.target.value);
                            }}
                        ></MinLenth>
                    </>
                )}

                {fieldType === 'media' && (
                    <MediaTypes
                        ext={ext}
                        onChange={(e) => {
                            setExt(e.target.value);
                        }}
                    ></MediaTypes>
                )}

                {fieldType === 'dropDownList' && (
                    <div id="accordion-custom-collection-drop-down">
                        <div className="card mb-3">
                            <div className="card-header" id="options-from-collection">
                                <h5 className="mb-0">
                                    <button
                                        className="btn btn-link"
                                        data-toggle="collapse"
                                        data-target="#collapse-options-from-collection"
                                        aria-expanded="true"
                                        aria-controls="collapse-options-from-collection"
                                    >
                                        Add options from another custom collection
                                    </button>
                                </h5>
                            </div>
                            <div
                                id="collapse-options-from-collection"
                                className={`collapse ${selectedCollection !== '' ? 'show' : ''}`}
                                aria-labelledby="options-from-collection"
                                data-parent="#accordion-custom-collection-drop-down"
                            >
                                <div className="card-body">
                                    {collectionsList &&
                                        Array.isArray(collectionsList) &&
                                        collectionsList.length > 0 && (
                                            <select
                                                className="form-control"
                                                value={selectedCollection}
                                                onChange={(event) => {
                                                    setSelectedCollection(event.target.value);
                                                    setItemList([]);
                                                }}
                                            >
                                                <option value="">
                                                    -- select custom collection --
                                                </option>
                                                {collectionsList.map((collection) => {
                                                    const { _id, customeCollectionName, menuName } =
                                                        collection;

                                                    return (
                                                        <option
                                                            value={customeCollectionName}
                                                            key={`custom-collection-${_id}`}
                                                        >
                                                            {menuName}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="custom-options">
                                <h5 className="mb-0">
                                    <button
                                        className="btn btn-link collapsed"
                                        data-toggle="collapse"
                                        data-target="#collapse-custom-options"
                                        aria-expanded="false"
                                        aria-controls="collapse-custom-options"
                                    >
                                        Add options manually
                                    </button>
                                </h5>
                            </div>
                            <div
                                id="collapse-custom-options"
                                className={`collapse ${itemList.length > 0 ? 'show' : ''}`}
                                aria-labelledby="custom-options"
                                data-parent="#accordion-custom-collection-drop-down"
                            >
                                <div className="card-body">
                                    <DropDownList
                                        item={item}
                                        itemList={itemList}
                                        onItemValueChange={(e) => {
                                            setItem(e.target.value);
                                        }}
                                        onItemAddClick={() => {
                                            setItemList((itemList) => {
                                                if (item != '') {
                                                    return [...itemList, item];
                                                }

                                                return itemList;
                                            });
                                            setItem('');
                                        }}
                                        setItemList={setItemList}
                                    ></DropDownList>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                        props.closeModal(false);
                    }}
                >
                    Close
                </button>
                <Button
                    className="btn btn-primary"
                    onClick={(e) => {
                        onSaveClick();
                    }}
                >
                    Save changes
                </Button>
            </div>
        </div>
    );
};

const MaxLenth = ({ maxVal, onChange }) => {
    return (
        <div className="row">
            <div className="col-12 form-group">
                <label htmlFor="maxLength">Maximum Length</label>
                <input
                    name="maxLength"
                    className="form-control"
                    type="number"
                    onChange={onChange}
                    value={maxVal}
                />
            </div>
        </div>
    );
};

const MinLenth = ({ minVal, onChange }) => {
    return (
        <div className="row">
            <div className="col-12 form-group">
                <label htmlFor="minLength">Minimum Length</label>
                <input
                    name="minLength"
                    className="form-control"
                    type="number"
                    onChange={onChange}
                    value={minVal}
                />
            </div>
        </div>
    );
};

const MediaTypes = ({ ext, onChange }) => {
    return (
        <div className="row">
            <div className="col-12 form-group">
                <label htmlFor="minLength">Allowed Types Of Media</label>
                <input
                    name="minLength"
                    className="form-control"
                    type="text"
                    onChange={onChange}
                    value={ext}
                />
            </div>
        </div>
    );
};

const DropDownList = (props: IdropDownList) => {
    const tbldata = () => {
        return Object.entries(props.itemList).map(([key, value]) => {
            return (
                <tr key={key}>
                    <td>{parseInt(key) + 1}</td>
                    <td>{value}</td>
                    <td>
                        <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={(e) => {
                                const itemList = [...props.itemList];
                                itemList.splice(parseInt(key), 1);
                                props.setItemList(itemList);
                            }}
                        >
                            Remove
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <div>
            <div className="row">
                <div className="col-9 form-group">
                    <input
                        name="itemName"
                        className="form-control"
                        type="text"
                        onChange={props.onItemValueChange}
                        value={props.item}
                    />
                </div>
                <div className="col-3 form-group">
                    <Button
                        type="button"
                        className="btn btn-primary"
                        onClick={props.onItemAddClick}
                    >
                        Add
                    </Button>
                </div>
            </div>
            <div className="row">
                <div className="col-12 form-group">
                    <Table className="table-borderless table-hover tbl-thm-01 table">
                        <thead className="">
                            <tr>
                                <th>ID</th>
                                <th>List Item</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>{props.itemList && tbldata()}</tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdvanceConfigs;
