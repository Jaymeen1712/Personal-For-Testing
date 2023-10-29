import React from 'react';
import get from 'lodash.get';
import { Button, Form, Input, Select, Tabs, Tooltip } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

import useCreateUpdateTemplatesEmailsController from './create-update-templates-emails-controller';
import SendTestEmail from '../sendTestEmail';
import ArrowLeftIcon from '../../../../../images/icons/arrow-left-icon';
import SearchIcon from '../../../../../images/icons/search-icon';

const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: '#75baff',
    caret: '#5d00ff',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#8a91991a',
    gutterBackground: '#EDEDF0',
    gutterForeground: '#9D9CAF',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#0080ff' },
    { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
    { tag: t.number, color: '#5c6166' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: t.keyword, color: '#5c6166' },
    { tag: t.operator, color: '#5c6166' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#5c6166' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
  ],
});

const CreateUpdateTemplates: React.FC = () => {
  const {
    t,
    getEmailTemplate,
    getAllEnvironments,
    onBackButtonClick,
    form,
    onFinish,
    onHideSendTestEmailModal,
    onSendTestEmail,
    isSendEmailModalVisible,
    selectedTemplateIdForSendEmail,
    onTextAreaChange,
    htmlData,
    onSubjectChange,
    subjectData,
    permission,
    handleFieldChange,
    disableSave,
  } = useCreateUpdateTemplatesEmailsController();

  return (
    <>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        key={get(getEmailTemplate.data, 'name', '')}
        name="create-update-template-form"
        initialValues={getEmailTemplate.data}
        onFieldsChange={handleFieldChange}
        form={form}
        onFinish={onFinish}>
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon" onClick={onBackButtonClick}>
              <ArrowLeftIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {t('common.labels.edit_template', {
                  entity: getEmailTemplate.data?.name,
                })}
              </span>
            </div>
          </div>
          <div className="headerright">
            <div className="ant-row ant-row-end">
              <Button
                type="link"
                id={t('common.labels.send_test_mail')}
                onClick={onSendTestEmail}>
                {t('common.labels.send_test_mail')}
              </Button>
              <Button
                id={t('common.labels.cancel')}
                onClick={onBackButtonClick}>
                {t('common.labels.cancel')}
              </Button>
              <Button
                disabled={
                  !permission.canUpdateEmailTemplatesTemplate() || disableSave
                }
                id={t('common.labels.save')}
                type="primary"
                htmlType="submit">
                {t('common.labels.save')}
              </Button>
            </div>
          </div>
        </div>
        <div className="page-content-top m-b-40">
          <Form.Item
            name="masterTemplateName"
            label={t('common.labels.template')}>
            <Input className="w-480" disabled={true} />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.name'),
                }),
              },
            ]}
            label={t('common.labels.name')}>
            <Input className="w-480" />
          </Form.Item>

          <div className="w-480 position-relative">
            <Form.Item
              className="w-480 m-0"
              name="environmentIds"
              label={t('common.labels.assign_environment')}>
              <Select
                placeholder={t('common.labels.select_environment')}
                mode="multiple"
                showArrow={true}
                suffixIcon={
                  <span className="anticon select-search-icon">
                    <SearchIcon />
                  </span>
                }>
                {getAllEnvironments.data &&
                  getAllEnvironments.data.length &&
                  getAllEnvironments.data.map((environment) => (
                    <Select.Option value={environment.id} key={environment.id}>
                      {environment.title}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Tooltip
              className="link-label"
              overlayClassName="custom-tooltip custom-large"
              title={t('common.messages.assign_to_tooltip_message')}
              placement="right">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        </div>

        <Tabs className="email-tabs">
          <Tabs.TabPane tab={t('common.labels.preview')} key="preview">
            <div className="ant-row email-preview-subject">
              <span>Subject:</span>
              <p
                className="m-0"
                dangerouslySetInnerHTML={{
                  __html: subjectData,
                }}
              />
            </div>
            <div className="email-preview-content">
              <div className="email-preview-content-inner table-disable table-section">
                <div
                  className="email-preview-content-wrap"
                  dangerouslySetInnerHTML={{
                    __html: htmlData,
                  }}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('common.labels.code')} key="code">
            <Form.Item
              name="subject"
              label={t('common.labels.subject')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.subject'),
                  }),
                },
              ]}>
              <Input
                placeholder={t('common.labels.subject')}
                onChange={(e) => onSubjectChange(e)}
              />
            </Form.Item>
            <Form.Item
              label={t('common.labels.content')}
              name="htmlContent"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.content'),
                  }),
                },
              ]}>
              <CodeMirror
                height="800px"
                extensions={[
                  html({ matchClosingTags: true, autoCloseTags: true }),
                ]}
                onChange={(val) => onTextAreaChange(val)}
                theme={myTheme}
                value={htmlData}
                //@ts-ignore
                options={{
                  lineNumbers: true,
                  lineWrapping: true,
                  matchBrackets: true,
                  mode: 'javascript',
                  tabSize: 2,
                  gutters: ['CodeMirror-lint-markers'],
                  lint: true,
                }}
              />
            </Form.Item>
          </Tabs.TabPane>
        </Tabs>
      </Form>

      <SendTestEmail
        isSendTestEmailModalVisible={isSendEmailModalVisible}
        onHideSendTestEmail={onHideSendTestEmailModal}
        templateId={selectedTemplateIdForSendEmail}
      />
    </>
  );
};

export default CreateUpdateTemplates;
