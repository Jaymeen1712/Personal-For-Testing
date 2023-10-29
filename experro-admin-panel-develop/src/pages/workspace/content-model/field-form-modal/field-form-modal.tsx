import React from 'react';
import { Tabs, Form, Button } from 'antd';

import {
  RegularDefaultTabPane,
  RegularValidationTabPane,
  RegularMoreTabPane,
  RelationAdvancedSettingTabPane,
  RelationBaseSetting,
  ComponentsBaseSettings,
  ComponentsAdvancedSettings,
} from './common-components';
import Modal from '../../../../components/modal';
import useFiledFormController from './field-form-modal-controller';
import { ContentModelList } from '../../../../types';

const { TabPane } = Tabs;

interface FieldFormModalProps {
  isModalVisible: boolean;
  hideModal: () => void;
  selectedFieldType: string;
  editFieldIdAndStatus: { id: string; status: boolean };
  hideUpdateModal: () => void;
  componentsList?: ContentModelList[];
  selectedContentDetails?:
    | { key: string; label: string; description?: string }
    | undefined;
  isLocalizationEnable?: boolean;
  addNewType: string;
  modelList: ContentModelList[];
}

const FieldFormModal: React.FC<FieldFormModalProps> = ({
  selectedFieldType,
  isModalVisible,
  hideModal,
  hideUpdateModal,
  componentsList,
  selectedContentDetails,
  isLocalizationEnable,
  editFieldIdAndStatus,
  addNewType,
  modelList,
}) => {
  const {
    t,
    selectedField,
    form,
    onSave,
    onValueChange,
    maximumInputVisible,
    minimumInputVisible,
    tabValue,
    onTabChange,
    fieldInitialValue,
    relationValue,
    setRelationValue,
    defaultSelectValue,
    internalFieldName,
    minimumInputValue,
    maximumInputValue,
    onBlur,
    internalFieldNameChange,
    editInternalFieldName,
    extensionName,
    duplicateFieldOnBlur,
    createContentField,
    createComponentField,
    updateContentField,
    updateComponentField,
    type,
  } = useFiledFormController(
    selectedFieldType,
    editFieldIdAndStatus,
    addNewType,
    hideUpdateModal,
    isModalVisible
  );
  return (
    <Modal
      classname="CustomModal"
      title={
        editFieldIdAndStatus.status
          ? t('common.labels.edit_field_model_title')
          : t('common.labels.add_new_field_model_title')
      }
      isModalVisibility={isModalVisible}
      hideModal={() => {
        editFieldIdAndStatus.status ? hideUpdateModal() : hideModal();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            editFieldIdAndStatus.status ? hideUpdateModal() : hideModal();
          }}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="save"
          onClick={onSave}
          type="primary"
          loading={
            type === 'component'
              ? editFieldIdAndStatus.status
                ? updateComponentField?.isLoading
                : createComponentField?.isLoading
              : editFieldIdAndStatus.status
              ? updateContentField?.isLoading
              : createContentField?.isLoading
          }>
          {t('common.labels.save')}
        </Button>,
      ]}>
      <Form
        layout="vertical"
        form={form}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={
          editFieldIdAndStatus.status
            ? fieldInitialValue
            : isLocalizationEnable
            ? {
                validation: ['enable_localization'],
                textRadioButton: 'shortText',
                richTextEditorType: 'defaultEditor',
              }
            : {
                textRadioButton: 'shortText',
                richTextEditorType: 'defaultEditor',
              }
        }
        key={fieldInitialValue?.fieldName}
        onValuesChange={onValueChange}>
        <div className="fieldlistmain selectedfieldlistmain">
          <div className="fieldlist-item">
            <div className="fieldlist ant-row ant-row-space-between ant-row-middle">
              <div className="selected-left ant-row ant-row-middle">
                {selectedField?.icon}
                <div className="info">
                  <div className="title-sm">{selectedField?.title}</div>
                  <p className="font-sm gray-text">{selectedField?.subTitle}</p>
                </div>
              </div>
              {editFieldIdAndStatus.status ? (
                ''
              ) : (
                <Button size="small" type="link" onClick={hideModal}>
                  {t('common.labels.form_field_change_button')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {selectedField?.key === 'relation' ||
        selectedField?.key === 'component' ? (
          <Tabs activeKey={tabValue} onChange={onTabChange}>
            <TabPane
              tab={t('common.labels.form_field_base_settings_tab')}
              key="1"
              forceRender>
              {selectedField?.key === 'relation' ? (
                <RelationBaseSetting
                  relationValue={relationValue}
                  setRelationValue={setRelationValue}
                  selectedContentDetails={selectedContentDetails}
                  internalFieldName={internalFieldName}
                  onBlur={onBlur}
                  editContentFieldStatus={editFieldIdAndStatus.status}
                  editInternalFieldName={editInternalFieldName}
                  internalFieldNameChange={internalFieldNameChange}
                  extensionName={extensionName}
                  duplicateFieldOnBlur={duplicateFieldOnBlur}
                  modelList={modelList}
                  destinationContentModalId={fieldInitialValue?.relationSelect}
                />
              ) : (
                <ComponentsBaseSettings
                  componentsList={componentsList}
                  internalFieldName={internalFieldName}
                  onBlur={onBlur}
                  editContentFieldStatus={editFieldIdAndStatus.status}
                  editInternalFieldName={editInternalFieldName}
                  internalFieldNameChange={internalFieldNameChange}
                  extensionName={extensionName}
                />
              )}
            </TabPane>

            <TabPane
              tab={t('common.labels.form_field_advanced_settings_tab')}
              key="2"
              forceRender>
              {selectedField?.key === 'relation' ? (
                <RelationAdvancedSettingTabPane selectedField={selectedField} />
              ) : (
                <ComponentsAdvancedSettings
                  selectedField={selectedField}
                  maximumInputVisible={maximumInputVisible}
                  minimumInputVisible={minimumInputVisible}
                />
              )}
            </TabPane>
          </Tabs>
        ) : (
          <Tabs activeKey={tabValue} onChange={onTabChange}>
            <TabPane
              tab={t('common.labels.form_default_field')}
              key="1"
              forceRender>
              <RegularDefaultTabPane
                selectedField={selectedField}
                internalFieldName={internalFieldName}
                onBlur={onBlur}
                editContentFieldStatus={editFieldIdAndStatus.status}
                internalFieldNameChange={internalFieldNameChange}
                editInternalFieldName={editInternalFieldName}
                extensionName={extensionName}
                initialSelectedModals={fieldInitialValue?.selectModels}
              />
            </TabPane>
            {selectedField?.key !== 'page-editor' &&
              selectedField?.key !== 'style' &&
              selectedField?.key !== 'color-picker' &&
              selectedField?.key !== 'script' && (
                <TabPane
                  tab={t('common.labels.form_validation_field')}
                  key="2"
                  forceRender>
                  <RegularValidationTabPane
                    selectedField={selectedField}
                    maximumInputVisible={maximumInputVisible}
                    minimumInputVisible={minimumInputVisible}
                    defaultSelectValue={defaultSelectValue}
                    minimumInputValue={minimumInputValue}
                    maximumInputValue={maximumInputValue}
                  />
                </TabPane>
              )}
            {selectedField?.key !== 'page-editor' &&
              selectedField?.key !== 'style' &&
              selectedField?.key !== 'color-picker' &&
              selectedField?.key !== 'script' && (
                <TabPane
                  tab={t('common.labels.form_more_field')}
                  key="3"
                  forceRender>
                  <RegularMoreTabPane selectedField={selectedField} />
                </TabPane>
              )}
          </Tabs>
        )}
      </Form>
    </Modal>
  );
};
export default FieldFormModal;
