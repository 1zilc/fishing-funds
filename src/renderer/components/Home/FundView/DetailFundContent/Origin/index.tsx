import React from 'react';
import { Table } from 'antd';
import { APIOptions } from '@/components/Toolbar/SettingContent';
import * as Enums from '@/utils/enums';

const { shell } = window.contextModules.electron;

interface OriginProps {
  code: string;
}

const Origin: React.FC<OriginProps> = ({ code }) => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
  ];

  function onMore(type: Enums.FundApiType) {
    switch (type) {
      case Enums.FundApiType.Eastmoney:
        shell.openExternal(`http://fund.eastmoney.com/${code}.html`);
        break;
      case Enums.FundApiType.Ant:
        shell.openExternal(`https://www.fund123.cn/matiaria?fundCode=${code}`);
        break;
      case Enums.FundApiType.Fund10jqka:
        shell.openExternal(`http://fund.10jqka.com.cn/${code}/`);
        break;
      case Enums.FundApiType.Tencent:
        shell.openExternal(`https://gu.qq.com/${code}`);
        break;
        break;
      default:
        break;
    }
  }

  return (
    <Table
      rowKey="code"
      size="small"
      columns={columns}
      dataSource={APIOptions}
      pagination={{
        defaultPageSize: 5,
        hideOnSinglePage: true,
        position: ['bottomCenter'],
      }}
      onRow={(record) => ({
        onClick: () => onMore(record.code),
      })}
    />
  );
};

export default Origin;
