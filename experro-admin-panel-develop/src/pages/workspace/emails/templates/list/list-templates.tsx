import React from 'react';
import { Modal, Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import SendTestEmail from '../sendTestEmail';
import useListTemplateController from './list-template-controller';
import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

const ListTemplates = () => {
  const {
    t,
    listTemplates,
    columns,
    isDeleteModalVisible,
    onHideDeleteModal,
    onDeleteTemplateModal,
    isLoadingDeleteButton,
    selectedTemplateIdForSendEmail,
    isSendEmailModalVisible,
    onHideSendTestEmailModal,
    deleteRecordName,
    pagination,
    onHideActiveInActiveModal,
    isActiveInActiveTemplateModalVisible,
    onActiveInActiveModalClick,
  } = useListTemplateController();

  return (
    <>
      {listTemplates.isSuccess &&
      listTemplates.data &&
      listTemplates.data?.items ? (
        <div className="table-section">
          <Table
            columns={columns}
            // @ts-ignore
            dataSource={listTemplates.data?.items}
            pagination={pagination}
            locale={{
              emptyText: (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_record_added')}
                  description={t('common.labels.add_templates_above')}
                />
              ),
            }}
          />
        </div>
      ) : (
        (listTemplates.isLoading || listTemplates.isFetching) && (
          <Spin
            className="HV-center m-t-32"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )
      )}

      <Modal
        className="confirm-modal"
        title={t('common.labels.delete_template', { entity: deleteRecordName })}
        open={isDeleteModalVisible}
        onCancel={onHideDeleteModal}
        okText={t('common.labels.delete')}
        onOk={onDeleteTemplateModal}
        confirmLoading={isLoadingDeleteButton}
        okButtonProps={{
          danger: true,
        }}
        centered>
        <div className="user-delete-modal">
          <p className="m-0 gray-text">
            {t('common.messages.template_delete_modal_message')}
          </p>
        </div>
      </Modal>

      <Modal
        className="confirm-modal"
        title={t('common.labels.inactive_email_template')}
        open={isActiveInActiveTemplateModalVisible}
        onCancel={onHideActiveInActiveModal}
        onOk={onActiveInActiveModalClick}
        okText={t('common.labels.inactive')}
        okButtonProps={{
          danger: true,
        }}
        centered>
        <div className="user-delete-modal">
          <p className="m-0 gray-text">
            {t('common.labels.inactive_email_template_description')}
          </p>
        </div>
      </Modal>

      <SendTestEmail
        isSendTestEmailModalVisible={isSendEmailModalVisible}
        onHideSendTestEmail={onHideSendTestEmailModal}
        templateId={selectedTemplateIdForSendEmail}
      />
    </>
  );
};

export default ListTemplates;
