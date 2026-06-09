import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiX } from 'react-icons/fi';
import TravelToolbar, { type ToolbarCommand } from './TravelToolbar';
import styles from './TravelEditor.module.css';

type LinkDialogValue = {
  text: string;
  url: string;
  openInNewTab: boolean;
};

interface TravelEditorProps {
  value: string;
  onChange: (val: string) => void;
  title: string;
  onTitleChange: (val: string) => void;
  onContinue?: () => void;
  onInlineImageUpload?: (file: File) => Promise<{ url: string; publicId: string }>;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    Paragraph: 'p',
    'Heading 1': 'h1',
    'Heading 2': 'h2',
    'Heading 3': 'h3',
    'Heading 4': 'h4',
    Quote: 'blockquote',
    'Code block': 'pre',
  };
  return map[type] || 'p';
};

const TravelEditor: React.FC<TravelEditorProps> = ({
  value,
  onChange,
  title,
  onTitleChange,
  onContinue,
  onInlineImageUpload,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [saveStatus, setSaveStatus] = useState('Saved locally');
  const [htmlMode, setHtmlMode] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkDialog, setLinkDialog] = useState<LinkDialogValue>({ text: '', url: '', openInNewTab: true });
  const [uploadError, setUploadError] = useState('');

  const editorStats = useMemo(() => {
    const plainText = stripHtml(value);
    const words = plainText ? plainText.split(/\s+/).length : 0;
    return {
      charCount: plainText.length,
      wordCount: words,
      readTime: Math.max(1, Math.ceil(words / 200)) + ' min',
    };
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => setSaveStatus('Saved locally'), 1500);
    return () => clearTimeout(timer);
  }, [value, title]);

  const getSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: value.length, end: value.length, selected: '' };
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      selected: value.slice(textarea.selectionStart, textarea.selectionEnd),
    };
  };

  const replaceSelection = (replacement: string) => {
    const textarea = textareaRef.current;
    const { start, end } = getSelection();
    const next = value.slice(0, start) + replacement + value.slice(end);
    setSaveStatus('Unsaved changes');
    onChange(next);
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + replacement.length, start + replacement.length);
    });
  };

  const wrapSelection = (before: string, after: string, fallback = 'Text') => {
    const { selected } = getSelection();
    replaceSelection(`${before}${selected || fallback}${after}`);
  };

  const handleCommand = (command: ToolbarCommand, commandValue?: string) => {
    if (command === 'undo') document.execCommand('undo');
    if (command === 'redo') document.execCommand('redo');
    if (command === 'bold') wrapSelection('<strong>', '</strong>');
    if (command === 'italic') wrapSelection('<em>', '</em>');
    if (command === 'underline') wrapSelection('<u>', '</u>');
    if (command === 'strike') wrapSelection('<s>', '</s>');
    if (command === 'sup') wrapSelection('<sup>', '</sup>');
    if (command === 'sub') wrapSelection('<sub>', '</sub>');
    if (command === 'clear') replaceSelection(stripHtml(getSelection().selected || value));
    if (command === 'bullet') wrapSelection('<ul><li>', '</li></ul>', 'List item');
    if (command === 'number') wrapSelection('<ol><li>', '</li></ol>', 'List item');
    if (command === 'quote') wrapSelection('<blockquote>', '</blockquote>');
    if (command === 'code') wrapSelection('<pre><code>', '</code></pre>', 'Code');
    if (command === 'hr') replaceSelection('<hr />');
    if (command.startsWith('align')) wrapSelection(`<p style="text-align:${command.replace('align-', '')};">`, '</p>');
    if (command === 'font' && commandValue) wrapSelection(`<span style="font-family:${commandValue};">`, '</span>');
    if (command === 'size' && commandValue) wrapSelection(`<span style="font-size:${commandValue}px;">`, '</span>');
    if (command === 'color' && commandValue) wrapSelection(`<span style="color:${commandValue};">`, '</span>');
    if (command === 'type' && commandValue) {
      const tag = getTypeTag(commandValue);
      if (tag === 'pre') wrapSelection('<pre><code>', '</code></pre>', 'Code');
      else wrapSelection(`<${tag}>`, `</${tag}>`, commandValue);
    }
  };

  const openLinkDialog = () => {
    const { selected } = getSelection();
    setLinkDialog({ text: selected || '', url: '', openInNewTab: true });
    setLinkDialogOpen(true);
  };

  const applyLink = () => {
    if (!linkDialog.url.trim()) return;
    const text = linkDialog.text.trim() || linkDialog.url.trim();
    const target = linkDialog.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    replaceSelection(`<a href="${linkDialog.url.trim()}"${target}>${text}</a>`);
    setLinkDialogOpen(false);
  };

  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onInlineImageUpload) return;

    setUploadError('');
    try {
      const uploaded = await onInlineImageUpload(file);
      replaceSelection(`<img src="${uploaded.url}" alt="" loading="lazy" />`);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Inline image upload failed.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.editorHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.docIconWrapper}><FiFileText /></div>
          <div className={styles.docInfo}>
            <input
              aria-label="Document title"
              type="text"
              className={styles.docTitleInput}
              placeholder="Untitled Blog Document"
              value={title}
              onChange={(e) => {
                setSaveStatus('Unsaved changes');
                onTitleChange(e.target.value);
              }}
            />
            <span className={styles.saveStatus}>{saveStatus} · Last edited just now</span>
          </div>
        </div>
      </div>

      <TravelToolbar
        htmlMode={htmlMode}
        onCommand={handleCommand}
        onOpenLinkDialog={openLinkDialog}
        onImportImage={() => imageInputRef.current?.click()}
        onToggleHtmlMode={() => setHtmlMode((current) => !current)}
      />

      <input
        ref={imageInputRef}
        aria-label="Upload inline image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className={styles.hiddenInput}
        onChange={handleImageSelected}
      />

      <div className={styles.editorBody}>
        <div className={styles.documentPage}>
          <textarea
            ref={textareaRef}
            aria-label="Blog post content"
            className={`${styles.documentEditable} ${htmlMode ? styles.htmlMode : ''}`}
            placeholder={htmlMode ? 'Write HTML/CSS-safe content here...' : 'Start writing your blog post...'}
            value={value}
            onChange={(e) => {
              setSaveStatus('Unsaved changes');
              onChange(e.target.value);
            }}
          />
        </div>
      </div>

      {uploadError && <div className={styles.editorAlert}>{uploadError}</div>}

      {linkDialogOpen && (
        <div className={styles.dialogOverlay}>
          <div className={styles.linkDialog}>
            <div className={styles.dialogHeader}>
              <h3>Insert Link</h3>
              <button
                type="button"
                title="Close insert link dialog"
                aria-label="Close insert link dialog"
                onClick={() => setLinkDialogOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <label>
              <span>Text to display</span>
              <input
                type="text"
                value={linkDialog.text}
                onChange={(e) => setLinkDialog((current) => ({ ...current, text: e.target.value }))}
              />
            </label>
            <label>
              <span>URL</span>
              <input
                type="url"
                value={linkDialog.url}
                onChange={(e) => setLinkDialog((current) => ({ ...current, url: e.target.value }))}
              />
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={linkDialog.openInNewTab}
                onChange={(e) => setLinkDialog((current) => ({ ...current, openInNewTab: e.target.checked }))}
              />
              Open in new tab
            </label>
            <div className={styles.dialogActions}>
              <button type="button" onClick={() => setLinkDialogOpen(false)}>Cancel</button>
              <button type="button" onClick={applyLink}>Apply</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.editorFooter}>
        <div className={styles.footerStats}>
          <span>Words: {editorStats.wordCount}</span>
          <span>Characters: {editorStats.charCount}</span>
          <span>Estimated writing time: {editorStats.readTime}</span>
        </div>
        <div className={styles.footerStatus}>
          {saveStatus}
          {onContinue && (
            <button className={styles.continueBtn} onClick={onContinue}>
              Continue to Publish
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TravelEditor;
