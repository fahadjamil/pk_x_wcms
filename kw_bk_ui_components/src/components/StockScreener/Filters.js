import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FilterSlider } from './FilterSlider';
import { SelectSector } from './SelectSector';
import { NumOfResults } from './NumOfResults';
import { useUserAgent } from '../../customHooks/useUserAgent';
import { Clear } from './static/Clear';

const FiltersWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
`;

const ApplyBtn = styled.button`
    margin-right: 20px;
    margin-left: 20px;
    height: 35px;
    background: #6c757d;
    color: white;
    border-radius: 5px;
    border-styles: hidden;
    ${(props) =>
        props.isMobile ? 'width: 80%;   margin-bottom: 10px; margin-top: 5px;' : 'width: 150px;'}
`;

const ClearBtn = styled.button`
    height: 35px;
    border-radius: 5px;
    border-styles: hidden;
    ${(props) => (props.isMobile ? 'width: 80%; ' : 'width: 150px;')}
`;

const FilterDisplayBtn = styled.button`
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    color: #6c757d;
`;

const ButtonWrapper = styled.div`
    width: 100%;
    height: 100%;
    margin: 0 30px 20px 15px;
    ${(props) => (props.isMobile ? 'text-align: center;' : 'text-align: end;')}
`;

const MainWrapper = styled.div`
    margin-top: 10px;
    width: 100%;
`;

const NumOfResultsWrapper = styled.span``;

const InputWrapper = styled.span`
    ${(props) => (props.isMobile ? 'margin: 0 10%;' : ' margin: 0 2.5%;')}
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const FilterDisplayWrapper = styled.div`
    display: flex;
    justify-content: center;
    ${(props) => (props.isMobile ? 'width: 80%; margin: 0 20%;' : 'width: 270px;')}
`;

const SearchBarWrapper = styled.div`
    border: 1px solid;
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    max-height: 30px;
    ${(props) => (props.isMobile ? 'width: 100%;' : '')}
    margin-bottom: 15px;
`;
const SearchBar = styled.input`
    border: 0;
    height: 28px;
    :focus {
        outline: none !important;
    }
`;

const ClearBtnWrapper = styled.div`
    margin: 2px;
    width: 22px;
`;
export const Filters = (props) => {
    const { lang, activeSearchBar } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const isMobile = useUserAgent();
    const allFilters = [
        {
            name: 'Market Cap',
            nameAR: 'رسملة السوق',
            mappingField: 'mktCap',
            tooltip: {
                en: "Market capitalization refers to the total market value of a company's outstanding shares of stock. It is calculated by multiplying the total number of a company's outstanding shares by the current market price of one share.",
                ar: '\u0631\u0633\u0645\u0644\u0629 \u0627\u0644\u0633\u0648\u0642 \u0647\u064a \u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u0633\u0648\u0642\u064a\u0629 \u0644\u0644\u0623\u0633\u0647\u0645 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0644\u0644\u0634\u0631\u0643\u0629\u060c \u0648\u064a\u062a\u0645 \u0627\u062d\u062a\u0633\u0627\u0628\u0647\u0627 \u0628\u0636\u0631\u0628 \u0625\u062c\u0645\u0627\u0644\u064a \u0639\u062f\u062f \u0627\u0644\u0623\u0633\u0647\u0645 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0644\u0644\u0634\u0631\u0643\u0629 \u0628\u0633\u0639\u0631 \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u062d\u0627\u0644\u064a \u0644\u0644\u0633\u0647\u0645 \u0627\u0644\u0648\u0627\u062d\u062f\u002e',
            },
        },
        {
            name: 'P/B Ratio',
            nameAR: 'مضاعف القيمة الدفترية',
            mappingField: 'priceBookValue',
            tooltip: {
                en: "The price-to-book ratio is calculated by dividing the company's stock price per share by its book value per share. It is used to compare a firm's market capitalization to its book value. ",
                ar: '\u064a\u062a\u0645 \u0627\u062d\u062a\u0633\u0627\u0628 \u0645\u0636\u0627\u0639\u0641 \u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u062f\u0641\u062a\u0631\u064a\u0629 \u0628\u062a\u0642\u0633\u064a\u0645 \u0633\u0639\u0631 \u0633\u0647\u0645 \u0627\u0644\u0634\u0631\u0643\u0629 \u0639\u0644\u0649 \u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u062f\u0641\u062a\u0631\u064a\u0629 \u0644\u0644\u0633\u0647\u0645 \u0627\u0644\u0648\u0627\u062d\u062f\u060c \u0648\u064a\u062a\u0645 \u0627\u0633\u062a\u062e\u062f\u0627\u0645\u0647 \u0644\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u0633\u0648\u0642\u064a\u0629 \u0644\u0644\u0634\u0631\u0643\u0629 \u0628\u0642\u064a\u0645\u062a\u0647\u0627 \u0627\u0644\u062f\u0641\u062a\u0631\u064a\u0629\u002e',
            },
        },
        {
            name: 'P/E Ratio',
            nameAR: 'مضاعف ربحية السهم',
            mappingField: 'per',
            tooltip: {
                en: 'The price-to-earnings ratio is the ratio for valuing a company that measures its current share price relative to its per-share earnings (EPS).',
                ar: '\u0646\u0633\u0628\u0629 \u0627\u0644\u0633\u0639\u0631 \u0625\u0644\u0649 \u0627\u0644\u0623\u0631\u0628\u0627\u062d \u0647\u064a \u0646\u0633\u0628\u0629 \u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u0634\u0631\u0643\u0629 \u0627\u0644\u062a\u064a \u062a\u0642\u064a\u0633 \u0633\u0639\u0631 \u0633\u0647\u0645\u0647\u0627 \u0627\u0644\u062d\u0627\u0644\u064a \u0628\u0627\u0644\u0646\u0633\u0628\u0629 \u0625\u0644\u0649 \u0631\u0628\u062d\u064a\u0629 \u0627\u0644\u0633\u0647\u0645\u002e',
            },
        },
        {
            name: 'Dividend Yield',
            nameAR: 'عائد الأرباح',
            mappingField: 'yield',
            tooltip: {
                en: 'The dividend yield, expressed as a percentage, is a financial ratio (dividend/price) that shows how much a company pays out in dividends each year relative to its stock price.',
                ar: '\u0627\u0644\u0639\u0627\u0626\u062f \u0627\u0644\u0631\u0628\u062d\u064a \u0028\u062a\u0648\u0632\u064a\u0639\u0627\u062a \u0627\u0644\u0623\u0631\u0628\u0627\u062d \u002f \u0627\u0644\u0633\u0639\u0631\u0029 \u0647\u0648 \u0646\u0633\u0628\u0629 \u0627\u0644\u0623\u0631\u0628\u0627\u062d \u0627\u0644\u0633\u0646\u0648\u064a\u0629 \u0644\u0644\u0634\u0631\u0643\u0629 \u0645\u0642\u0627\u0631\u0646\u0629 \u0628\u0633\u0639\u0631 \u0627\u0644\u0633\u0647\u0645 \u0627\u0644\u0648\u0627\u062d\u062f \u0648\u064a\u062a\u0645 \u062a\u0645\u062b\u064a\u0644\u0647 \u0628\u0646\u0633\u0628\u0629 \u0645\u0626\u0648\u064a\u0629',
            },
        },
        {
            name: '4-wk Price Change %',
            nameAR: '% تغيير السعر لـ4 أسابيع',
            mappingField: 'pricePctChgMTD',
            tooltip: {
                en: 'It is the current closing price of a security minus the closing price of the same security from 4 weeks ago divided by the closing price from 4 weeks ago. The result is multiplied by 100.',
                ar: '\u0647\u064a \u0633\u0639\u0631 \u0627\u0644\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u062d\u0627\u0644\u064a \u0644\u0644\u0633\u0647\u0645 \u0645\u0637\u0631\u0648\u062d\u0627 \u0645\u0646\u0647 \u0633\u0639\u0631 \u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0633\u0647\u0645 \u0646\u0641\u0633\u0647 \u0645\u0646\u0630 \u0034 \u0623\u0633\u0627\u0628\u064a\u0639 \u0645\u0642\u0633\u0648\u0645\u064b\u0627 \u0639\u0644\u0649 \u0633\u0639\u0631 \u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0633\u0647\u0645 \u0645\u0646\u0630 \u0034 \u0623\u0633\u0627\u0628\u064a\u0639 \u0648\u0645\u0636\u0631\u0648\u0628\u0627 \u0628 \u0031\u0030\u0030\u002e',
            },
        },
        {
            name: '13-wk Price Change %',
            nameAR: '% تغيير السعر لـ13 أسبوع',
            mappingField: 'pricePctChg13Wk',
            tooltip: {
                en: 'It is the current closing price of a security minus the closing price of the same security from 13 weeks ago divided by the closing price from 13 weeks ago. The result is multiplied by 100.',
                ar: ' \u0647\u064a \u0633\u0639\u0631 \u0627\u0644\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u062d\u0627\u0644\u064a \u0644\u0644\u0633\u0647\u0645 \u0645\u0637\u0631\u0648\u062d\u0627\u064b \u0645\u0646\u0647 \u0633\u0639\u0631 \u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0633\u0647\u0645 \u0646\u0641\u0633\u0647 \u0645\u0646\u0630 \u0031\u0033 \u0623\u0633\u0628\u0648\u0639 \u0645\u0642\u0633\u0648\u0645\u064b\u0627 \u0639\u0644\u0649 \u0633\u0639\u0631 \u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0633\u0647\u0645 \u0645\u0646\u0630 \u0031\u0033 \u0623\u0633\u0628\u0648\u0639 \u0648\u0645\u0636\u0631\u0648\u0628\u0627\u064b \u0628 \u0031\u0030\u0030\u002e',
            },
        },
        {
            name: '26-wk Price Change %',
            nameAR: '% تغيير السعر لـ26 أسبوع',
            mappingField: 'pricePctChg26Wk',
            tooltip: {
                en: 'It is the current closing price of a security minus the closing price of the same security from 26 weeks ago divided by the closing price from 26 weeks ago. The result is multiplied by 100.',
                ar: '\u0647\u064a \u0633\u0639\u0631 \u0627\u0644\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u062d\u0627\u0644\u064a \u0644\u0644\u0633\u0647\u0645 \u0645\u0637\u0631\u0648\u062d\u0627\u064b \u0645\u0646\u0647 \u0633\u0639\u0631 \u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0633\u0647\u0645 \u0646\u0641\u0633\u0647 \u0645\u0646\u0630 \u0032\u0036 \u0623\u0633\u0628\u0648\u0639 \u0645\u0642\u0633\u0648\u0645\u064b\u0627 \u0639\u0644\u0649 \u0633\u0639\u0631 \u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0633\u0647\u0645 \u0645\u0646\u0630 \u0032\u0036 \u0623\u0633\u0628\u0648\u0639 \u0648\u0645\u0636\u0631\u0648\u0628\u0627\u064b \u0628 \u0031\u0030\u0030\u002e',
            },
        },
        {
            name: '1 yr Revenue Change %',
            nameAR: '% تغيير الإيرادات لسنة',
            mappingField: 'revPctChg1Yr',
            tooltip: {
                en: 'It is the total revenues for a company in the recent fiscal year minus the total revenues for the same period one year ago divided by the revenues for the same period one year ago, multiplied by 100. It measures the change in revenues for a company during one year.',

                ar: '\u0646\u0633\u0628\u0629 \u062a\u063a\u064a\u0631 \u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0647\u064a \u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0644\u0634\u0631\u0643\u0629 \u0641\u064a \u0627\u0644\u0633\u0646\u0629 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0627\u0644\u0623\u062e\u064a\u0631\u0629 \u0645\u0637\u0631\u0648\u062d\u0627 \u0645\u0646\u0647\u0627 \u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0644\u0646\u0641\u0633 \u0627\u0644\u0641\u062a\u0631\u0629 \u0642\u0628\u0644 \u0639\u0627\u0645 \u0648\u0627\u062d\u062f \u0645\u0642\u0633\u0648\u0645\u064b\u0627 \u0639\u0644\u0649 \u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0646\u0641\u0633 \u0627\u0644\u0641\u062a\u0631\u0629 \u0642\u0628\u0644 \u0639\u0627\u0645 \u0648\u0627\u062d\u062f \u0645\u0636\u0631\u0648\u0628\u064b\u0627 \u0628\u0031\u0030\u0030\u060c \u0648\u0647\u0648 \u064a\u0642\u064a\u0633 \u0627\u0644\u062a\u063a\u064a\u0631 \u0641\u064a \u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0627\u0644\u0634\u0631\u0643\u0629 \u062e\u0644\u0627\u0644 \u0633\u0646\u0629 \u0648\u0627\u062d\u062f\u0629\u002e',
            },
        },
        {
            name: 'YTD%',
            nameAR: '% منذ بداية العام',
            mappingField: 'pricePctChg52Wk',
            tooltip: {
                en: 'The year to date return percentage is the current price of a security minus the price of the same security at the first day of the year divided by the price of the security at the first day of the year and multiplied by 100. It is used to assess the performance of a stock or to compare the recent performance of a number of stocks.',
                ar: '\u0646\u0633\u0628\u0629 \u0627\u0644\u0639\u0627\u0626\u062f \u0645\u0646 \u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u0639\u0627\u0645 \u062d\u062a\u0649 \u062a\u0627\u0631\u064a\u062e\u0647 \u0647\u064a \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u062d\u0627\u0644\u064a \u0644\u0644\u0633\u0647\u0645  \u0645\u0637\u0631\u0648\u062d\u0627 \u0645\u0646\u0647 \u0633\u0639\u0631 \u0627\u0644\u0633\u0647\u0645 \u0646\u0641\u0633\u0647 \u0641\u064a \u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u062a\u062f\u0627\u0648\u0644 \u0645\u0646 \u0627\u0644\u0633\u0646\u0629 \u0645\u0642\u0633\u0648\u0645\u0627\u064b \u0639\u0644\u0649 \u0633\u0639\u0631 \u0627\u0644\u0633\u0647\u0645 \u0646\u0641\u0633\u0647 \u0641\u064a \u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u062a\u062f\u0627\u0648\u0644 \u0645\u0646 \u0627\u0644\u0633\u0646\u0629 \u0648\u0645\u0636\u0631\u0648\u0628\u0627\u064b \u0628 \u0031\u0030\u0030\u002e \u0648\u062a\u0633\u062a\u062e\u062f\u0645 \u0641\u064a \u062a\u0642\u064a\u064a\u0645 \u0623\u062f\u0627\u0621 \u0627\u0644\u0633\u0647\u0645 \u0623\u0648 \u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0623\u062f\u0627\u0621 \u0644\u0639\u062f\u062f \u0645\u0646 \u0627\u0644\u0623\u0633\u0647\u0645\u002e',
            },
        },
        {
            name: 'Net Profit %',
            nameAR: 'هامش صافي الربح',
            mappingField: 'netProfPct',
            tooltip: {
                en: 'The net profit margin is the ratio of net profits to revenues for a company and is typically expressed as a percentage',
                ar: '\u0647\u0627\u0645\u0634 \u0635\u0627\u0641\u064a \u0627\u0644\u0631\u0628\u062d \u0647\u0648 \u0646\u0633\u0628\u0629 \u0635\u0627\u0641\u064a \u0627\u0644\u0623\u0631\u0628\u0627\u062d \u0625\u0644\u0649 \u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0627\u0644\u0634\u0631\u0643\u0629\u060c \u0648\u064a\u062a\u0645 \u0627\u0644\u062a\u0639\u0628\u064a\u0631 \u0639\u0646\u0647 \u0639\u0627\u062f\u0629 \u0643\u0646\u0633\u0628\u0629 \u0645\u0626\u0648\u064a\u0629\u002e',
            },
        },
    ];
    const [filterData, setFilterData] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [numOfDisplayingFilters, setNumOfDisplayingFilters] = useState(4);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let tempFilteredData = props.stockData.filter((stock) => {
            return selectedSector == '' || selectedSector == stock.sectorID;
        });
        const isSectorEmpty = tempFilteredData.length == 0;

        let tempFilterData = allFilters.map((sliderFilter, sliderFilterIndex) => {
            let tempMin = isSectorEmpty ? 0 : findMin(sliderFilter.mappingField, tempFilteredData);
            let tempMax = isSectorEmpty ? 0 : findMax(sliderFilter.mappingField, tempFilteredData);
            return {
                filterID: sliderFilterIndex,
                name: sliderFilter.name,
                nameAR: sliderFilter.nameAR,
                active: false,
                selectedMin: tempMin,
                selectedMax: tempMax,
                rangeMin: tempMin,
                rangeMax: tempMax,
                mappingField: sliderFilter.mappingField,
                tooltip: sliderFilter.tooltip,
            };
        });

        setFilterData(tempFilterData);
    }, [selectedSector]);

    const findMax = (field, dataArray) =>
        Math.ceil(Math.max(...dataArray.map((data) => data[field])));
    const findMin = (field, dataArray) =>
        Math.floor(Math.min(...dataArray.map((data) => data[field])));

    const handleChange = (filterID, newValue) => {
        let updatedFilterData = filterData.map((filter) => {
            if (filter.filterID == filterID) {
                return {
                    ...filter,
                    selectedMin: newValue[0],
                    selectedMax: newValue[1],
                };
            } else {
                return filter;
            }
        });
        setFilterData(updatedFilterData);
    };

    const toggleFilter = (filterID) => {
        let updatedFilterData = filterData.map((filter) => {
            if (filter.filterID == filterID) {
                return {
                    ...filter,
                    active: !filter.active,
                };
            } else {
                return filter;
            }
        });
        setFilterData(updatedFilterData);
        if (search) {
            setSearch('');
        }
    };

    const onApplyFilter = () => {
        if (filterData.length > 0) {
            let usedFilters = filterData.filter((filter) => filter.active);

            let tempFilteredData = props.stockData.filter((stock) => {
                let filterCriteria = usedFilters.map(
                    (fil) =>
                        stock[fil.mappingField] >= fil.selectedMin &&
                        stock[fil.mappingField] <= fil.selectedMax
                );

                return (
                    (selectedSector == '' || selectedSector == stock.sectorID) &&
                    filterCriteria.every((filter) => filter)
                );
            });

            props.setFilteredStockData(tempFilteredData);
        }
    };

    const onClearFilters = () => {
        let tempFilters = filterData.map((filter) => ({
            ...filter,
            active: false,
            selectedMin: filter.rangeMin,
            selectedMax: filter.rangeMax,
        }));
        setFilterData(tempFilters);
        props.setFilteredStockData(props.stockData);
        setSelectedSector('');
    };

    const changeNumOfFiltersDisplaying = () => {
        if (numOfDisplayingFilters == 4) {
            setNumOfDisplayingFilters(filterData.length);
        } else {
            setNumOfDisplayingFilters(4);
        }
    };

    const isAllDeactivated = () =>
        filterData.every((filter) => !filter.active) && selectedSector == '';

    const handleSearch = (searchString) => {
        setSearch(searchString);
        if (searchString) {
            if (!isAllDeactivated()) {
                onClearFilters();
            }
            let searchResults = props.stockData.filter(
                (stock) =>
                    stock.ticker.toLowerCase().search(searchString.toLowerCase()) > -1 ||
                    stock.stockID.toString().search(searchString) > -1
            );
            props.setFilteredStockData(searchResults);
        } else {
            onClearFilters();
        }
    };

    const clearSearch = () => {
        setSearch('');
        onClearFilters();
    };
    const SEARCH = convertByLang('بحث', 'Search');

    const handleSectorSelect = (value) => {
        setSelectedSector(value);
        if (search !== '') {
            setSearch('');
        }
    };

    return (
        <MainWrapper>
            <InputWrapper isMobile={isMobile}>
                {activeSearchBar ? (
                    <SearchBarWrapper isMobile={isMobile}>
                        <SearchBar
                            type="text"
                            placeholder={SEARCH}
                            value={search}
                            onChange={(event) => handleSearch(event.target.value)}
                        ></SearchBar>
                        <ClearBtnWrapper onClick={() => clearSearch()}>
                            {search != '' ? (
                                <Clear width="20px" height="20px" />
                            ) : (
                                <React.Fragment />
                            )}
                        </ClearBtnWrapper>
                    </SearchBarWrapper>
                ) : (
                    <React.Fragment />
                )}
                <SelectSector
                    sectorData={props.sectorData}
                    onChange={handleSectorSelect}
                    currentValue={selectedSector}
                    lang={lang}
                    isMobile={isMobile}
                />
            </InputWrapper>
            <FiltersWrapper>
                {filterData.slice(0, numOfDisplayingFilters).map((filter) => (
                    <FilterSlider
                        key={filter.filterID}
                        filterID={filter.filterID}
                        name={convertByLang(filter.nameAR, filter.name)}
                        active={filter.active}
                        handleChange={handleChange}
                        selectedMin={filter.selectedMin}
                        selectedMax={filter.selectedMax}
                        rangeMin={filter.rangeMin}
                        rangeMax={filter.rangeMax}
                        setDisabled={toggleFilter}
                        tooltip={convertByLang(filter.tooltip.ar, filter.tooltip.en)}
                        lang={lang}
                    ></FilterSlider>
                ))}
                <FilterDisplayWrapper isMobile={isMobile}>
                    <FilterDisplayBtn onClick={() => changeNumOfFiltersDisplaying()}>
                        {numOfDisplayingFilters == 4
                            ? convertByLang('↓ المزيد من عوامل الفرز', 'Show more filters ↓ ')
                            : convertByLang('↑ عوامل فرز اقل', 'Show less filters ↑')}
                    </FilterDisplayBtn>
                </FilterDisplayWrapper>
                <ButtonWrapper isMobile={isMobile}>
                    <NumOfResultsWrapper isMobile={isMobile}>
                        <NumOfResults
                            numOfResults={props.numOfResults}
                            numOfAllStocks={props.stockData.length}
                            lang={lang}
                        />
                    </NumOfResultsWrapper>

                    <ApplyBtn isMobile={isMobile} onClick={() => onApplyFilter()}>
                        {convertByLang('فرز', 'Screen')}
                    </ApplyBtn>
                    <ClearBtn isMobile={isMobile} onClick={() => onClearFilters()}>
                        {convertByLang('إعادة ضبط', 'Reset')}
                    </ClearBtn>
                </ButtonWrapper>
            </FiltersWrapper>
        </MainWrapper>
    );
};
