import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type SplitTextProps = {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: Record<string, string | number>;
  animationTo?: Record<string, string | number>;
  easing?: any;
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
};

const SplitText: React.FC<SplitTextProps> = ({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0px,0)' },
  easing = 'easeOut',
  threshold = 0.15,
  rootMargin = '0px',
  onAnimationComplete
}) => {
  const letters = text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', margin: 0 }}>
      {letters.map((char, index) => {
        return (
          <motion.span
            key={index}
            initial={animationFrom}
            animate={inView ? animationTo : animationFrom}
            transition={{
              delay: (index * delay) / 1000,
              ease: easing,
              duration: 0.6
            }}
            onAnimationComplete={index === letters.length - 1 ? onAnimationComplete : undefined}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              willChange: 'transform, opacity'
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
};

export default SplitText;
