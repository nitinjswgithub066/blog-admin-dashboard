import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TravelToolbar from './TravelToolbar';
import MoreToolsMenu from './MoreToolsMenu';
import DestinationFactsBlock from './CustomBlocks/DestinationFactsBlock';
import BudgetBoxBlock from './CustomBlocks/BudgetBoxBlock';
import styles from './TravelEditor.module.css';

interface TravelEditorProps {
  value: string;
  onChange: (val: string) => void;
  onOpenImport?: () => void;
}

export type TravelBlockType = 'destination' | 'budget';

const TravelEditor: React.FC<TravelEditorProps> = ({ value, onChange, onOpenImport }) => {
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);
  const [blocks, setBlocks] = useState<TravelBlockType[]>([]);
  const [activeFormattingTools, setActiveFormattingTools] = useState<string[]>([]);

  const handleToggleTool = (toolId: string) => {
    setActiveFormattingTools(prev => 
      prev.includes(toolId) ? prev.filter(t => t !== toolId) : [...prev, toolId]
    );
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TravelToolbar 
        onMoreClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)} 
        activeTools={activeFormattingTools}
        onToggleTool={handleToggleTool}
      />
      
      <MoreToolsMenu 
        isOpen={isMoreToolsOpen} 
        onClose={() => setIsMoreToolsOpen(false)} 
        activeTools={activeFormattingTools}
        onToggleTool={handleToggleTool}
        onInsertBlock={(type) => {
          setBlocks([...blocks, type]);
          setIsMoreToolsOpen(false);
        }}
      />

      <div className={styles.canvas}>
        {!value && blocks.length === 0 ? (
          <div className={styles.emptyStateHero}>
            <h2 className={styles.emptyTitle}>Start writing your travel story...</h2>
            <p className={styles.emptySubtitle}>Create content manually or import a Word document.</p>
            <div className={styles.emptyActions}>
              <button 
                type="button" 
                className={styles.startWritingBtn}
                onClick={() => onChange(' ')}
              >
                Start Writing
              </button>
              <button 
                type="button" 
                className={styles.importBtn}
                onClick={onOpenImport}
              >
                Import Word Document
              </button>
            </div>
          </div>
        ) : (
          <textarea
            className={styles.textarea}
            style={{ flex: 'none' }}
            placeholder="Start writing your travel story..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        )}
        
        {/* Render dynamically inserted blocks */}
        {blocks.length > 0 && (
          <div className={styles.blocksWrapper}>
            {blocks.map((block, i) => (
              <React.Fragment key={i}>
                {block === 'destination' && (
                  <DestinationFactsBlock onRemove={() => setBlocks(blocks.filter((_, idx) => idx !== i))} />
                )}
                {block === 'budget' && (
                  <BudgetBoxBlock onRemove={() => setBlocks(blocks.filter((_, idx) => idx !== i))} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {blocks.length > 0 && (
          <textarea
            className={styles.textarea}
            placeholder="Continue writing after the blocks..."
          />
        )}
      </div>
    </motion.div>
  );
};

export default TravelEditor;
