import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import styles from './DateTimeCard.module.css';

const DateTimeCard: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className={styles.dateTimeCard} padding="large">
      <h2 className={styles.time}>{formatTime(time)}</h2>
      <p className={styles.date}>{formatDate(time)}</p>
    </Card>
  );
};

export default DateTimeCard;
