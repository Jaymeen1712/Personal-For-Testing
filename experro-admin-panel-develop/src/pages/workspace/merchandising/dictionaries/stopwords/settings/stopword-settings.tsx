import useStopWordsSettingsController from './stopwords-settings-controller';
import React from 'react';
import { Button, Form, Modal, Spin, Switch } from 'antd';
import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import { LoadingOutlined } from '@ant-design/icons';

export interface IStopWordSettings {
  isEnableStopWord: boolean;
  setIsEnableStopWord: (isEnableStopWord: undefined | boolean) => void;
}

const StopWordsSettings = (props: IStopWordSettings) => {
  const {
    t,
    form,
    isEnableStopWord,
    isDisableSave,
    onChangeEnableStopWord,
    onCancel,
    isDisableModalVisible,
    onDisableSettingsClick,
    onCancelSettingsClick,
    onSaveButtonClick,
    isSaveModalVisible,
    onBackButtonClick,
    onHandleFieldChange,
    isLoading,
  } = useStopWordsSettingsController(props);

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
              {t('common.labels.subtitle_stop_word_settings')}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
          size="large"
        />
      ) : (
        <Form
          colon={false}
          className="w-480 discovery-setting-form"
          form={form}
          autoComplete="off"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
          labelAlign="left"
          onFieldsChange={onHandleFieldChange}
          name="settings-form">
          <Form.Item
            className="m-0 m-b-24 text-right switch-custom-label"
            name="isEnableStopWords"
            label={t('common.labels.enable_stop_words')}>
            <Switch
              checked={isEnableStopWord}
              onClick={onChangeEnableStopWord}
            />
          </Form.Item>
          <div className="form-top-border">
            <Button
              id={t('common.labels.save')}
              type="primary"
              disabled={isDisableSave}
              onClick={onSaveButtonClick}>
              {t('common.labels.save')}
            </Button>
            <Button onClick={onCancelSettingsClick}>
              {t('common.labels.cancel')}
            </Button>
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
          <Button key="cancelResetSetting" onClick={onCancelSettingsClick}>
            {t('common.labels.discard')}
          </Button>,
          <Button key="saveSetting" type="primary" onClick={onSaveButtonClick}>
            {t('common.labels.save')}
          </Button>,
        ]}>
        <p>{t('common.messages.save_settings_description')}</p>
      </Modal>

      <Modal
        title={t('common.labels.disable_stop_words')}
        open={isDisableModalVisible}
        onCancel={onCancel}
        className="confirm-modal"
        centered
        footer={[
          <Button key="cancelDisable" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="disableSetting"
            type="primary"
            danger
            onClick={onDisableSettingsClick}>
            {t('common.labels.disable')}
          </Button>,
        ]}>
        <p>
          {t('common.messages.subtitle_disable_search', {
            name: t('common.labels.small_stop_words'),
          })}
        </p>
      </Modal>
    </>
  );
};

export default StopWordsSettings;
