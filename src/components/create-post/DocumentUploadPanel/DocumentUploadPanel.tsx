import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';
import styles from './DocumentUploadPanel.module.css';

interface DocumentUploadPanelProps {
  onConverted: (mockHtml: string) => void;
  onContinue?: () => void;
}

const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({ onConverted, onContinue }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mockHtmlPreview, setMockHtmlPreview] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setIsFinished(false);
    setProgress(0);
    setMockHtmlPreview('');
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      const validTypes = [
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/html'
      ];
      const validExtensions = ['.doc', '.docx', '.html'];
      
      const hasValidExt = validExtensions.some(ext => selected.name.toLowerCase().endsWith(ext));
      
      if (!validTypes.includes(selected.type) && !hasValidExt) {
        setError('Only Microsoft Word (.doc, .docx) or HTML documents are supported.');
        setFile(null);
        return;
      }
      
      setFile(selected);
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleProceed = () => {
    if (!file) return;
    
    setIsConverting(true);
    setProgress(0);
    
    // Mock conversion progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);
  };

  useEffect(() => {
    if (progress >= 100 && isConverting) {
      setTimeout(() => {
        setIsConverting(false);
        setIsFinished(true);
        const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #1a1a1a; }
  </style>
</head>
<body>
  <h1>Imported from ${file?.name}</h1>
  <p>This is mock content converted successfully from the uploaded document.</p>
  <p>In the backend phase, this will be parsed into clean HTML matching the blog's design system.</p>
</body>
</html>`;
        setMockHtmlPreview(html);
        onConverted(html); // Inform parent about the converted content
      }, 500);
    }
  }, [progress, isConverting, file, onConverted]);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {!file ? (
        <div 
          className={styles.uploadArea}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUploadCloud className={styles.uploadIcon} />
          <h3 className={styles.uploadTitle}>Upload Document</h3>
          <p className={styles.uploadSubtitle}>Supports .docx, .doc, .html (Up to 10MB)</p>
          <p className={styles.futureSupport}>* Google Docs exported files supported soon</p>
          <input 
            type="file" 
            accept=".docx,.doc,.html,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
        </div>
      ) : (
        <div className={styles.conversionLayout}>
          <motion.div 
            className={styles.fileCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={styles.fileDetails}>
              <div className={styles.fileIconWrapper}>
                <FiFileText className={styles.fileIcon} />
              </div>
              <div className={styles.fileTextInfo}>
                <h4 className={styles.fileName}>{file.name}</h4>
                <p className={styles.fileMeta}>
                  {formatSize(file.size)} · {new Date().toLocaleString()}
                </p>
              </div>
            </div>
            
            <button 
              className={`${styles.convertBtn} ${isFinished ? styles.convertFinished : ''}`} 
              onClick={handleProceed}
              disabled={isConverting || isFinished}
            >
              {isConverting ? (
                <>Converting... {Math.min(progress, 100)}%</>
              ) : isFinished ? (
                <><FiCheckCircle /> Conversion Finished</>
              ) : (
                'Convert to HTML'
              )}
              {isConverting && (
                <div className={styles.progressBar} style={{ width: `${Math.min(progress, 100)}%` }} />
              )}
            </button>
          </motion.div>

          {/* Converted Preview Pane */}
          <AnimatePresence>
            {isFinished && mockHtmlPreview && (
              <motion.div 
                className={styles.previewPane}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={styles.previewHeader}>
                  <h4 className={styles.previewTitle}>Converted HTML/CSS/JS Preview</h4>
                  <span className={styles.previewFileName}>{file.name}</span>
                </div>
                <div className={styles.codeContainer}>
                  <pre className={styles.codePreview}>
                    {mockHtmlPreview}
                  </pre>
                </div>
                {onContinue && (
                  <button className={styles.continueBtn} onClick={onContinue}>
                    Continue to Publish
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}
    </motion.div>
  );
};

export default DocumentUploadPanel;
