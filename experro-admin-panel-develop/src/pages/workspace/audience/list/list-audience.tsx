import React from 'react';
import { Button } from 'antd';

import useListAudienceController from './list-audience-controller';
import Grid from '../../../../components/grid/grid';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import { onSidebarToggle } from '../../../../utills';

interface IListAudience {
  environment: string;
}

const ListAudience: React.FC<IListAudience> = ({ environment }) => {
  const {
    t,
    columns,
    listAudience,
    increaseRowCount,
    audienceList,
    isLoadMoreDisabled,
  } = useListAudienceController({ environment });

  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onSidebarToggle}>
            <HamburgerIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.all')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.list_audience_subtitle')}
            </span>
          </div>
        </div>
      </div>
      {listAudience.isSuccess && (
        <Grid
          className="audienceTable"
          columns={columns}
          rows={audienceList}
          showPagination={false}
        />
      )}
      {listAudience.data && listAudience.data.length > 0 && (
        <div className="text-center load-more-button">
          <Button
            onClick={increaseRowCount}
            type="primary"
            disabled={isLoadMoreDisabled}>
            {t('common.labels.load_more')}
          </Button>
        </div>
      )}
    </>
  );
};
export default ListAudience;
