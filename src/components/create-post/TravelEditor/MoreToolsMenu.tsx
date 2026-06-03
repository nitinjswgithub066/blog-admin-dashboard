import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuHighlighter, LuEraser, LuSubscript, LuSuperscript, LuPalette, LuStrikethrough,
  LuAlignCenter, LuAlignRight, LuAlignJustify, LuListOrdered, LuListTodo,
  LuMapPin, LuWallet, LuCloudSun, LuLightbulb, LuTriangleAlert, LuHotel, LuUtensils, LuBackpack, LuCalendarDays, LuCircleHelp, LuMap,
  LuListTree, LuSquareSplitHorizontal, LuMousePointerClick, LuCode, LuImagePlus, LuShare2, LuYoutube,
  LuVideo, LuTable, LuQuote, LuMinus,
  LuSearch, LuSettings,
  LuSave, LuEye, LuSend
} from 'react-icons/lu';
import styles from './MoreToolsMenu.module.css';

interface MoreToolsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertBlock?: (type: 'destination' | 'budget') => void;
  activeTools: string[];
  onToggleTool: (toolId: string) => void;
}

const MoreToolsMenu: React.FC<MoreToolsMenuProps> = ({ isOpen, onClose, onInsertBlock, activeTools, onToggleTool }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('#more-tools-btn')) {
        return; // Handled by the button's own onClick
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={menuRef}
          className={styles.menuContainer}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          role="menu"
        >
          <div className={styles.categoriesWrapper}>
            
            <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>Text & Formatting</div>
            <button className={`${styles.menuItem} ${activeTools.includes('strikethrough') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('strikethrough')}><span className={styles.menuItemIcon}><LuStrikethrough size={16} /></span> Strikethrough</button>
            <button className={`${styles.menuItem} ${activeTools.includes('highlight') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('highlight')}><span className={styles.menuItemIcon}><LuHighlighter size={16} /></span> Highlight</button>
            <button className={`${styles.menuItem} ${activeTools.includes('textColor') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('textColor')}><span className={styles.menuItemIcon}><LuPalette size={16} /></span> Text Color</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuEraser size={16} /></span> Clear Formatting</button>
            <button className={`${styles.menuItem} ${activeTools.includes('superscript') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('superscript')}><span className={styles.menuItemIcon}><LuSuperscript size={16} /></span> Superscript</button>
            <button className={`${styles.menuItem} ${activeTools.includes('subscript') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('subscript')}><span className={styles.menuItemIcon}><LuSubscript size={16} /></span> Subscript</button>
          </div>

          <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>Paragraph & Lists</div>
            <button className={`${styles.menuItem} ${activeTools.includes('numberedList') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('numberedList')}><span className={styles.menuItemIcon}><LuListOrdered size={16} /></span> Numbered List</button>
            <button className={`${styles.menuItem} ${activeTools.includes('checklist') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('checklist')}><span className={styles.menuItemIcon}><LuListTodo size={16} /></span> Checklist</button>
            <button className={`${styles.menuItem} ${activeTools.includes('alignCenter') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('alignCenter')}><span className={styles.menuItemIcon}><LuAlignCenter size={16} /></span> Align Center</button>
            <button className={`${styles.menuItem} ${activeTools.includes('alignRight') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('alignRight')}><span className={styles.menuItemIcon}><LuAlignRight size={16} /></span> Align Right</button>
            <button className={`${styles.menuItem} ${activeTools.includes('justify') ? styles.active : ''}`} role="menuitem" onClick={() => onToggleTool('justify')}><span className={styles.menuItemIcon}><LuAlignJustify size={16} /></span> Justify</button>
          </div>

          <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>Travel Blocks</div>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem" onClick={() => onInsertBlock?.('destination')}><span className={styles.menuItemIcon}><LuMapPin size={16} /></span> Destination Facts</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem" onClick={() => onInsertBlock?.('budget')}><span className={styles.menuItemIcon}><LuWallet size={16} /></span> Budget Box</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuCloudSun size={16} /></span> Weather Box</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuLightbulb size={16} /></span> Travel Tips</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuTriangleAlert size={16} /></span> Travel Warning</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuHotel size={16} /></span> Hotel Recommendation</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuUtensils size={16} /></span> Food Recommendation</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuBackpack size={16} /></span> Packing List</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuCalendarDays size={16} /></span> Itinerary Block</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuCircleHelp size={16} /></span> FAQ Block</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuMap size={16} /></span> Map Embed</button>
          </div>

          <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>Advanced Content</div>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuVideo size={16} /></span> Video</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuTable size={16} /></span> Table</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuQuote size={16} /></span> Quote</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuMinus size={16} /></span> Divider</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuListTree size={16} /></span> Accordion</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuSquareSplitHorizontal size={16} /></span> Tabs</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuMousePointerClick size={16} /></span> Button</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuCode size={16} /></span> Code Block</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuImagePlus size={16} /></span> Gallery</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuShare2 size={16} /></span> Social Embed</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuYoutube size={16} /></span> YouTube Embed</button>
          </div>

          <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>SEO Tools</div>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuSearch size={16} /></span> Meta Settings</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuSettings size={16} /></span> Schema Settings</button>
          </div>

          <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>Publishing</div>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuSave size={16} /></span> Save Draft</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuEye size={16} /></span> Preview</button>
              <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuSend size={16} /></span> Schedule / Publish</button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoreToolsMenu;
