import React from 'react';
import { Spin, Table } from 'antd';
import { ExpandableConfig } from 'rc-table/lib/interface';
import { TableLocale, TableRowSelection } from 'antd/es/table/interface';
import { LoadingOutlined } from '@ant-design/icons';

import useGridController from './grid-controller';
import { GridColumnType, GridParams } from '../../types';

interface GridProps {
  url?: string;
  columns: GridColumnType[];
  params?: GridParams;
  rows?: unknown[];
  showHeader?: boolean;
  showPagination?: boolean;
  expandable?: ExpandableConfig<object>;
  sortable?: boolean;
  className?: string;
  rowSelection?: TableRowSelection<object>;
  locale?: TableLocale;
  filterText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paginationData?: any;
}

const Grid: React.FC<GridProps> = ({
  url,
  columns,
  params,
  rows,
  showHeader,
  showPagination = true,
  expandable,
  sortable,
  className,
  rowSelection,
  locale,
  filterText,
  paginationData,
}) => {
  const { data, columnsWithCellRenderer, pagination, components, isSuccess } =
    useGridController(columns, url, params, sortable, rows, filterText);

  return (
    <>
      {isSuccess ? (
        <Table
          columns={columnsWithCellRenderer}
          dataSource={rows || data}
          pagination={
            showPagination && (paginationData ? paginationData : pagination)
          }
          showHeader={showHeader}
          expandable={expandable}
          components={components}
          className={className}
          rowSelection={rowSelection}
          locale={locale}
          rowKey="id"
        />
      ) : (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      )}
    </>
  );
};

export default Grid;
