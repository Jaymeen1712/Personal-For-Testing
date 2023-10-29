import React from 'react';
import { TFunction } from 'react-i18next';
import { Button } from 'antd';

import ArrowLeftIcon from '../../../../../images/icons/arrow-left-icon';

interface IHeaderFacetsDetail {
  t: TFunction<'translation', undefined>;
  onSaveFacetClick: () => void;
  onBackButtonClick: () => void;
  isEditingExistingFacet: boolean;
}

const HeaderFacetsDetail: React.FC<IHeaderFacetsDetail> = ({
  t,
  onSaveFacetClick,
  onBackButtonClick,
  isEditingExistingFacet,
}) => {
  console.log(isEditingExistingFacet);
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onBackButtonClick}>
          <ArrowLeftIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {isEditingExistingFacet
              ? t('common.labels.edit_facet')
              : t('common.labels.add_facet')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.add_facet_sub_title')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          <Button onClick={onBackButtonClick}>
            {t('common.labels.cancel')}
          </Button>
          <Button
            id={t('common.labels.add_rule')}
            type="primary"
            onClick={onSaveFacetClick}>
            {t('common.labels.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderFacetsDetail;
