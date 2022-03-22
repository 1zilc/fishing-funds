import React, { useState } from 'react';
import { Input, Radio } from 'antd';
import ColorHash from 'color-hash';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import WebAppIcon from '@/components/Toolbar/AppCenterContent/WebAppIcon';
import StandCard from '@/components/Card/StandCard';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

interface AddWebContentProps {
  onEnter: (web: Web.SettingItem) => void;
  onClose: () => void;
  web: Web.SettingItem;
  favicons: string[];
}

const colorHash = new ColorHash();

const AddWebContent: React.FC<AddWebContentProps> = (props) => {
  const { web, favicons } = props;
  const [title, setTitle] = useState(web.title);
  const [url, setUrl] = useState(web.url);
  const [iconType, setIconType] = useState(Enums.WebIconType.First);
  const favicon = favicons[favicons.length - 1];

  function onEnter() {
    props.onEnter({
      title,
      url,
      iconType,
      color: colorHash.hex(title),
      icon: favicon,
    });
  }

  return (
    <CustomDrawerContent title="添加网站" enterText="确定" onClose={props.onClose} onEnter={onEnter}>
      <div className={styles.content}>
        <StandCard title="预览">
          <div className={styles.appContent}>
            <WebAppIcon favicon={favicon} title={title} iconType={iconType} />
          </div>
        </StandCard>
        <section>
          <label>
            <i className="red">*</i>网站标题：
          </label>
          <Input
            type="text"
            placeholder="请输入网站标题"
            value={title}
            size="small"
            onChange={(e) => {
              const value = e.target.value.trim();
              setTitle(value);
            }}
          />
        </section>
        <section>
          <label>
            <i className="red">*</i>网站地址：
          </label>
          <Input.TextArea
            placeholder="请输入网站地址"
            value={url}
            size="small"
            onChange={(e) => {
              const value = e.target.value.trim();
              setUrl(value);
            }}
          />
        </section>
        <section>
          <label>图标类型：</label>
          <Radio.Group value={iconType} onChange={(e) => setIconType(e.target.value)}>
            <Radio value={Enums.WebIconType.First}>首字</Radio>
            {favicons.length && <Radio value={Enums.WebIconType.Favicon}>favicon</Radio>}
          </Radio.Group>
        </section>
      </div>
    </CustomDrawerContent>
  );
};

export default AddWebContent;
