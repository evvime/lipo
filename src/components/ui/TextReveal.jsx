import { motion } from 'motion/react';

/**
 * Kelime kelime beliren başlık animasyonu.
 * Her kelime bağımsız olarak animate edilir; animasyon takılsa bile
 * son durum daima opacity:1 olur, böylece metin asla görünmez kalmaz.
 *
 * @param {{ text?: string, className?: string }} props
 */
const TextReveal = ({ text = '', className = '' }) => {
  const words = text ? String(text).split(' ') : [];

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          style={{ marginRight: '0.25em' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default TextReveal;
