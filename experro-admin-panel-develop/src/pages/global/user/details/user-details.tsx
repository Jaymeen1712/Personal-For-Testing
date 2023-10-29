import React from 'react';
import { Button, Table } from 'antd';

import DetailsTable from '../../../../components/details-table';
import UserDetailsController from './user-details-controller';
import Modal from '../../../../components/modal';
import NoDataFound from '../../../../components/no-data-found';
import DownArrowIcon from '../../../../images/icons/arrow-left-icon';
import NoRecordIcon from '../../../../images/icons/no-records-icon';

const UserDetails: React.FC = () => {
  const {
    workspaceRoleDetail,
    columns,
    aboutInfo,
    fullName,
    onBackButtonClick,
    t,
    detailUser,
    onDeleteClick,
    isDeleteModalVisible,
    deleteUser,
    hideDeleteModal,
    onDeleteModalSubmit,
    onResetPasswordClick,
    onEditClick,
    isResetPasswordModalVisible,
    hideResetPasswordModal,
    onResetPasswordSubmit,
    resetPassword,
  } = UserDetailsController();

  return (
    <div>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onBackButtonClick}>
            <DownArrowIcon />
          </div>
          <div className="w-100">
            <span className="ant-page-header-heading-title">{fullName}</span>
          </div>
        </div>
        <div className="headerright">
          <div className="ant-row ant-row-end">
            <div className="ant-row ant-row-end">
              <Button
                id={t('common.labels.delete')}
                onClick={onDeleteClick}
                danger
                disabled={
                  detailUser.data && detailUser.data.status === 'inactive'
                }
                type="link">
                {t('common.labels.delete')}
              </Button>

              {detailUser.data && detailUser.data.status !== 'inactive' && (
                <Button
                  id={t('common.labels.reset_password')}
                  type="default"
                  onClick={onResetPasswordClick}>
                  {detailUser.data.status === 'invited'
                    ? t('common.labels.resend_link')
                    : t('common.labels.reset_password')}
                </Button>
              )}

              <Button
                id={t('common.labels.edit')}
                type="primary"
                disabled={
                  detailUser.data &&
                  (detailUser.data.status === 'inactive' ||
                    detailUser.data.status === 'invited')
                }
                onClick={onEditClick}>
                {t('common.labels.edit')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="ant-row">
        <div className="ant-row" />
      </div>
      <div className="ant-vertical-table-wrapper">
        <DetailsTable rows={aboutInfo} />
      </div>

      <div className="table-section">
        <div className="m-b-40">
          {detailUser.isSuccess && (
            <Table
              columns={columns}
              dataSource={workspaceRoleDetail}
              pagination={false}
              locale={{
                emptyText: (
                  <NoDataFound
                    icon={<NoRecordIcon />}
                    title={t('common.labels.no_roles_assign')}
                    description={t('common.labels.assign_role_to_see_the_list')}
                  />
                ),
              }}
            />
          )}
        </div>

        {/*TODO:Currently access history removed*/}
        {/*<div>*/}
        {/*  <h3>{t('common.labels.access_history')}</h3>*/}
        {/*  <Table*/}
        {/*    columns={accessHistoryColumns}*/}
        {/*    dataSource={accessHistoryData}*/}
        {/*    pagination={false}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>

      <Modal
        title={t('common.messages.delete_entity', {
          entity: `${detailUser.data?.firstName}`,
        })}
        isModalVisibility={isDeleteModalVisible}
        hideModal={hideDeleteModal}
        onOK={onDeleteModalSubmit}
        okText={t('common.labels.delete')}
        confirmLoading={deleteUser.isLoading}
        classname="confirm-modal">
        <p>
          {t('common.messages.delete_entity_message', {
            entity: t('common.labels.userDelete'),
          })}
        </p>
      </Modal>

      <Modal
        title={t('common.messages.reset_user_password', {
          name: `${detailUser.data?.firstName}`,
        })}
        isModalVisibility={isResetPasswordModalVisible}
        hideModal={hideResetPasswordModal}
        footer={[
          <Button key="back" onClick={hideResetPasswordModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onResetPasswordSubmit}
            loading={resetPassword.isLoading ? true : false}>
            {t('common.labels.reset_password')}
          </Button>,
        ]}>
        <p>{t('common.messages.reset_password_message')}</p>
      </Modal>
    </div>
  );
};

export default UserDetails;
