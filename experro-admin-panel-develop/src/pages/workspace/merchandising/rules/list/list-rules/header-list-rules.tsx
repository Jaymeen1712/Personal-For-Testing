import React from 'react';
import { TFunction } from 'react-i18next';
import { Button } from 'antd';

import { onSidebarToggle } from '../../../../../../utills';
import HamburgerIcon from '../../../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../../../images/icons/plus-icon';

interface IHeaderListRules {
  subMenu?: string;
  t: TFunction<'translation', undefined>;
  isAddRuleButtonVisible: boolean;
  onAddRule?: () => void;
}

const HeaderListRules: React.FC<IHeaderListRules> = ({
  subMenu,
  t,
  isAddRuleButtonVisible,
  onAddRule,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {subMenu === 'category-rules'
              ? t('common.labels.category_rules')
              : subMenu === 'global-rules'
              ? t('common.labels.global_rules')
              : t('common.labels.search_rules')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {subMenu === 'category-rules'
              ? t('common.labels.category_rules_description')
              : subMenu === 'global-rules'
              ? t('common.labels.site_rules_description')
              : t('common.labels.search_rules_description')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          {isAddRuleButtonVisible && (
            <Button
              icon={
                <span className="anticon">
                  <PlusIcon />
                </span>
              }
              id={t('common.labels.add_rule')}
              type="primary"
              onClick={onAddRule}>
              {t('common.labels.add_rule')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderListRules;
