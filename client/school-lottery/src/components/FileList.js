import React, { useEffect, useState } from 'react';
import API from '../api';

export default function FileList({ onSelect }) {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await API.get('/files');
    setFiles(res.data);
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('למחוק את הקובץ?')) return;
    await API.delete(`/files/${filename}`);
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h3>קבצים קיימים:</h3>
      <ul>
        {files.map(file => (
          <li key={file}>
            {file}
            <button onClick={() => onSelect(file)}>בחר להגרלה</button>
            <button onClick={() => handleDelete(file)}>מחק</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
