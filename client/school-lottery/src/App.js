import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Lottery from './components/Lottery';
import Layout from './components/Layout';
import API from './api';
import './App.css';

export default function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    const res = await API.get('/files');
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Layout>
      <div className="app-container">
        <h1>🎉 הגרלת תלמידים</h1>

        <FileUpload onUpload={fetchFiles} />
        <FileList files={files} onSelect={setSelectedFile} />

        {selectedFile && <Lottery filename={selectedFile} />}
      </div>
    </Layout>
  );
}
