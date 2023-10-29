import React from 'react';
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Switch,
  Typography,
} from 'antd';
import get from 'lodash.get';
import { LoadingOutlined } from '@ant-design/icons';

import useUpdateEnvironmentsController from './update-environments-controller';
import CopyableIcon from '../../../../images/icons/copyable-icon';
import ArrowLeftIcon from '../../../../images/icons/arrow-left-icon';

const { TextArea } = Input;
const { Paragraph } = Typography;

const UpdateEnvironments: React.FC = () => {
  const {
    t,
    form,
    onCancel,
    onSaveEnvironment,
    isMaintenanceMode,
    isSetUpDomain,
    getEnvironment,
    onCustomDomainChecked,
    onSiteMapCopy,
    onUpdateButtonClick,
    onBackButtonClick,
    handleFieldChange,
    disableSave,
    isDirtyCheckModalVisible,
    onDiscardClick,
    onCancelDirtyCheckModal,
    // isPreviewCode,
    // isPreviewCodeData,
    // onPasswordProtectionChecked,
    // onMaintenanceModeChecked,
    // onChangePreviewCode,
  } = useUpdateEnvironmentsController();

  return (
    <div className="page-content">
      <Form
        name="updateEnvironments-form"
        layout="vertical"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onSaveEnvironment}
        initialValues={getEnvironment.data}
        key={get(getEnvironment.data, 'title', ' ')}
        onFieldsChange={handleFieldChange}
        autoComplete="off"
        form={form}>
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon" onClick={onBackButtonClick}>
              <ArrowLeftIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {t('common.labels.edit_environment', {
                  entity: getEnvironment.data?.title
                    ? getEnvironment.data?.title
                    : '',
                })}
              </span>
              <span className="ant-page-header-heading-sub-title m-t-4">
                {t('common.labels.details_of_environments')}
              </span>
            </div>
          </div>
          <div className="headerright">
            <div className="ant-row ant-row-end">
              <Button id={t('common.labels.cancel')} onClick={onCancel}>
                {t('common.labels.cancel')}
              </Button>
              <Button type="primary" disabled={disableSave} htmlType="submit">
                {t('common.labels.save')}
              </Button>
            </div>
          </div>
        </div>
        {isMaintenanceMode && (
          <Alert
            className="alertOnTop m-b-32"
            message={t('common.messages.environment_under_maintenance')}
            type="error"
          />
        )}

        {getEnvironment.isLoading || getEnvironment.isFetching ? (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : (
          <>
            <div className="ant-row environment-section">
              <div className="environment-section-left w-480">
                <div className="page-content-top w-100 m-b-32">
                  <Form.Item
                    label={t('common.labels.name')}
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: t('common.messages.required', {
                          entity: t('common.labels.name'),
                        }),
                      },
                    ]}>
                    <Input
                      disabled={true}
                      placeholder={t('common.labels.environment')}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t('common.labels.site_url')}
                    name="domain"
                    rules={[
                      {
                        required: true,
                        message: t('common.messages.required', {
                          entity: t('common.labels.name'),
                        }),
                      },
                    ]}>
                    <Input
                      disabled={true}
                      placeholder={t('common.labels.environment')}
                    />
                  </Form.Item>
                  <Form.Item
                    name="httpRobots"
                    className="w-100"
                    label={t('common.labels.http_robots')}>
                    <TextArea
                      rows={4}
                      placeholder={t('common.labels.http_robots_placeholder')}
                    />
                  </Form.Item>
                  <>
                    {getEnvironment?.data &&
                      getEnvironment.data?.type === 'PRODUCTION' && (
                        <div className="site-map-position">
                          {getEnvironment.data.siteMapUrl !== null &&
                            ((getEnvironment?.data?.customDomain &&
                              getEnvironment?.data?.customDomain?.length > 0) ||
                              (getEnvironment.data?.workspaceDomain &&
                                getEnvironment.data?.workspaceDomain?.length >
                                  0)) && (
                              <>
                                <Button
                                  type="link"
                                  onClick={onUpdateButtonClick}
                                  className="site-map-update-button">
                                  {t('common.labels.update')}
                                </Button>
                                <Form.Item
                                  name="siteMapUrl"
                                  className="w-100"
                                  label={t('common.labels.site_map')}>
                                  <Paragraph
                                    className="copyable-dashed-border ant-row ant-row-middle ant-row-space-between"
                                    disabled={true}
                                    copyable={{
                                      icon: <CopyableIcon />,
                                      tooltips: ['Copy link', 'Link copied!'],
                                      onCopy: onSiteMapCopy,
                                    }}>
                                    <div className="copyable-text">
                                      {getEnvironment.data.pointYourDomain ===
                                        true &&
                                      getEnvironment?.data?.customDomain
                                        ?.length > 0 &&
                                      getEnvironment.data.siteMapUrl !== null
                                        ? `https://${getEnvironment.data?.customDomain}/sitemap.xml`
                                        : getEnvironment.data.siteMapUrl !==
                                            null &&
                                          getEnvironment.data?.workspaceDomain
                                            .length > 0 &&
                                          `https://${getEnvironment.data?.workspaceDomain}/sitemap.xml`}
                                    </div>
                                  </Paragraph>
                                </Form.Item>
                              </>
                            )}
                        </div>
                      )}
                  </>
                </div>

                {/*
                // TODO: temporarily commented
               <div className="ant-row ant-row-top environment-switch">
                  <Form.Item
                    name="enablePasswordProtect"
                    initialValue={getEnvironment?.data?.enablePasswordProtect}>
                    <Switch
                      onChange={onPasswordProtectionChecked}
                      defaultChecked={
                        getEnvironment?.data?.enablePasswordProtect
                      }
                    />
                  </Form.Item>
                  <div>
                    <p className="title-default m-b-8">
                      {t('common.labels.preview_code')}
                    </p>
                    <p className="font-sm title-sm font-normal gray-text">
                      {t(
                        'common.messages.preview_code_allow_pre_launched_website'
                      )}
                    </p>
                    {isPreviewCode && (
                      <div className="w-100">
                        <Form.Item
                          className="m-b-16"
                          name="passwordHash"
                          rules={[
                            {
                              required: true,
                              message: t('common.labels.preview_code_required'),
                            },
                          ]}>
                          <Input
                            type={isPreviewCodeData ? 'input' : 'password'}
                            onFocus={onChangePreviewCode}
                            value={getEnvironment?.data?.passwordHash}
                          />
                        </Form.Item>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ant-row ant-row-top environment-switch">
                  <Form.Item
                    name="enableMaintenance"
                    initialValue={getEnvironment?.data?.enableMaintenance}>
                    <Switch
                      onChange={onMaintenanceModeChecked}
                      defaultChecked={getEnvironment?.data?.enableMaintenance}
                    />
                  </Form.Item>
                  <div>
                    <p className="title-default m-b-8">
                      {t('common.labels.maintenance_mode')}
                    </p>
                    <p className="font-sm font-normal gray-text">
                      {t('common.messages.maintenance_mode')}
                    </p>
                  </div>
                </div>*/}
                {getEnvironment?.data &&
                  (getEnvironment?.data.type === 'PRODUCTION' ||
                    getEnvironment?.data.type === 'CUSTOM') && (
                    <div className="ant-row environment-switch last-switch">
                      <>
                        <Form.Item
                          name="pointYourDomain"
                          initialValue={getEnvironment.data.pointYourDomain}>
                          <Switch
                            defaultChecked={getEnvironment.data.pointYourDomain}
                            onChange={onCustomDomainChecked}
                          />
                        </Form.Item>
                        <div>
                          <p className="title-default m-b-8">
                            {t('common.labels.point_your_domain')}
                          </p>
                          <p className="font-sm font-normal gray-text">
                            {t(
                              'common.messages.use_your_domain_render_content'
                            )}
                          </p>
                          {isSetUpDomain && (
                            <div className="ant-row m-b-16">
                              <Form.Item
                                className="m-0 w-100"
                                name="customDomain"
                                rules={[
                                  {
                                    required: true,
                                    message: t(
                                      'common.messages.this_field_required'
                                    ),
                                  },
                                ]}>
                                <Input
                                  addonBefore="https://"
                                  placeholder={t(
                                    'common.labels.enter_domain_placeholder'
                                  )}
                                  value={getEnvironment?.data?.customDomain}
                                />
                              </Form.Item>
                            </div>
                          )}
                        </div>
                      </>

                      <div>
                        {/*{isAddDomain && (*/}
                        {/*  <>*/}
                        {/*    <div className="label-and-text-section with-border">*/}
                        {/*      <p className="m-b-28">*/}
                        {/*        <b>*/}
                        {/*          {t(*/}
                        {/*            'common.labels.add_records_to_domain_settings'*/}
                        {/*          )}*/}
                        {/*        </b>*/}
                        {/*      </p>*/}
                        {/*      <div className="label-and-text-section-inner">*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.type')} </span>*/}
                        {/*          <p>em4488.bizwiz.io</p>*/}
                        {/*        </div>*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.name')} </span>*/}
                        {/*          <p>CNAME</p>*/}
                        {/*        </div>*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.value')} </span>*/}
                        {/*          <p>u7797592.wl093.sendgrid.net</p>*/}
                        {/*        </div>*/}
                        {/*        <div className="icon-on-right">*/}
                        {/*          <RightIcon />*/}
                        {/*        </div>*/}
                        {/*      </div>*/}
                        {/*      <div className="label-and-text-section-inner">*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.type')} </span>*/}
                        {/*          <p>CNAME</p>*/}
                        {/*        </div>*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.name')} </span>*/}
                        {/*          <p>s1._domainkey.bizwiz.io</p>*/}
                        {/*        </div>*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.value')} </span>*/}
                        {/*          <p>s1.domainkey.u7797592.wl093.sendgrid.net</p>*/}
                        {/*        </div>*/}
                        {/*        <div className="icon-on-right">*/}
                        {/*          <RightIcon />*/}
                        {/*        </div>*/}
                        {/*      </div>*/}
                        {/*      <div className="label-and-text-section-inner">*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.type')} </span>*/}
                        {/*          <p>CNAME</p>*/}
                        {/*        </div>*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.name')} </span>*/}
                        {/*          <p>s2._domainkey.bizwiz.io</p>*/}
                        {/*        </div>*/}
                        {/*        <div>*/}
                        {/*          <span>{t('common.labels.value')} </span>*/}
                        {/*          <p>s2.domainkey.u7797592.wl093.sendgrid.net</p>*/}
                        {/*        </div>*/}
                        {/*        <div className="icon-on-right">*/}
                        {/*          <RightIcon />*/}
                        {/*        </div>*/}
                        {/*      </div>*/}
                        {/*      <div className="ant-row ant-space-align-center ant-row-space-between">*/}
                        {/*        <Button*/}
                        {/*          icon={<DeleteIcon />}*/}
                        {/*          size="large"></Button>*/}
                        {/*        <Button*/}
                        {/*          id="submit"*/}
                        {/*          type="primary"*/}
                        {/*          htmlType="submit"*/}
                        {/*          onClick={() => ''}>*/}
                        {/*          {t('common.labels.verify')}*/}
                        {/*        </Button>*/}
                        {/*      </div>*/}
                        {/*    </div>*/}
                        {/*  </>*/}
                        {/*)}*/}
                      </div>
                    </div>
                  )}
              </div>

              {/*<div className="environment-section-right">*/}
              {/*  <OnBoardBanner*/}
              {/*    header={t('common.labels.quick_guide')}*/}
              {/*    description={t('common.labels.how_setup_domain')}*/}
              {/*    image={Environment}*/}
              {/*    className="small"*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
          </>
        )}
      </Form>

      <Modal
        className="confirm-modal"
        title={t('common.labels.save_changes')}
        open={isDirtyCheckModalVisible}
        onCancel={onCancelDirtyCheckModal}
        centered
        footer={[
          <Button key="cancelEnvironment" onClick={onDiscardClick}>
            {t('common.labels.discard')}
          </Button>,
          <Button
            key="saveDirtyCheck"
            type="primary"
            onClick={onSaveEnvironment}>
            {t('common.labels.save')}
          </Button>,
        ]}>
        <p>{t('common.messages.save_description')}</p>
      </Modal>
    </div>
  );
};

export default UpdateEnvironments;
