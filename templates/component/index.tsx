import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TemplateNameProps {}

const TemplateName: React.FC<TemplateNameProps> = () => {
  return <div className={classnames(styles.content)}>TemplateName Component</div>;
};

export default TemplateName;
