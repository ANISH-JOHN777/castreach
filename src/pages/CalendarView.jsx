import { useState } from 'react';
import { mockCalendarEvents } from '../mock-data/data';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Video } from 'lucide-react';
import './CalendarView.css';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // February 2024
    const [view, setView] = useState('month'); // month, week, day
    const [events] = useState(mockCalendarEvents);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getEventsForDay = (date) => {
        if (!date) return [];
        return events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear();
        });
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getEventTypeClass = (type) => {
        return type === 'recording' ? 'event-recording' : 'event-preparation';
    };

    const getStatusClass = (status) => {
        return status === 'confirmed' ? 'status-confirmed' : 'status-pending';
    };

    const days = getDaysInMonth(currentDate);
    const today = new Date();

    return (
        <div className="calendar-page">
            <div className="container">
                <div className="calendar-header">
                    <div>
                        <h1 className="calendar-title">Calendar</h1>
                        <p className="calendar-subtitle">Manage your podcast schedule</p>
                    </div>
                    <button className="btn btn-primary" onClick={goToToday}>
                        <CalendarIcon size={18} />
                        Today
                    </button>
                </div>

                <div className="calendar-controls">
                    <div className="month-navigation">
                        <button className="nav-btn" onClick={previousMonth}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="current-month">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button className="nav-btn" onClick={nextMonth}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="view-selector">
                        <button
                            className={view === 'month' ? 'active' : ''}
                            onClick={() => setView('month')}
                        >
                            Month
                        </button>
                        <button
                            className={view === 'week' ? 'active' : ''}
                            onClick={() => setView('week')}
                        >
                            Week
                        </button>
                        <button
                            className={view === 'day' ? 'active' : ''}
                            onClick={() => setView('day')}
                        >
                            Day
                        </button>
                    </div>
                </div>

                <div className="calendar-grid">
                    <div className="calendar-weekdays">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="weekday">{day}</div>
                        ))}
                    </div>

                    <div className="calendar-days">
                        {days.map((date, index) => {
                            const dayEvents = date ? getEventsForDay(date) : [];
                            const isToday = date &&
                                date.getDate() === today.getDate() &&
                                date.getMonth() === today.getMonth() &&
                                date.getFullYear() === today.getFullYear();

                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                                >
                                    {date && (
                                        <>
                                            <div className="day-number">{date.getDate()}</div>
                                            <div className="day-events">
                                                {dayEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className={`day-event ${getEventTypeClass(event.type)} ${getStatusClass(event.status)}`}
                                                        title={event.title}
                                                    >
                                                        <div className="event-time">
                                                            {formatTime(event.start)}
                                                        </div>
                                                        <div className="event-title">{event.title}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events List */}
                <div className="upcoming-events">
                    <h3>Upcoming Events</h3>
                    <div className="events-list">
                        {events.map(event => (
                            <div key={event.id} className={`event-card ${getEventTypeClass(event.type)}`}>
                                <div className="event-card-header">
                                    <div className={`event-status ${getStatusClass(event.status)}`}>
                                        {event.status}
                                    </div>
                                    <div className="event-type-icon">
                                        {event.type === 'recording' ? <Video size={18} /> : <Clock size={18} />}
                                    </div>
                                </div>
                                <h4>{event.title}</h4>
                                <div className="event-details">
                                    <div className="event-detail">
                                        <CalendarIcon size={16} />
                                        <span>{event.start.toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="event-detail">
                                        <Clock size={16} />
                                        <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                                    </div>
                                    <div className="event-detail">
                                        <User size={16} />
                                        <span>{event.guest} × {event.host}</span>
                                    </div>
                                </div>
                                <div className="event-actions">
                                    <button className="btn btn-secondary btn-sm">Reschedule</button>
                                    <button className="btn btn-primary btn-sm">Join</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="calendar-legend">
                    <div className="legend-item">
                        <div className="legend-color event-recording"></div>
                        <span>Recording Session</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color event-preparation"></div>
                        <span>Preparation Call</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color status-confirmed"></div>
                        <span>Confirmed</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color status-pending"></div>
                        <span>Pending</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
