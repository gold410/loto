import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

export default function Lottery({ filename }) {
  const navigate = useNavigate();
  const [winner, setWinner] = useState('');
  const [balls, setBalls] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bottomBalls, setBottomBalls] = useState([]);

  // confetti control
  const confettiDuration = 8000; // milliseconds
  const confettiTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  const containerSize = 300;
  const ballSize = 50;
  const totalBalls = 30;

  const randomLetter = () => {
    const hebrewLetters = 'אבגדהוזחטיכלמנסעפצקרשת';
    return hebrewLetters[Math.floor(Math.random() * hebrewLetters.length)];
  };

  const draw = async () => {
    if (!filename) {
      alert('בחר קובץ קודם!');
      return;
    }

    setDrawing(true);
    setWinner('');
    setBottomBalls([]);
    setShowConfetti(false);

    // 30 כדורים במיכל
    const initialBalls = Array.from({ length: totalBalls }).map((_, idx) => ({
      idx,
      letter: randomLetter(),
      hue: Math.random() * 360,
      x: 0,
      y: 0,
      isFlying: false,
      locked: false, 
    }));
    setBalls(initialBalls);

    try {
      const res = await API.get(`/draw/${filename}`);
      const name = res.data.name || '';
      name.split('').forEach(l =>
  console.log("הקוד של האות",l, l.charCodeAt(0))
);

      setWinner(name);

      setTimeout(() => {
        name.split('').forEach((letter, idx) => {
          console.log(`Processing letter: ${letter} at index ${idx}`);
          setTimeout(() => {
            setBalls(prev => {
              const availableIdx = Math.floor(Math.random() * prev.length);
              const newBalls = [...prev];
              console.log(`Changing ball ${availableIdx} from ${newBalls[availableIdx].letter} to ${letter}`);
              newBalls[availableIdx] = {
                ...newBalls[availableIdx],
                letter,
                isFlying: true,
                forceUpdate: Date.now(),
                isNameLetter: true
              };
              return newBalls;
            });

            setTimeout(() => {
              setBottomBalls(prev => [...prev, { letter, idx, hue: Math.random() * 360 }]);
             setBalls(prev => {
  const availableIdx = Math.floor(Math.random() * prev.length);
  const newBalls = [...prev];
  newBalls[availableIdx] = {
    ...newBalls[availableIdx],
    letter,
    isFlying: true,
    forceUpdate: Date.now(),
    isNameLetter: true
  };
  return newBalls;
});


              if (idx === name.length - 1) {
                setShowConfetti(true);
                setDrawing(false);
                // show confetti for confettiDuration then navigate to winner
                confettiTimeoutRef.current = setTimeout(() => {
                  setShowConfetti(false);
                  navigate(`/winner/${encodeURIComponent(name)}`);
                }, confettiDuration);
              }
            }, 1000);
          }, idx * 5000); // 5 שניות בין כל כדור
        });
      }, 5000);
    } catch (err) {
      console.error(err);
      alert('שגיאה בהגרלה');
      setDrawing(false);
    }
  };

  const ballsElements = balls.map(ball => {
    const radius = containerSize / 2 - ballSize / 2;
    
    // תנועה כאוטית לכל כיוון
    const randomX1 = (Math.random() - 0.5) * radius * 2;
    const randomY1 = (Math.random() - 0.5) * radius * 2;
    const randomX2 = (Math.random() - 0.5) * radius * 2;
    const randomY2 = (Math.random() - 0.5) * radius * 2;
    const randomX3 = (Math.random() - 0.5) * radius * 2;
    const randomY3 = (Math.random() - 0.5) * radius * 2;
    const randomX4 = (Math.random() - 0.5) * radius * 2;
    const randomY4 = (Math.random() - 0.5) * radius * 2;

    const animateProps = showConfetti
      ? { 
          x: (Math.random() - 0.5) * (containerSize - ballSize * 2), 
          y: containerSize / 2 - ballSize / 4 - (Math.random() * ballSize)
        }
      : ball.isFlying
      ? { x: containerSize / 2 + 100, y: 0 }
      : { 
          x: [0, randomX1, randomX2, randomX3, randomX4, 0], 
          y: [0, randomY1, randomY2, randomY3, randomY4, 0],
          rotate: [0, 180, 360, 540, 720]
        };

    const transitionProps = showConfetti
      ? { duration: 1, ease: 'easeOut' }
      : ball.isFlying
      ? { duration: 1.5, ease: 'easeInOut' }
      : { 
          duration: 0.3 + Math.random() * 0.3,
          repeat: Infinity, 
          ease: 'easeInOut',
          repeatType: 'loop'
        };

    return (
      <motion.div
key={`${ball.idx}-${ball.letter}-${ball.forceUpdate || 0}`}
        initial={false}
        style={{
          width: ballSize,
          height: ballSize,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, hsl(${ball.hue},70%,80%), hsl(${ball.hue},70%,60%), hsl(${ball.hue},70%,40%))`,
          boxShadow: `
            inset -4px -4px 8px rgba(0,0,0,0.2),
            inset 4px 4px 8px rgba(255,255,255,0.2),
            0 4px 8px rgba(0,0,0,0.2)
          `,
          position: 'absolute',
          top: containerSize / 2 - ballSize / 2,
          left: containerSize / 2 - ballSize / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#fff',
          fontSize: '1.5rem',
          fontFamily: '"Noto Sans Hebrew", sans-serif',
        }}
        animate={animateProps}
        transition={transitionProps}
      >
        <span style={{
          borderRadius: '3px',
          padding: '2px',
        }}>
          {ball.letter}
        </span>
      </motion.div>
    );
  });

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', position: 'relative' }}>
      <button
        onClick={draw}
        disabled={drawing}
        style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: drawing ? 'not-allowed' : 'pointer' }}
      >
        {drawing ? 'מגרילים...' : 'הגרל זוכה'}
      </button>

      <div
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: '50%',
          border: '6px solid #fff',
          margin: '40px auto',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          boxShadow: `
            0 0 40px rgba(168, 237, 234, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.2),
            0 8px 32px rgba(0, 0, 0, 0.2)
          `
        }}
      >
        {ballsElements}
      </div>

      {/* שורה אופקית מימין לשמאל */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '50px',
          marginBottom: '100px',
          position: 'relative'
        }}
      >
        {bottomBalls.map((ball, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ x: 0, y: -400 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                width: ballSize,
                height: ballSize,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, hsl(${ball.hue},70%,80%), hsl(${ball.hue},70%,60%), hsl(${ball.hue},70%,40%))`,
                boxShadow: `
                  inset -4px -4px 8px rgba(0,0,0,0.2),
                  inset 4px 4px 8px rgba(255,255,255,0.2),
                  0 4px 8px rgba(0,0,0,0.2)
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#fff',
                fontSize: '1.5rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
              
            >
              {ball.letter}
              
            </motion.div>
            
          );
          
        })}
      </div>

      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={true}
            numberOfPieces={300}
            gravity={0.2}
          />
        </div>
      )}
    </div>
  );
}