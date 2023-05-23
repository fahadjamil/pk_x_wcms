import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import ColSixIcon from '../../resources/ColSixIcon';
import { SpecificPreviewComponent } from '../CMSSpecificPreviewComponent';
import { SearchInputComponent } from './SearchInputComponent';

export function SiteSearchResultsComponent(props) {
    const { commonConfigs, data, lang, dbName } = props;
    const { settings } = props.data;
    const [results, setResults] = useState({});
    const [resultCount, setResultCount] = useState(0);
    const [totalResultCount, setTotalResultCount] = useState(0);

    const [isViewAll, setIsViewAll] = useState(false);
    const [isMenuViewAll, setIsMenuViewAll] = useState(false);
    const [isArticleViewAll, setIsArticleViewAll] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [viewAllIndex, setViewAllIndex] = useState(undefined);
    let langKey = lang.langKey.toLowerCase();
    let reportCount = 0;
    let showRecordsCount = 5;
    let filterResultsLabel = langKey === 'en' ? 'Filter Results' : 'فرز نتائج البحث';
    let noResultsLabel = langKey === 'en' ? 'No Results Found' : 'لا توجد نتائج';

    if (settings) {
        showRecordsCount = settings.recordsLimit ? settings.recordsLimit.value : 5;
    }

    useEffect(() => {
        if (results && results.customCollections) {
            reportCount = 0;
            results.customCollections.forEach((data) => {
                reportCount += data.collectionData.length;
            });
        }
        setTotalResultCount(reportCount);
    }, [results]);

    const titleMap = {
        menu: 'Menu',
        customCollections: 'Reports',
        pageContent: 'Articles',
    };

    const titleMapAR = {
        menu: 'القائمة',
        customCollections: 'التقارير',
        pageContent: 'المواد',
    };

    // get parameters
    let keyword = '';
    let hashValue = '';
    if (typeof window !== 'undefined') {
        if (window && window.location && window.location.hash) {
            hashValue = decodeURI(window.location.hash);
            keyword = hashValue.substring(1);
        }
    }

    useEffect(() => {
        if (keyword != '') {
            getSearchResults(dbName, keyword);
        }
    }, []);

    function filterResults(event, category) {
        results[category].isVisible = event.target.checked;
        setIsFilter(!isFilter);
    }

    function viewAll(index) {
        setIsViewAll(true);
        setViewAllIndex(index);
    }

    function viewAllMenu() {
        setIsMenuViewAll(true);
    }

    function viewAllArticle() {
        setIsArticleViewAll(true);
    }

    function getSearchResults(database, keyword) {
        const jwt = localStorage.getItem('jwt-token');
        const sessionId = localStorage.getItem('sessionId');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                nameSpace: database,
                keyword: keyword,
                langKey: lang.langKey,
            },
        };

        Axios.get('/api/site-search/data', httpHeaders)
            .then((results) => {
                Object.keys(results.data).map((result, index) => {
                    // setting check value for checkbox
                    if (results.data[result].length > 0) {
                        results.data[result].isVisible = true;
                        if (lang.langKey.toLowerCase() === 'en') {
                            results.data[result].title = titleMap[result];
                        } else {
                            results.data[result].title = titleMapAR[result];
                        }
                    } else {
                        results.data[result].isVisible = false;
                    }
                });

                setResults(results.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <React.Fragment>
            <div className="search-result w-100">
                <div className="row">
                    <div className="col-md-3 result-filter">
                        <div className="">
                            <div className="card-body">
                                <h5 className="card-title mb-3 font-weight-bold">
                                    {filterResultsLabel}
                                </h5>
                                <form>
                                    <div className="">
                                        {Object.keys(results).map((result, index) => {
                                            return (
                                                <React.Fragment>
                                                    <div className="mb-3">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`check${index}`}
                                                            onChange={(e) => {
                                                                filterResults(e, result);
                                                            }}
                                                            disabled={results[result].length === 0}
                                                            defaultChecked={
                                                                results[result].isVisible
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={`check${index}`}
                                                        >
                                                            {langKey == 'en'
                                                                ? titleMap[result]
                                                                : titleMapAR[result]}
                                                            <span className="search-result-count">
                                                                {result.includes(
                                                                    'customCollections'
                                                                )
                                                                    ? totalResultCount
                                                                    : results[result].length}{' '}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-9 result-content">
                        <SearchInputComponent keyword={keyword} lang={langKey} />

                        {keyword != '' &&
                            results &&
                            results.menu &&
                            results.menu.length > 0 &&
                            results.menu.isVisible && (
                                <div className="result-group">
                                    <div className="result-group-header mb-3">
                                        <h5 className="mb-3 ">
                                            {' '}
                                            <span className="font-weight-bold">
                                                {' '}
                                                {results.menu.title}{' '}
                                            </span>{' '}
                                            <span className="search-result-count">
                                                {' '}
                                                {results.menu.length}{' '}
                                            </span>{' '}
                                        </h5>
                                    </div>

                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <ul>
                                                {results.menu.map((item, index) => {
                                                    return (
                                                        (index < showRecordsCount ||
                                                            isMenuViewAll) && (
                                                            <React.Fragment
                                                                key={item.name + '-' + index}
                                                            >
                                                                <li className="row">
                                                                    <a
                                                                        href={`/${langKey}${item.path}`}
                                                                        target="_blank"
                                                                    >
                                                                        {' '}
                                                                        {item.name}
                                                                    </a>
                                                                </li>
                                                            </React.Fragment>
                                                        )
                                                    );
                                                })}
                                            </ul>
                                            {results.menu.length > showRecordsCount &&
                                                !isMenuViewAll && (
                                                    <span className="clickable-01">
                                                        <a
                                                            className="viewall"
                                                            onClick={() => {
                                                                viewAllMenu();
                                                            }}
                                                        >
                                                            {' '}
                                                            View all
                                                        </a>
                                                    </span>
                                                )}
                                            {isMenuViewAll && (
                                                <span className="clickable-01">
                                                    <a
                                                        className="showless"
                                                        onClick={() => {
                                                            setIsMenuViewAll(false);
                                                        }}
                                                    >
                                                        {' '}
                                                        Hide
                                                    </a>
                                                </span>
                                            )}

                                            <br />
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            )}

                        {keyword != '' &&
                            results &&
                            results.customCollections &&
                            results.customCollections.length > 0 &&
                            results.customCollections.isVisible && (
                                <React.Fragment>
                                    <h5 className="mb-3 ">
                                        {' '}
                                        <span className="font-weight-bold">
                                            {' '}
                                            {results.customCollections.title}{' '}
                                        </span>{' '}
                                        <span className="search-result-count">
                                            {' '}
                                            {totalResultCount}{' '}
                                        </span>{' '}
                                    </h5>

                                    <React.Fragment>
                                        {results.customCollections.map((collection, mainindex) => {
                                            return (
                                                <div
                                                    className="card mb-3"
                                                    key={
                                                        collection.collectionName + '-' + mainindex
                                                    }
                                                >
                                                    <div className="card-body">
                                                        <h5 className="card-title">
                                                            {collection.collectionName}{' '}
                                                            <span className="search-result-count">
                                                                {collection.collectionData.length}
                                                            </span>
                                                        </h5>

                                                        <ul key={mainindex}>
                                                            {collection.collectionData.map(
                                                                (item, index) => {
                                                                    return (
                                                                        (index < showRecordsCount ||
                                                                            (isViewAll &&
                                                                                viewAllIndex ===
                                                                                    mainindex)) && (
                                                                            <React.Fragment
                                                                                key={
                                                                                    item.name +
                                                                                    '-' +
                                                                                    index
                                                                                }
                                                                            >
                                                                                <li
                                                                                    className="row"
                                                                                    key={
                                                                                        item.name +
                                                                                        '-' +
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {item.path && (
                                                                                        <a
                                                                                            href={`/${item.path}`}
                                                                                            target="_blank"
                                                                                        >
                                                                                            {' '}
                                                                                            {
                                                                                                item.name
                                                                                            }
                                                                                        </a>
                                                                                    )}
                                                                                </li>
                                                                            </React.Fragment>
                                                                        )
                                                                    );
                                                                }
                                                            )}
                                                        </ul>

                                                        {collection.collectionData.length >
                                                            showRecordsCount &&
                                                            viewAllIndex != mainindex && (
                                                                <span className="clickable-01">
                                                                    <a
                                                                        className="viewall"
                                                                        onClick={() => {
                                                                            viewAll(mainindex);
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        View all
                                                                    </a>
                                                                </span>
                                                            )}
                                                        {viewAllIndex === mainindex && (
                                                            <span className="clickable-01">
                                                                <a
                                                                    className="showless"
                                                                    onClick={() => {
                                                                        setIsViewAll(false);
                                                                        setViewAllIndex(undefined);
                                                                    }}
                                                                >
                                                                    {' '}
                                                                    Hide
                                                                </a>
                                                            </span>
                                                        )}

                                                        <br />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                </React.Fragment>
                            )}

                        {keyword != '' &&
                            results &&
                            results.pageContent &&
                            results.pageContent.length > 0 &&
                            results.pageContent.isVisible && (
                                <div className="result-group">
                                    <div className="result-group-header mb-3">
                                        <h5 className="mb-3 ">
                                            {' '}
                                            <span className="font-weight-bold">
                                                {' '}
                                                {results.pageContent.title}{' '}
                                            </span>{' '}
                                            <span className="search-result-count">
                                                {' '}
                                                {results.pageContent.length}{' '}
                                            </span>{' '}
                                        </h5>
                                    </div>

                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <ul>
                                                {results.pageContent.map((item, index) => {
                                                    return (
                                                        (index < showRecordsCount ||
                                                            isArticleViewAll) && (
                                                            <React.Fragment
                                                                key={item.name + '-' + index}
                                                            >
                                                                <li className="row">
                                                                    {item.path && (
                                                                        <a
                                                                            href={`/${langKey}${item.path}`}
                                                                            target="_blank"
                                                                        >
                                                                            {' '}
                                                                            {item.name}
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            </React.Fragment>
                                                        )
                                                    );
                                                })}
                                            </ul>
                                            {results.pageContent.length > showRecordsCount &&
                                                !isArticleViewAll && (
                                                    <span className="clickable-01">
                                                        <a
                                                            className="viewall"
                                                            onClick={() => {
                                                                viewAllArticle();
                                                            }}
                                                        >
                                                            {' '}
                                                            View all
                                                        </a>
                                                    </span>
                                                )}
                                            {isArticleViewAll && (
                                                <span className="clickable-01">
                                                    <a
                                                        className="showless"
                                                        onClick={() => {
                                                            setIsArticleViewAll(false);
                                                        }}
                                                    >
                                                        {' '}
                                                        Hide
                                                    </a>
                                                </span>
                                            )}

                                            <br />
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            )}

                        {(keyword === '' ||
                            (results &&
                                results.menu &&
                                results.customCollections &&
                                results.pageContent.length === 0 &&
                                results.menu.length === 0 &&
                                results.customCollections.length === 0 &&
                                results.pageContent.length === 0)) && <div>{noResultsLabel}.</div>}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
    // return commonConfigs.isPreview ? (
    //     <SpecificPreviewComponent title="Site Search Results" />
    // ) : (
    //     <>Results</>
    // );
}
