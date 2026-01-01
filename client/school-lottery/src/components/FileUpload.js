import React, { useState } from 'react';
import API from '../api';

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload();
      setFile(null);
    } catch (err) {
      console.error(err);
      alert('שגיאה בהעלאת הקובץ');
    }
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>העלה קובץ</button>
    </div>
  );
}
