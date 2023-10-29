import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { Radio } from 'antd';
import { FormInstance } from 'antd/es/form';
import useCreateUpdateSynonymsController from './create-update-synonyms-controller';
import { WithContext as ReactTags } from 'react-tag-input';

interface ICreateUpdateStopWords {
  form: FormInstance;
  isModalVisible: boolean;
  synonymsId: string;
  selectedSynonyms: { id: string; text: string; className?: string }[];
  setSelectedSynonyms: (
    selectedSynonyms: { id: string; text: string; className?: string }[]
  ) => void;
  setIsModalVisible: (isModalVisible: boolean) => void;
  setSynonymsId: (synonymsId: string[]) => void;
}

const CreateUpdateSynonyms: React.FC<ICreateUpdateStopWords> = ({
  form,
  isModalVisible,
  synonymsId,
  setIsModalVisible,
  setSynonymsId,
  selectedSynonyms,
  setSelectedSynonyms,
}) => {
  const {
    t,
    // listData,
    // synonymsDataArray,
    radioOption,
    radioType,
    onChangeRadioType,
    onCancel,
    onAddSynonym,
    onDeleteSynonyms,
    // onClickSuggestionsTag,
    onSave,
    isLoading,
    handleFieldChange,
    disableSave,
    // isFieldChange,
    onHandleInputChange,
  } = useCreateUpdateSynonymsController(
    form,
    synonymsId,
    setIsModalVisible,
    setSynonymsId,
    selectedSynonyms,
    setSelectedSynonyms
  );

  return (
    <Modal
      title={
        synonymsId.length
          ? t('common.labels.edit_synonyms')
          : t('common.labels.add_synonyms')
      }
      className="CustomModal CustomModal-small"
      open={isModalVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          disabled={disableSave}
          onClick={onSave}>
          {t('common.labels.save')}
        </Button>,
      ]}
      centered>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        onFieldsChange={handleFieldChange}
        form={form}>
        <div>
          <Form.Item
            label="Term"
            name="term"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.term'),
                }),
              },
            ]}>
            <Input
              className="w-100 m-0"
              placeholder={t('common.labels.enter_term')}
              autoFocus={true}
            />
          </Form.Item>

          <Form.Item className="custom-radio-group" name="type">
            <Radio.Group
              defaultValue="oneway"
              options={radioOption}
              onChange={onChangeRadioType}
              value={radioType}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <div className="custom-label-input star-icon m-t-32">
            <Form.Item
              name="synonyms"
              label={t('common.labels.synonyms')}
              extra={
                synonymsId.length === 0 && (
                  <>{t('common.labels.synonyms_prompt_text')}</>
                )
              }
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.synonyms'),
                  }),
                },
              ]}>
              <ReactTags
                inputFieldPosition="inline"
                tags={selectedSynonyms}
                handleAddition={onAddSynonym}
                handleDelete={onDeleteSynonyms}
                handleInputChange={onHandleInputChange}
                allowDragDrop={false}
                placeholder={
                  selectedSynonyms?.length > 0
                    ? ''
                    : t('common.labels.synonyms_placeholder')
                }
              />
            </Form.Item>

            {/* {!selectedSynonyms.length && synonymsId.length > 0 && (
            <span
              className="ant-form-item-explain-error"
              style={{ position: 'relative' }}>
              {t('common.messages.required', {
                entity: t('common.labels.synonyms'),
              })}
            </span>
          )}*/}
          </div>

          {/*{(isFieldChange || synonymsId.length > 0) && (*/}
          {/*  <div className="cursor-pointer ant-row ant-space-align-center m-t-16">*/}
          {/*    <p className="gray-text m-0 m-r-16">*/}
          {/*      <small>Suggetions </small>*/}
          {/*    </p>*/}
          {/*    {listData.map((item, index) => (*/}
          {/*      <>*/}
          {/*        {!synonymsDataArray.find(*/}
          {/*          (element) => element.id === item.id*/}
          {/*        ) && (*/}
          {/*          <Tag*/}
          {/*            key={index}*/}
          {/*            color="blue"*/}
          {/*            onClick={() => onClickSuggestionsTag(item)}*/}
          {/*            visible={true}>*/}
          {/*            {item.label}*/}
          {/*          </Tag>*/}
          {/*        )}*/}
          {/*      </>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateSynonyms;
