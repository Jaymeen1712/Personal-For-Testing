import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';

import Modal from '../../../../../../components/modal';
import { ICreateUpdateRule } from '../../../../../../types';
import {
  DESCRIPTION_REGEX_PATTERN,
  TEXT_REGEX_PATTERN,
} from '../../../../../../utills';
import { useListEnvironments } from '../../../../../../apis/environments';
import DownArrowIcon from '../../../../../../images/icons/downarrow-icon';

const { TextArea } = Input;

const CreateUpdateRule: React.FC<ICreateUpdateRule> = ({
  t,
  subMenu,
  onSave,
  hideAddRule,
  initialValue,
  workspaceId,
  selectedEnvironment,
  buttonLoading,
}) => {
  const [form] = Form.useForm();
  const listEnvironments = useListEnvironments(workspaceId);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  return (
    <Modal
      title={
        initialValue?.title
          ? t('common.labels.edit_merchandising_rule_title', {
              entity: subMenu
                ?.toLowerCase()
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .slice(0, subMenu.length - 1),
            })
          : t('common.labels.add_merchandising_rule_title', {
              entity: subMenu
                ?.toLowerCase()
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .slice(0, subMenu.length - 1),
            })
      }
      isModalVisibility={true}
      hideModal={hideAddRule}
      classname="CustomModal CustomModal-small"
      footer={[
        <Button key="back" onClick={hideAddRule}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!isButtonEnabled}
          loading={buttonLoading ? true : false}
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                if (values.title.trim().length === 0) {
                  form.setFields([
                    {
                      name: 'title',
                      errors: [t('common.messages.please_provide')],
                    },
                  ]);
                } else if (values.title.trim().length < 3) {
                  form.setFields([
                    {
                      name: 'title',
                      errors: [
                        t('common.messages.min_length', {
                          entity: t('common.labels.rule_name'),
                        }),
                      ],
                    },
                  ]);
                } else if (values.title.length > 255) {
                  form.setFields([
                    {
                      name: 'title',
                      errors: [
                        t('common.messages.max_length', {
                          entity: t('common.labels.rule_name'),
                        }),
                      ],
                    },
                  ]);
                } else if (
                  values.title.trim().length > 0 &&
                  !TEXT_REGEX_PATTERN.test(values.title)
                ) {
                  form.setFields([
                    {
                      name: 'title',
                      errors: [
                        t('common.messages.format', {
                          entity: t('common.labels.rule_name'),
                        }),
                      ],
                    },
                  ]);
                } else if (
                  values.description !== undefined &&
                  values.description !== null &&
                  values.description.length > 2000
                ) {
                  form.setFields([
                    {
                      name: 'description',
                      errors: [
                        t('common.messages.max_length', {
                          entity: t('common.labels.workspace_description'),
                        }),
                      ],
                    },
                  ]);
                } else if (
                  values.description !== undefined &&
                  values.description !== null &&
                  values.description.trim().length > 0 &&
                  !DESCRIPTION_REGEX_PATTERN.test(values.description)
                ) {
                  form.setFields([
                    {
                      name: 'description',
                      errors: [
                        t('common.messages.format', {
                          entity: t('common.labels.workspace_description'),
                        }),
                      ],
                    },
                  ]);
                } else if (
                  values.description !== undefined &&
                  values.description !== null &&
                  values.description.length > 0 &&
                  values.description.trim().length === 0
                ) {
                  form.setFields([
                    {
                      name: 'description',
                      errors: [t('common.messages.please_provide')],
                    },
                  ]);
                } else if (
                  values.title.trim().length === 0 &&
                  values.description.trim().length === 0
                ) {
                  form.setFields([
                    {
                      name: 'title',
                      errors: [t('common.messages.please_provide')],
                    },
                    {
                      name: 'description',
                      errors: [t('common.messages.please_provide')],
                    },
                  ]);
                } else {
                  onSave(values);
                }
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}>
          {t('common.labels.save')}
        </Button>,
      ]}>
      <Form
        onValuesChange={() => setIsButtonEnabled(true)}
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        initialValues={initialValue}
        form={form}>
        <Form.Item
          className="display-none"
          label={t('common.labels.environment')}
          name="environmentsId"
          initialValue={selectedEnvironment}>
          <Select
            disabled={true}
            className="w-100"
            suffixIcon={<DownArrowIcon />}
            placeholder={t('common.labels.select_environment')}>
            {listEnvironments.data?.map((environment) => (
              <Select.Option value={environment.id}>
                {environment.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t('common.labels.rule_name')}
          name="title"
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.rule_name'),
              }),
            },
          ]}>
          <Input
            placeholder={t('common.labels.rule_name_placeholder')}
            className="w-100"
          />
        </Form.Item>
        <Form.Item
          label={t('common.labels.workspace_description')}
          name="description">
          <TextArea
            rows={4}
            placeholder={t('common.labels.description_placeholder')}
            className="w-100"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUpdateRule;
