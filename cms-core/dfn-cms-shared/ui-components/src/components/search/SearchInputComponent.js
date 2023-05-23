import React, { useEffect, useState } from 'react';
import SearchIcon from '../../resources/SearchIcon';

export function SearchInputComponent(props) {
    const [searchKeyword, setSearchKeyword] = useState('');
    let lang = props.lang ? props.lang : 'en';

    useEffect(() => {
        if (props.keyword) {
            setSearchKeyword(props.keyword);
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        if (typeof window !== 'undefined') {
            window.location.href = `/${lang}/search#${searchKeyword}`;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="input-group mt-2 mb-5">
                    <input
                        type="search"
                        className="form-control"
                        id="siteSearch"
                        name="siteSearch"
                        placeholder="Search"
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                        }}
                        autoComplete="off"
                    />

                    <div className="input-group-search">
                        <a href={`/${lang}/search#${searchKeyword}`}>
                            <button type="submit" className="btn btn-bk-primary">
                                <span>
                                    <SearchIcon width="24" height="24" />
                                </span>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    );
}
