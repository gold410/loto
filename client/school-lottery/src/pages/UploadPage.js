import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import Layout from '../components/Layout';
import API from '../api';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    console.log('Fetching files from server...');
    try {
      const res = await API.get('/files');
      console.log('Received files from server:', res.data);
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleStartLottery = () => {
    if (selectedFile) {
      navigate(`/lottery/${selectedFile}`);
    } else {
      alert('בחר קובץ קודם!');
    }
  };

  return (
    <Layout>
      <div className="app-container">
        <h1>🎉 הגרלת תלמידים</h1>

        <FileUpload onUpload={fetchFiles} />
        <FileList files={files} onSelect={setSelectedFile} />

        {selectedFile && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ marginBottom: '20px', fontSize: '18px' }}>קובץ נבחר: {selectedFile}</p>
            <button 
              onClick={handleStartLottery}
              style={{ padding: '15px 30px', backgroundColor: '#4f46e5', color: 'white', fontSize: '20px', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              התחל הגרלה! 🎲
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}