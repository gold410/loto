import React, { useRef } from 'react';
import API from '../api';

export default function FileUpload({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {

    if (!file) return;

    console.log('Starting upload for file:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending file to server...');
      const response = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload successful:', response.data);

      onUpload(); // <-- כאן מעדכנים את הרשימה מיד אחרי ההעלאה
      window.location.reload();
    } catch (err) {
      console.error('Upload error:', err);
      console.error('Error response:', err.response?.data);
      alert('שגיאה בהעלאת הקובץ: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input 
        ref={fileInputRef}
        type="file"
        onChange={e => handleUpload(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <div 
        onClick={handleIconClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          fontSize: '40px',
          cursor: 'pointer',
          margin: '10px'
        }}
      >
        ➕
      </div>
    </div>
  );
}
