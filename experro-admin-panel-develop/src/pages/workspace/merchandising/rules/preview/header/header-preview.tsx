import React from 'react';
import { Button, Layout, Tag } from 'antd';

import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import { IRuleList } from '../../../../../../types';
import { TFunction } from 'react-i18next';

const { Header } = Layout;

interface IHeaderPreview {
  backToEditor: () => void;
  t: TFunction<'translation', undefined>;
  rulesList?: IRuleList;
}

const HeaderPreview: React.FC<IHeaderPreview> = ({
  backToEditor,
  t,
  rulesList,
}) => {
  return (
    <Header>
      <div className="headerinner ant-row ant-space-align-center ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={backToEditor}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <div className="ant-row ant-row-no-wrap w-100">
              <span className="ant-page-header-heading-title">
                {rulesList?.contentModelData.title}
              </span>
              <Tag color="success">{t('common.labels.preview_mode')}</Tag>
          </div>
          
          <span className="ant-page-header-heading-sub-title m-t-4">
            {rulesList?.contentModelData.description}
          </span>
        </div>
        </div>
        <div className="headerright">
          <div className="ant-row ant-row-end ant-row-middle">
            <Button type="primary" onClick={backToEditor}>
              {t('common.labels.back_to_editor')}
            </Button>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HeaderPreview;
