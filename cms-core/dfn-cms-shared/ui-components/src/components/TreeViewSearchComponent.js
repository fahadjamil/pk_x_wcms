import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import { ParagraphComponent } from './ParagraphComponent';
import MultiSelect from 'react-multi-select-component';
import ReactPaginate from 'react-paginate';

function TreeViewSearchComponent(params) {
    const { commonConfigs } = params;
    const { data, styles, settings } = params.data;
    const selectedLanguage = params.lang;
    const { tree, paragraphMap, titleMap } = settings;
    const { uniqueId, value } = tree;
    const { isEditMode, isPreview } = commonConfigs;
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [fullSearchResults, setFullSearchResults] = useState([]);
    const [chapterSelect, setChapterSelect] = useState([]);
    const [treeData, settreeData] = useState();
    const [recordsPerPage, setRecordsPerPage] = useState(20);
    const [pageCount, setPageCount] = useState(1);
    const [sortingOption, setSortingOption] = useState('relevance');
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    let routerDomLocation = undefined;

    useEffect(() => {
        let isUnmounted = false;

        if (!isUnmounted && value && value !== '') {
            getTreeDataFromSource(isUnmounted);
        }

        return () => {
            isUnmounted = true;
        };
    }, []);

    useEffect(() => {
        let isUnmounted = false;

        getData(isUnmounted);

        return () => {
            isUnmounted = true;
        };
    }, [getLocationHashValue()]);

    function getData(isUnmounted) {
        if (
            !isUnmounted &&
            routerDomLocation &&
            routerDomLocation.hash &&
            routerDomLocation.hash !== ''
        ) {
            const treeSearchKey = routerDomLocation.hash.substr(1);
            if (treeSearchKey && treeSearchKey !== '') {
                const decodedStr = decodeURIComponent(treeSearchKey);
                setSearchText(decodedStr);
                getSearchResults(decodedStr);
            }
        }
    }

    function getLocationHashValue() {
        if (typeof location !== 'undefined' && routerDomLocation === undefined) {
            if (isPreview) {
                try {
                    routerDomLocation = useLocation();
                } catch (error) {
                    console.log('reactUseLocation error', error);
                }
            } else {
                routerDomLocation = location;
            }
        }

        if (routerDomLocation && routerDomLocation.hash) {
            return routerDomLocation.hash;
        } else {
            return '';
        }
    }

    function getTreeDataFromSource(isUnmounted) {
        const jwt = localStorage.getItem('jwt-token');

        let requestUrl = '/api/tree';
        let requestParams = { id: value, nameSpace: params.dbName };

        if (isPreview) {
            requestUrl = '/api/custom-collections/tree';
            requestParams = { id: value, dbName: params.dbName };
        }

        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: requestParams,
        };

        Axios.get(requestUrl, httpHeaders)
            .then((result) => {
                if (!isUnmounted && result && result.data) {
                    settreeData(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getSearchResults(searchKey = undefined) {
        const jwt = localStorage.getItem('jwt-token');

        const selectedParentNodes = chapterSelect.map((item) => {
            return item.value;
        });
        const selectedNodesParamString = selectedParentNodes.join('#');

        let requestUrl = '/api/tree/search';
        let requestParams = {
            treeId: value,
            langKey: selectedLanguage.langKey,
            keyWord: searchKey || searchText,
            nameSpace: params.dbName,
            parentNodeIds: selectedNodesParamString,
            sorting: sortingOption,
        };

        if (isPreview) {
            requestUrl = '/api/custom-collections/tree/search';
            requestParams = {
                treeId: value,
                langKey: selectedLanguage.langKey,
                keyWord: searchKey || searchText,
                dbName: params.dbName,
                parentNodeIds: selectedNodesParamString,
                sorting: sortingOption,
            };
        }

        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: requestParams,
        };

        Axios.get(requestUrl, httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setFullSearchResults(result.data);

                    if (result.data.length > 0) {
                        setSearchResults(result.data.slice(0, recordsPerPage));
                        setPageCount(Math.ceil(result.data.length / recordsPerPage));
                    } else {
                        setSearchResults([]);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getChapters() {
        if (treeData && treeData.tree && treeData.tree.length > 0) {
            return treeData.tree.map((parentNode) => {
                const nodeTitle = parentNode.localizeTitle[selectedLanguage.langKey.toLowerCase()];
                return { label: nodeTitle, value: parentNode.nodeID };
            });
        } else {
            return [];
        }
    }

    function getSerachTableRecord(searchItem, index) {
        if (searchItem) {
            return (
                <tr key={`searchRecord${index}`}>
                    <td>{getChapterTitle(searchItem)}</td>
                    <td>{getRecordTitle(searchItem)}</td>
                    <td>{getDocumentParagraphView(searchItem)}</td>
                </tr>
            );
        } else {
            return <React.Fragment></React.Fragment>;
        }
    }

    function getRecordTitle(document) {
        if (document && document.fieldData && document.fieldData[selectedLanguage.langKey]) {
            if (titleMap && titleMap.value && titleMap.value !== '') {
                const mappingName = titleMap.value.toLocaleLowerCase().split(' ').join('_');
                return document.fieldData[selectedLanguage.langKey][mappingName];
            } else {
                return document.fieldData[selectedLanguage.langKey].entry_name;
            }
        } else {
            return '';
        }
    }

    function getRecordParagraph(document) {
        if (document && document.fieldData && document.fieldData[selectedLanguage.langKey]) {
            if (paragraphMap && paragraphMap.value && paragraphMap.value !== '') {
                const mappingName = paragraphMap.value.toLocaleLowerCase().split(' ').join('_');

                let paragraphHtmlText = document.fieldData[selectedLanguage.langKey][mappingName];
                if (searchText && searchText !== '') {
                    const parts = paragraphHtmlText.split(new RegExp(`(${searchText})`, 'gi'));
                    const newParts = parts.map((part, i) => {
                        if (part.toLowerCase() === searchText.toLowerCase()) {
                            return `<mark>${part}</mark>`;
                        } else {
                            return part;
                        }
                    });

                    paragraphHtmlText = newParts.join('');
                }
                return paragraphHtmlText;
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    function getDocumentParagraphView(document) {
        try {
            const params = {
                styles: styles,
                data: { paragraph: getRecordParagraph(document) },
            };

            return <ParagraphComponent data={params} />;
        } catch (error) {
            console.log('Document Paragraph Type Error', error);
            return <React.Fragment>{getRecordParagraph(document)}</React.Fragment>;
        }
    }

    function getChapterTitle(document) {
        if (document && document.parentNode && document.parentNode.localizeTitle) {
            return document.parentNode.localizeTitle[selectedLanguage.langKey.toLowerCase()];
        } else {
            return '';
        }
    }

    function getResultsCount() {
        if (searchResults && searchResults.length > -1) {
            return `${searchResults.length} results found`;
        } else {
            return '';
        }
    }

    function handlePageNavigation(data) {
        let selected = data.selected;
        let start = Math.ceil(selected * recordsPerPage);
        let end = Math.ceil((selected + 1) * recordsPerPage);

        setCurrentPageNumber(selected);
        setSearchResults(fullSearchResults.slice(start, end));
    }

    return (
        <div className="tree-view-search">
            <form>
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 form-group mb-3">
                        <label className="">Chapter</label>
                        <MultiSelect
                            className="multi-select"
                            options={getChapters()}
                            value={chapterSelect}
                            onChange={setChapterSelect}
                            labelledBy={'Select'}
                            disableSearch
                        />
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-12 form-group mb-3">
                        <label className="">Keywords</label>
                        <input
                            className="form-control"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                            }}
                            placeholder="Keywords"
                        />
                    </div>
                    <div className="col-lg-1 mt-4 col-md-1 col-sm-12 form-group mb-3 text-right align-self-center">
                        <button
                            type="submit"
                            className="btn btn-bk-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                getSearchResults();
                            }}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>
            <div className="row d-flex mb-3 border-bottom">
                <div className="col-lg-1 col-md-2 mr-auto col-sm-4 form-group align-self-center">
                    <strong> {getResultsCount()} </strong>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-4 form-group">
                    <label className="">Sort By</label>
                    <select
                        className="form-select form-control"
                        aria-label="sortby"
                        value={sortingOption}
                        onChange={(e) => {
                            setSortingOption(e.target.value);
                        }}
                    >
                        <option value="relevance">Relevance</option>
                        <option value="chapter">Chapter</option>
                        <option value="articleNumber">Article Number</option>
                        <option value="revisionDate">Revision Date</option>
                    </select>
                </div>
                <div className="col-lg-1 col-md-2 col-sm-4 form-group ">
                    <label className="">Show</label>
                    <select
                        className="form-control form-select"
                        aria-label="show"
                        onChange={(e) => {
                            const value = e.target.value;

                            setRecordsPerPage(value);
                            setPageCount(Math.ceil(fullSearchResults.length / value));
                            setSearchResults(fullSearchResults.slice(0, value));
                        }}
                        value={recordsPerPage}
                    >
                        <option value={20}>20</option>
                        <option value={40}>40</option>
                        <option value={60}>60</option>
                        <option value={80}>80</option>
                    </select>
                </div>
            </div>
            <table className="table-borderless table-hover tbl-thm-01 table">
                <tbody>
                    {searchResults &&
                        searchResults.map((searchItem, index) => {
                            return getSerachTableRecord(searchItem, index);
                        })}
                </tbody>
            </table>
            {searchResults && searchResults.length > 0 && (
                <nav aria-label="Page navigation" className="search-pagination-nav">
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'search-pagination-break'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageNavigation}
                        containerClassName={'search-pagination-container'}
                        subContainerClassName={'search-pagination-sub-container'}
                        activeClassName={'active'}
                        forcePage={currentPageNumber}
                    />
                </nav>
            )}
        </div>
    );
}

export default TreeViewSearchComponent;
