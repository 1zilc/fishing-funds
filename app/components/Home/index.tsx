import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoolean } from 'ahooks';
import routes from '../../constants/routes.json';
import { Collapse } from 'react-collapse';
import superagent from 'superagent';
import classnames from 'classnames';
import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { ReactComponent as FreshIcon } from 'assets/icons/fresh.svg';
import { ReactComponent as MoneyIcon } from 'assets/icons/consumption.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from 'assets/icons/arrow-up.svg';
import * as Utils from 'utils';

import styles from './index.css';
export interface Fund {
  name: string;
  fundcode: string;
  gztime: string;
  gszzl: string;
  jzrq: string;
  dwjz: string;
  gsz: string;
}
const codes = [
  {
    code: '003834',
    cyfe: 1279.65
  },
  {
    code: '161725',
    cyfe: 3482.86
  },
  {
    code: '260108',
    cyfe: 2341.88
  },
  {
    code: '003984',
    cyfe: 1122.73
  },
  {
    code: '320007',
    cyfe: 0
  }
];

const codeMap = codes.reduce((r, c, i) => {
  r[c.code] = c;
  return r;
}, {} as { [index: string]: any });

const jsonpgz = (response: any) => response;

const getFund = async (code: string) => {
  const { text } = await superagent.get(
    `http://fundgz.1234567.com.cn/js/${code}.js`
  );
  return eval(text);
};

export interface RowProps {
  fund: Fund;
  index: number;
}

const Row = props => {
  const { fund, index } = props;
  const [collapse, { toggle }] = useBoolean(false);
  const cyfe = codeMap[fund?.fundcode]?.cyfe || 0;
  const bjz = Utils.Minus(fund.gsz, fund.dwjz);
  const jrsygz = Utils.Multiply(cyfe, bjz).toFixed(2);
  const gszz = Utils.Multiply(fund.gsz, cyfe).toFixed(2);

  return (
    <div>
      <div className={styles.row}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100 + index
          }}
          onClick={() => toggle(_ => !_)}
        >
          <div className={styles.arrow}>
            {collapse ? (
              <ArrowUpIcon style={{ width: 12, height: 12 }} />
            ) : (
              <ArrowDownIcon style={{ width: 12, height: 12 }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span className={styles.fundName}>{fund.name} </span>
            </div>
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}> ({fund.fundcode}) </span>
                <span>{fund.gztime.slice(5)}</span>
              </div>
            </div>
          </div>
          <div
            className={classnames(
              styles.value,
              fund.gszzl < 0 ? styles.down : styles.up
            )}
          >
            {Utils.yang(fund.gszzl)} %
          </div>
          <div className={styles.remove} style={{ width: 20 }}>
            <RemoveIcon />
          </div>
        </div>
      </div>
      <Collapse isOpened={collapse}>
        <div className={styles.collapseContent}>
          <section>
            <span>当前净值：</span>
            <span>{fund.dwjz}</span>
          </section>
          <section>
            <span>估算值：</span>
            <span>{fund.gsz}</span>
            <span style={{ float: 'right' }}>({Utils.yang(bjz)})</span>
          </section>
          <section>
            <span>持有份额：</span>
            <span>{cyfe}</span>
          </section>
          <section>
            <span>今日收益估值：</span>
            <span>¥ {Utils.yang(jrsygz)}</span>
          </section>
          <section>
            <span>截止日期：</span>
            <span>{fund.jzrq}</span>
          </section>
          <section>
            <span>今日估算总值：</span>
            <span>¥ {gszz}</span>
          </section>
        </div>
      </Collapse>
    </div>
  );
};

export default function Home() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [showRemove, setRemove] = useState(false);

  const fresh = async () => {
    const result: Fund[] = await Promise.all(
      codes.map(({ code }) => getFund(code))
    );
    setFunds(result);
    return result;
  };
  useEffect(() => {
    fresh();
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {funds.map((fund, index) => {
          return <Row key={index} fund={fund} index={index} />;
        })}
      </div>
      <div className={styles.bar}>
        <AddIcon style={{ height: 24, width: 24 }} />
        <DeleteIcon
          style={{ height: 24, width: 24 }}
          onClick={() => setRemove(_ => !_)}
        />
        <FreshIcon style={{ height: 22, width: 22 }} onClick={fresh} />
        <SettingIcon style={{ height: 24, width: 24 }} />
      </div>
    </div>
  );
}
