import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Confetti from 'react-confetti';

export default function WinnerPage() {
  const { winnerName } = useParams();

  return (
    <Layout>
      <div className="app-container" style={{ textAlign: 'center', padding: '50px', direction: 'rtl' }}>
        <div style={{ position: 'relative', margin: '20px auto', maxWidth: '600px' }}>
          {/* larger soft blurred ellipse behind the card (pastel) */}
          <div style={{
            position: 'absolute',
            top: '-320px',
            left: '-460px',
            right: '-460px',
            bottom: '-320px',
            borderRadius: '320px',
            background: 'radial-gradient(closest-side, rgba(230,220,255,0.995), rgba(253,250,255,0.8))',
            filter: 'blur(140px) saturate(1.06)',
            transform: 'scale(1.95)',
            zIndex: 0,
            opacity: 0.985,
            pointerEvents: 'none'
          }} />

          {/* subtle blurred border around the card */}
          <div style={{
            position: 'absolute',
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            borderRadius: '22px',
            border: '1px solid rgba(255,255,255,0.4)',
            filter: 'blur(4px)',
            zIndex: 995,
            pointerEvents: 'none',
            opacity: 0.9
          }} />

          <div style={{
            position: 'relative',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #B08BFF, #b59ecfff)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 12px 36px rgba(59,14,130,0.28)',
            border: '1px solid rgba(200,170,255,0.45)',
            animation: 'cardFadeIn 600ms ease-out both',
            // feathered/blurred edges while keeping inner content sharp
            maskImage: 'radial-gradient(closest-side, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'radial-gradient(closest-side, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
            maskMode: 'alpha',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: '100% 100%'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              color: '#fff', 
              marginBottom: '30px',
              textShadow: '2px 2px 6px rgba(0,0,0,0.5)'
            }}>
              🎉 מזל טוב! 🎉
            </h1>
            
            <h2 style={{ 
              fontSize: '2rem', 
              color: '#fff', 
              marginBottom: '20px',
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
            }}>
              לזוכה {decodeURIComponent(winnerName)}
            </h2>
            
            <p style={{ 
              fontSize: '1.5rem', 
              color: '#fff', 
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              זכית ב-10 נקודות! 🏆
            </p>


          </div>
        </div>



        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 900 }}>
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={true}
            numberOfPieces={300}
            gravity={0.2}
          />
        </div>
      </div>
    </Layout>
  );
}