import useAboutAppComponentController from './about-app-component-controller';
import { Button, Modal } from 'antd';
import React from 'react';
import ContentfulLogoIcon from '../../../../../../../images/icons/contentful-logo-icon';
import IntegrationsHeader from '../../../../header/integration-header';

const AboutAppComponent = () => {
  const {
    t,
    onBackButtonClick,
    onGetThisAppButtonClick,
    hideModal,
    isAppInstallModalVisible,
    onAcceptButtonClick,
    isAppInstallLoading,
  } = useAboutAppComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        onGetThisAppButtonClick={onGetThisAppButtonClick}
        onBackButtonClick={onBackButtonClick}
        integrationName="Contentful"
        isAppInstalled={false}
        icon={<ContentfulLogoIcon />}
        titleText={t('common.labels.contentful_title_text')}
      />
      <div className="about-app-section">
        <div className="left-section">
          <h2>{t('common.labels.about_app')}</h2>
          <p>
            <big>{t('common.messages.contentful_about')}</big>
          </p>
          {/* <div className="about-image-column contentful-about">&nbsp;</div> */}
          <h3>{t('common.labels.app_features')}</h3>
          <ul className="dot-list">
            <li>{t('common.messages.contentful_feature_flexible')}</li>
            <li>{t('common.messages.contentful_feature_user_friendly')}</li>
            <li>{t('common.messages.contentful_feature_api_tools')}</li>
            <li>{t('common.messages.contentful_feature_integration')}</li>
            <li>{t('common.messages.contentful_feature_scalability')}</li>
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
      <Modal
        title={`${t('common.labels.install')} Contentful - CMS ${t(
          'common.labels.platform'
        )}`}
        open={isAppInstallModalVisible}
        onCancel={hideModal}
        onOk={onAcceptButtonClick}
        confirmLoading={isAppInstallLoading}
        okText={t('common.labels.install')}
        centered>
        <div className="user-delete-modal">
          <p className="m-0 gray-text">
            {t('common.messages.install_platform_first_part')}{' '}
            <Button
              type="link"
              target="_blank"
              href="https://www.experro.com/terms-of-services/">
              {t('common.labels.terms_and_conditions')}
            </Button>{' '}
            {t('common.messages.install_platform_last_part')}
          </p>
        </div>
      </Modal>
    </>
  );
};
export default AboutAppComponent;
