import React from 'react';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import useListEnvironmentController from './list-environments-controller';
import { onSidebarToggle } from '../../../../utills';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import { Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ListEnvironments: React.FC = () => {
  const {
    columns,
    listEnvironmentsData,
    isSuccess,
    t,
    onChangeTable,
    isSortByClick,
  } = useListEnvironmentController();

  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onSidebarToggle}>
            <HamburgerIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.environments')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.list_environments')}
            </span>
          </div>
        </div>
      </div>
      {(isSuccess && listEnvironmentsData) || isSortByClick ? (
        <div className="table-section">
          <Table
            onChange={onChangeTable}
            columns={columns}
            //@ts-ignore
            dataSource={listEnvironmentsData}
            pagination={false}
            // onChange={onTableChange}
            locale={{
              emptyText: (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_record_added')}
                />
              ),
            }}
          />
        </div>
      ) : (
        <Spin
          data-testid={'loader'}
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      )}
    </>
  );
};

export default ListEnvironments;
