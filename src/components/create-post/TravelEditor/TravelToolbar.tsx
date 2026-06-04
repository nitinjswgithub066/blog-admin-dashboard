import React from 'react';
import { 
  FiCornerUpLeft, FiCornerUpRight, 
  FiBold, FiItalic, FiUnderline,
  FiLink, FiImage, 
  FiList, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiCode, FiMoreHorizontal
} from 'react-icons/fi';
import { MdFormatQuote, MdFormatListNumbered } from 'react-icons/md';
import styles from './TravelToolbar.module.css';

const TravelToolbar: React.FC = () => {
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
          <button className={styles.toolbarBtn} title="Bold"><FiBold /></button>
          <button className={styles.toolbarBtn} title="Italic"><FiItalic /></button>
          <button className={styles.toolbarBtn} title="Underline"><FiUnderline /></button>
        </div>

        {/* Links & Media */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarBtn} title="Insert Link"><FiLink /></button>
          <button className={styles.toolbarBtn} title="Insert Image"><FiImage /></button>
        </div>

        {/* Lists & Quotes */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarBtn} title="Bulleted List"><FiList /></button>
          <button className={styles.toolbarBtn} title="Numbered List"><MdFormatListNumbered /></button>
          <button className={styles.toolbarBtn} title="Blockquote"><MdFormatQuote /></button>
          <button className={styles.toolbarBtn} title="Code Block"><FiCode /></button>
        </div>

        {/* Alignment */}
        <div className={styles.toolbarGroup}>
          <button className={`${styles.toolbarBtn} ${styles.active}`} title="Align Left"><FiAlignLeft /></button>
          <button className={styles.toolbarBtn} title="Align Center"><FiAlignCenter /></button>
          <button className={styles.toolbarBtn} title="Align Right"><FiAlignRight /></button>
        </div>
        
        {/* More Tools */}
        <div className={styles.toolbarGroup} style={{ borderRight: 'none' }}>
          <button className={styles.toolbarBtn} title="More Tools"><FiMoreHorizontal /></button>
        </div>
      </div>
    </div>
  );
};

export default TravelToolbar;
