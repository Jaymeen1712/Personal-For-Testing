import React from 'react';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../../utills';
import useListBigcommerceStoreController from './list-bigcommerce-store-controller';
import OnBoardBanner from '../../../../components/on-board-banner';
import BigCommerceImage from '../../../../images/BigCommerce.png';
import Grid from '../../../../components/grid';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import NoDataFound from '../../../../components/no-data-found';
import SubSideBar from '../../../../components/sub-sidebar';
import HeaderListBigcommerceStore from './header-list-bigcommerce-store';

interface IListBigcommerceStore {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ListBigcommerceStore: React.FC<IListBigcommerceStore> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    t,
    onAddStore,
    // canCreateStore,
    permissions,
    columns,
    listStore,
    listEnvironment,
    addedEnvironmentsOfStores,
  } = useListBigcommerceStoreController({ onMainSidebarActiveItem });

  return (
    <>
      <SubSideBar
        isGlobalPage={false}
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ECOMMERCE_PLUGINS.BIGCOMMERCE
        }>
        <HeaderListBigcommerceStore
          t={t}
          permissions={permissions}
          listStore={listStore}
          onAddStore={onAddStore}
          listEnvironment={listEnvironment}
          addedEnvironmentsOfStores={addedEnvironmentsOfStores}
        />
        {listStore.isSuccess && listStore?.data?.length ? (
          <>
            <div className="table-section">
              <Grid
                showPagination={false}
                columns={columns}
                rows={listStore.data}
                // url={`${APIS_ROUTES.BIGCOMMERCE}/${workspaceId}/bigcommerce-stores`}
                locale={{
                  emptyText: (
                    <NoDataFound
                      icon={<NoRecordIcon />}
                      title={t('common.labels.no_record_added')}
                      description={t('common.labels.add_user_above')}
                    />
                  ),
                }}
              />
            </div>
          </>
        ) : (
          <>
            {!listStore.isFetching && (
              <OnBoardBanner
                header={t('common.labels.bigcommerce')}
                description={t('common.labels.add_bigcommerce_store')}
                buttonName={t('common.labels.add_store')}
                onClickAction={onAddStore}
                image={BigCommerceImage}
                addButtonPermission={permissions.canCreateEcommerceStore()}
                className="image-large"
              />
            )}
          </>
        )}
      </SubSideBar>
    </>
  );
};

export default ListBigcommerceStore;
