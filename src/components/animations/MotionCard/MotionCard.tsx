import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import Card from '../../ui/Card';
import styles from './MotionCard.module.css';

interface MotionCardProps {
  children: ReactNode;
  /** Applied to the outer motion.div — use this for grid-column spans */
  className?: string;
  /** Applied to the inner Card — use for padding/style overrides */
  cardClassName?: string;
  delay?: number;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.4,
      ease: 'easeOut' as const
    }
  })
};

const MotionCard = ({ children, className, cardClassName, delay = 0 }: MotionCardProps) => {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={variants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`${styles.wrapper} ${className ?? ''}`}
    >
      <Card className={`${styles.card} ${cardClassName ?? ''}`}>
        {children}
      </Card>
    </motion.div>
  );
};

export default MotionCard;
