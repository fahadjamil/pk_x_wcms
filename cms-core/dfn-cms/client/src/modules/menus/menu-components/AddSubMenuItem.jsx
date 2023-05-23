import React, { useEffect, useState } from 'react';

export default function AddSubMenuItem(props) {
    const [subMenuName, setSubMenuName] = useState();

    useEffect(() => {}, []);

    const saveSubMenu = () => {
        props.updateSubMenu(props.subIndex, subMenuName);
    };

    const subMenuNameInputHandler = (event) => {
        setSubMenuName(event.target.value);
    };


    return (
        <>
            <form>
                <div className="form-group">
                    <label className="col-form-label">Sub Menu Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="role-name"
                        value={subMenuName}
                        onChange={(event) => subMenuNameInputHandler(event)}
                    ></input>
                </div>
            </form>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={(e) => saveSubMenu()}
                >
                    Save changes
                </button>
            </div>
        </>
    );
}
