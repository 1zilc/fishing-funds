import React from 'react';
import { WebViewer, WebViewerProps } from '@/components/WebViewerDrawer';
import { useRouterParams } from '@/utils/hooks';

export type WebViewerPageParams = Pick<WebViewerProps, 'phone' | 'title' | 'url'>;

const WebViewerPage: React.FC = () => {
  const params: WebViewerPageParams = useRouterParams();

  return <WebViewer full {...params} />;
};

export default WebViewerPage;
