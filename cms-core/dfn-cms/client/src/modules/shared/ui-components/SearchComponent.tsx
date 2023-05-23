import React, { useState } from 'react';
import SearchIcon from '../resources/SearchIcon';

export default function SearchComponent(props) {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isReset, setIsReset] = useState<boolean>(false);

    function getSearchQuery(query) {
        if (query.target.value.length < searchQuery.length && !isReset) {
            props.reset();
            setIsReset(true);
        }
        setSearchQuery(query.target.value);
    }

    function onKeyDownHandler(e) {
        if (e.keyCode === 13) {
            props.search(searchQuery);
            setIsReset(false);
        }
    }

    return (
        <div className="form-group">
            <div className="input-group mt-2 mb-2">
                <input
                    type="search"
                    className="form-control"
                    id="search-page"
                    placeholder={props.placeholder}
                    value={searchQuery}
                    onKeyDown={onKeyDownHandler}
                    onChange={getSearchQuery}
                />
                <div className="input-group-append">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                            props.search(searchQuery);
                            setIsReset(false);
                        }}
                    >
                        <span className="logout-cms mr-3 clickable-01">
                            <SearchIcon width="24" height="26" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
