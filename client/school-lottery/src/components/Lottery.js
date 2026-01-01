import React, { useState } from 'react';
import API from '../api';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

export default function Lottery({ filename }) {
  const [winner, setWinner] = useState('');
  const [balls, setBalls] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bottomBalls, setBottomBalls] = useState([]);

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
    }));
    setBalls(initialBalls);

    try {
      const res = await API.get(`/draw/${filename}`);
      const name = res.data.name || '';
      setWinner(name);

      setTimeout(() => {
        name.split('').forEach((letter, idx) => {
          setTimeout(() => {
            setBalls(prev => {
              const availableIdx = Math.floor(Math.random() * prev.length);
              const newBalls = [...prev];
              newBalls[availableIdx] = {
                ...newBalls[availableIdx],
                letter,
                isFlying: true,
              };
              return newBalls;
            });

            setTimeout(() => {
              setBottomBalls(prev => [...prev, { letter, idx }]);
              setBalls(prev =>
                prev.map(b => (b.isFlying ? { ...b, isFlying: false } : b))
              );

              if (idx === name.length - 1) {
                setShowConfetti(true);
                setDrawing(false);
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
      ? { x: 0, y: 0 } // עצירה כשיש קונפטי
      : ball.isFlying
      ? { x: 0, y: containerSize / 2 + 60 } // למטה
      : { 
          x: [0, randomX1, randomX2, randomX3, randomX4, 0], 
          y: [0, randomY1, randomY2, randomY3, randomY4, 0],
          rotate: [0, 180, 360, 540, 720]
        };

    const transitionProps = showConfetti
      ? { duration: 0.3, ease: 'easeOut' } // עצירה מהירה
      : ball.isFlying
      ? { duration: 2, ease: 'easeInOut' } // יותר איטי לכדורים שטסים
      : { 
          duration: 0.5 + Math.random() * 0.5, // מהירות רנדומלית מהירה יותר
          repeat: Infinity, 
          ease: 'easeInOut',
          repeatType: 'loop'
        };

    return (
      <motion.div
        key={`${ball.idx}-${showConfetti ? 'stopped' : 'moving'}`} // מאלץ רי-רנדר כשהקונפטי מתחיל
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
        }}
        animate={animateProps}
        transition={transitionProps}
      >
        {ball.letter}
      </motion.div>
    );
  });

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
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
          border: '3px solid #333',
          margin: '40px auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {ballsElements}
      </div>

      {/* שורה תחתונה מימין לשמאל */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: '5px',
          position: 'relative',
          height: ballSize + 20,
          marginTop: '20px',
          direction: 'rtl'
        }}
      >
        {bottomBalls.reverse().map((ball, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ top: 0, left: containerSize / 2 - ballSize / 2 }}
              animate={{ top: 0, right: idx * (ballSize + 5) }}
              transition={{ duration: 3 }} // איטי יותר לכדורים התחתונים
              style={{
                width: ballSize,
                height: ballSize,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, hsl(200,70%,80%), hsl(200,70%,60%), hsl(200,70%,40%))`,
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
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                transform: 'perspective(100px) rotateX(10deg) rotateY(10deg)',
                position: 'absolute',
              }}
            >
              {ball.letter}
            </motion.div>
          );
        })}
      </div>

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
    </div>
  );
}
