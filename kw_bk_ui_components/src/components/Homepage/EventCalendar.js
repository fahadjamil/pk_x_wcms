import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import Axios from 'axios';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';
import { getDate } from '../../helper/date';
import { marketBackEndProxyPass } from '../../config/path';
import { setLanguage } from '../../helper/metaData';
import {
    eventCalendarLink,
    newsDetailLink,
    shortDaysOfTheWeek,
    daysOfTheWeekArabic,
    monthNames,
    arabicMonths,
} from '../../config/constants';

const DateBullet = styled.span`
    display: inline-block;
    text-align: center;
    width: 38px;
    background: #c69449;
    padding: 7px;
    border-radius: 100%;
    color: white;
`;
const EventTitle = styled.span`
    padding-left: 10px;
    .event-detail-ticker {
        color: #c69449;
        font-weight: 700;
    }
`;

const EventCalendarWraper = styled.div`
    display: flex;
    height: 350px;
`;
const EventItem = styled.div`
    margin-bottom: 20px;
`;

const CalendarWrapper = styled.div`
    width: 400px;
    margin-left: 30px;

    .react-calendar {
        border: 0px;
        width: 350px;
        max-width: 100%;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.125em;
    }
    .react-calendar--doubleView {
        width: 700px;
    }
    .react-calendar--doubleView .react-calendar__viewContainer {
        display: flex;
        margin: -0.5em;
    }
    .react-calendar--doubleView .react-calendar__viewContainer > * {
        width: 50%;
        margin: 0.5em;
    }
    .react-calendar,
    .react-calendar *,
    .react-calendar *:before,
    .react-calendar *:after {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    .react-calendar button {
        margin: 0;
        border: 0;
        outline: none;
    }
    .react-calendar button:enabled:hover {
        cursor: pointer;
    }
    .react-calendar__navigation {
        height: 44px;
        margin-bottom: 1em;
    }
    .react-calendar__navigation button {
        min-width: 44px;
        background: none;
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
        background-color: #e6e6e6;
    }
    .react-calendar__navigation button[disabled] {
        background-color: #f0f0f0;
    }
    .react-calendar__month-view__weekdays {
        text-align: center;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.75em;
    }
    .react-calendar__month-view__weekdays__weekday {
        padding: 0.5em;
    }
    .react-calendar__month-view__weekNumbers {
        font-weight: bold;
    }
    .react-calendar__month-view__weekNumbers .react-calendar__tile {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75em;
        padding: calc(0.75em / 0.75) calc(0.5em / 0.75);
    }
    .react-calendar__month-view__days__day--weekend {
        color: #d10000;
    }
    .react-calendar__month-view__days__day--neighboringMonth {
        color: #757575;
    }
    .react-calendar__year-view .react-calendar__tile,
    .react-calendar__decade-view .react-calendar__tile,
    .react-calendar__century-view .react-calendar__tile {
        padding: 2em 0.5em;
    }
    .react-calendar__tile {
        max-width: 100%;
        text-align: center;
        padding: 0.75em 0.5em;
        background: none;
    }
    .react-calendar__tile:disabled {
        background-color: #f0f0f0;
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
        background-color: #e6e6e6;
    }

    .react-calendar--selectRange .react-calendar__tile--hover {
        background-color: #e6e6e6;
    }

    .highlight {
        color: #ffff !important;
        background-color: #c69449 !important;
        border-radius: 100%;
        padding: 15px;
    }
    .normal {
        border-radius: 100%;
    }
`;
const EventDetailWrapper = styled.div`
    display: inline-block;
    padding-top: 70px;
`;

export const EventCalendar = (props) => {
    const { commonConfigs, lang } = props;

    const [eventData, setEventData] = useState([]);
    const [highlightDates, setHighlightDates] = useState([]);
    const today = new Date();

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3513,
                Y: today.getFullYear(),
                M: today.getMonth() + 1,
                L: setLanguage(lang),
            },
        }).then((res) => {
            setEventData(closestEvents(res.data));
            setHighlightDates(res.data.map((event) => getDate(event.PostedDate)));
        });
    }, []);

    const closestEvents = (eventData) => {
        let events = eventData.sort((a, b) => a.PostedDate - b.PostedDate);
        if (events.length >= 5) {
            let futureEvents = events.filter(
                (event) => getDate(event.PostedDate) >= today.getDate()
            );

            return futureEvents.length < 5 ? events.slice(-5) : futureEvents.slice(0, 5);
        } else {
            return events;
        }
    };

    const handleDayClick = (e) => {
        if (typeof window !== 'undefined') {
            window.location = eventCalendarLink(lang);
        }
    };

    return null && commonConfigs && commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Summary of Events" />
    ) : (
        <EventCalendarWraper>
            <CalendarWrapper className="calendar-view">
                <h2 className="text-xl text-dark font-semibold">
                    {lang.langKey == 'EN'
                        ? monthNames[today.getMonth()]
                        : arabicMonths[today.getMonth()]}{' '}
                    {today.getFullYear()}
                </h2>
                <Calendar
                    tileClassName={({ date }) => {
                        if (
                            highlightDates.find(
                                (x) => x === date.getDate() && date.getMonth() === today.getMonth()
                            )
                        ) {
                            return 'highlight';
                        } else {
                            return 'normal';
                        }
                    }}
                    showNavigation={false}
                    calendarType="Hebrew"
                    onClickDay={handleDayClick}
                    formatShortWeekday={(locale, date) =>
                        lang.langKey == 'EN'
                            ? shortDaysOfTheWeek[date.getDay()]
                            : daysOfTheWeekArabic[date.getDay()]
                    }
                />
            </CalendarWrapper>
            <EventDetailWrapper className="calendar-detail">
                {eventData
                    .map((event) => (
                        <EventItem>
                            <DateBullet> {getDate(event.PostedDate)}</DateBullet>
                            <EventTitle>
                                <a href={newsDetailLink(event.NewsID, lang)}>
                                    <span className="event-detail-ticker">
                                        {event.DisplayTicker ? `    ${event.DisplayTicker} - ` : ''}
                                    </span>{' '}
                                    {event.Title}
                                </a>
                            </EventTitle>
                        </EventItem>
                    ))
                    }
            </EventDetailWrapper>
        </EventCalendarWraper>
    );
};
