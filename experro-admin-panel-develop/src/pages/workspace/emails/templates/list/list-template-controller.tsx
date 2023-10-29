import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useCloneTemplatesEmails,
  useDeleteTemplateEmails,
  useListTemplatesEmails,
  usePatchTemplateEmails,
} from '../../services';
import { Button, Dropdown, Menu, Tag } from 'antd';

import usePermissions from '../../../../../hooks/permissions';
import { openNotificationWithIcon, PAGE_SIZE } from '../../../../../utills';
import { RowRecord } from '../../../../../types';
import EllipsisIcon from '../../../../../images/icons/ellipsis-icon';

interface IListTemplateControllerParams {
  workspaceId: string;
  masterTemplateId?: string;
}

const useListTemplateController = () => {
  const { t } = useTranslation();
  const { workspaceId, masterTemplateId } =
    useParams<IListTemplateControllerParams>();
  const history = useHistory();
  const permissions = usePermissions();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteRecordName, SetDeleteRecordName] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isSendEmailModalVisible, setIsSendEmailModalVisible] =
    useState<boolean>(false);
  const [selectedTemplateIdForSendEmail, setSelectedTemplateIdForSendEmail] =
    useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [templateInActiveData, setTemplateInActiveData] = useState<RowRecord>(
    {}
  );
  const [
    isActiveInActiveTemplateModalVisible,
    setIsActiveInActiveTemplateModalVisible,
  ] = useState<boolean>(false);

  const listTemplates = useListTemplatesEmails(
    workspaceId,
    page,
    pageSize,
    masterTemplateId
  );
  const deleteTemplates = useDeleteTemplateEmails(workspaceId);
  const cloneTemplates = useCloneTemplatesEmails(workspaceId);
  const patchTemplates = usePatchTemplateEmails(workspaceId);

  const pagination = useMemo(
    () => ({
      total: listTemplates.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        listTemplates.data &&
        listTemplates.data.totalCount &&
        listTemplates.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
        listTemplates.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listTemplates.data, setPage, page, pageSize, setPageSize]
  );

  const onDeleteTemplate = useCallback(
    (templateId: string, record: RowRecord) => {
      setIsDeleteModalVisible(true);
      SetDeleteRecordName(record.name);
      setSelectedTemplateId(templateId);
    },
    []
  );

  const onDeleteTemplateModal = () => {
    deleteTemplates.mutate(selectedTemplateId);
  };

  const onHideDeleteModal = () => {
    setSelectedTemplateId('');
    SetDeleteRecordName('');
    setIsDeleteModalVisible(false);
  };

  useEffect(() => {
    if (deleteTemplates.isSuccess) {
      onHideDeleteModal();
      setSelectedTemplateId('');
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      listTemplates.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTemplates.isSuccess, t]);

  const onEditTemplate = useCallback(
    (templateId: string) => {
      history.push(
        `/workspaces/${workspaceId}/emails/templates/${templateId}/create-update/false/${masterTemplateId}`
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, workspaceId]
  );

  const onCloneTemplate = useCallback((templateId: string) => {
    cloneTemplates.mutate({ templateId: templateId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cloneTemplates.isSuccess && cloneTemplates.data) {
      history.push(
        `/workspaces/${workspaceId}/emails/templates/${cloneTemplates.data.id}/create-update/true/${masterTemplateId}`
      );

      openNotificationWithIcon(
        'success',
        t('common.messages.cloned_successfully')
      );
    }
    // eslint-disable-next-line
  }, [cloneTemplates.isSuccess, cloneTemplates.data, workspaceId]);

  const onSendTestEmail = useCallback((templateId: string) => {
    setIsSendEmailModalVisible(true);
    setSelectedTemplateIdForSendEmail(templateId);
  }, []);

  const onHideSendTestEmailModal = () => {
    setSelectedTemplateIdForSendEmail('');
    setIsSendEmailModalVisible(false);
  };

  const onTemplateClick = useCallback(
    (templateId: string) => {
      history.push(
        `/workspaces/${workspaceId}/emails/templates/${templateId}/create-update/false/${masterTemplateId}`
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, workspaceId]
  );

  const onActiveInActiveClick = useCallback(
    (templateId: string, row: RowRecord) => {
      if (row.isActive) {
        setTemplateInActiveData(row);
        setIsActiveInActiveTemplateModalVisible(true);
      } else {
        patchTemplates.mutate({
          id: templateId,
          isActive: !row.isActive,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onActiveInActiveModalClick = () => {
    patchTemplates.mutate({
      id: templateInActiveData.id,
      isActive: !templateInActiveData.isActive,
    });
  };

  const onHideActiveInActiveModal = () => {
    setTemplateInActiveData({});
    setIsActiveInActiveTemplateModalVisible(false);
  };

  useEffect(() => {
    if (patchTemplates.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      if (isActiveInActiveTemplateModalVisible) {
        onHideActiveInActiveModal();
      }
      listTemplates.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchTemplates.isSuccess]);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
        width: '34%',
        render: (name: string, row: object) => {
          return (
            <>
              <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
                <div
                  className="text-truncate text-blue cursor-pointer with-pixel-large"
                  //@ts-ignore
                  onClick={() => onTemplateClick(row.id)}>
                  {/* @ts-ignore */}
                  {row.name ? row.name : '-'}
                </div>

                <Dropdown
                  placement="bottomRight"
                  trigger={['click']}
                  overlay={
                    <div className="table-dropdown">
                      <Menu>
                        {permissions.canUpdateEmailTemplatesTemplate() && (
                          <Menu.Item
                            //@ts-ignore
                            className={`${row.isDefault ? 'display-none' : ''}`}
                            //@ts-ignore
                            onClick={() => onEditTemplate(row.id)}>
                            {t('common.labels.edit')}
                          </Menu.Item>
                        )}
                        {permissions.canCreateEmailTemplatesTemplate() && (
                          <Menu.Item
                            //@ts-ignore
                            onClick={() => onCloneTemplate(row.id, row)}>
                            {t('common.labels.clone')}
                          </Menu.Item>
                        )}

                        {/* @ts-ignore */}
                        <Menu.Item
                          // @ts-ignore
                          onClick={() => onSendTestEmail(row.id, row)}>
                          {t('common.labels.send_test_mail')}
                        </Menu.Item>

                        {permissions.canUpdateEmailTemplatesTemplate() && (
                          <Menu.Item
                            // @ts-ignore
                            onClick={() => onActiveInActiveClick(row.id, row)}>
                            {
                              // @ts-ignore
                              row.isActive
                                ? t('common.labels.inactive')
                                : t('common.labels.active')
                            }
                          </Menu.Item>
                        )}

                        {permissions.canDeleteEmailTemplatesTemplate() && (
                          <Menu.Item
                            className={`${
                              // @ts-ignore
                              row.isDefault ? 'display-none' : ''
                            }`}
                            // @ts-ignore
                            onClick={() => onDeleteTemplate(row.id, row)}>
                            <p className="text-red m-0">
                              {t('common.labels.delete')}
                            </p>
                          </Menu.Item>
                        )}
                      </Menu>
                    </div>
                  }>
                  <Button
                    type="text"
                    size="small"
                    className="on-hover"
                    icon={<EllipsisIcon />}
                    style={{ float: 'right' }}
                  />
                </Dropdown>
              </div>
            </>
          );
        },
      },
      {
        title: t('common.labels.assign_to'),
        dataIndex: 'environments',
        key: 'assignedTo',
        width: '33%',
        render: (environments: string[]) => (
          <>
            <div className="text-truncate">
              {environments && environments.length > 0
                ? environments.length > 2
                  ? `${environments[0]},${environments[1]}, +${
                      environments.length - 2
                    }`
                  : environments.length > 1
                  ? `${environments[0]},${environments[1]}`
                  : environments[0]
                : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.status'),
        dataIndex: 'isActive',
        key: 'isActive',
        width: '33%',
        render: (isActive: string, record: RowRecord) => {
          if (record.isActive) {
            return <Tag color="success">{t('common.labels.active')}</Tag>;
          } else {
            return <Tag color="error">{t('common.labels.inactive')}</Tag>;
          }
        },
      },
    ],
    // eslint-disable-next-line
    []
  );

  return {
    t,
    listTemplates,
    columns,
    isDeleteModalVisible,
    onHideDeleteModal,
    onDeleteTemplateModal,
    isLoadingDeleteButton: deleteTemplates.isLoading,
    selectedTemplateIdForSendEmail,
    isSendEmailModalVisible,
    onHideSendTestEmailModal,
    deleteRecordName,
    pagination,
    onHideActiveInActiveModal,
    isActiveInActiveTemplateModalVisible,
    onActiveInActiveModalClick,
  };
};

export default useListTemplateController;
