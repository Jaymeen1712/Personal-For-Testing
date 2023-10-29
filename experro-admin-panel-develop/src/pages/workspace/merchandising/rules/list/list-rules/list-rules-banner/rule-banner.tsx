import React from 'react';
import { TFunction } from 'react-i18next';

import MerchandisingSiteRuleBanner from '../../../../../../../images/icons/merchandising-site-rule-banner';
import { Button, Col, Row } from 'antd';
import PlusIcon from '../../../../../../../images/icons/plus-icon';

interface IRuleBanner {
  t: TFunction<'translation', undefined>;
  subMenu?: string;
  addRule?: () => void;
}

const RuleBanner: React.FC<IRuleBanner> = ({ t, subMenu, addRule }) => {
  return (
    <Row className="generate-box ant-row ant-space-align-center p-32">
      <Col span={12}>
        <div className="generate-box-content p-l-32">
          <h1 className="h4 m-b-16 secondary-black">
            {t('common.labels.start_adding_rules')}
          </h1>
          <p className="m-b-32 gray-text">
            {subMenu === 'category-rules'
              ? t('common.labels.category_rule_banner_description')
              : subMenu === 'global-rules'
              ? t('common.labels.site_rule_banner_description')
              : t('common.labels.search_rule_banner_description')}
          </p>

          <Button
            type="primary"
            onClick={addRule}
            icon={
              <span className="anticon">
                <PlusIcon />
              </span>
            }>
            {t('common.labels.add_rule')}
          </Button>
        </div>
      </Col>
      <Col span={12}>
        <div className="generate-box-img ant-row ant-row-end">
          <MerchandisingSiteRuleBanner />
        </div>
      </Col>
    </Row>
  );
};

export default RuleBanner;
