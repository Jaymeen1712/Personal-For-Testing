import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  useCreateModelGroup,
  useUpdateModelGroup,
  useDeleteGroup,
} from '../services/models';
import {
  useCreateComponentGroup,
  useUpdateComponentGroup,
  useDeleteComponentGroup,
} from '../services/components';
import { IWorkspaceParams } from '../../../../types';
import queryClient from '../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../utills';
import useError from '../../../../hooks/error';

const useCreateUpdateFolderModalController = (
  onModalVisibilityChange: (val: boolean, isEmptyData: boolean) => void,
  editFolderStatus: {
    folderId: string;
    folderName: string;
    position: number;
    status: boolean;
  },
  addNewType: string,
  titleAndSubtitleChange: (title: string, subTitle: string) => void
) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const history = useHistory();

  const [isDeleteFolderModalVisible, setIsDeleteFolderModalVisible] =
    useState<boolean>(false);
  const [isCreateFolderButtonVisible, setIsCreateFolderButtonVisible] =
    useState(true);

  const createModelFolder = useCreateModelGroup(workspaceId);
  const updateModelFolder = useUpdateModelGroup(workspaceId);

  const createComponentFolder = useCreateComponentGroup(workspaceId);
  const updateComponentFolder = useUpdateComponentGroup(workspaceId);

  const deleteGroup = useDeleteGroup(workspaceId);
  const deleteComponentGroup = useDeleteComponentGroup(workspaceId);

  const onSave = async () => {
    try {
      const result = await form.validateFields();
      if (addNewType === 'component') {
        if (editFolderStatus.status) {
          result['groupId'] = editFolderStatus.folderId;
          result['position'] = editFolderStatus.position;
          updateComponentFolder.mutate(result);
        } else {
          createComponentFolder.mutate(result);
        }
      } else {
        if (editFolderStatus.status) {
          result['groupId'] = editFolderStatus.folderId;
          result['position'] = editFolderStatus.position;
          updateModelFolder.mutate(result);
        } else {
          createModelFolder.mutate(result);
        }
      }
    } catch (err) {}
  };

  const onDelete = () => {
    onModalVisibilityChange(false, false);
    setIsDeleteFolderModalVisible(true);
  };

  const onHideDeleteModal = () => {
    setIsDeleteFolderModalVisible(false);
    onModalVisibilityChange(false, true);
  };

  const onDeleteModal = async () => {
    if (addNewType === 'component') {
      deleteComponentGroup.mutate(editFolderStatus.folderId);
    } else {
      deleteGroup.mutate(editFolderStatus.folderId);
    }
  };

  const onFormValueChange = (val: { groupName: string }) => {
    if (val.groupName === editFolderStatus.folderName || !val.groupName) {
      setIsCreateFolderButtonVisible(true);
    } else {
      setIsCreateFolderButtonVisible(false);
    }
  };
  useEffect(() => {
    if (editFolderStatus.status) {
      form.setFieldsValue({
        groupName: editFolderStatus.folderName,
        position: editFolderStatus.position,
      });
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editFolderStatus]);

  useEffect(() => {
    if (createModelFolder.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      onModalVisibilityChange(false, true);
      openNotificationWithIcon(
        'success',
        t('common.messages.folder_created_success')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModelFolder.isSuccess]);

  useEffect(() => {
    if (createModelFolder.isError) {
      if (createModelFolder.error.response.Error?.code === 'EX-00053') {
        openNotificationWithIcon(
          'error',
          t('common.messages.group_name_already_exists')
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModelFolder.isError]);

  useEffect(() => {
    if (updateModelFolder.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.folder_update_success')
      );
      onModalVisibilityChange(false, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateModelFolder.isSuccess]);

  useEffect(() => {
    if (updateModelFolder.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_in_folder_updated')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateModelFolder.isError]);

  useEffect(() => {
    if (createComponentFolder.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_LIST]);
      onModalVisibilityChange(false, true);
      openNotificationWithIcon(
        'success',
        t('common.messages.folder_created_success')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createComponentFolder.isSuccess]);

  useEffect(() => {
    if (createComponentFolder.isError) {
      if (createComponentFolder.error.response.Error?.code === 'EX-00053') {
        openNotificationWithIcon(
          'error',
          t('common.messages.group_name_already_exists')
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createComponentFolder.isError]);

  useEffect(() => {
    if (updateComponentFolder.isSuccess) {
      titleAndSubtitleChange(form.getFieldValue('groupName'), '');
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.folder_update_success')
      );
      onModalVisibilityChange(false, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateComponentFolder.isSuccess]);

  useEffect(() => {
    if (updateComponentFolder.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_in_folder_updated')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateComponentFolder.isError]);

  useEffect(() => {
    if (deleteGroup.isSuccess) {
      onHideDeleteModal();
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.delete_folder_success')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteGroup.isSuccess]);

  useError({
    mutation: deleteGroup,
    entity: t('common.labels.error_group_delete'),
    dependentEntities: t('common.labels.error_group_delete'),
  });

  useError({
    mutation: deleteComponentGroup,
    entity: t('common.labels.error_group_delete'),
    dependentEntities: t('common.labels.error_folder_delete'),
  });

  useEffect(() => {
    if (deleteComponentGroup.isSuccess) {
      onHideDeleteModal();
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_GROUP_LIST]);
      // queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.delete_folder_success')
      );
      onModalVisibilityChange(false, true);
      history.push(`/workspaces/${workspaceId}/content-model`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteComponentGroup.isSuccess]);

  return {
    t,
    form,
    onSave,
    loading: createModelFolder.isLoading,
    onDelete,
    deleteButtonLoading:
      addNewType === 'component'
        ? deleteComponentGroup.isLoading
        : deleteGroup.isLoading,
    isDeleteFolderModalVisible,
    onHideDeleteModal,
    onDeleteModal,
    isCreateFolderButtonVisible,
    onFormValueChange,
  };
};
export default useCreateUpdateFolderModalController;
