import React, { useRef, useState, useEffect } from 'react';
import { 
  LuUndo2, LuRedo2, LuBold, LuItalic, LuUnderline,
  LuAlignLeft, LuList,
  LuLink2, LuImage, LuChevronDown,
  LuChevronLeft, LuChevronRight,
  LuStrikethrough, LuHighlighter, LuPalette, LuSuperscript, LuSubscript,
  LuListOrdered, LuListTodo, LuAlignCenter, LuAlignRight, LuAlignJustify
} from 'react-icons/lu';
import styles from './TravelToolbar.module.css';

interface TravelToolbarProps {
  onMoreClick: () => void;
  activeTools: string[];
  onToggleTool: (toolId: string) => void;
}

const TravelToolbar: React.FC<TravelToolbarProps> = ({ onMoreClick, activeTools, onToggleTool }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Native wheel listener to convert vertical wheel to horizontal scroll safely
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeftState(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.toolbarContainer}>
      
      <div className={`${styles.scrollWrapper} ${canScrollLeft ? styles.showLeftShadow : ''} ${canScrollRight ? styles.showRightShadow : ''}`}>
        
        {canScrollLeft && (
          <button type="button" className={`${styles.navArrow} ${styles.navLeft}`} onClick={() => scrollByAmount(-200)}>
            <LuChevronLeft size={16} />
          </button>
        )}

        <div 
          className={`${styles.primaryActions} ${isDragging ? styles.isDragging : ''}`}
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          
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
            <button type="button" className={`${styles.toolbarBtn} ${styles.hideOnMobile}`} title="Italic">
              <LuItalic size={16} />
            </button>
            <button type="button" className={`${styles.toolbarBtn} ${styles.hideOnTablet}`} title="Underline">
              <LuUnderline size={16} />
            </button>
          </div>

          {/* Dynamic Active Tools (Swapped in from More Tools) */}
          {activeTools.length > 0 && (
            <div className={styles.toolbarGroup}>
              {activeTools.includes('strikethrough') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('strikethrough')} title="Strikethrough"><LuStrikethrough size={16} /></button>}
              {activeTools.includes('highlight') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('highlight')} title="Highlight"><LuHighlighter size={16} /></button>}
              {activeTools.includes('textColor') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('textColor')} title="Text Color"><LuPalette size={16} /></button>}
              {activeTools.includes('superscript') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('superscript')} title="Superscript"><LuSuperscript size={16} /></button>}
              {activeTools.includes('subscript') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('subscript')} title="Subscript"><LuSubscript size={16} /></button>}
              {activeTools.includes('numberedList') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('numberedList')} title="Numbered List"><LuListOrdered size={16} /></button>}
              {activeTools.includes('checklist') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('checklist')} title="Checklist"><LuListTodo size={16} /></button>}
              {activeTools.includes('alignCenter') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('alignCenter')} title="Align Center"><LuAlignCenter size={16} /></button>}
              {activeTools.includes('alignRight') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('alignRight')} title="Align Right"><LuAlignRight size={16} /></button>}
              {activeTools.includes('justify') && <button type="button" className={`${styles.toolbarBtn} ${styles.active}`} onClick={() => onToggleTool('justify')} title="Justify"><LuAlignJustify size={16} /></button>}
            </div>
          )}

          {/* Insert Basics */}
          <div className={`${styles.toolbarGroup} ${styles.groupInsertBasic}`}>
            <button type="button" className={styles.toolbarBtn} title="Link">
              <LuLink2 size={16} />
            </button>
            <button type="button" className={styles.toolbarBtn} title="Image">
              <LuImage size={16} />
            </button>
          </div>

          {/* Lists Group (Hidden on tablet/mobile or if swapped out) */}
          {activeTools.length < 2 && (
            <div className={`${styles.toolbarGroup} ${styles.groupLists}`}>
              <button type="button" className={styles.toolbarBtn} title="Bullet List">
                <LuList size={16} />
              </button>
            </div>
          )}

          {/* Alignment Group (Hidden on tablet/mobile or if swapped out) */}
          {activeTools.length < 1 && (
            <div className={`${styles.toolbarGroup} ${styles.groupAlign}`}>
              <button type="button" className={styles.toolbarBtn} title="Align Left">
                <LuAlignLeft size={16} />
              </button>
            </div>
          )}

        </div>

        {canScrollRight && (
          <button type="button" className={`${styles.navArrow} ${styles.navRight}`} onClick={() => scrollByAmount(200)}>
            <LuChevronRight size={16} />
          </button>
        )}
      </div>

      <button id="more-tools-btn" type="button" className={styles.moreToolsBtn} onClick={onMoreClick}>
        <span>More Tools</span>
      </button>

    </div>
  );
};

export default TravelToolbar;
