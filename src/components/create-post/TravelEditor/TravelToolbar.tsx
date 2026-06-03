import React from 'react';
import { 
  LuUndo2, LuRedo2, LuBold, LuItalic, LuUnderline, LuStrikethrough,
  LuAlignLeft, LuAlignCenter, LuAlignRight, LuAlignJustify,
  LuList, LuListOrdered, LuListTodo,
  LuLink2, LuImage, LuVideo, LuTable,
  LuQuote, LuMinus, LuEllipsis, LuChevronDown
} from 'react-icons/lu';
import styles from './TravelToolbar.module.css';

interface TravelToolbarProps {
  onMoreClick: () => void;
}

const TravelToolbar: React.FC<TravelToolbarProps> = ({ onMoreClick }) => {
  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.primaryActions}>
        
        {/* History Group (Hidden on mobile) */}
        <div className={`${styles.toolbarGroup} ${styles.groupHistory}`}>
          <button type="button" className={styles.toolbarBtn} title="Undo">
            <LuUndo2 size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Redo">
            <LuRedo2 size={16} />
          </button>
        </div>

        {/* Heading Group (Hidden on mobile) */}
        <div className={`${styles.toolbarGroup} ${styles.groupHeading}`}>
          <div className={styles.headingSelectWrapper}>
            <select className={styles.headingSelect}>
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </select>
            <LuChevronDown size={14} className={styles.headingSelectIcon} />
          </div>
        </div>

        {/* Formatting Group */}
        <div className={`${styles.toolbarGroup} ${styles.groupFormat}`}>
          <button type="button" className={styles.toolbarBtn} title="Bold">
            <LuBold size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Italic">
            <LuItalic size={16} />
          </button>
          <button type="button" className={`${styles.toolbarBtn} ${styles.hideOnMobile}`} title="Underline">
            <LuUnderline size={16} />
          </button>
          <button type="button" className={`${styles.toolbarBtn} ${styles.hideOnMobile}`} title="Strikethrough">
            <LuStrikethrough size={16} />
          </button>
        </div>

        {/* Insert Basics (Mixed visibility) */}
        <div className={`${styles.toolbarGroup} ${styles.groupInsertBasic}`}>
          <button type="button" className={styles.toolbarBtn} title="Link">
            <LuLink2 size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Image">
            <LuImage size={16} />
          </button>
        </div>

        {/* Lists Group (Hidden on mobile) */}
        <div className={`${styles.toolbarGroup} ${styles.groupLists}`}>
          <button type="button" className={styles.toolbarBtn} title="Bullet List">
            <LuList size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Numbered List">
            <LuListOrdered size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Checklist">
            <LuListTodo size={16} />
          </button>
        </div>

        {/* Alignment Group (Hidden on tablet/mobile) */}
        <div className={`${styles.toolbarGroup} ${styles.groupAlign}`}>
          <button type="button" className={styles.toolbarBtn} title="Align Left">
            <LuAlignLeft size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Align Center">
            <LuAlignCenter size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Align Right">
            <LuAlignRight size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Justify">
            <LuAlignJustify size={16} />
          </button>
        </div>

        {/* Advanced Content Group (Hidden on tablet/mobile) */}
        <div className={`${styles.toolbarGroup} ${styles.groupInsertContent}`}>
          <button type="button" className={styles.toolbarBtn} title="Video">
            <LuVideo size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Table">
            <LuTable size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Quote">
            <LuQuote size={16} />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Divider">
            <LuMinus size={16} />
          </button>
        </div>

      </div>

      <button type="button" className={styles.moreToolsBtn} onClick={onMoreClick}>
        <LuEllipsis size={18} />
        <span>More Tools</span>
      </button>

    </div>
  );
};

export default TravelToolbar;
