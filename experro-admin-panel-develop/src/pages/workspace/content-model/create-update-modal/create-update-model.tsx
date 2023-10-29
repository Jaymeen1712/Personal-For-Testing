import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Checkbox,
  Radio,
  Tooltip,
  Spin,
} from 'antd';
import React from 'react';

import useCreateUpdateModelController from './create-update-model-controller';
import { LoadingOutlined } from '@ant-design/icons';
import DownArrowIcon from '../../../../images/icons/downarrow-icon';

interface ModalProps {
  isVisible: boolean;
  onModalVisibilityChange: (val: boolean) => void;
  modelGroupList: { id: string; name: string }[];
  componentGroupList: { id: string; name: string }[];
  editModelStatus: { contentModelId: string; status: boolean };
  editNewModelStatusChange: (id: string, status: boolean) => void;
  addNewType: string;
  modelInternalName: string;
  changeModalAndGroupList: (modelData: [], groupData: []) => void;
}

const CreateUpdateModel = ({
  isVisible,
  onModalVisibilityChange,
  modelGroupList,
  editModelStatus,
  editNewModelStatusChange,
  addNewType,
  componentGroupList,
  modelInternalName,
  changeModalAndGroupList,
}: ModalProps) => {
  const {
    t,
    form,
    // enableActAsWebPage,
    onFormValueChange,
    selectedContentType,
    onSave,
    loading,
    onDelete,
    hideDeleteModal,
    isDeleteModalVisible,
    onDeleteModel,
    type,
    getModelDetailsById,
    deleteLoading,
    getComponentModelDetailsById,
    onCancelModelClick,
    canDeleteContentModel,
    canDeleteComponent,
    onActAsWebPageChange,
    updateLoading,
    isSystemCreated,
    isGetModelDetailsByIdIsLoading,
    isSaveButtonDisabled,
  } = useCreateUpdateModelController(
    onModalVisibilityChange,
    editModelStatus,
    editNewModelStatusChange,
    addNewType,
    modelInternalName,
    changeModalAndGroupList
  );
  const { TextArea } = Input;
  return (
    <>
      <Modal
        open={isVisible}
        centered
        onCancel={() => {
          onCancelModelClick();
        }}
        className="CustomModal CustomModal-small contentModal"
        title={
          editModelStatus.status
            ? addNewType === 'component'
              ? t('common.labels.edit_component')
              : t('common.labels.edit_model')
            : addNewType === 'component'
            ? t('common.labels.add_new_component')
            : t('common.labels.add_new_modal')
        }
        footer={[
          <div
            className={
              editModelStatus.status ? 'ant-row ant-row-space-between' : ''
            }>
            {editModelStatus.status && (
              <div className="custom-delete-button">
                <Tooltip
                  title={
                    addNewType === 'component'
                      ? !canDeleteComponent() &&
                        t('common.messages.error_component_delete')
                      : !canDeleteContentModel(modelInternalName) &&
                        t('common.messages.error_model_delete')
                  }>
                  <Button
                    key="delete"
                    type="link"
                    danger
                    onClick={onDelete}
                    disabled={
                      addNewType === 'component'
                        ? !canDeleteComponent()
                        : !canDeleteContentModel(modelInternalName) ||
                          isSystemCreated
                    }>
                    {t('common.labels.delete')}
                  </Button>
                </Tooltip>
              </div>
            )}
            <div>
              <Button
                key="cancel"
                onClick={() => {
                  onCancelModelClick();
                }}>
                {t('common.labels.cancel')}
              </Button>
              <Button
                disabled={isSaveButtonDisabled}
                key="save"
                type="primary"
                onClick={onSave}
                loading={editModelStatus.status ? updateLoading : loading}>
                {t('common.labels.save')}
              </Button>
            </div>
          </div>,
        ]}>
        {editModelStatus.status && isGetModelDetailsByIdIsLoading ? (
          <Spin
            className="HV-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : (
          <Form
            layout="vertical"
            form={form}
            onValuesChange={onFormValueChange}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}>
            <Form.Item
              name="name"
              label={
                addNewType === 'component'
                  ? t(t('common.labels.component_name_is_required'))
                  : t('common.labels.model_name')
              }
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity:
                      addNewType === 'component'
                        ? t('common.labels.component_name_is_required')
                        : t('common.labels.model_name'),
                  }),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
                {
                  pattern: new RegExp(/^[ A-Za-z0-9]*$/i),
                  message: t('common.messages.format', {
                    entity:
                      addNewType === 'component'
                        ? t('common.labels.component_name')
                        : t('common.labels.model_name'),
                  }),
                },
                {
                  max: 50,
                  message: t('common.messages.max_length', {
                    entity:
                      addNewType === 'component'
                        ? t('common.labels.component_name')
                        : t('common.labels.model_name'),
                  }),
                },
              ]}
              normalize={(value) => value.trimStart()}>
              <Input
                disabled={isSystemCreated}
                placeholder={
                  addNewType === 'component'
                    ? t('common.labels.component_name')
                    : t('common.labels.model_name_input_placeholder')
                }
              />
            </Form.Item>
            {addNewType !== 'component' && (
              <Form.Item
                name="internalName"
                label={t('common.labels.internal_name')}
                rules={[
                  {
                    required: true,
                    message: t('common.messages.required', {
                      entity: t('common.labels.model_name'),
                    }),
                  },
                  {
                    whitespace: true,
                    message: t('common.messages.please_provide'),
                  },
                  {
                    max: 255,
                    message: t('common.messages.max_length', {
                      entity: t('common.labels.model_name'),
                    }),
                  },
                ]}>
                <Input
                  placeholder={t(
                    'common.labels.internal_name_input_placeholder'
                  )}
                  disabled={editModelStatus.status || isSystemCreated}
                />
              </Form.Item>
            )}

            <Form.Item
              name="description"
              label={t('common.labels.description')}>
              <TextArea
                disabled={isSystemCreated}
                placeholder={t('common.labels.description_input_placeholder')}
                maxLength={255}
              />
            </Form.Item>
            <Form.Item
              label={t('common.labels.parent_group')}
              name="groupId"
              rules={[
                {
                  required: true,
                  message: t('common.messages.error_select_group'),
                },
              ]}>
              <Select
                placeholder={t('common.labels.groups_placeholder')}
                suffixIcon={<DownArrowIcon />}>
                {addNewType === 'component'
                  ? componentGroupList.map((item) => (
                      <Select.Option value={item.id}>{item.name}</Select.Option>
                    ))
                  : modelGroupList.map((item) => (
                      <Select.Option value={item.id}>{item.name}</Select.Option>
                    ))}
              </Select>
            </Form.Item>
            <Form.Item name="isLocalizationEnabled" valuePropName="checked">
              <Checkbox disabled={editModelStatus.status || isSystemCreated}>
                {t('common.labels.enable_localization')}
              </Checkbox>
            </Form.Item>
            {addNewType !== 'component' && (
              <>
                <Form.Item
                  name="type"
                  initialValue="single"
                  label={t('common.labels.model_type')}>
                  <Radio.Group
                    disabled={editModelStatus.status || isSystemCreated}>
                    <Radio value="single">
                      {t('common.labels.single_entry')}
                    </Radio>
                    <Radio value="collection">
                      {t('common.labels.multi_entry')}
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                {selectedContentType === 'collection' && (
                  <>
                    <Form.Item name="actAsWebPage" valuePropName="checked">
                      <Checkbox
                        disabled={editModelStatus.status || isSystemCreated}
                        onChange={(val) => {
                          onActAsWebPageChange(val.target.checked);
                        }}>
                        {t('common.labels.act_as_web_page')}
                      </Checkbox>
                    </Form.Item>
                  </>
                )}
              </>
            )}
          </Form>
        )}
      </Modal>
      <Modal
        className="confirm-modal"
        centered
        footer={[
          <Button onClick={hideDeleteModal} key="cancel">
            {t('common.labels.cancel')}
          </Button>,
          <Button
            danger
            onClick={onDeleteModel}
            type="primary"
            key="delete"
            loading={deleteLoading}>
            {t('common.labels.delete')}
          </Button>,
        ]}
        title={
          addNewType === 'component'
            ? t('common.messages.delete_entity', {
                entity: getComponentModelDetailsById.data?.name,
              })
            : t('common.messages.delete_entity', {
                entity: getModelDetailsById.data?.name,
              })
        }
        open={isDeleteModalVisible}
        onCancel={hideDeleteModal}
        confirmLoading={type === 'component' ? false : deleteLoading}>
        {type === 'component'
          ? t('common.messages.delete_component')
          : t('common.messages.delete_content', { entity: type })}
      </Modal>
    </>
  );
};
export default CreateUpdateModel;
