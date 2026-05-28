import { motion } from 'framer-motion';
import { useT } from '../../context/ThemeContext';

export default function Skeleton({ width = '100%', height = '1rem', borderRadius = '4px', style }) {
  const { T } = useT();
  
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 1,
        ease: 'easeInOut',
      }}
      style={{
        width,
        height,
        borderRadius,
        background: T.bgAlt,
        ...style,
      }}
    />
  );
}
