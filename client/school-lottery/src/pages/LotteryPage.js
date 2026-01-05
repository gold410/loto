import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Lottery from '../components/Lottery';
import Layout from '../components/Layout';

export default function LotteryPage() {
  const { filename } = useParams();
  const navigate = useNavigate();

  const handleBackToUpload = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="app-container" style={{ position: 'relative' }}>
        <Lottery filename={filename} />
      </div>
    </Layout>
  );
}