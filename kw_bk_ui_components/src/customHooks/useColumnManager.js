import React, { useEffect, useState } from 'react';
import { retrieveBrowserStorage, saveOnBrowserStorage } from '../helper/localStorage';
import Cookies from 'universal-cookie/es6';
import { LOGIN_ID_COOKIE } from '../config/constants';

// this Custom Hook manages the columns in a table for a specific user,
// saves the column prefference in local storage
export const useColumnManager = (tableName) => {
    const [tableConfig, setTableConfig] = useState({});
    const [columns, updateColumns] = useState([]);

    const cookies = new Cookies();
    let userId = cookies.get(LOGIN_ID_COOKIE);
    const KEY_NAME = 'tableConfig';

    let tempTableConfig = retrieveBrowserStorage(KEY_NAME);
    useEffect(() => {
        if (userId && tableName && tempTableConfig) {
            setTableConfig(tempTableConfig);
            const tempColumns =
                tempTableConfig && tempTableConfig[tableName] && tempTableConfig[tableName][userId];
            updateColumns(tempColumns);
        }
    }, []);

    const setColumns = (newColumns) => {
        // Saving on browser storage only for logged in users
        if (tableName && userId) {
            let newTableConfig = tableConfig || {};
            // handle if user or table doesnt exist
            if (!newTableConfig[tableName]) {
                newTableConfig[tableName] = {};
            }

            newTableConfig[tableName][userId] = newColumns;
            saveOnBrowserStorage(KEY_NAME, newTableConfig);

            // --- For future improvements - to send user's column preference to BackEnd ---
        }
    };

    return [columns, setColumns];
};
