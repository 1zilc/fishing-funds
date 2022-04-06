import React from 'react';

export interface CollectProps {
  title: string;
}
const { production } = window.contextModules.process;

export const Collect: React.FC<CollectProps> = ({ title }) => {
  return <>{!production && title && <webview src={`https://ff.1zilc.top/collect?title=${title}`} style={{ display: 'none' }} />}</>;
};
export default Collect;
