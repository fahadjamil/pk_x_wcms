import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { oldMarketBackEndProxyPass } from '../../config/path';
import { _getHeaderIndexList } from '../../helper/metaData';

const StyledSelect = styled.select`
    ${(props) =>
        props.isMobile
            ? 'width: 280px; height: 35px; margin-top:20px;'
            : 'width: 350px; height: 30px;'}
`;
const StyledSelectWrapper = styled.span`
    ${(props) => (props.isMobile ? 'text-align: center;' : '')}
`;

const StyledButtonWrapper = styled.span`
    ${(props) => (props.isMobile ? 'text-align: center;' : '')}
`;
const StyledButton = styled.button`
    ${(props) =>
        props.isMobile
            ? 'height: 35px; width: 125px; margin:20px 7.5px;'
            : 'height: 31px; width: 120px; margin: 0px 10px 0px 5px;'}

    border: none;
    color: white;
    border-radius: 5px;
    background: ${(props) => props.bgColor || '#BBBBBB'};
    margin-bottom: 20px;
`;

const ToolbarWrapper = styled.div`
    text-align: center;
`;

export const CalendarToolbar = (props) => {
    const { callback, lang, isMobile } = props;
    const [listOfSecurities, setListofSecurities] = useState([]);
    const [selectedSecurity, setSelectedSecurity] = useState('ALL');
    const [selectedEvent, setSelectedEvent] = useState('ALL');
    useEffect(() => {
        Axios.get(oldMarketBackEndProxyPass(), {
            params: {
                UID: '3166765',
                SID: '3090B191-7C82-49EE-AC52-706F081F265D',
                L: lang,
                UNC: 0,
                UE: 'KSE',
                H: 1,
                M: 1,
                RT: 303,
                SRC: 'KSE',
                AS: 1,
            },
        }).then((res) => {
            if (res.data.DAT.TD) {
                let headerFields = ['SYMBOL', 'SYMBOL_DESCRIPTION', 'COMPANY_CODE'];
                let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);
                let tempList = res.data.DAT.TD.filter(
                    (stock) => stock.split('|')[symHedIdxList.SYMBOL].split('`')[1] == 'R'
                );

                setListofSecurities(
                    tempList.map((stock) => ({
                        name: stock.split('|')[symHedIdxList.SYMBOL_DESCRIPTION],
                        stockRef: stock.split('|')[symHedIdxList.COMPANY_CODE],
                    }))
                );
            }
        });
    }, []);

    const changeSecurity = (newSecurity) => setSelectedSecurity(newSecurity);
    const changeEventType = (newEventType) => setSelectedEvent(newEventType);
    const onFilter = () => {
        let tempFilters = {};
        if (selectedSecurity && selectedSecurity != 'ALL') {
            tempFilters.SYMC = selectedSecurity;
        }

        if (selectedEvent && selectedEvent != 'ALL') {
            tempFilters.NT = selectedEvent;
        }
        callback({ ...tempFilters });
    };

    const onClearFilter = () => {
        setSelectedEvent('ALL');
        setSelectedSecurity('ALL');
        callback({});
    };

    return (
        <ToolbarWrapper>
             <StyledSelectWrapper isMobile={isMobile}>
            <StyledSelect
            isMobile={isMobile}
                value={selectedSecurity}
                onChange={(event) => changeSecurity(event.target.value)}
            >
                <option value="ALL"> {lang == 'EN' ? 'All Securities' : ' كل الشركات '}</option>
                {listOfSecurities.map((stock, index) => (
                    <option
                        key={index}
                        value={stock.stockRef}
                    >{`${stock.stockRef} : ${stock.name}`}</option>
                ))}
            </StyledSelect>{' '}
            <StyledSelect
            isMobile={isMobile}
                onChange={(event) => changeEventType(event.target.value)}
                value={selectedEvent}
            >
                <option value="ALL"> {lang == 'EN' ? 'All Events' : ' كل الأحداث '}</option>
                <option value="1">
                    {lang == 'EN' ? 'General Assembly Meeting   ' : 'الجمعية العامة تنعقد بتاريخ'}
                </option>
                <option value="2">
                    {lang == 'EN'
                        ? 'General Assembly Meeting Date Amendment   '
                        : 'تغيير موعد الجمعية العامة الى'}
                </option>
                <option value="3">
                    {lang == 'EN'
                        ? 'Postponed General Assembly Meeting   '
                        : 'الجمعية العامة (المؤجلة) تنعقد بتاريخ '}
                </option>
                <option value="4">
                    {lang == 'EN'
                        ? 'Dividend Distribution   '
                        : 'البدء بتوزيع الارباح اعتبارا من تاريخ'}
                </option>
                <option value="5">
                    {lang == 'EN'
                        ? 'Dividend Distribution Date Amendment   '
                        : 'تغيير موعد البدء بتوزيع الارباح الى'}
                </option>
                <option value="7">
                    {lang == 'EN' ? 'Board of Directors Meeting   ' : 'مجلس الادارة يجتمع في'}
                </option>
                <option value="8">
                    {lang == 'EN'
                        ? 'Board of Directors Meeting Results'
                        : 'نتائج اجتماع مجلس الادارة    '}
                </option>
                <option value="9">
                    {lang == 'EN'
                        ? 'Financial Results   '
                        : 'النتائج المالية عن الفترة المنتهية في   '}
                </option>
                <option value="10">
                    {lang == 'EN'
                        ? 'Rescheduling Board of Directors Meeting   '
                        : 'تأجيل موعد اجتماع مجلس الادارة الى'}
                </option>
                <option value="11">
                    {lang == 'EN'
                        ? 'Board of Directors Meeting Date Amendment   '
                        : ' تغيير موعد اجتماع مجلس الادارة الى'}
                </option>
                <option value="12">
                    {lang == 'EN'
                        ? 'Board of Directors Membership Change'
                        : 'تغيير في مجلس الادارة'}
                </option>
                <option value="13">
                    {lang == 'EN' ? 'Formation of Board of Directors' : 'تشكيل مجلس الادارة  '}
                </option>
                <option value="14">
                    {lang == 'EN'
                        ? 'Election of New Board of Directors'
                        : 'فتح باب الترشيح لعضوية مجلس الادارة  '}
                </option>
                <option value="15">
                    {lang == 'EN' ? 'Board of Directors Resignation' : 'استقالة مجلس الادارة'}
                </option>
                <option value="16">
                    {lang == 'EN'
                        ? 'Board of Directors Recommendation for Voluntary Delisting'
                        : 'توصية مجلس الادارة بالانسحاب الاختياري من البورصة'}
                </option>
                <option value="17">
                    {lang == 'EN' ? 'Monthly Information   ' : 'المعلومات الشهرية     '}
                </option>
                <option value="18">
                    {lang == 'EN' ? 'Financial Report   ' : 'النتائج المالية     '}
                </option>
                <option value="19">
                    {lang == 'EN'
                        ? 'Unitholders Assembly Meeting      '
                        : 'جمعية حملة وحدات         '}
                </option>
                <option value="20">
                    {lang == 'EN' ? 'Dividend Distribution      ' : 'توزيع أرباح        '}
                </option>
                <option value="21">
                    {lang == 'EN'
                        ? 'Unitholders Assembly Meeting Date Amendment      '
                        : 'تغيير موعد جمعية حملة وحدات        '}
                </option>
                <option value="22">
                    {lang == 'EN'
                        ? 'Postponed Unitholders Assembly Meeting      '
                        : 'تأجيل موعد جمعية حملة وحدات        '}
                </option>
                <option value="23">
                    {lang == 'EN'
                        ? 'Disclosure regarding an unusual trades    '
                        : 'ايضاح بشأن التداول غير الاعتيادي'}
                </option>
                <option value="24">
                    {lang == 'EN' ? 'Judicial Decision Disclosure' : 'افصاح بشأن الدعاوى والاحكام'}
                </option>
                <option value="25">
                    {lang == 'EN' ? 'Credit Rating Disclosure' : 'افصاح بشأن التصنيف الائتماني'}
                </option>
                <option value="26">
                    {lang == 'EN' ? 'Listed Sukuk Disclosure' : 'افصاح بشأن صكوك مدرجة'}
                </option>
                <option value="27">
                    {lang == 'EN' ? 'Listed Bond Disclosure' : 'افصاح بشأن سندات مدرجة'}
                </option>
                <option value="28">
                    {lang == 'EN'
                        ? 'Treasury Share Sale/Purchase Request Approval'
                        : 'الموافقة على تجديد حق شراء أو بيع أسهم الشركة  '}
                </option>
                <option value="29">
                    {lang == 'EN'
                        ? 'Treasury Share Sale/Purchase Request Denial'
                        : 'عدم الموافقة على تجديد حق شراء أو بيع أسهم الشركة  '}
                </option>
                <option value="30">
                    {lang == 'EN'
                        ? 'CMA Voluntary Delisting Approval'
                        : 'موافقة هيئة أسواق المال بالانسحاب الاختياري من البورصة'}
                </option>
                <option value="31">
                    {lang == 'EN' ? 'Company Name Change   ' : 'تغيير اسم الشركة اعتبارا من '}
                </option>
                <option value="32">
                    {lang == 'EN' ? 'Ticker Name Change   ' : 'تغيير رمز تداول الشركة اعتبارا من'}
                </option>
                <option value="33">
                    {lang == 'EN'
                        ? 'Decrease in Major Shareholder Ownership'
                        : 'إنقاص ملكية مسيطر  في شركة مدرجة'}
                </option>
                <option value="34">
                    {lang == 'EN'
                        ? 'Material Information Disclosure   '
                        : 'افصاح معلومات جوهرية    '}
                </option>
                <option value="35">
                    {lang == 'EN' ? 'Supplementary Disclosure   ' : 'افصاح مكمل    '}
                </option>
                <option value="36">
                    {lang == 'EN' ? 'Disclosure Amendment    ' : 'افصاح تصحيحي    '}
                </option>
                <option value="39">
                    {lang == 'EN' ? 'Delisting Date' : '  موعد انسحاب الشركة من البورصة  '}
                </option>
                <option value="40">{lang == 'EN' ? '*Other*' : '*إعلانات اخرى*'}</option>
                <option value="41">
                    {lang == 'EN' ? 'Delisting Date' : '  موعد انسحاب الصندوق من البورصة     '}
                </option>
                <option value="60">
                    {lang == 'EN'
                        ? 'Capital Increase Call   '
                        : 'استدعاء زيادة رأس المال اعتبارا من'}
                </option>
                <option value="70">
                    {lang == 'EN' ? 'KSX 15 Index Review' : 'مراجعة مؤشر كويت 15'}
                </option>
                <option value="71">
                    {lang == 'EN' ? 'Suspension Date' : 'وقف التداول على أسهم الشركة'}
                </option>
                <option value="72">
                    {lang == 'EN' ? 'Activation Date' : 'إعادة التداول على أسهم الشركة'}
                </option>
                <option value="73">{lang == 'EN' ? 'Obligatory Executions' : ' تنفيذ جبري'}</option>
                <option value="74">
                    {lang == 'EN' ? 'Trades of 5% or Above' : 'تنفيذ صفقة 5% أو أكثر'}
                </option>
                <option value="75">
                    {lang == 'EN'
                        ? 'Trading after Capital Increase'
                        : 'تداول أسهم الشركة بعد زيادة رأس المال'}
                </option>
                <option value="76">
                    {lang == 'EN'
                        ? 'Trading without Bonus Shares'
                        : 'تداول أسهم الشركة بدون اسهم المنحة'}
                </option>
                <option value="77">
                    {lang == 'EN'
                        ? 'Trading after Capital Decrease'
                        : 'تداول أسهم الشركة بعد تخفيض رأس المال '}
                </option>
                <option value="78">{lang == 'EN' ? 'Official Holidays' : 'العطل الرسمية '}</option>
                <option value="79">
                    {lang == 'EN' ? 'Listing in Regular Market' : 'إدراج الشركة في السوق الرسمي'}
                </option>
                <option value="80">
                    {lang == 'EN' ? 'Listing in Parallel Market' : 'إدراج الشركة في السوق الموازي '}
                </option>
                <option value="81">
                    {lang == 'EN' ? 'Promotion to Regular Market' : 'رفع تصنيف الشركة للسوق الرسمي'}
                </option>
                <option value="82">
                    {lang == 'EN'
                        ? 'Demotion to Parallel Market'
                        : 'خفض تصنيف الشركة للسوق الموازي'}
                </option>
                <option value="83">
                    {lang == 'EN' ? 'Cum AGM Date' : 'حيازة السهم لحضور الجمعية '}
                </option>
                <option value="84">
                    {lang == 'EN' ? 'Record AGM Date' : 'تاريخ الاستحقاق لحضور الجمعية'}
                </option>
                <option value="85">
                    {lang == 'EN' ? 'Cum-Dividend Date' : 'تاريخ حيازة  السهم '}
                </option>
                <option value="86">
                    {lang == 'EN' ? 'Ex-Dividend Date' : 'تاريخ تداول السهم دون الاستحقاق'}
                </option>
                <option value="87">{lang == 'EN' ? 'Record Date' : 'تاريخ الاستحقاق'}</option>
                <option value="88">{lang == 'EN' ? 'Payment Date' : 'تاريخ التوزيع'}</option>
                <option value="89">
                    {lang == 'EN'
                        ? 'Unitholders Assembly Meeting    '
                        : ' جمعية حملة الوحدات تنعقد بتاريخ '}
                </option>
                <option value="90">
                    {lang == 'EN'
                        ? 'Unitholders Assembly Meeting Date Amendment     '
                        : 'تغيير موعد اجمعية حملة الوحدات الى  '}
                </option>
                <option value="91">
                    {lang == 'EN'
                        ? 'Postponed Unitholders Assembly Meeting     '
                        : 'جمعية حملة الوحدات (المؤجلة) تنعقد بتاريخ   '}
                </option>
                <option value="92">
                    {lang == 'EN'
                        ? 'Unitholders Assembly outcome'
                        : 'نتائج اجتماع جمعية حملة الوحدات'}
                </option>
                <option value="93">
                    {lang == 'EN' ? 'Committee Members Meeting    ' : 'الهيئة الادارية تجتمع في   '}
                </option>
                <option value="94">
                    {lang == 'EN'
                        ? 'Committee Members Meeting Results'
                        : 'نتائج اجتماع الهيئة الادارية    '}
                </option>
                <option value="95">
                    {lang == 'EN'
                        ? 'Rescheduling Committee Members Meeting     '
                        : 'تأجيل موعد اجتماع الهيئة الادارية الى  '}
                </option>
                <option value="96">
                    {lang == 'EN'
                        ? 'Committee Members Meeting Date Amendment     '
                        : '  تغيير موعد اجتماع الهيئة الادارية الى       '}
                </option>
                <option value="97">
                    {lang == 'EN'
                        ? 'Committee Members Membership Change'
                        : 'تغيير في الهيئة الادارية'}
                </option>
                <option value="98">
                    {lang == 'EN' ? 'Committee Members Resignation' : 'استقالة الهيئة الادارية'}
                </option>
                <option value="99">
                    {lang == 'EN'
                        ? 'Committee Members Recommendation for Voluntary Delisting'
                        : 'توصية الهيئة الادارية بالانسحاب الاختياري من البورصة'}
                </option>
                <option value="101">
                    {lang == 'EN' ? 'Transcript of the Analysts Conference' : 'محضر مؤتمر المحللين'}
                </option>
                <option value="110">
                    {lang == 'EN'
                        ? 'Annual general meeting outcome'
                        : 'نتائج اجتماع الجمعية العامة'}
                </option>
                <option value="120">
                    {lang == 'EN'
                        ? 'Corporate actions time table'
                        : 'الجدول الزمني لاستحقاقات الأسهم'}
                </option>
                <option value="130">
                    {lang == 'EN' ? 'Fund Name Change    ' : 'تغيير اسم الصندوق اعتبارا من  '}
                </option>
                <option value="131">
                    {lang == 'EN'
                        ? 'Decrease in Major Unitholder Ownership'
                        : 'إنقاص ملكية مسيطر  في صندوق'}
                </option>
                <option value="200">Off-Market Trades</option>
                <option value="300">Market Maker Announcement</option>
            </StyledSelect>{' '}
            </StyledSelectWrapper>
            <StyledButtonWrapper isMobile={isMobile}>
            <StyledButton onClick={() => onClearFilter()} isMobile={isMobile}>
                {lang == 'EN' ? 'Clear Filters' : 'مسح التصفية'}{' '}
            </StyledButton>
            <StyledButton onClick={() => onFilter()} bgColor={'#C5964A'} isMobile={isMobile}>
                {' '}
                {lang == 'EN' ? 'Filter' : 'تصفية البحث'}
            </StyledButton>
            </StyledButtonWrapper>
            <hr />
        </ToolbarWrapper>
    );
};
