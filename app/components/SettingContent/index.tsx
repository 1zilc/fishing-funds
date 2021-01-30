import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Tilt from 'react-tilt';
import InputNumber from 'rc-input-number';
import Checkbox from 'rc-checkbox';
import wechatQRcodeImage from 'assets/qrcode/wechat.png';
import alipayQRcodeImage from 'assets/qrcode/alipay.png';
import { ReactComponent as QRcodeIcon } from 'assets/icons/qr-code.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/link.svg';
import { getSystemSetting, setSystemSetting } from '../../actions/setting';
import Coins from '../Coins';

import styles from './index.scss';
export interface SettingContentProps {
  show?: boolean;
  onEnter: () => void;
  onClose: () => void;
}

const { remote, shell } = require('electron');
const { app } = remote;

const SettingContent: React.FC<SettingContentProps> = props => {
  const {
    autoStartSetting,
    autoFreshSetting,
    freshDelaySetting
  } = getSystemSetting();

  const [autoStart, setAutoStart] = useState(autoStartSetting);
  const [autoFresh, setAutoFresh] = useState(autoFreshSetting);
  const [freshDelay, setFreshDelay] = useState(freshDelaySetting);

  const onSave = () => {
    setSystemSetting({
      autoStartSetting: autoStart,
      autoFreshSetting: autoFresh,
      freshDelaySetting: freshDelay || 1
    });
    app.setLoginItemSettings({
      openAtLogin: autoStart
    });
    props.onEnter();
  };

  useEffect(() => {
    setAutoStart(autoStartSetting);
    setAutoFresh(autoFreshSetting);
    setFreshDelay(freshDelaySetting);
  }, [props.show]);

  return (
    <div className={classnames(styles.content)}>
      <div className={styles.header}>
        <button className={styles.close} onClick={props.onClose}>
          关闭
        </button>
        <h3>设置</h3>
        <button className={styles.add} onClick={onSave}>
          保存
        </button>
      </div>
      <div className={styles.body}>
        <div>
          <div className={styles.title}>
            <SettingIcon />
            <span>通用设置</span>
          </div>
          <div className={styles.setting}>
            <section>
              <label>开机自启：</label>
              <Checkbox
                checked={autoStart}
                onChange={e => setAutoStart(e.target.checked)}
              />
            </section>
            <section>
              <label>自动刷新：</label>
              <Checkbox
                checked={autoFresh}
                onChange={e => setAutoFresh(e.target.checked)}
              />
            </section>
            <section>
              <label>刷新间隔(min)：</label>
              <InputNumber
                disabled={!autoFresh}
                value={freshDelay}
                onChange={setFreshDelay}
                className={styles.input}
                placeholder="1~60"
                precision={0}
                min={1}
                max={60}
              />
            </section>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <QRcodeIcon />
            <span>支付宝支持一下～</span>
          </div>
          <div className={styles.pay}>
            {/* <Coins num={20} /> */}
            <Tilt
              options={{ max: 25 }}
              className={classnames(styles.qrcode, styles.alipay)}
            >
              <img src={alipayQRcodeImage} />
            </Tilt>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <QRcodeIcon />
            <span>微信支持一下～</span>
          </div>
          <div className={styles.pay}>
            {/* <Coins num={20} /> */}
            <Tilt
              options={{ max: 25 }}
              className={classnames(styles.qrcode, styles.wechat)}
            >
              <img src={wechatQRcodeImage} />
            </Tilt>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <LinkIcon />
            <span>联系作者</span>
          </div>
          <div className={styles.link}>
            <a
              onClick={e => {
                shell.openExternal(e.target.innerHTML);
              }}
            >
              https://github.com/1zilc/fishing-funds
            </a>
          </div>
        </div>
      </div>
      <div className={styles.exit}>
        <button onClick={() => app.quit()}>退出程序</button>
      </div>
      <div className={styles.version}>version 1.0.1</div>
    </div>
  );
};

export default SettingContent;
