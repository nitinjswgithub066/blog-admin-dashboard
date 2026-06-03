import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';
import styles from './DocumentUploadPanel.module.css';

interface DocumentUploadPanelProps {
  onConverted: (mockHtml: string) => void;
}

const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({ onConverted }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isConverted, setIsConverted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setIsConverted(false);
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleProceed = () => {
    setIsConverted(true);
    // Mock HTML that would come from a real docx parser backend
    const mockHtml = `<h2>Imported Document Heading</h2><p>This is mock content converted from <strong>${file?.name}</strong>.</p><p>In a real application, the DOCX file would be sent to a backend parser, which would return clean HTML matching the blog's design system.</p>`;
    onConverted(mockHtml);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!file ? (
        <div 
          className={styles.uploadArea}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUploadCloud className={styles.uploadIcon} />
          <h3 className={styles.uploadTitle}>Upload a Word Document</h3>
          <p className={styles.uploadSubtitle}>Supports .docx files up to 10MB</p>
          <input 
            type="file" 
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
        </div>
      ) : (
        <motion.div 
          className={styles.fileInfo}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.fileDetails}>
            <FiFileText className={styles.fileIcon} />
            <div>
              <h4 className={styles.fileName}>{file.name}</h4>
              <p className={styles.fileSize}>{formatSize(file.size)}</p>
            </div>
          </div>
          {!isConverted && (
            <button className={styles.proceedBtn} onClick={handleProceed}>
              Proceed
            </button>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {isConverted && (
          <motion.div 
            className={styles.previewArea}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h4 className={styles.previewTitle}>
              <FiCheckCircle /> Document converted to HTML preview.
            </h4>
            <div className={styles.mockPreviewContent}>
              <p>The document content has been loaded into the content state. You can publish or save it as a draft.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DocumentUploadPanel;
