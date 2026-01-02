import React from 'react';
import API from '../api';

export default function FileUpload({ onUpload }) {

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onUpload(); // <-- כאן מעדכנים את הרשימה מיד אחרי ההעלאה
    } catch (err) {
      console.error(err);
      alert('שגיאה בהעלאת הקובץ');
    }
  };

  return (
    <input className='input'
      type="file"
      onChange={e => handleUpload(e.target.files[0])} // העלאה אוטומטית
    />
  );
}
