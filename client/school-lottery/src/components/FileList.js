import React, { useEffect, useState } from 'react';
import API from '../api';

export default function FileList({ onSelect, files }) {
  const [localFiles, setLocalFiles] = useState([]);

  const handleDelete = async (filename) => {
    if (!window.confirm('למחוק את הקובץ?')) return;
    await API.delete(`/files/${filename}`);
    window.location.reload();
  };

  useEffect(() => {
    setLocalFiles(files || []);
  }, [files]);

  return (
    <div>
      <h3>קבצים קיימים:</h3>
      <ul>
        {localFiles.map(file => (
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