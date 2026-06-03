const fs = require('fs');
const path = require('path');

const animDir = path.join(__dirname, 'src', 'components', 'animations');
if (!fs.existsSync(animDir)) fs.mkdirSync(animDir, { recursive: true });

const components = [
  {
    name: 'PageTransition',
    tsx: `import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
};

const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
      style={{ minWidth: 0, wordBreak: 'break-word' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
`,
    css: ``
  },
  {
    name: 'AnimatedBackground',
    tsx: `import { motion } from 'framer-motion';
import styles from './AnimatedBackground.module.css';
import { cn } from '../../../utils';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground = ({ className }: AnimatedBackgroundProps) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <motion.div 
        className={styles.blob1}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className={styles.blob2}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.8, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
`,
    css: `.wrapper {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: var(--bg-primary);
  pointer-events: none;
}

.blob1, .blob2 {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  mix-blend-mode: multiply;
}

.blob1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: var(--accent-primary);
  opacity: 0.15;
}

.blob2 {
  bottom: -20%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: var(--accent-secondary, #3a82f6);
  opacity: 0.1;
}

:global(.dark) .blob1, :global(.dark) .blob2 {
  mix-blend-mode: screen;
  opacity: 0.08;
}
`
  },
  {
    name: 'MotionCard',
    tsx: `import { motion } from 'framer-motion';
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
      ease: 'easeOut'
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
      <Card className={className} style={{ height: '100%' }}>
        {children}
      </Card>
    </motion.div>
  );
};

export default MotionCard;
`,
    css: ``
  }
];

components.forEach(comp => {
  const compDir = path.join(animDir, comp.name);
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });
  
  fs.writeFileSync(path.join(compDir, comp.name + '.tsx'), comp.tsx);
  if (comp.css) {
    fs.writeFileSync(path.join(compDir, comp.name + '.module.css'), comp.css);
  }
  fs.writeFileSync(path.join(compDir, 'index.ts'), "export { default } from './" + comp.name + "';\n");
});

console.log('Animation shells generated!');
