import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Button } from 'antd';

import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../images/icons/plus-icon';
import {
  IAPIError,
  IBigcommerceStore,
  IListEnvironments,
} from '../../../../types';
import { onSidebarToggle } from '../../../../utills';

interface IHeaderListBigcommerceStore {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissions: any;
  listStore: UseQueryResult<IBigcommerceStore[], IAPIError>;
  onAddStore: () => void;
  listEnvironment: UseQueryResult<IListEnvironments[], IAPIError>;
  addedEnvironmentsOfStores: string[];
}

const HeaderListBigcommerceStore: React.FC<IHeaderListBigcommerceStore> = ({
  t,
  permissions,
  listStore,
  onAddStore,
  listEnvironment,
  addedEnvironmentsOfStores,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.bigcommerce')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.bigcommerce-subtitle')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          {permissions.canCreateEcommerceStore() &&
            listStore.isSuccess &&
            listStore.data.length > 0 && (
              <Button
                type="primary"
                icon={<span className="anticon"><PlusIcon /></span>}
                onClick={onAddStore}
                disabled={
                  listEnvironment.data?.length ===
                  addedEnvironmentsOfStores.length
                }>
                {t('common.labels.add_store')}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default HeaderListBigcommerceStore;
