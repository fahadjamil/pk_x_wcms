import React from 'react';

function TopPanelComponent(props) {
    const { openAddResourceModal, handleSave } = props;

    return (
        <div className="d-inline float-right">
            <button
                type="button"
                className="btn btn-outline-primary btn-sm mr-3"
                onClick={openAddResourceModal}
            >
                Add New Resource
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
                Save
            </button>
        </div>
    );
}

export default TopPanelComponent;
