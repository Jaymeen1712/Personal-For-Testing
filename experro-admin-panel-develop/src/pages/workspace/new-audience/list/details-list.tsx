import { Input, Spin, Table } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import SearchIcon from '../../../../images/icons/search-icon';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';

const DetailsList: React.FC<{
  t: (val: string) => string;
  onSearchDataChange: (e: HTMLInputElement) => void;
  totalRecordCount: number;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  segmentDetailsByQuery: any;
  currentPageNumber: number;
  skipLimit: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPageChange: any;
}> = ({
  onSearchDataChange,
  t,
  totalRecordCount,
  isLoading,
  columns,
  segmentDetailsByQuery,
  currentPageNumber,
  skipLimit,
  onPageChange,
}) => {
  return (
    <>
      <div className="search-section ant-row ant-space-align-center ant-row-space-between">
        <div className="ant-row ant-space-align-center">
          <div className={'m-0 m-r-16 ant-space-align-center'}>
            <Input
              autoComplete="off"
              size="middle"
              placeholder={t('common.labels.search')}
              prefix={<SearchIcon />}
              onChange={(e) => {
                // @ts-ignore
                onSearchDataChange(e);
              }}
              onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : '')}
            />
          </div>
          <span className="search-count">
            {totalRecordCount} {t('common.labels.records')}
          </span>
        </div>
      </div>
      <div>
        {isLoading ? (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : (
          <>
            <div className="table-section">
              <Table
                showSorterTooltip={false}
                className="audienceTable"
                columns={columns}
                dataSource={segmentDetailsByQuery}
                pagination={{
                  current: currentPageNumber,
                  defaultPageSize: skipLimit,
                  total: totalRecordCount,
                  showSizeChanger: true,
                  locale: { items_per_page: ' per page' },
                  onChange: onPageChange,
                  hideOnSinglePage: totalRecordCount
                    ? totalRecordCount < skipLimit
                    : false,
                }}
                locale={{
                  emptyText: (
                    <NoDataFound
                      icon={<NoRecordIcon />}
                      title={t('common.labels.audience_define_filter_message')}
                    />
                  ),
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default DetailsList;
