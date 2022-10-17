import { useRequest } from 'ahooks';
import styles from './index.module.scss';
const { ipcRenderer } = window.contextModules.electron;

const Logo = () => {
  const { data } = useRequest(ipcRenderer.invoke.bind(null, 'get-app-icon'), {
    cacheKey: 'get-app-icon',
    cacheTime: -1,
  });
  return (
    <div className={styles.content}>
      <img src={data} draggable={false} />
    </div>
  );
};
export default Logo;
