import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import InformationModal from '../../../shared/ui-components/modals/information-modal';

function FormValidationsChangeOptions(props) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [item, setItem] = useState<string>('');
    const [itemList, setItemList] = useState<string[]>(props.value);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            if (props.value && Array.isArray(props.value) && props.value.length > 0) {
                setItemList(props.value);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [props.value]);

    function handleItemRemove(index) {
        const updatedItemList = [...itemList];
        updatedItemList.splice(parseInt(index), 1);

        setItemList(updatedItemList);
    }

    function onItemAddClick() {
        if (item != '') {
            const updatedItemList = [...itemList];
            updatedItemList.push(item);
            setItemList(updatedItemList);
        }

        setItem('');
    }

    function onItemValueChange(event) {
        setItem(event.target.value);
    }

    function handleConfirme() {
        const validations = {
            ...props.validations,
            [props.columnId]: {
                ...props.validations[props.columnId],
                [props.validation]: itemList,
            },
        };

        props.setValidations(validations);
        setIsModalOpen(false);
    }

    const tbldata = () => {
        return itemList.map((value, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{value}</td>
                    <td>
                        <button className="btn btn-primary" onClick={handleItemRemove}>
                            Remove
                        </button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <>
            <button className="btn btn-sm btn-secondary" onClick={() => setIsModalOpen(true)}>
                Change Options
            </button>
            {isModalOpen && (
                <InformationModal
                    modalTitle="Change Options"
                    show={isModalOpen}
                    size="md"
                    submitBtnText="Save"
                    centered={true}
                    handleClose={() => setIsModalOpen(false)}
                    handleConfirme={handleConfirme}
                >
                    <div className="row">
                        <div className="col-9 form-group">
                            <input
                                name="itemName"
                                className="form-control"
                                type="text"
                                onChange={onItemValueChange}
                                value={item}
                            />
                        </div>
                        <div className="col-3 form-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={onItemAddClick}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 form-group">
                            <table className="table-borderless table-hover tbl-thm-01 table">
                                <thead className="">
                                    <tr>
                                        <th>ID</th>
                                        <th>List Item</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>{itemList.length > 0 && tbldata()}</tbody>
                            </table>
                        </div>
                    </div>
                </InformationModal>
            )}
        </>
    );
}

export default FormValidationsChangeOptions;
