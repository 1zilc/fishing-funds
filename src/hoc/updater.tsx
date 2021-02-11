import React, { useLayoutEffect } from 'react';
import { useInterval } from 'ahooks';
import { ipcRenderer } from 'electron';
import { useDispatch } from 'react-redux';
import { updateAvaliable } from '@/actions/updater';

const Updater = (WrappedComponent: React.FC<any>) => {
  return () => {
    const dispatch = useDispatch();
    // 一个小时检查一次版本
    useInterval(() => ipcRenderer.send('check-update'), 1000 * 60 * 60 * 1);
    useLayoutEffect(() => {
      ipcRenderer.on('update-available', (e, data) =>
        dispatch(updateAvaliable(data))
      );
      return () => {
        ipcRenderer.removeAllListeners('update-available');
      };
    }, []);
    return <WrappedComponent />;
  };
};

export default Updater;
