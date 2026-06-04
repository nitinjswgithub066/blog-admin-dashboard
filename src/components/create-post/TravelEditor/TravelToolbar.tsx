import React, { useState, useRef, useEffect } from 'react';
import { 
  FiCornerUpLeft, FiCornerUpRight, 
  FiBold, FiItalic, FiUnderline,
  FiLink, FiImage, 
  FiList, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiCode, FiMoreHorizontal
} from 'react-icons/fi';
import { MdFormatQuote, MdFormatListNumbered, MdStrikethroughS, MdSubscript, MdSuperscript, MdFormatClear } from 'react-icons/md';
import styles from './TravelToolbar.module.css';

const TravelToolbar: React.FC = () => {
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    AlignLeft: true,
  });
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

  const toggleFormat = (format: string) => {
    if (format.startsWith('Align')) {
      setActiveFormats(prev => {
        const next = { ...prev };
        delete next.AlignLeft;
        delete next.AlignCenter;
        delete next.AlignRight;
        next[format] = true;
        return next;
      });
      return;
    }
    setActiveFormats(prev => ({ ...prev, [format]: !prev[format] }));
  };

  const getBtnClass = (format: string) => 
    `${styles.toolbarBtn} ${activeFormats[format] ? styles.active : ''}`;

  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.editorToolbar}>
        {/* Undo / Redo */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarBtn} title="Undo"><FiCornerUpLeft /></button>
          <button className={styles.toolbarBtn} title="Redo"><FiCornerUpRight /></button>
        </div>

        {/* Formats Dropdowns */}
        <div className={styles.toolbarGroup}>
          <select className={styles.toolbarSelect}>
            <option>Paragraph</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>
          <select className={styles.toolbarSelect}>
            <option>16</option>
            <option>14</option>
            <option>18</option>
            <option>24</option>
          </select>
        </div>

        {/* Text Styles */}
        <div className={styles.toolbarGroup}>
          <button className={getBtnClass('Bold')} onClick={() => toggleFormat('Bold')} title="Bold"><FiBold /></button>
          <button className={getBtnClass('Italic')} onClick={() => toggleFormat('Italic')} title="Italic"><FiItalic /></button>
          <button className={getBtnClass('Underline')} onClick={() => toggleFormat('Underline')} title="Underline"><FiUnderline /></button>
        </div>

        {/* Links & Media */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarBtn} title="Insert Link"><FiLink /></button>
          <button className={styles.toolbarBtn} title="Insert Image"><FiImage /></button>
        </div>

        {/* Lists & Quotes */}
        <div className={styles.toolbarGroup}>
          <button className={getBtnClass('Bullet')} onClick={() => toggleFormat('Bullet')} title="Bulleted List"><FiList /></button>
          <button className={getBtnClass('Number')} onClick={() => toggleFormat('Number')} title="Numbered List"><MdFormatListNumbered /></button>
          <button className={getBtnClass('Quote')} onClick={() => toggleFormat('Quote')} title="Blockquote"><MdFormatQuote /></button>
          <button className={getBtnClass('Code')} onClick={() => toggleFormat('Code')} title="Code Block"><FiCode /></button>
        </div>

        {/* Alignment */}
        <div className={styles.toolbarGroup}>
          <button className={getBtnClass('AlignLeft')} onClick={() => toggleFormat('AlignLeft')} title="Align Left"><FiAlignLeft /></button>
          <button className={getBtnClass('AlignCenter')} onClick={() => toggleFormat('AlignCenter')} title="Align Center"><FiAlignCenter /></button>
          <button className={getBtnClass('AlignRight')} onClick={() => toggleFormat('AlignRight')} title="Align Right"><FiAlignRight /></button>
        </div>
        
        {/* More Tools */}
        <div className={styles.toolbarGroup} style={{ borderRight: 'none', position: 'relative' }} ref={moreToolsRef}>
          <button 
            className={`${styles.toolbarBtn} ${moreToolsOpen ? styles.active : ''}`} 
            onClick={() => setMoreToolsOpen(!moreToolsOpen)} 
            title="More Tools"
          >
            <FiMoreHorizontal />
          </button>
          
          {moreToolsOpen && (
            <div className={styles.moreToolsMenu}>
              <button className={getBtnClass('Strikethrough')} onClick={() => toggleFormat('Strikethrough')} title="Strikethrough">
                <MdStrikethroughS /> Strikethrough
              </button>
              <button className={getBtnClass('Superscript')} onClick={() => toggleFormat('Superscript')} title="Superscript">
                <MdSuperscript /> Superscript
              </button>
              <button className={getBtnClass('Subscript')} onClick={() => toggleFormat('Subscript')} title="Subscript">
                <MdSubscript /> Subscript
              </button>
              <div className={styles.menuDivider}></div>
              <button className={styles.toolbarBtn} title="Clear Formatting">
                <MdFormatClear /> Clear Formatting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelToolbar;
