import React, { useRef, useState } from 'react';
import { FiUpload } from "react-icons/fi";

const FileImageUpload = ({ onImageUpload, acceptedTypes = "image/*" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  
  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Pass file to parent component
      onImageUpload(file);
    }
  };
  
  // Upload icon as a component
  const UploadIcon = () => (
    <div style={{ fontSize: '24px', marginBottom: '8px', color: '#0056b3', marginTop: '50px'}}>
      <FiUpload />
    </div>
  );
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      {/* Upload Button */}
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`upload-container ${isDragging ? 'dragging' : ''}`}
        style={{
          border: `2px dashed ${isDragging ? '#007bff' : '#ccc'}`,
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          width: '100px',
          height: '2px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <UploadIcon />
        <p style={{ marginTop: '8px', fontSize: '14px', color:"#575555"}}>
          {preview ? 'Change Image' : 'Click to Upload'}
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={acceptedTypes}
          style={{ display: 'none' }} 
        />
      </div>
      
      {/* Preview on the right */}
      {preview && (
        <div 
          style={{ 
            width: '100px', 
            height: '5vw', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }} 
          />
          <div 
            onClick={() => setPreview(null)} 
            style={{
              color:'red',
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '25px'
            }}
          >
            ×
          </div>
        </div>
      )}
    </div>
  );
};

export default FileImageUpload;