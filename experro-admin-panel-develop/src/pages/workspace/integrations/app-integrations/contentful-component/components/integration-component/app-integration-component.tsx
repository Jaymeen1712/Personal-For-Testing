import { Button } from 'antd';
import React from 'react';

import useIntegrationComponentController from './app-integration-component-controller';

import ContentfulLogoIcon from '../../../../../../../images/icons/contentful-logo-icon';
import IntegrationsHeader from '../../../../header/integration-header';

const AppIntegrationComponent = () => {
  const { t, onAcceptButtonClick, onCancelButtonClick } =
    useIntegrationComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        onBackButtonClick={onCancelButtonClick}
        integrationName="Integrations with Contentful"
        isHideButton={true}
        icon={<ContentfulLogoIcon />}
      />
      <div className="app-interation-section w-480">
        <h3>Things you can do</h3>
        <ul className="dot-list right-icon">
          <li>View content model & types</li>
          <li>View content model fields</li>
          <li>View content records</li>
          <li>View records status</li>
          <li>View media assets</li>
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
