import React from 'react';
import { Button, Form, Select } from 'antd';

import useLoadLibraryController from './load-library-controller';
import SearchIcon from '../../../../../../images/icons/search-icon';
import Modal from '../../../../../../components/modal';

interface LoadLibraryModalProps {
  isVisible: boolean;
  environment: string;
  hideModal: () => void;
}

const LoadLibraryModal: React.FC<LoadLibraryModalProps> = ({
  isVisible,
  environment,
  hideModal,
}) => {
  const {
    t,
    form,
    industries,
    onSave,
    onIndustriesChanged,
    onCancelModal,
    isLoading,
  } = useLoadLibraryController(environment, hideModal);

  return (
    <Modal
      classname="CustomModal CustomModal-small"
      isModalVisibility={isVisible}
      title={t('common.labels.load_library')}
      hideModal={onCancelModal}
      footer={[
        <Button key="cancel" onClick={onCancelModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          // disabled={!selectedIndustriesIds.length}
          onClick={onSave}>
          {t('common.labels.save')}
        </Button>,
      ]}>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        initialValues={{}}
        key={'key'}
        form={form}>
        <div className="m-b-8">
          <Form.Item
            label={t('common.labels.industries')}
            name="industries"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.industries'),
                }),
              },
            ]}>
            <Select
              showArrow={true}
              mode="multiple"
              maxTagPlaceholder={(props) => <p>+{props.length}</p>}
              showSearch={true}
              optionFilterProp="children"
              suffixIcon={
                <span className="select-search-icon">
                  <SearchIcon />
                </span>
              }
              maxTagCount={3}
              placeholder={t('common.labels.industries_placeholder')}
              onChange={onIndustriesChanged}>
              {industries.map((option) => {
                return (
                  <Select.Option value={option.categoryId}>
                    {option.category}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default LoadLibraryModal;
