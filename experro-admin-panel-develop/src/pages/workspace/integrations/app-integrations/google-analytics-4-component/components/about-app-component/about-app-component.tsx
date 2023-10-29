import { Button } from 'antd';
import IntegrationsHeader from '../../../../header/integration-header';
import useAboutAppComponentController from './about-app-component-controller';
import GoogleAnalyticsLogoIcon from '../../../../../../../images/icons/google-analytics-logo-icon';

const AboutAppComponent = () => {
  const { t, onBackButtonClick } = useAboutAppComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        // onGetThisAppButtonClick={onGetThisAppButtonClick}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.google_analytics_title_text')}
        isAppInstalled={false}
        icon={<GoogleAnalyticsLogoIcon />}
        titleText={t('common.labels.google_analytics_title_text')}
      />
      <div className="about-app-section">
        <div className="left-section">
          <h2>{t('common.labels.about_app')}</h2>
          <p>
            <big>{t('common.messages.google_analytics_about')}</big>
          </p>{' '}
          <h3>{t('common.labels.app_features')}</h3>
          <ul className="dot-list">
            <li>{t('common.messages.google_analytics_feature_ml')}</li>
            <li>
              {t(
                'common.messages.google_analytics_feature_cross_platform_tracking'
              )}
            </li>
            <li>
              {t('common.messages.google_analytics_feature_event_tracking')}
            </li>
            <li>
              {t('common.messages.google_analytics_feature_data_collection')}
            </li>
            <li>
              {t('common.messages.google_analytics_feature_privacy_controlls')}
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
