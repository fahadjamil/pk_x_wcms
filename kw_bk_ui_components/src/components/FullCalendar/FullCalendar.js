import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/ar-kw';
import { dateFormat } from '../../helper/date';
import Axios from 'axios';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../config/path';

import {
    monthNames,
    arabicMonths,
    daysOfTheWeek,
    daysOfTheWeekArabic,
    arabicNumbers,
    shortDaysOfTheWeek
} from '../../config/constants';

const BigCalendarWrapper = styled.div`
    @charset "UTF-8";
    .rbc-btn {
        color: inherit;
        font: inherit;
        margin: 0;
    }

    button.rbc-btn {
        overflow: visible;
        text-transform: none;
        -webkit-appearance: button;
        cursor: pointer;
    }

    button[disabled].rbc-btn {
        cursor: not-allowed;
    }

    button.rbc-input::-moz-focus-inner {
        border: 0;
        padding: 0;
    }

    .rbc-calendar {
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .rbc-calendar *,
    .rbc-calendar *:before,
    .rbc-calendar *:after {
        box-sizing: inherit;
    }

    .rbc-abs-full,
    .rbc-row-bg {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .rbc-ellipsis,
    .rbc-event-label,
    .rbc-row-segment .rbc-event-content,
    .rbc-show-more {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .rbc-rtl {
        direction: rtl;
    }

    .rbc-off-range {
        color: #999999;
    }

    .rbc-off-range-bg {
        background: #e6e6e6 !important;
    }

    .rbc-header {
        overflow: hidden;
        flex: 1 0 0%;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 3px;
        vertical-align: middle;
        font-size: 90%;
        min-height: 0;
        border-bottom: 0px solid #ddd;
        color: #c5964a;
        margin: 4px;
        text-align: right;
        font-weight: 600;
    }
    .rbc-header + .rbc-header {
        border-left: 0px solid #ddd;
    }
    .rbc-rtl .rbc-header + .rbc-header {
        border-left-width: 0;
        border-right: 0px solid #ddd;
    }
    .rbc-header > a,
    .rbc-header > a:active,
    .rbc-header > a:visited {
        color: inherit;
        text-decoration: none;
    }

    .rbc-row-content {
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        z-index: 4;
        height: 500px;
    }

    .rbc-today {
        background-color: #fcf8e3;
    }

    .rbc-toolbar {
        flex-wrap: wrap;
        text-align: center;
        margin-bottom: 10px;
        font-size: 16px;
        ${(props) =>
          props.isMobile
            ? ""
            : "display:flex; justify-content: center;align-items: center;"}
      }
    .rbc-toolbar .rbc-toolbar-label {
        flex-grow: 1;
        padding: 0 10px;
        text-align: center;
        font-size: 1.5em;
        font-weight: 600;
    }
    .rbc-toolbar button {
        color: #373a3c;
        display: inline-block;
        margin: 0;
        text-align: center;
        vertical-align: middle;
        background: none;
        background-image: none;
        border: 1px solid #ccc;
        padding: 0.375rem 1rem;
        border-radius: 7px;
        line-height: normal;
        white-space: nowrap;
        font-weight: 600;
    }
    .rbc-toolbar button:active,
    .rbc-toolbar button.rbc-active {
        background-image: none;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0);
        color: #c5964a;
        border-color: #adadad;
    }
    .rbc-toolbar button:active:hover,
    .rbc-toolbar button:active:focus,
    .rbc-toolbar button.rbc-active:hover,
    .rbc-toolbar button.rbc-active:focus {
        color: #373a3c;
        background-color: #d4d4d4;
    }
    .rbc-toolbar button:focus {
        color: #373a3c;
        background-color: #e6e6e6;
    }
    .rbc-toolbar button:hover {
        color: #373a3c;
        background-color: #e6e6e6;
    }

    .rbc-btn-group {
        display: inline-block;
        white-space: nowrap;
        ${(props) =>
            props.isMobile
              ? "margin-top: 10px;margin-bottom: 10px; padding: 0 10px; width: 100%;"
              : ""}
    }
    .rbc-btn-group > button:first-child:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .rbc-btn-group > button:last-child:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .rbc-rtl .rbc-btn-group > button:first-child:not(:last-child) {
        border-radius: 4px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .rbc-rtl .rbc-btn-group > button:last-child:not(:first-child) {
        border-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .rbc-btn-group > button:not(:first-child):not(:last-child) {
        border-radius: 0;
    }
    .rbc-btn-group button + button {
        margin-left: -1px;
    }
    .rbc-rtl .rbc-btn-group button + button {
        margin-left: 0;
        margin-right: -1px;
    }
    .rbc-btn-group + .rbc-btn-group,
    .rbc-btn-group + button {
        margin-left: 10px;
    }

    .rbc-event {
        border: none;
        box-sizing: border-box;
        box-shadow: none;
        margin: 0;
        padding: 2px 5px;
        background-color: #c5964a;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        width: 100%;
        text-align: left;
        a {
            color: white;
            text-decoration: none;
        }
    }
    .rbc-slot-selecting .rbc-event {
        cursor: inherit;
        pointer-events: none;
    }
    .rbc-event.rbc-selected {
        background-color: #265985;
    }
    .rbc-event:focus {
        outline: 5px auto #3b99fc;
    }

    .rbc-event-label {
        font-size: 80%;
    }

    .rbc-event-overlaps {
        box-shadow: -1px 1px 5px 0px rgba(51, 51, 51, 0.5);
    }

    .rbc-event-continues-prior {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .rbc-event-continues-after {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .rbc-event-continues-earlier {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .rbc-event-continues-later {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .rbc-row {
        display: flex;
        flex-direction: row;
    }

    .rbc-row-segment {
        padding: 0 1px 1px 1px;
    }

    .rbc-selected-cell {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .rbc-show-more {
        background-color: rgba(255, 255, 255, 0.3);
        z-index: 4;
        font-weight: bold;
        font-size: 85%;
        height: auto;
        line-height: normal;
    }

    .rbc-month-view {
        position: relative;
        border: 0px solid #ddd;
        display: flex;
        flex-direction: column;
        flex: 1 0 0;
        width: 100%;
        user-select: none;
        -webkit-user-select: none;
        height: 100%;
        ${(props) => (props.isMobile ? "margin-top: 10px;" : "")}
    }

    .rbc-month-header {
        display: flex;
        flex-direction: row;
    }

    .rbc-month-row {
        display: flex;
        position: relative;
        flex-direction: column;
        flex: 1 0 0;
        flex-basis: 0px;
        overflow: hidden;
        height: 100%;
    }
    .rbc-month-row + .rbc-month-row {
        border-top: 0px solid #ddd;
    }

    .rbc-date-cell {
        flex: 1 1 0;
        min-width: 0;
        padding-right: 15px;
        padding-top: 10px;
        text-align: right;
    }
    .rbc-date-cell.rbc-now {
        font-weight: bold;
    }
    .rbc-date-cell > a,
    .rbc-date-cell > a:active,
    .rbc-date-cell > a:visited {
        color: inherit;
        text-decoration: none;
    }

    .rbc-row-bg {
        display: flex;
        flex-direction: row;
        flex: 1 0 0;
        overflow: hidden;
    }

    .rbc-day-bg {
        flex: 1 0 0%;
        margin: 2px;
        border-radius: 15px;
        border: 1px solid #ddd;
    }
    .event-date {
        background: #dfddd0 !important;
    }
    .rbc-day-bg + .rbc-day-bg {
        border-left: 1px solid #ddd;
    }
    .rbc-rtl .rbc-day-bg + .rbc-day-bg {
        border-left-width: 0;
        border-right: 1px solid #ddd;
    }

    .rbc-overlay {
        position: absolute;
        z-index: 5;
        border: 1px solid #e5e5e5;
        background-color: #fff;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
        padding: 10px;
    }
    .rbc-overlay > * + * {
        margin-top: 1px;
    }

    .rbc-overlay-header {
        border-bottom: 1px solid #e5e5e5;
        margin: -10px -10px 5px -10px;
        padding: 2px 10px;
    }

    .rbc-agenda-view {
        display: flex;
        flex-direction: column;
        flex: 1 0 0;
        overflow: auto;
    }
    .rbc-agenda-view table.rbc-agenda-table {
        width: 100%;
        border: 1px solid #ddd;
        border-spacing: 0;
        border-collapse: collapse;
    }
    .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
        padding: 5px 10px;
        vertical-align: top;
    }
    .rbc-agenda-view table.rbc-agenda-table .rbc-agenda-time-cell {
        padding-left: 15px;
        padding-right: 15px;
        text-transform: lowercase;
    }
    .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td {
        border-left: 1px solid #ddd;
    }
    .rbc-rtl .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td {
        border-left-width: 0;
        border-right: 1px solid #ddd;
    }
    .rbc-agenda-view table.rbc-agenda-table tbody > tr + tr {
        border-top: 1px solid #ddd;
    }
    .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
        padding: 3px 5px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    .rbc-rtl .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
        text-align: right;
    }

    .rbc-agenda-time-cell {
        text-transform: lowercase;
    }
    .rbc-agenda-time-cell .rbc-continues-after:after {
        content: ' »';
    }
    .rbc-agenda-time-cell .rbc-continues-prior:before {
        content: '« ';
    }

    .rbc-agenda-date-cell,
    .rbc-agenda-time-cell {
        white-space: nowrap;
    }

    .rbc-agenda-event-cell {
        width: 100%;
    }

    .rbc-time-column {
        display: flex;
        flex-direction: column;
        min-height: 100%;
    }
    .rbc-time-column .rbc-timeslot-group {
        flex: 1;
    }

    .rbc-timeslot-group {
        border-bottom: 1px solid #ddd;
        min-height: 40px;
        display: flex;
        flex-flow: column nowrap;
    }

    .rbc-time-gutter,
    .rbc-header-gutter {
        flex: none;
    }

    .rbc-label {
        padding: 0 5px;
    }

    .rbc-day-slot {
        position: relative;
    }
    .rbc-day-slot .rbc-events-container {
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        margin-right: 10px;
        top: 0;
    }
    .rbc-day-slot .rbc-events-container.rbc-rtl {
        left: 10px;
        right: 0;
    }
    .rbc-day-slot .rbc-event {
        border: 1px solid #265985;
        display: flex;
        max-height: 100%;
        min-height: 20px;
        flex-flow: column wrap;
        align-items: flex-start;
        overflow: hidden;
        position: absolute;
    }
    .rbc-day-slot .rbc-event-label {
        flex: none;
        padding-right: 5px;
        width: auto;
    }
    .rbc-day-slot .rbc-event-content {
        width: 100%;
        flex: 1 1 0;
        word-wrap: break-word;
        line-height: 1;
        height: 100%;
        min-height: 1em;
    }
    .rbc-day-slot .rbc-time-slot {
        border-top: 1px solid #f7f7f7;
    }

    .rbc-time-view-resources .rbc-time-gutter,
    .rbc-time-view-resources .rbc-time-header-gutter {
        position: sticky;
        left: 0;
        background-color: white;
        border-right: 1px solid #ddd;
        z-index: 10;
        margin-right: -1px;
    }

    .rbc-time-view-resources .rbc-time-header {
        overflow: hidden;
    }

    .rbc-time-view-resources .rbc-time-header-content {
        min-width: auto;
        flex: 1 0 0;
        flex-basis: 0px;
    }

    .rbc-time-view-resources .rbc-time-header-cell-single-day {
        display: none;
    }

    .rbc-time-view-resources .rbc-day-slot {
        min-width: 140px;
    }

    .rbc-time-view-resources .rbc-header,
    .rbc-time-view-resources .rbc-day-bg {
        width: 140px;
        flex: 1 1 0;
        flex-basis: 0 px;
    }

    .rbc-time-header-content + .rbc-time-header-content {
        margin-left: -1px;
    }

    .rbc-time-slot {
        flex: 1 0 0;
    }
    .rbc-time-slot.rbc-now {
        font-weight: bold;
    }

    .rbc-day-header {
        text-align: center;
    }

    .rbc-slot-selection {
        z-index: 10;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 75%;
        width: 100%;
        padding: 3px;
    }

    .rbc-slot-selecting {
        cursor: move;
    }

    .rbc-time-view {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        border: 1px solid #ddd;
        min-height: 0;
    }
    .rbc-time-view .rbc-time-gutter {
        white-space: nowrap;
    }
    .rbc-time-view .rbc-allday-cell {
        box-sizing: content-box;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .rbc-time-view .rbc-allday-cell + .rbc-allday-cell {
        border-left: 1px solid #ddd;
    }
    .rbc-time-view .rbc-allday-events {
        position: relative;
        z-index: 4;
    }
    .rbc-time-view .rbc-row {
        box-sizing: border-box;
        min-height: 20px;
    }

    .rbc-time-header {
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
    }
    .rbc-time-header.rbc-overflowing {
        border-right: 1px solid #ddd;
    }
    .rbc-rtl .rbc-time-header.rbc-overflowing {
        border-right-width: 0;
        border-left: 1px solid #ddd;
    }
    .rbc-time-header > .rbc-row:first-child {
        border-bottom: 1px solid #ddd;
    }
    .rbc-time-header > .rbc-row.rbc-row-resource {
        border-bottom: 1px solid #ddd;
    }

    .rbc-time-header-cell-single-day {
        display: none;
    }

    .rbc-time-header-content {
        flex: 1;
        display: flex;
        min-width: 0;
        flex-direction: column;
        border-left: 1px solid #ddd;
    }
    .rbc-rtl .rbc-time-header-content {
        border-left-width: 0;
        border-right: 1px solid #ddd;
    }
    .rbc-time-header-content > .rbc-row.rbc-row-resource {
        border-bottom: 1px solid #ddd;
        flex-shrink: 0;
    }

    .rbc-time-content {
        display: none;
    }
`;

export const FullCalendar = (props) => {
    const { filters } = props || {};
    const { lang } = props || 'EN';
    const { isMobile } = props;

    if (lang === 'EN') {
        moment.updateLocale('en-gb', {
            week: {
                dow: 0,
            },
        });
    } else if (lang === 'AR') {
        moment.locale('ar-kw');
    }
    const localizer = momentLocalizer(moment);

    const [eventData, setEventData] = useState([]);
    const todayDate = new Date();
    const [dateToFetch, setDateToFetch] = useState({
        month: todayDate.getMonth(),
        year: todayDate.getFullYear(),
    });
    useEffect(() => {
        if (dateToFetch) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    L: lang == 'EN' ? 'E' : 'A',
                    RT: 3513,
                    Y: dateToFetch.year,
                    M: dateToFetch.month + 1,
                    ...filters,
                },
            }).then((res) => setEventData(mapDatatoState(res.data)));
        }
    }, [dateToFetch, filters]);

    const mapDatatoState = (eventArray) =>
        (eventArray &&
            eventArray.map((event) => ({
                title: event.Title,
                date: dateFormat(event.PostedDate),
                allDay: true,
                NewsID: event.NewsID,
                DisplayTicker: event.DisplayTicker,
            }))) ||
        [];

    const handleNavigation = (e) => {
        if (dateToFetch.month != e.getMonth() || dateToFetch.year != e.getFullYear()) {
            setDateToFetch({ month: e.getMonth(), year: e.getFullYear() });
        }
    };
    const setEventTitle = (e) => (
        <a href={`/en/news/view#${e.NewsID}`}>{`${e.DisplayTicker || ''} - ${e.title}`}</a>
    );
    const setBgClassName = (dateSlot) =>
        eventData &&
        eventData.find(
            (event) =>
                event.date.getDate() == dateSlot.getDate() &&
                event.date.getMonth() == dateSlot.getMonth()
        ) && {
            className: 'event-date',
        };

    let convertToArabicDigits = (str) => {
        if (typeof str != 'string') {
            str = str.toString();
        }
        let westernDigits = str.split('');
        let arabicDigits = westernDigits.map((digit) => arabicNumbers[parseInt(digit)]);
        return arabicDigits.join('');
    };

    const convertByLang = (arText, enText) => (lang === 'AR' ? arText : enText);
    const buttonMessages = {
        month: convertByLang('الشهر', 'Month'),
        week: convertByLang('الأسبوع', 'Week'),
        day: convertByLang('اليوم', 'Day'),
        next: '>',
        previous: '<',
        today: convertByLang('اليوم', 'Today'),
        showMore: (a) => <span>{convertByLang('أكثر', '+ More')}</span>,
    };
    const weekRangeHeader = (range) => {
        if (range.start.getMonth() == range.end.getMonth()) {
            return lang == 'AR'
                ? `${arabicMonths[range.start.getMonth()]} ${convertToArabicDigits(
                      range.start.getDate()
                  )} - ${convertToArabicDigits(range.end.getDate())}`
                : `${
                      monthNames[range.start.getMonth()]
                  } ${range.start.getDate()} - ${range.end.getDate()}`;
        } else {
            return lang == 'AR'
                ? `${arabicMonths[range.start.getMonth()]} ${convertToArabicDigits(
                      range.start.getDate()
                  )} - ${arabicMonths[range.end.getMonth()]} ${convertToArabicDigits(
                      range.end.getDate()
                  )}`
                : `${monthNames[range.start.getMonth()]} ${range.start.getDate()} - ${
                      monthNames[range.end.getMonth()]
                  } ${range.end.getDate()}`;
        }
    };

    const formats = {
        dateFormat: (date) => {
            return lang == 'AR' ? convertToArabicDigits(date.getDate()) : `${date.getDate()}`;
        },
        monthHeaderFormat: (month) =>
            lang == 'AR'
                ? `${arabicMonths[month.getMonth()]} ${month.getFullYear()}`
                : `${monthNames[month.getMonth()]} ${month.getFullYear()}`,
        weekdayFormat: (week) =>
            lang == 'AR' ? daysOfTheWeekArabic[week.getDay()] : shortDaysOfTheWeek[week.getDay()],
        dayFormat: (day) =>
            lang == 'AR'
                ? `${daysOfTheWeekArabic[day.getDay()]} ${convertToArabicDigits(day.getDate())}`
                : `${daysOfTheWeek[day.getDay()]} ${day.getDate()}`,
        dayHeaderFormat: (day) =>
            lang == 'AR'
                ? `${daysOfTheWeekArabic[day.getDay()]} ${
                      arabicMonths[day.getMonth()]
                  } ${convertToArabicDigits(day.getDate())}`
                : `${daysOfTheWeek[day.getDay()]} ${monthNames[day.getMonth()]} ${day.getDate()}`,
        dayRangeHeaderFormat: (range) => weekRangeHeader(range),
    };

    return (
        <BigCalendarWrapper isMobile={isMobile}>
            <Calendar
                views={['day', 'week', 'month']}
                localizer={localizer}
                events={eventData}
                startAccessor="date"
                endAccessor="date"
                style={{ height: isMobile ? 600 : 800 }}
                onNavigate={handleNavigation}
                titleAccessor={setEventTitle}
                getNow={() => todayDate}
                dayPropGetter={setBgClassName}
                formats={formats}
                rtl={lang == 'ar'}
                messages={buttonMessages}
            />
        </BigCalendarWrapper>
    );
};
