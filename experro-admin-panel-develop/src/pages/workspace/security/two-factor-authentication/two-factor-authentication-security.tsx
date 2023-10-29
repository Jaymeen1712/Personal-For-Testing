import React from 'react';
import { Button, Checkbox, Col, Row, Switch, Tag, Typography } from 'antd';

import useTwoFactorAuthenticationSecurityController from './two-factor-authentication-security-controller';
import AuthenticatorAppTwoFactorAuthentication from './authenticator-app';
import CopiedRecoveryKeyTwoFactorAuthentication from './copied-recovery-key';
import CreateNewRecoveryKeyTwoFactorAuthentication from './create-new-recovery-key';
import PreferenceTwoFactorAuthentication from './preference';
import CreateNewRecoveryKeyModalTwoFactorAuthentication from './create-new-recovery-key-modal';
import DisableModalTwoFactorAuthentication from './disable-modal';
import BannerPersonManagingSettings from '../../../../images/banners/banner-person-managing-settings';

const { Link } = Typography;

const TwoFactorAuthenticationSecurity: React.FC = () => {
  const {
    t,
    profile,
    onTwoFactorAuthenticationEnable,
    isTwoFactorEnableDisableSwitch,
    onTwoFactorAuthenticationSwitchChange,
    onTwoFactorAuthenticationUsingEmail,
    onTwoFactorAuthenticationUsingApp,
    generateQrTwoFactorAuthentication,
    onVerify,
    validateQrForm,
    form,
    onIHaveCopiedClick,
    onReCreateEmergencyRecoveryKey,
    selectedFirstPreference,
    onPreferenceChange,
    isDisableTwoFactorModalVisible,
    isDisableTwoFactorEmailModalVisible,
    isDisableTwoFactorAuthenticationUsingAppModalVisible,
    onDisableMfa,
    isTwoFactorAuthenticationUsingEmail,
    isTwoFactorAuthenticationUsingApp,
    isCreateNewRecoveryKeyModalVisible,
    onHideGenerateNewKeyModal,
    onCreateNewRecoveryKey,
    onHideDisableTwoFactor,
  } = useTwoFactorAuthenticationSecurityController();

  return (
    <>
      {profile.data && !profile.data.isMfa ? (
        <Row
          className={`generate-box ant-row ant-space-align-center p-32 image-large`}>
          <Col span={12}>
            <div className="generate-box-content p-l-32">
              <h1 className="h4 m-b-16 secondary-black">
                {t('common.labels.two_factor_banner_header')}
              </h1>
              <p className="m-b-32 gray-text">
                {t('common.labels.two_factor_banner_description')}
              </p>
              <div className="m-b-32">
                <Link
                  href="https://support.experro.com/hc/en-us/articles/9854610201757"
                  target="_blank">
                  {t('common.labels.learn_more_about_2fa')}
                </Link>
              </div>

              <Button type="primary" onClick={onTwoFactorAuthenticationEnable}>
                {t('common.labels.two_factor_banner_button_name')}
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className="generate-box-img ant-row ant-row-end">
              <BannerPersonManagingSettings />
            </div>
          </Col>
        </Row>
      ) : (
        <>
          <div className="ant-row email-top-switch m-b-40">
            <Switch
              checked={isTwoFactorEnableDisableSwitch}
              onChange={onTwoFactorAuthenticationSwitchChange}
              className="m-r-12"
            />
            <h3 className="m-0">
              {t('common.labels.two_factor_authentication')}
            </h3>
          </div>

          <div
            className={`ant-row email-top-switch ${
              !isTwoFactorEnableDisableSwitch ? 'disabled' : ''
            } `}>
            <Checkbox
              className="m-r-24"
              disabled={!isTwoFactorEnableDisableSwitch}
              onChange={onTwoFactorAuthenticationUsingEmail}
              checked={isTwoFactorAuthenticationUsingEmail}></Checkbox>
            <div>
              <div className="ant-row ant-space-align-center m-b-8">
                <h3 className="m-0 font-normal">
                  {t('common.labels.two_factor_authentication_using_email')}
                </h3>
                <Tag
                  className="m-l-8"
                  color={
                    profile.data && profile.data.isMfaMail ? 'success' : 'error'
                  }>
                  {profile.data && profile.data.isMfaMail
                    ? t('common.labels.enable')
                    : t('common.labels.disable')}
                </Tag>
              </div>
              <p className="m-0 gray-text">
                {t(
                  'common.labels.two_factor_authentication_using_email_description'
                )}
              </p>
            </div>
          </div>

          <div
            className={`ant-row email-top-switch m-t-32 ${
              !isTwoFactorEnableDisableSwitch ? 'disabled' : ''
            } `}>
            <Checkbox
              className="m-r-24"
              disabled={!isTwoFactorEnableDisableSwitch}
              onChange={onTwoFactorAuthenticationUsingApp}
              checked={isTwoFactorAuthenticationUsingApp}></Checkbox>
            <div>
              <div className="ant-row ant-space-align-center m-b-8">
                <h3 className="m-0 font-normal">
                  {t('common.labels.two_factor_authentication_using_app')}
                </h3>
                <Tag
                  className="m-l-8"
                  color={
                    profile.data &&
                    profile.data.isMfaAuthApp &&
                    profile.data.recoveryKey &&
                    profile.data.isRecoveryKeyGenerated
                      ? 'success'
                      : 'error'
                  }>
                  {profile.data &&
                  profile.data.isMfaAuthApp &&
                  profile.data.recoveryKey &&
                  profile.data.isRecoveryKeyGenerated
                    ? t('common.labels.enable')
                    : t('common.labels.disable')}
                </Tag>
              </div>
              <p className="m-0 gray-text">
                {t(
                  'common.labels.two_factor_authentication_using_app_description'
                )}
              </p>
            </div>
          </div>

          {profile.data &&
            profile.data.isMfa &&
            profile.data.isMfaEnable &&
            profile.data.isMfaAuthApp &&
            !profile.data.recoveryKey && (
              <AuthenticatorAppTwoFactorAuthentication
                t={t}
                generateQrTwoFactorAuthentication={
                  generateQrTwoFactorAuthentication.data
                }
                onVerify={onVerify}
                validateQrForm={validateQrForm}
              />
            )}

          {profile.data &&
            profile.data.isMfa &&
            profile.data.isMfaEnable &&
            profile.data.isMfaAuthApp &&
            profile.data.recoveryKey &&
            !profile.data.isRecoveryKeyGenerated && (
              <CopiedRecoveryKeyTwoFactorAuthentication
                t={t}
                profile={profile.data}
                onIHaveCopiedClick={onIHaveCopiedClick}
              />
            )}

          {profile.data &&
            profile.data.isMfa &&
            profile.data.isMfaEnable &&
            profile.data.isMfaAuthApp &&
            profile.data.recoveryKey &&
            profile.data.isRecoveryKeyGenerated && (
              <CreateNewRecoveryKeyTwoFactorAuthentication
                t={t}
                onReCreateEmergencyRecoveryKey={onReCreateEmergencyRecoveryKey}
              />
            )}

          {profile.data &&
            profile.data.isMfa &&
            profile.data.isMfaEnable &&
            profile.data.isMfaMail &&
            profile.data.isMfaAuthApp &&
            profile.data.isRecoveryKeyGenerated &&
            profile.data.recoveryKey && (
              <PreferenceTwoFactorAuthentication
                t={t}
                onPreferenceChange={onPreferenceChange}
                selectedFirstPreference={selectedFirstPreference}
              />
            )}
        </>
      )}

      <CreateNewRecoveryKeyModalTwoFactorAuthentication
        t={t}
        isCreateNewRecoveryKeyModalVisible={isCreateNewRecoveryKeyModalVisible}
        onHideGenerateNewKeyModal={onHideGenerateNewKeyModal}
        onCreateNewRecoveryKey={onCreateNewRecoveryKey}
      />

      <DisableModalTwoFactorAuthentication
        t={t}
        isDisableTwoFactorModalVisible={isDisableTwoFactorModalVisible}
        isDisableTwoFactorEmailModalVisible={
          isDisableTwoFactorEmailModalVisible
        }
        isDisableTwoFactorAuthenticationUsingAppModalVisible={
          isDisableTwoFactorAuthenticationUsingAppModalVisible
        }
        onDisableMfa={onDisableMfa}
        onHideDisableTwoFactor={onHideDisableTwoFactor}
        form={form}
      />
    </>
  );
};

export default TwoFactorAuthenticationSecurity;
