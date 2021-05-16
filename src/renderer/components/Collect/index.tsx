import React from 'react';

export interface CollectProps {
  title: string;
}
const { production } = window.contextModules.process;

export const Collect: React.FC<CollectProps> = ({ title }) => {
  return (
    <>
      {production && (
        <webview
          src={`https://ff.1zilc.top/collect?title=${title}`}
          style={{ height: 1080, width: 1920, display: 'none' }}
        ></webview>
      )}
    </>
  );
};
export default Collect;
