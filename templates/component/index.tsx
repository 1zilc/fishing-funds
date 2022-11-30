import React from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

export type TemplateNameProps = {};

const TemplateName: React.FC<TemplateNameProps> = () => {
  return <div className={clsx(styles.content)}>TemplateName Component</div>;
};

export default TemplateName;
