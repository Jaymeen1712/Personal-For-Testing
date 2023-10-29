import { onSidebarToggle } from '../../../utills';
import HamburgerIcon from '../../../images/icons/hamburger-icon';
import React from 'react';
import { TFunction } from 'react-i18next';
import { Button, Tooltip } from 'antd';

interface IHeaderEdgeCaching {
  t: TFunction<'translation', undefined>;
  canDeleteCache: boolean;
  onPurgeAllCacheClick: () => void;
}

const HeaderEdgeCaching: React.FC<IHeaderEdgeCaching> = ({
  t,
  canDeleteCache,
  onPurgeAllCacheClick,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.cache')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.cache_subtitle')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end ant-space-align-center">
          <Tooltip
            placement="bottom"
            title={
              !canDeleteCache && t('common.messages.you_dont_have_access')
            }>
            <Button
              onClick={onPurgeAllCacheClick}
              disabled={!canDeleteCache}
              danger
              type="primary">
              {t('common.labels.purge_all_cache')}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default HeaderEdgeCaching;
