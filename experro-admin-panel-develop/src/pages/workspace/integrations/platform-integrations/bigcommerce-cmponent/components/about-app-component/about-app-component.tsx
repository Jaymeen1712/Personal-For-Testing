import useAboutAppComponentController from './about-app-component-controller';
import { Button, Modal } from 'antd';
import React from 'react';
import BigCommerceLogoIcon from '../../../../../../../images/icons/bigcommerce-logo-icon';
import IntegrationsHeader from '../../../../header';

const AboutAppComponent = () => {
  const {
    t,
    onBackButtonClick,
    canUpdateEcommerceStore,
    isInstallAppModalVisible,
    onInstallButtonClick,
    isAppInstallLoading,
    onVisitWebsiteButtonClick,
    toggleModal,
  } = useAboutAppComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        onGetThisAppButtonClick={() => toggleModal(true)}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.bigcommerce')}
        isAppInstalled={false}
        icon={<BigCommerceLogoIcon />}
        titleText={t('common.labels.bigcommerce_title_text')}
        onVisitWebsiteButtonClick={onVisitWebsiteButtonClick}
        type="platforms"
        canInstallOrRemoveApp={canUpdateEcommerceStore() || false}
      />
      <div className="about-app-section">
        <div className="left-section">
          <h2>{t('common.labels.about_platform')}</h2>
          <p>
            <big>{t('common.messages.bigcommerce_about')}</big>
          </p>{' '}
          <h3>{t('common.labels.platform_features')}</h3>
          <ul className="dot-list">
            <li>{t('common.messages.bigcommerce_feature_customizable')}</li>
            <li>{t('common.messages.bigcommerce_feature_secure')}</li>
            <li>
              {t('common.messages.bigcommerce_feature_payment_integration')}
            </li>
            <li>
              {t('common.messages.bigcommerce_feature_order_management_tools')}
            </li>
            <li>{t('common.messages.bigcommerce_feature_marketing_seo')}</li>
          </ul>
        </div>
        <div className="right-section">
          <h2>{t('common.labels.documentations')}</h2>
          <Button
            type="link"
            target="_blank"
            href="https://support.experro.com/hc/en-us/articles/7925100805789">
            {t('common.labels.installation_guide')}
          </Button>
          {/* <Button type="link" className="display-block m-b-8">
            {t('common.labels.user_guide')}
          </Button> */}
          <h2 className="m-t-32">{t('common.labels.support')}</h2>
          <Button
            type="link"
            className="m-b-8"
            target="_blank"
            href="https://www.experro.com/contact-us/">
            {t('common.labels.contact_support')}
          </Button>
        </div>
      </div>
      <Modal
        className="confirm-modal"
        title={`${t('common.labels.install')} BigCommerce - eCommerce`}
        open={isInstallAppModalVisible}
        onCancel={() => toggleModal(false)}
        onOk={onInstallButtonClick}
        confirmLoading={isAppInstallLoading}
        okText={t('common.labels.install')}
        centered>
        <div className="user-delete-modal">
          <p className="m-0">
            {t('common.messages.install_platform_first_part')}{' '}
            <a
              type="link"
              target="_blank"
              rel="noreferrer"
              href="https://www.experro.com/terms-of-services/">
              {t('common.labels.terms_and_conditions')}
            </a>{' '}
            {t('common.messages.install_platform_last_part')}
          </p>
        </div>
      </Modal>
    </>
  );
};
export default AboutAppComponent;
