import { Button } from 'antd';
import IntegrationsHeader from '../../../../header/integration-header';
import useAboutAppComponentController from './about-app-component-controller';

const AboutAppComponent = () => {
  const { t, onBackButtonClick } = useAboutAppComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        // onGetThisAppButtonClick={onGetThisAppButtonClick}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.powerreview_title_text')}
        isAppInstalled={false}
        icon={<div className="powerreview-logo"></div>}
        titleText={t('common.labels.powerreview_title_text')}
      />
      <div className="about-app-section">
        <div className="left-section">
          <h2>{t('common.labels.about_app')}</h2>
          <p>
            <big>{t('common.messages.powerreviews_about')}</big>
          </p>{' '}
          <h3>{t('common.labels.app_features')}</h3>
          <ul className="dot-list">
            <li>
              {t('common.messages.powerreviews_feature_automated_review')}
            </li>
            <li>
              {t('common.messages.powerreviews_feature_review_management')}
            </li>
            <li>{t('common.messages.powerreviews_feature_syndication')}</li>
            <li>{t('common.messages.powerreviews_feature_analytics')}</li>
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
