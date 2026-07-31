'use client'

import { isSameDay } from '@/app/common/dateUtils'
import styles from '@/app/globals.module.css'
import { useCalendarView } from './hooks/useCalendarView'
import CalendarSelectedEventsList from './CalendarSelectedEventsList'

const CalendarView = () => {
    const {
        loading,
        error,
        calendarMonth,
        selectedDate,
        calendarDays,
        eventAmounts,
        selectedDayEvents,
        setCalendarMonth,
        setSelectedDate,
        getDayKey,
        refreshEvents,
    } = useCalendarView()

    if (loading) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading events...</p>
    }

    if (error) {
        return <p style={{ marginTop: '1rem', opacity: 0.9, color: 'red' }}>{error}</p>
    }

    return (
        <div className={styles.calendarShell}>
            <div className={styles.calendarHeader}>
                <button
                    type="button"
                    className={styles.calendarNavButton}
                    onClick={() =>
                        setCalendarMonth(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                        )
                    }
                >
                    &lt;&lt;
                </button>
                <h3>
                    {calendarMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </h3>
                <button
                    type="button"
                    className={styles.calendarNavButton}
                    onClick={() =>
                        setCalendarMonth(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                        )
                    }
                >
                    &gt;&gt;
                </button>
            </div>
            <div className={styles.calendarGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                    <div key={label} className={styles.calendarWeekday}>
                        {label}
                    </div>
                ))}
                {calendarDays.map((day) => {
                    const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false
                    const eventsAmount = eventAmounts.get(getDayKey(day.date)) ?? 0

                    return (
                        <button
                            key={`${day.date.toISOString()}-${day.inMonth ? 'in' : 'out'}`}
                            type="button"
                            className={`${styles.calendarDayButton} ${day.inMonth ? '' : styles.calendarDayButtonOutOfMonth} ${isSelected ? styles.calendarDayButtonSelected : ''} ${eventsAmount > 0 ? styles.calendarDayButtonHasEvents : ''}`.trim()}
                            onClick={() => setSelectedDate(day.date)}
                            aria-label={`Select day ${day.date.getDate()}`}
                        >
                            <span>{day.date.getDate()}</span>
                            {eventsAmount > 0 && `${eventsAmount} event(s)`}
                        </button>
                    )
                })}
            </div>
            <div className={styles.calendarDayPanel}>
                <h3>
                    {selectedDate
                        ? selectedDate.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                          })
                        : 'Selected day'}
                </h3>
                <CalendarSelectedEventsList events={selectedDayEvents} onRefresh={refreshEvents} />
            </div>
        </div>
    )
}

export default CalendarView
