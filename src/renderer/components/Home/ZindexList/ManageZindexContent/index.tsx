import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'ahooks';
import classnames from 'classnames';
import { ReactSortable } from 'react-sortablejs';

import PureCard from '@/components/Card/PureCard';
import { ReactComponent as MenuIcon } from '@/assets/icons/menu.svg';
import Eye from '@/components/Eye';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { setZindexConfigAction } from '@/actions/zindex';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface ManageZindexContentProps {
  onEnter: () => void;
  onClose: () => void;
}
interface MarketProps {
  name: string;
  code: Enums.ZindexType;
  onEyeChange: (status: boolean, code: Enums.ZindexType) => void;
  onCheckChange: (status: boolean, code: Enums.ZindexType) => void;
  selections: string[];
  setSelectrions: (selections: string[]) => void;
}

const Market: React.FC<MarketProps> = (props) => {
  const { name, code, selections } = props;
  const [eyeOpen, { toggle }] = useBoolean(true);
  const { zindexConfig } = useSelector((state: StoreState) => state.zindex.config);
  const { indeterminate, checked } = useMemo(() => {
    const selectedMap = Utils.MakeMap(selections);
    const markets = zindexConfig.filter((_) => _.type === code);
    const checkEvery = markets.every((_) => selectedMap[_.code]);
    const checkSome = markets.some((_) => selectedMap[_.code]);
    return {
      indeterminate: !checkEvery && checkSome,
      checked: checkEvery,
    };
  }, [selections, code]);

  useEffect(() => {
    props.onEyeChange(eyeOpen, code);
  }, [eyeOpen, code]);

  return (
    <PureCard className={styles.market}>
      <Checkbox indeterminate={indeterminate} checked={checked} onChange={(e) => props.onCheckChange(e.target.checked, code)}>
        {name}
      </Checkbox>
      <Eye status={eyeOpen} onClick={toggle} />
    </PureCard>
  );
};

export const marketsConfig = [
  { name: '沪深指数', code: Enums.ZindexType.SS },
  { name: '美洲股市', code: Enums.ZindexType.America },
  { name: '亚洲股市', code: Enums.ZindexType.Asia },
  { name: '欧洲股市', code: Enums.ZindexType.Europe },
  { name: '澳洲股市', code: Enums.ZindexType.Australia },
  { name: '其他', code: Enums.ZindexType.Other },
];

const marketsGroup = Utils.Group(marketsConfig, 2);

const ManageZindexContent: React.FC<ManageZindexContentProps> = (props) => {
  const dispatch = useDispatch();
  const { zindexConfig, selectZindexs } = useSelector((state: StoreState) => state.zindex.config);
  const [sortZindexConfig, setSortZindexConfig] = useState(zindexConfig.map((_) => ({ ..._, id: _.code, eyeOpen: true })));
  const [selections, setSelections] = useState(selectZindexs);

  function onSave() {
    const selectedMap = Utils.MakeMap(selections);
    sortZindexConfig.forEach((zindex) => {
      zindex.show = !!selectedMap[zindex.code];
    });
    dispatch(setZindexConfigAction(sortZindexConfig));
    props.onEnter();
  }

  function onMarketCheckChange(status: boolean, code: Enums.ZindexType) {
    const selectedMap = Utils.MakeMap(selections);
    const newSelections = [
      ...sortZindexConfig.filter((_) => _.type !== code && selectedMap[_.code]).map((_) => _.code),
      ...sortZindexConfig.filter((_) => _.type === code && status).map((_) => _.code),
    ];
    setSelections(newSelections);
  }

  function onMarketEyeChange(status: boolean, code: Enums.ZindexType) {
    setSortZindexConfig(
      sortZindexConfig.map((_) => ({
        ..._,
        eyeOpen: _.type === code ? status : _.eyeOpen,
      }))
    );
  }

  return (
    <CustomDrawerContent title="指数自选" enterText="保存" onEnter={onSave} onClose={props.onClose}>
      <div className={styles.content}>
        {marketsGroup.map((markets, index) => (
          <div key={index} className={styles.markets}>
            {markets.map((market) => (
              <Market
                key={market.code}
                name={market.name}
                code={market.code}
                onCheckChange={onMarketCheckChange}
                onEyeChange={onMarketEyeChange}
                selections={selections}
                setSelectrions={setSelections}
              />
            ))}
          </div>
        ))}
        <Checkbox.Group style={{ width: '100%' }} onChange={(e) => setSelections(e.map((i) => String(i)))} value={selections}>
          <ReactSortable animation={200} delay={2} list={sortZindexConfig} setList={setSortZindexConfig} dragClass={styles.dragItem} swap>
            {sortZindexConfig.map((zindex) => {
              return (
                <PureCard
                  key={zindex.code}
                  className={classnames(styles.row, 'hoverable', {
                    [styles.disappear]: !zindex.eyeOpen,
                  })}
                >
                  <Checkbox value={zindex.code}>{zindex.name}</Checkbox>
                  <MenuIcon />
                </PureCard>
              );
            })}
          </ReactSortable>
        </Checkbox.Group>
      </div>
    </CustomDrawerContent>
  );
};

export default ManageZindexContent;
