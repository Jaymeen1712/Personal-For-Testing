import { Button } from 'antd';
import React from 'react';

import useIntegrationComponentController from './app-integration-component-controller';
import AffirmLogoIcon from '../../../../../../../images/icons/affirm-logo-icon';
import IntegrationsHeader from '../../../../header/integration-header';

const AppIntegrationComponent = () => {
  const { t, onAcceptButtonClick, onCancelButtonClick } =
    useIntegrationComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        onBackButtonClick={onCancelButtonClick}
        integrationName="Integrations with Affirm"
        isHideButton={true}
        titleText="Affirm"
        icon={<AffirmLogoIcon />}
      />
      <div className="app-interation-section w-480">
        <h3>Things you can do</h3>
        <ul className="dot-list right-icon">
          <li>View and modify carts</li>
          <li>View channel listings</li>
          <li>View channel settings</li>
          <li>View and modify sites and routes</li>
          <li>View and modify site content</li>
          <li>Customer login</li>
          <li>View customer information</li>
          <li>View and modify basic store information</li>
          <li>View and modify general store information</li>
          <li>View and modify marketing information</li>
          <li>View order</li>
          <li>View and modify products</li>
          <li>View and modify order transactions</li>
        </ul>
        <h3 className="m-t-32">Things you can not do</h3>
        <ul className="dot-list right-icon cross-circle-icon">
          <li>Access to your password</li>
        </ul>
        <div className="m-t-32 form-top-border">
          <Button
            key="headerAddRecord"
            type="primary"
            onClick={onAcceptButtonClick}>
            {t('common.labels.accept_and_configure')}
          </Button>
          <Button key="headerAddRecord" onClick={onCancelButtonClick}>
            {t('common.labels.cancel')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AppIntegrationComponent;
