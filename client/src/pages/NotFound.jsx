import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useT } from '../../context/ThemeContext';
import Button from '../ui/Button';

export default function NotFound() {
  const { T } = useT();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: T.bgCard,
          padding: '3rem',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: `1px solid ${T.border}`,
          maxWidth: 400,
          width: '100%'
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐕</div>
        <h1 style={{ color: T.textHeading, fontSize: '2rem', margin: '0 0 0.5rem 0' }}>404</h1>
        <h2 style={{ color: T.text, fontSize: '1.25rem', margin: '0 0 1rem 0' }}>Page Not Found</h2>
        <p style={{ color: T.textMuted, fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Oops! The page you're looking for seems to have wandered off. Let's get you back home.
        </p>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ width: '100%' }}>
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
