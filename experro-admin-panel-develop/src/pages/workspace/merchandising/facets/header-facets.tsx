import React from 'react';
import { TFunction } from 'react-i18next';
import { Button } from 'antd';

import { onSidebarToggle } from '../../../../utills';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../images/icons/plus-icon';

interface IHeaderFacets {
  t: TFunction<'translation', undefined>;
  isStoreAdded: boolean;
  onAddFacetClick: () => void;
}

const HeaderFacets: React.FC<IHeaderFacets> = ({
  t,
  isStoreAdded,
  onAddFacetClick,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.facets')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.facet_subtitle')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          {isStoreAdded && (
            <Button
              icon={<span className="anticon"><PlusIcon /></span>}
              id={t('common.labels.add_facet')}
              type="primary"
              onClick={onAddFacetClick}>
              {t('common.labels.add_facet')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderFacets;
