import React from 'react';
import { useFakeUA } from '@/utils/hooks';

interface DaPanYunTuProps {}

const DaPanYunTu: React.FC<DaPanYunTuProps> = (props) => {
  const fakeUA = useFakeUA(false);
  return (
    <webview
      src="https://dapanyuntu.com/"
      style={{ height: 'calc(100vh - 222px)', overflow: 'hidden' }}
      useragent={fakeUA}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      allowpopups="true"
    />
  );
};
export default DaPanYunTu;
