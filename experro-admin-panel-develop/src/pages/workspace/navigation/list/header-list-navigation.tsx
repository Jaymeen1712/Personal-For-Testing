import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Button } from 'antd';

import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../images/icons/plus-icon';
import {
  IAPIError,
  IMenuNameResponse,
  ISelectNavigation,
} from '../../../../types';
import { onSidebarToggle } from '../../../../utills';

interface IHeaderListNavigation {
  t: TFunction<'translation', undefined>;
  listNavigation: UseQueryResult<ISelectNavigation[] | undefined, unknown>;
  contentModel: UseQueryResult<IMenuNameResponse | undefined, IAPIError>;
  onAddNavigationClick: () => void;
}

const HeaderListNavigation: React.FC<IHeaderListNavigation> = ({
  t,
  listNavigation,
  contentModel,
  onAddNavigationClick,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.navigation')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.navigation_subtitle')}
          </span>
        </div>
      </div>
      <div className="headerright">
        {!listNavigation.isLoading &&
          !contentModel.isLoading &&
          listNavigation.data &&
          listNavigation.data.length > 0 && (
            <div className="ant-row ant-row-end">
              <Button
                type="primary"
                icon={<span className="anticon"><PlusIcon /></span>}
                onClick={onAddNavigationClick}>
                {t('common.labels.add_navigation')}
              </Button>
            </div>
          )}
      </div>
    </div>
  );
};

export default HeaderListNavigation;
