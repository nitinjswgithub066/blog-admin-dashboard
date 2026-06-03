import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import Card from '../../ui/Card';

interface MotionCardProps {
  children: ReactNode;
  className?: string;
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

const MotionCard = ({ children, className, delay = 0 }: MotionCardProps) => {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={variants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  );
};

export default MotionCard;
