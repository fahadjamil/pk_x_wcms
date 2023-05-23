import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function AddmenuItem(params) {
    const [menuName, setMenuName] = useState('');
    const history = useHistory();

    const colId = 'column1';
    const jwt = localStorage.getItem('jwt-token');
    const httpHeaders = {
        headers: {
            Authorization: jwt,
        },
    };

    return (
        <>
            <div className="col-md-10 ml-2">
                <form>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="website"
                            placeholder="Enter Name"
                            value={menuName}
                            onChange={(e) => setMenuName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Add
                    </button>
                </form>
            </div>
        </>
    );
}
