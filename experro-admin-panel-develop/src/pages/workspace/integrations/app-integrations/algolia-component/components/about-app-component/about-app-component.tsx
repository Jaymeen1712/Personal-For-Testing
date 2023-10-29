import useAboutAppComponentController from './about-app-component-controller';
import { Button } from 'antd';
import React from 'react';
import IntegrationsHeader from '../../../../header/integration-header';
import AlgoliaLogoIcon from '../../../../../../../images/icons/algolia-logo-icon';

const AboutAppComponent = () => {
  const { t, onBackButtonClick, onGetThisAppButtonClick } =
    useAboutAppComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        onGetThisAppButtonClick={onGetThisAppButtonClick}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.algolia_title_text')}
        isAppInstalled={false}
        icon={<AlgoliaLogoIcon />}
        titleText={t('common.labels.algolia_title_text')}
      />
      <div className="about-app-section">
        <div className="left-section">
          <h2>{t('common.labels.about_app')}</h2>
          <p>
            <big>{t('common.messages.algolia_about')}</big>
          </p>{' '}
          <h3>{t('common.labels.app_features')}</h3>
          <ul className="dot-list">
            <li>{t('common.messages.algolia_feature_search')}</li>
            <li>{t('common.messages.algolia_feature_customizable_search')}</li>
            <li>{t('common.messages.algolia_feature_analytics')}</li>
            <li>
              {t('common.messages.algolia_feature_multilingual_search_support')}
            </li>
            <li>{t('common.messages.algolia_feature_developer_tools')}</li>
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
