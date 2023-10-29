import useAboutAppComponentController from './about-app-component-controller';
import { Button } from 'antd';
import React from 'react';
import AffirmLogoIcon from '../../../../../../../images/icons/affirm-logo-icon';
import IntegrationsHeader from '../../../../header/integration-header';

const AboutAppComponent = () => {
  const { t, onBackButtonClick, onGetThisAppButtonClick } =
    useAboutAppComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        onGetThisAppButtonClick={onGetThisAppButtonClick}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.affirm_title_text')}
        isAppInstalled={false}
        icon={<AffirmLogoIcon />}
        titleText={t('common.labels.affirm_title_text')}
      />
      <div className="about-app-section">
        <div className="left-section">
          <h2>{t('common.labels.about_app')}</h2>
          <p>
            <big>{t('common.messages.affirm_about')}</big>
          </p>{' '}
          <h3>{t('common.labels.app_features')}</h3>
          <ul className="dot-list">
            <li>{t('common.messages.affirm_feature_loans')}</li>
            <li>{t('common.messages.affirm_feature_monthly_payments')}</li>
            <li>{t('common.messages.affirm_feature_loan_decisions')}</li>
            <li>{t('common.messages.affirm_feature_loan_management')}</li>
            <li>
              {t('common.messages.affirm_feature_personalized_loan_offers')}
            </li>
          </ul>
        </div>
        <div className="right-section">
          <h2>{t('common.labels.documentations')}</h2>
          <Button type="link" className="display-block m-b-8">
            {t('common.labels.installation_guide')}
          </Button>
          <Button type="link" className="display-block m-b-8">
            {t('common.labels.user_guide')}
          </Button>
          <h2 className="m-t-32">{t('common.labels.support')}</h2>
          <Button type="link" className="display-block m-b-8">
            {t('common.labels.contact_support')}
          </Button>
        </div>
      </div>
    </>
  );
};
export default AboutAppComponent;
