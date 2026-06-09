import React, { useEffect, useRef, useState } from 'react';
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiCode,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiDroplet,
  FiImage,
  FiItalic,
  FiLink,
  FiList,
  FiMoreHorizontal,
  FiUnderline,
} from 'react-icons/fi';
import {
  MdFormatClear,
  MdFormatListNumbered,
  MdFormatQuote,
  MdHorizontalRule,
  MdStrikethroughS,
  MdSubscript,
  MdSuperscript,
} from 'react-icons/md';
import styles from './TravelToolbar.module.css';

export type ToolbarCommand =
  | 'undo'
  | 'redo'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'sup'
  | 'sub'
  | 'clear'
  | 'bullet'
  | 'number'
  | 'quote'
  | 'code'
  | 'hr'
  | 'align-left'
  | 'align-center'
  | 'align-right'
  | 'align-justify'
  | 'font'
  | 'type'
  | 'size'
  | 'color';

interface TravelToolbarProps {
  htmlMode: boolean;
  onCommand: (command: ToolbarCommand, value?: string) => void;
  onOpenLinkDialog: () => void;
  onImportImage: () => void;
  onToggleHtmlMode: () => void;
}

const fontFamilies = [
  'Inter',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Roboto',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Courier New',
];

const textTypes = ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Quote', 'Code block'];
const textSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '40', '48'];

const TravelToolbar: React.FC<TravelToolbarProps> = ({
  htmlMode,
  onCommand,
  onOpenLinkDialog,
  onImportImage,
  onToggleHtmlMode,
}) => {
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);
  const moreToolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreToolsRef.current && !moreToolsRef.current.contains(e.target as Node)) {
        setMoreToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.editorToolbar}>
        <div className={`${styles.toolbarGroup} ${styles.secondaryGroup}`}>
          <button type="button" className={styles.toolbarBtn} title="Undo" onClick={() => onCommand('undo')}><FiCornerUpLeft /></button>
          <button type="button" className={styles.toolbarBtn} title="Redo" onClick={() => onCommand('redo')}><FiCornerUpRight /></button>
        </div>

        <div className={`${styles.toolbarGroup} ${styles.formatGroup}`}>
          <select className={styles.toolbarSelect} title="Font Family" aria-label="Font family" onChange={(e) => onCommand('font', e.target.value)}>
            {fontFamilies.map((font) => <option key={font}>{font}</option>)}
          </select>
          <select className={styles.toolbarSelect} title="Text Type" aria-label="Text type" onChange={(e) => onCommand('type', e.target.value)}>
            {textTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
          <select className={styles.toolbarSelect} title="Text Size" aria-label="Text size" onChange={(e) => onCommand('size', e.target.value)}>
            {textSizes.map((size) => <option key={size}>{size}</option>)}
          </select>
        </div>

        <div className={styles.toolbarGroup}>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('bold')} title="Bold"><FiBold /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('italic')} title="Italic"><FiItalic /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('underline')} title="Underline"><FiUnderline /></button>
        </div>

        <div className={styles.toolbarGroup}>
          <button type="button" className={styles.toolbarBtn} title="Import Picture" onClick={onImportImage}><FiImage /></button>
          <label className={styles.colorBtn} title="Text Color">
            <FiDroplet />
            <input type="color" aria-label="Text color" onChange={(e) => onCommand('color', e.target.value)} />
          </label>
        </div>

        <div className={`${styles.toolbarGroup} ${styles.secondaryGroup}`}>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('bullet')} title="Bulleted List"><FiList /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('number')} title="Numbered List"><MdFormatListNumbered /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('quote')} title="Quote"><MdFormatQuote /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('code')} title="Code Block"><FiCode /></button>
        </div>

        <div className={`${styles.toolbarGroup} ${styles.alignmentGroup}`}>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('align-left')} title="Align Left"><FiAlignLeft /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('align-center')} title="Align Center"><FiAlignCenter /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('align-right')} title="Align Right"><FiAlignRight /></button>
          <button type="button" className={styles.toolbarBtn} onClick={() => onCommand('align-justify')} title="Justify"><FiAlignJustify /></button>
        </div>

        <div className={`${styles.toolbarGroup} ${styles.moreToolsGroup}`} ref={moreToolsRef}>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${moreToolsOpen ? styles.active : ''}`}
            onClick={() => setMoreToolsOpen(!moreToolsOpen)}
            title="More Tools"
          >
            <FiMoreHorizontal />
          </button>

          {moreToolsOpen && (
            <div className={styles.moreToolsMenu}>
              <button type="button" className={styles.toolbarBtn} title="Insert Link" onClick={onOpenLinkDialog}><FiLink /> Insert Link</button>
              <button type="button" className={`${styles.toolbarBtn} ${htmlMode ? styles.active : ''}`} title="HTML Mode" onClick={onToggleHtmlMode}>
                <FiCode /> HTML Mode
              </button>
              <div className={styles.menuDivider}></div>
              <button type="button" className={styles.toolbarBtn} title="Strikethrough" onClick={() => onCommand('strike')}><MdStrikethroughS /> Strikethrough</button>
              <button type="button" className={styles.toolbarBtn} title="Superscript" onClick={() => onCommand('sup')}><MdSuperscript /> Superscript</button>
              <button type="button" className={styles.toolbarBtn} title="Subscript" onClick={() => onCommand('sub')}><MdSubscript /> Subscript</button>
              <button type="button" className={styles.toolbarBtn} title="Clear format" onClick={() => onCommand('clear')}><MdFormatClear /> Clear format</button>
              <button type="button" className={styles.toolbarBtn} title="Horizontal line" onClick={() => onCommand('hr')}><MdHorizontalRule /> Horizontal line</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelToolbar;
