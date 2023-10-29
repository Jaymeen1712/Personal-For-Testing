import React from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Typography,
  Modal,
} from 'antd';
import get from 'lodash.get';
import CopyableIcon from '../../../../../images/icons/copyable-icon';
import useCLITokenController from './create-update-cli-token-controller';
import DownloadPageIcon from '../../../../../images/icons/download-page-icon';
import Calender from '../../../../../images/icons/calender';

const { Paragraph } = Typography;

interface ICreateUpdateCLIToken {
  isCreateModalVisible: boolean;
  tokenId: string | undefined;
  setCLITokenId: (tokenId: string) => void;
  setIsCreateModalVisible: (isCreateModalVisible: boolean) => void;
  onCancelCLIToken: () => void;
  setIsModalVisible: (isModalVisible: boolean) => void;
  isModalVisible: boolean;
}

const CreateUpdateCLIToken: React.FC<ICreateUpdateCLIToken> = ({
  isCreateModalVisible,
  tokenId,
  setCLITokenId,
  setIsCreateModalVisible,
  onCancelCLIToken,
  setIsModalVisible,
  isModalVisible,
}) => {
  const {
    t,
    form,
    getCLITokenDetails,
    radioValue,
    onChangeRadioValue,
    disabledDate,
    onSave,
    onHideModal,
    fileDownloadLink,
    onGenerateToken,
    onCopyToken,
    generateToken,
    disableReadOnly,
    disableSave,
    disableFullAccess,
    handleFieldChange,
    onResetDate,
    disableBuild,
  } = useCLITokenController(
    tokenId,
    setCLITokenId,
    setIsCreateModalVisible,
    setIsModalVisible,
    isModalVisible
  );

  return (
    <>
      <>
        {getCLITokenDetails?.isSuccess && (
          <Modal
            className="CustomModal CustomModal-small"
            title={
              tokenId
                ? t('common.labels.edit_cli_token')
                : t('common.labels.add_cli_token')
            }
            centered
            open={isCreateModalVisible}
            onCancel={onCancelCLIToken}
            okText={t('common.labels.delete')}
            footer={[
              <Button key="back" htmlType="button" onClick={onCancelCLIToken}>
                {t('common.labels.cancel')}
              </Button>,
              <Button
                id="submit"
                type="primary"
                disabled={disableSave}
                htmlType="submit"
                onClick={onSave}>
                {t('common.labels.save')}
              </Button>,
            ]}>
            <Form
              form={form}
              name="CLIToken-form"
              autoComplete="off"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              layout="vertical"
              onFieldsChange={handleFieldChange}
              key={get(getCLITokenDetails.data, 'name', '')}>
              <div className="custom-label-input">
                <Form.Item
                  label={t('common.labels.name')}
                  name="name"
                  extra={t('common.messages.cli_tokens_name_prompt_text')}
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
                  label={t('common.labels.expiration')}
                  extra={t('common.messages.cli_tokens_expiration_prompt_text')}
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
                <label className="custom-input-label">
                  {t('common.labels.permissions')}
                </label>
                <Radio.Group
                  value={radioValue}
                  onChange={(value) => onChangeRadioValue(value)}>
                  <Radio disabled={disableFullAccess} value="FULL_ACCESS">
                    {t('common.labels.full_access')}
                  </Radio>
                  <Radio disabled={disableBuild} value="BUILD_ONLY">
                    {t('common.labels.upload')}
                  </Radio>
                  <Radio
                    disabled={disableReadOnly}
                    value="LOCAL_DEVELOPMENT_ONLY">
                    {t('common.labels.local_development_only')}
                  </Radio>
                </Radio.Group>
              </div>
              {tokenId && !generateToken && (
                <Alert
                  className="alertBottom"
                  message={t(
                    'common.messages.for_security_token_see_only_once'
                  )}
                  type="warning"
                />
              )}
            </Form>
          </Modal>
        )}
      </>
      <>
        <Modal
          className="CustomModal CustomModal-small"
          title={t('common.labels.cli_token_generated')}
          onCancel={onHideModal}
          open={isModalVisible}
          centered
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
          ]}>
          <p className="m-0 m-b-8">
            <strong>{t('common.messages.cli_token_visible_once')}</strong>
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
      </>
    </>
  );
};

export default CreateUpdateCLIToken;
