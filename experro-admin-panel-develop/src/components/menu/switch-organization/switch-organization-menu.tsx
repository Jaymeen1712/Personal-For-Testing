import React from 'react';
import { Button, Form, Select } from 'antd';

import DownArrowIcon from '../../../images/icons/downarrow-icon';
import Modal from '../../modal';
import { ISwitchOrganization } from '../../../types';

const SwitchOrganizationMenu: React.FC<ISwitchOrganization> = ({
  isVisibleSwitchOrganizationModal,
  t,
  hideSwitchOrganizationModal,
  isSwitchButtonVisible,
  onSubmitOrganization,
  form,
  linksOrganization,
  selectedOrganizationData,
  onSwitchOrganization,
}) => {
  return (
    <Modal
      isModalVisibility={isVisibleSwitchOrganizationModal}
      title={t('common.labels.switch_organization')}
      classname="CustomModal CustomModal-small"
      hideModal={hideSwitchOrganizationModal}
      footer={[
        <Button key="back" onClick={hideSwitchOrganizationModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          disabled={!isSwitchButtonVisible}
          key="submit"
          type="primary"
          onClick={onSubmitOrganization}>
          {t('common.labels.switch')}
        </Button>,
      ]}>
      <Form
        name="organization-form"
        layout="vertical"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        form={form}>
        <Form.Item
          name="organization"
          className="w-100"
          label={t('common.labels.organization')}>
          {linksOrganization && linksOrganization.items.length > 1 && (
            <Select
              defaultValue={
                selectedOrganizationData && selectedOrganizationData.id
              }
              onChange={onSwitchOrganization}
              suffixIcon={<DownArrowIcon />}>
              {linksOrganization.items.map((link) => (
                <Select.Option key={link.linkName} value={link.id}>
                  {link.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SwitchOrganizationMenu;
