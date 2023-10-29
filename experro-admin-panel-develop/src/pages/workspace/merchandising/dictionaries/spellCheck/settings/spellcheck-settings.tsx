import useStopWordsSettingsController from './spellcheck-settings-controller';
import React from 'react';
import { Button, Form, Modal, Spin, Switch } from 'antd';
import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import { LoadingOutlined } from '@ant-design/icons';

export interface ISpellCheckSettings {
  isEnableSmartSuggestions: boolean;
  isEnableSpellCheck: boolean;
  setIsEnableSmartSuggestions: (isEnableSmartSuggestions: boolean) => void;
  setIsEnableSpellCheck: (isEnableSpellCheck: undefined | boolean) => void;
}

const SpellCheckSettings = (props: ISpellCheckSettings) => {
  const {
    t,
    form,
    isEnableSpellCheck,
    onChangeEnableSpellCheck,
    onBackButtonClick,
    onCancel,
    isDisableModalVisible,
    isDisableSave,
    onDisableSettingsClick,
    onSaveButtonClick,
    onCancelClick,
    onHandleFieldChange,
    isSaveModalVisible,
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
              {t('common.labels.subtitle_spellcheck_settings')}
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
          onFinish={onSaveButtonClick}
          name="settings-form">
          <Form.Item
            className="text-right m-0 switch-custom-label m-b-24"
            labelAlign="left"
            name="isEnableSpellCheck"
            label={t('common.labels.enable_spell_check')}>
            <Switch
              checked={isEnableSpellCheck}
              onClick={onChangeEnableSpellCheck}
            />
          </Form.Item>

          {/*<div className={!isEnableSpellCheck ? 'disabled-text' : ''}>*/}
          {/*  <Form.Item*/}
          {/*    className="text-right m-0 m-b-16 switch-custom-label"*/}
          {/*    labelAlign="left"*/}
          {/*    name="isEnableSmartSuggestions"*/}
          {/*    label={t('common.labels.smart_suggestions')}>*/}
          {/*    <Switch*/}
          {/*      checked={isEnableSmartSuggestions}*/}
          {/*      onChange={onChangeSmartSuggestions}*/}
          {/*      disabled={!isEnableSpellCheck}*/}
          {/*    />*/}
          {/*  </Form.Item>*/}
          {/*</div>*/}

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
        title={t('common.labels.disable_spell_check')}
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
            name: t('common.labels.small_spell_check'),
          })}
        </p>
      </Modal>
    </>
  );
};

export default SpellCheckSettings;
