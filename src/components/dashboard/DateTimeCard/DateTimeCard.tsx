import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCurrentTime } from '../../../hooks';
import styles from './DateTimeCard.module.css';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const DateTimeCard = () => {
  const now = useCurrentTime(1000);
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; type: 'prev' | 'curr' | 'next'; dateObj: Date }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: 'prev', dateObj: new Date(year, month - 1, daysInPrevMonth - i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'curr', dateObj: new Date(year, month, d) });
  }
  while (cells.length % 7 !== 0) {
    const d = cells.length - firstDay - daysInMonth + 1;
    cells.push({ day: d, type: 'next', dateObj: new Date(year, month + 1, d) });
  }

  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = String(hours % 12 || 12).padStart(2, '0');
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToToday = () => setViewDate(new Date());

  const isCurrentMonth = month === todayMonth && year === todayYear;

  return (
    <div className={styles.calendarCard}>
      {/* 1. Time Header */}
      <div className={styles.clockHeader}>
        <span className={styles.timeValue}>{h12}:{minutes}:{seconds}</span>
        <span className={styles.period}>{ampm}</span>
      </div>

      {/* 2. Date Line */}
      <div className={styles.dateLine}>
        {dayName}, {dateStr}
      </div>

      <hr className={styles.divider} />

      {/* 3. Month Navigation */}
      <div className={styles.monthHeader}>
        <span className={styles.monthYearLabel}>{MONTHS[month]} {year}</span>
        <div className={styles.navBtns}>
          <button onClick={prevMonth} className={styles.navBtn} aria-label="Previous month">
            <FiChevronLeft />
          </button>
          <button onClick={nextMonth} className={styles.navBtn} aria-label="Next month">
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* 4. Calendar Grid */}
      <div className={styles.weekdays}>
        {DAYS.map(d => <span key={d} className={styles.dayName}>{d}</span>)}
      </div>

      <div className={styles.gridWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={styles.daysGrid}
          >
            {cells.map((cell, i) => {
              const isToday = cell.type === 'curr'
                && cell.day === todayDate
                && month === todayMonth
                && year === todayYear;
              return (
                <div
                  key={i}
                  className={[
                    styles.dayCell,
                    cell.type !== 'curr' ? styles.mutedDay : '',
                    isToday ? styles.today : ''
                  ].join(' ')}
                >
                  {cell.day}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DateTimeCard;
