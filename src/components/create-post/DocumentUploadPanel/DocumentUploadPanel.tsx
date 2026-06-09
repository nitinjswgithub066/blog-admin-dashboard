import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { postService, type DocumentUploadResponse } from '../../../services/post.service';
import styles from './DocumentUploadPanel.module.css';

type UploadProgressState = 'idle' | 'uploading' | 'extracting' | 'preparing' | 'completed' | 'failed';

interface DocumentUploadPanelProps {
  onConverted: (data: DocumentUploadResponse) => void;
  onContinue?: () => void;
}

const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({ onConverted, onContinue }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [progressState, setProgressState] = useState<UploadProgressState>('idle');
  const [progress, setProgress] = useState(0);
  const [converted, setConverted] = useState<DocumentUploadResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setConverted(null);
    setProgress(0);
    setProgressState('idle');

    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      const validExtensions = ['.doc', '.docx', '.html', '.htm'];
      const hasValidExt = validExtensions.some((ext) => selected.name.toLowerCase().endsWith(ext));

      if (!hasValidExt) {
        setError('Only Microsoft Word (.doc, .docx) or HTML documents are supported.');
        setFile(null);
        return;
      }

      if (selected.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum size is 10MB.');
        setFile(null);
        return;
      }

      setFile(selected);
    }
  };

  const formatSize = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

  const handleProceed = async () => {
    if (!file) return;

    setError('');
    setProgressState('uploading');
    setProgress(25);

    try {
      const uploadTick = setTimeout(() => {
        setProgressState('extracting');
        setProgress(62);
      }, 350);
      const prepareTick = setTimeout(() => {
        setProgressState('preparing');
        setProgress(88);
      }, 900);

      const data = await postService.uploadDocument(file);
      clearTimeout(uploadTick);
      clearTimeout(prepareTick);
      setProgressState('completed');
      setProgress(100);
      setConverted(data);
      onConverted(data);
    } catch (uploadError) {
      setProgressState('failed');
      setError(uploadError instanceof Error ? uploadError.message : 'Document conversion failed.');
    }
  };

  const buttonLabel = () => {
    if (progressState === 'uploading') return `Uploading... ${progress}%`;
    if (progressState === 'extracting') return `Extracting... ${progress}%`;
    if (progressState === 'preparing') return `Preparing editor... ${progress}%`;
    if (progressState === 'completed') return <><FiCheckCircle /> Conversion Finished</>;
    return 'Convert to HTML';
  };

  const progressClass = {
    uploading: styles.progress25,
    extracting: styles.progress62,
    preparing: styles.progress88,
    completed: styles.progress100,
    idle: '',
    failed: '',
  }[progressState];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {!file ? (
        <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
          <FiUploadCloud className={styles.uploadIcon} />
          <h3 className={styles.uploadTitle}>Upload Document</h3>
          <p className={styles.uploadSubtitle}>Supports .docx, .doc, .html (Up to 10MB)</p>
          <p className={styles.futureSupport}>Google Docs exports work best as .docx or .html</p>
          <input
            aria-label="Upload document"
            type="file"
            accept=".docx,.doc,.html,.htm,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
        </div>
      ) : (
        <div className={styles.conversionLayout}>
          <motion.div className={styles.fileCard} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={styles.fileDetails}>
              <div className={styles.fileIconWrapper}><FiFileText className={styles.fileIcon} /></div>
              <div className={styles.fileTextInfo}>
                <h4 className={styles.fileName}>{file.name}</h4>
                <p className={styles.fileMeta}>{formatSize(file.size)} · {new Date().toLocaleString()}</p>
              </div>
            </div>

            <button
              className={`${styles.convertBtn} ${progressState === 'completed' ? styles.convertFinished : ''}`}
              onClick={handleProceed}
              disabled={['uploading', 'extracting', 'preparing', 'completed'].includes(progressState)}
            >
              {buttonLabel()}
              {['uploading', 'extracting', 'preparing'].includes(progressState) && (
                <div className={`${styles.progressBar} ${progressClass}`} />
              )}
            </button>
          </motion.div>

          <AnimatePresence>
            {converted && (
              <motion.div
                className={styles.previewPane}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={styles.previewHeader}>
                  <h4 className={styles.previewTitle}>Converted HTML Preview</h4>
                  <span className={styles.previewFileName}>{converted.fileName}</span>
                </div>
                <div className={styles.codeContainer}>
                  <pre className={styles.codePreview}>{converted.contentHtml}</pre>
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

      {error && <div className={styles.errorAlert}>{error}</div>}
    </motion.div>
  );
};

export default DocumentUploadPanel;
