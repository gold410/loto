import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Lottery from './components/Lottery';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>הגרלת תלמידים</h1>
      <FileUpload onUpload={() => setSelectedFile(null)} />
      <FileList onSelect={file => setSelectedFile(file)} />
      {selectedFile && <Lottery filename={selectedFile} />}
    </div>
  );
}

export default App;
