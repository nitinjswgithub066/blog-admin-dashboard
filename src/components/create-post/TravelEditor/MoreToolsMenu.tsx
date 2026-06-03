import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuHighlighter, LuEraser, LuSubscript, LuSuperscript, LuPalette,
  LuMapPin, LuWallet, LuCloudSun, LuLightbulb, LuTriangleAlert, LuHotel, LuUtensils, LuBackpack, LuCalendarDays, LuCircleHelp, LuMap,
  LuListTree, LuSquareSplitHorizontal, LuMousePointerClick, LuCode, LuImagePlus, LuShare2, LuYoutube,
  LuSearch, LuSettings,
  LuSave, LuEye, LuSend
} from 'react-icons/lu';
import styles from './MoreToolsMenu.module.css';

interface MoreToolsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreToolsMenu: React.FC<MoreToolsMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Use setTimeout to prevent immediate close on the button click that opened it
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} aria-hidden="true">
        <motion.div 
          ref={menuRef}
          className={styles.menuContainer}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          role="menu"
        >
          
          <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>Text Tools</div>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuPalette size={16} /></span> Text Color</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuHighlighter size={16} /></span> Highlight</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuEraser size={16} /></span> Clear Formatting</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuSuperscript size={16} /></span> Superscript</button>
            <button className={styles.menuItem} role="menuitem"><span className={styles.menuItemIcon}><LuSubscript size={16} /></span> Subscript</button>
          </div>

          <div className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>Travel Blocks</div>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuMapPin size={16} /></span> Destination Facts</button>
            <button className={`${styles.menuItem} ${styles.travelBlockItem}`} role="menuitem"><span className={styles.menuItemIcon}><LuWallet size={16} /></span> Budget Box</button>
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

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MoreToolsMenu;
