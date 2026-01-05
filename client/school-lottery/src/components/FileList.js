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
    console.log('FileList received files:', files);
    setLocalFiles(files || []);
  }, [files]);

  console.log('FileList rendering with localFiles:', localFiles);

  return (
    <div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {localFiles.map(file => (
          <li key={file} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '16px' }}>{file}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => onSelect(file)}>בחר להגרלה</button>
              <button onClick={() => handleDelete(file)}>מחק</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}