import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentTime } from '../../../hooks';
import styles from './DateTimeCard.module.css';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const DateTimeCard = () => {
  const now = useCurrentTime(1000);
  const [focusMins, setFocusMins] = useState(30);
  const [focusing, setFocusing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [viewDate, setViewDate] = useState(new Date());

  // Focus timer countdown
  useEffect(() => {
    if (!focusing) return;
    if (secondsLeft <= 0) { setFocusing(false); return; }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [focusing, secondsLeft]);

  const handleFocus = () => {
    setSecondsLeft(focusMins * 60);
    setFocusing(true);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; type: 'prev' | 'curr' | 'next' }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'curr' });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - firstDay - daysInMonth + 1, type: 'next' });
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

  return (
    <div className={styles.card}>
      {/* Clock */}
      <div className={styles.clockRow}>
        <div className={styles.timeGroup}>
          <span className={styles.timeDigits}>{h12}:{minutes}:{seconds}</span>
          <span className={styles.ampm}>{ampm}</span>
        </div>
        <div className={styles.dateLabel}>{dayName}, {dateStr}</div>
      </div>

      {/* Calendar */}
      <div className={styles.calendar}>
        <div className={styles.calHeader}>
          <span className={styles.monthYear}>{MONTHS[month]} {year}</span>
          <div className={styles.navBtns}>
            <button onClick={prevMonth} className={styles.navBtn} aria-label="Previous month">▲</button>
            <button onClick={nextMonth} className={styles.navBtn} aria-label="Next month">▼</button>
          </div>
        </div>

        <div className={styles.dayNames}>
          {DAYS.map(d => <span key={d} className={styles.dayName}>{d}</span>)}
        </div>

        <div className={styles.grid}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${year}-${month}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={styles.cells}
            >
              {cells.map((cell, i) => {
                const isToday = cell.type === 'curr'
                  && cell.day === todayDate
                  && month === todayMonth
                  && year === todayYear;
                return (
                  <span
                    key={i}
                    className={[
                      styles.cell,
                      cell.type !== 'curr' ? styles.dimCell : '',
                      isToday ? styles.today : ''
                    ].join(' ')}
                  >
                    {cell.day}
                  </span>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Focus Timer */}
      <div className={styles.focusRow}>
        {focusing ? (
          <div className={styles.countdown}>
            <span className={styles.countdownTime}>
              {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
            <button className={styles.stopBtn} onClick={() => setFocusing(false)}>■ Stop</button>
          </div>
        ) : (
          <>
            <button className={styles.minusBtn} onClick={() => setFocusMins(m => Math.max(5, m - 5))}>−</button>
            <span className={styles.focusLabel}>{focusMins} mins</span>
            <button className={styles.plusBtn} onClick={() => setFocusMins(m => Math.min(120, m + 5))}>+</button>
            <button className={styles.focusBtn} onClick={handleFocus}>▶ Focus</button>
          </>
        )}
      </div>
    </div>
  );
};

export default DateTimeCard;
