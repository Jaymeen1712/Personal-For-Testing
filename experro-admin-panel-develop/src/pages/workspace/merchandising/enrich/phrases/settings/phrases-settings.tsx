import React, { forwardRef } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Modal,
  Switch,
  Tag,
  InputNumber,
  Spin,
} from 'antd';
import usePhrasesSettingsController from './phrases-settings-controller';
import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import { LoadingOutlined } from '@ant-design/icons';

const PhrasesSettings = forwardRef((props, ref) => {
  const {
    t,
    form,
    isEnablePhrases,
    isDisableSave,
    isSaveModalVisible,
    isEnableSmartSuggestions,
    onChangeEnablePhrases,
    onChangeSmartSuggestions,
    onCancel,
    onSaveButtonClick,
    onCancelClick,
    isDisableModalVisible,
    isEnableAutomatePhrases,
    onChangeAutomatePhrases,
    onDisableSettingsClick,
    onHandleFieldChange,
    onBackButtonClick,
    onChangeReject,
    onChangePublish,
    onChangePending,
    pendingConfidence,
    publishConfidence,
    rejectConfidence,
    isLoading,
  } = usePhrasesSettingsController(props, ref);

  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onBackButtonClick}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.settings')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.subtitle_phrases_settings')}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <>
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
            size="large"
          />
        </>
      ) : (
        <Form
          colon={false}
          className="w-480 discovery-setting-form"
          form={form}
          autoComplete="off"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
          onFieldsChange={onHandleFieldChange}
          name="settings-form">
          <Form.Item
            name="isEnablePhrases"
            className="text-right m-0 switch-custom-label m-b-24"
            labelAlign="left"
            label={t('common.labels.enable_phrases')}>
            <Switch
              checked={isEnablePhrases}
              onChange={onChangeEnablePhrases}
            />
          </Form.Item>
          <div className={!isEnablePhrases ? 'disabled-text' : ''}>
            <Form.Item
              name="isEnableSmartSuggestion"
              className="text-right m-0 m-b-16 switch-custom-label"
              labelAlign="left"
              label={t('common.labels.smart_suggestions')}>
              <Switch
                checked={isEnableSmartSuggestions}
                onChange={onChangeSmartSuggestions}
                disabled={!isEnablePhrases}
              />
            </Form.Item>
          </div>

          {isEnableSmartSuggestions && (
            <>
              <div className="ant-row environment-switch with-checkbox form-top-border">
                <Form.Item name="isAutomatePhrases" valuePropName="checked">
                  <Checkbox
                    checked={isEnableAutomatePhrases}
                    onChange={onChangeAutomatePhrases}></Checkbox>
                </Form.Item>
                <div>
                  <label>{t('common.labels.automate_phrases')}</label>
                  <p className="gray-text m-0-important">
                    {t('common.messages.automate_description', {
                      name: 'phrases',
                    })}
                  </p>
                </div>
              </div>
            </>
          )}

          {isEnableSmartSuggestions && isEnableAutomatePhrases && (
            <>
              <div className="gray-bg-section score-section">
                <p>{t('common.messages.confidence_define_description')}</p>
                <div className="input-section">
                  <div className="ant-row ant-space-align-center ant-row-space-between">
                    <p className="m-0 gray-text">
                      <Tag color="error">{t('common.labels.reject')}</Tag>
                      {t('common.messages.if_less_than')}
                    </p>
                    <span>
                      <InputNumber
                        defaultValue={0}
                        min={0}
                        max={100}
                        value={rejectConfidence}
                        style={{ width: 60 }}
                        onChange={onChangeReject}
                      />
                    </span>
                  </div>
                  <div className="ant-row ant-space-align-center ant-row-space-between">
                    <p className="m-0 gray-text">
                      <Tag color="warning">{t('common.labels.pending')}</Tag>
                      {t('common.messages.if_less_than')}
                    </p>
                    <span>
                      <InputNumber
                        defaultValue={0}
                        min={0}
                        max={100}
                        value={pendingConfidence}
                        style={{ width: 60 }}
                        onChange={onChangePending}
                      />
                    </span>
                  </div>
                  <div className="ant-row ant-space-align-center ant-row-space-between">
                    <p className="m-0 gray-text">
                      <Tag color="success">{t('common.labels.publish')}</Tag>
                      {t('common.messages.if_more_than')}
                    </p>
                    <span>
                      <InputNumber
                        defaultValue={0}
                        min={0}
                        max={100}
                        value={publishConfidence}
                        style={{ width: 60 }}
                        onChange={onChangePublish}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="form-top-border">
            <Button
              id={t('common.labels.save')}
              type="primary"
              disabled={isDisableSave}
              onClick={onSaveButtonClick}>
              {t('common.labels.save')}
            </Button>
            <Button onClick={onCancelClick}>{t('common.labels.cancel')}</Button>
          </div>
        </Form>
      )}

      <Modal
        title={t('common.labels.save_changes')}
        open={isSaveModalVisible}
        onCancel={onCancel}
        className="confirm-modal"
        centered
        footer={[
          <Button key="cancelResetSetting" onClick={onCancelClick}>
            {t('common.labels.discard')}
          </Button>,
          <Button
            key="saveResetSetting"
            type="primary"
            onClick={onSaveButtonClick}>
            {t('common.labels.save')}
          </Button>,
        ]}>
        <p>{t('common.messages.save_description')}</p>
      </Modal>

      <Modal
        title={t('common.labels.disable_phrases')}
        open={isDisableModalVisible}
        onCancel={onCancel}
        className="confirm-modal"
        centered
        footer={[
          <Button key="cancel" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="save"
            type="primary"
            danger
            onClick={onDisableSettingsClick}>
            {t('common.labels.disable')}
          </Button>,
        ]}>
        <p>
          {t('common.messages.subtitle_disable_search', {
            name: t('common.labels.small_phrases'),
          })}
        </p>
      </Modal>
    </>
  );
});

export default PhrasesSettings;
