import useAboutAppComponentController from './about-app-component-controller';
import { Button, Modal } from 'antd';
import React from 'react';
import ShopifyLogoIcon from '../../../../../../../images/icons/shopify-logo-icon';
import IntegrationsHeader from '../../../../header';

const AboutAppComponent = () => {
  const {
    t,
    onBackButtonClick,
    isInstallAppModalVisible,
    onInstallButtonClick,
    isAppInstallLoading,
    toggleModal,
    onVisitWebsiteButtonClick,
    canUpdateEcommerceStore,
  } = useAboutAppComponentController();
  return (
    <>
      <IntegrationsHeader
        isListHeader={false}
        onGetThisAppButtonClick={() => toggleModal(true)}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.shopify_title_text')}
        isAppInstalled={false}
        icon={<ShopifyLogoIcon />}
        titleText={t('common.labels.shopify_title_text')}
        onVisitWebsiteButtonClick={onVisitWebsiteButtonClick}
        type="platforms"
        canInstallOrRemoveApp={canUpdateEcommerceStore() || false}
      />
      <div className="about-app-section">
        <div className="left-section">
          <h2>{t('common.labels.about_platform')}</h2>
          <p>
            <big>{t('common.messages.shopify_about')}</big>
          </p>{' '}
          {/*<div className="about-image-column">&nbsp;</div>*/}
          <h3>{t('common.labels.platform_features')}</h3>
          <ul className="dot-list">
            <li> {t('common.messages.shopify_feature_easy_setup')}</li>
            <li>
              {t('common.messages.shopify_feature_mobile_responsive_themes')}
            </li>
            <li>{t('common.messages.shopify_feature_secure_shopping_cart')}</li>
            <li>{t('common.messages.shopify_feature_payment_integration')}</li>
            <li>{t('common.messages.shopify_feature_tax_calculations')}</li>
            <li>{t('common.messages.shopify_feature_seo')}</li>
            <li>{t('common.messages.shopify_feature_marketing_tools')}</li>
            <li>
              {t('common.messages.shopify_feature_abandoned_cart_recovery')}
            </li>
            <li>
              {t(
                'common.messages.shopify_feature_multi_channel_selling_options'
              )}
            </li>
          </ul>
        </div>
        <div className="right-section">
          <h2>{t('common.labels.documentations')}</h2>
          <Button
            type="link"
            className="m-b-8"
            target="_blank"
            href="https://support.experro.com/hc/en-us/articles/12024213786269">
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
        title={`${t('common.labels.install')} Shopify - eCommerce`}
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
