import React from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Typography,
  Modal,
} from 'antd';
import get from 'lodash.get';
import moment from 'moment';

import useAPITokenController from './create-update-api-token-controller';
import CopyableIcon from '../../../../../images/icons/copyable-icon';
import DownloadPageIcon from '../../../../../images/icons/download-page-icon';
import ArrowLeftIcon from '../../../../../images/icons/arrow-left-icon';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';
import Calender from '../../../../../images/icons/calender';

const { Paragraph } = Typography;
const { Option } = Select;

const CreateUpdateApiToken: React.FC = () => {
  const {
    t,
    tokenId,
    getAPIToken,
    onCancel,
    disabledDate,
    onFinish,
    generateToken,
    form,
    isModalVisible,
    selectedValue,
    onGenerateToken,
    handleFieldChange,
    handleOnSelectChange,
    isLoading,
    disableSave,
    fileDownloadLink,
    onHideModal,
    onCopyToken,
    onClickBackButton,
    onResetDate,
  } = useAPITokenController();

  return (
    <div className="page-content">
      <Form
        layout="vertical"
        name="APIToken-form"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={
          getAPIToken.data && {
            ...getAPIToken.data,
            validTill: getAPIToken.data?.validTill
              ? moment(getAPIToken.data.validTill)
              : undefined,
            type: getAPIToken?.data?.type
              ? getAPIToken?.data?.type
              : 'READ_ONLY',
          }
        }
        key={get(getAPIToken.data, 'name', ' ')}
        onFinish={onFinish}
        onFieldsChange={handleFieldChange}
        autoComplete="off"
        form={form}>
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon" onClick={onClickBackButton}>
              <ArrowLeftIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {tokenId
                  ? t('common.labels.edit_token')
                  : t('common.labels.add_api_token')}
              </span>
              <span className="ant-page-header-heading-sub-title m-t-4">
                {tokenId
                  ? t('common.labels.edit_token_subtitle')
                  : t('common.labels.add_token_subtitle')}
              </span>
            </div>
          </div>
        </div>
        <div className="page-content-top w-480 m-b-32">
          <div className="custom-label-input">
            <Form.Item
              label={t('common.labels.name')}
              name="name"
              extra={t('common.messages.tokens_create_name_prompt_text')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.name'),
                  }),
                },
              ]}>
              <Input
                className="w-100 m-0"
                placeholder={t('common.labels.token_name_placeholder')}
                autoFocus={true}
              />
            </Form.Item>
          </div>

          <div className="custom-label-input">
            <Form.Item
              label={t('common.labels.description')}
              extra={t('common.messages.tokens_create_description_prompt_text')}
              name="description">
              <Input.TextArea
                className="w-100 m-0"
                placeholder={t('common.labels.description_token_placeholder')}
              />
            </Form.Item>
          </div>

          <div className="custom-label-input star-icon">
            <Form.Item
              label={t('common.labels.permissions')}
              extra={
                !tokenId && t('common.messages.api_token_help_text_permissions')
              }
              name="type">
              <Select
                disabled={!!tokenId}
                defaultValue={selectedValue}
                suffixIcon={<DownArrowIcon />}
                onChange={(value) => handleOnSelectChange(value)}>
                <Option value="READ_ONLY">
                  {t('common.labels.read_only')}
                </Option>
                <Option value="FULL_ACCESS">
                  {t('common.labels.full_access')}
                </Option>
              </Select>
            </Form.Item>
          </div>
          <div className="custom-label-input">
            <Form.Item
              label={t('common.labels.expiration')}
              extra={t('common.messages.tokens_create_expiry_date_prompt_text')}
              name="validTill">
              <DatePicker
                placeholder={t('common.labels.expiry_date')}
                format="DD MMM YYYY"
                disabledDate={disabledDate}
                showToday={false}
                suffixIcon={<Calender />}
                allowClear={false}
                renderExtraFooter={() => (
                  <div className="text-right">
                    <Button
                      key="reset"
                      type="link"
                      danger
                      onClick={onResetDate}>
                      {t('common.labels.reset')}
                    </Button>
                  </div>
                )}
              />
            </Form.Item>
          </div>

          <div className="custom-label-input">
            {tokenId && !generateToken && (
              <Alert
                message={t('common.messages.for_security_token_see_only_once')}
                type="warning"
              />
            )}
          </div>

          <div className="custom-label-input form-top-border">
            <Button
              id="submit"
              type="primary"
              htmlType="submit"
              disabled={disableSave}
              loading={isLoading}>
              {t('common.labels.save')}
            </Button>
            <Button id={t('common.labels.cancel')} onClick={onCancel}>
              {t('common.labels.cancel')}
            </Button>
          </div>
        </div>

        <Modal
          className="CustomModal CustomModal-small"
          title={t('common.labels.api_token_generated')}
          onCancel={onHideModal}
          open={isModalVisible}
          okText={t('common.labels.done')}
          footer={[
            <div className="ant-row ant-row-end">
              <div className="custom-delete-button m-r-16">
                <Button
                  className="template-button"
                  href={fileDownloadLink}
                  target="_self"
                  htmlType="button"
                  icon={
                    <span className="anticon">
                      <DownloadPageIcon />
                    </span>
                  }>
                  {t('common.labels.download')}
                </Button>
              </div>
              <Button type="primary" onClick={onGenerateToken}>
                {t('common.labels.done')}
              </Button>
            </div>,
          ]}
          centered>
          <p className="m-0 m-b-8 font-medium">
            {t('common.messages.api_token_visible_once')}
          </p>
          <p className="gray-text">
            <small>{t('common.messages.make_sure_copy_download_token')}</small>
          </p>
          <Paragraph
            className="copyable-dashed-border ant-row ant-row-middle ant-row-space-between"
            copyable={{
              icon: <CopyableIcon />,
              onCopy: onCopyToken,
              text: generateToken,
            }}>
            <div className="copyable-text" title={generateToken}>
              {generateToken}
            </div>
          </Paragraph>
        </Modal>
      </Form>
    </div>
  );
};

export default CreateUpdateApiToken;
