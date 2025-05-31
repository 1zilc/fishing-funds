import React from 'react';
import colorHash from '@/utils/colorHash';
import styles from './index.module.css';

interface ColorfulTagsProps {
  tags: string[];
}

const ColorfulTags: React.FC<ColorfulTagsProps> = ({ tags }) => {
  return (
    <div className={styles.tags}>
      {tags.map((tag) => {
        const color = colorHash.hex(tag);
        return (
          <div key={tag} className={styles.tag} style={{ background: color, boxShadow: `0 2px 5px ${color}` }}>
            {tag}
          </div>
        );
      })}
    </div>
  );
};

export default ColorfulTags;
