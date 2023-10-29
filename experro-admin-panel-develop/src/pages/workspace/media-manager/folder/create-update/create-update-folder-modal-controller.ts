import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Form } from 'antd';
import useError from '../../../../../hooks/error';
import queryClient from '../../../../../query-client';
import { IFolder, IWorkspaceParams } from '../../../../../types';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import { useCreateFolder, useUpdateFolder } from '../../services';

const useCreateUpdateFolderController = (
  parentFolderId: string,
  hideModal: () => void,
  folderDepth: number,
  selectedFolder?: IFolder,
  setCurrentFolderId?: (folderId: string) => void,
  isPopUp?: boolean
) => {
  const [isInputChanged, setInputChanged] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [form] = Form.useForm();

  const createFolder = useCreateFolder(workspaceId, parentFolderId);
  const updateFolder = useUpdateFolder(
    workspaceId,
    selectedFolder?.parentFolderId,
    selectedFolder?.id
  );

  useError({
    mutation: createFolder,
    entity: t('common.labels.folder'),
    dependentEntities: t('common.labels.file_or_folder'),
  });
  useError({
    mutation: updateFolder,
    entity: t('common.labels.folder'),
    dependentEntities: t('common.labels.file_or_folder'),
  });

  const onSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

      if (values.name.trim().length === 0) {
        form.setFields([
          {
            name: 'name',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (values.name.trim().length > 30) {
        form.setFields([
          {
            name: 'name',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.folder_name'),
              }),
            ],
          },
        ]);
      } else {
        if (selectedFolder) {
          updateFolder.mutate(values.name.trim());
        } else if (folderDepth > 5) {
          openNotificationWithIcon(
            'error',
            t('common.messages.max_depth_folder')
          );
        } else {
          createFolder.mutate(values.name.trim());
        }
      }
    } catch (error) {
      console.error('validation failed', error);
    }
  }, [createFolder, folderDepth, form, selectedFolder, t, updateFolder]);

  useEffect(() => {
    if (createFolder.isSuccess) {
      setInputChanged(false);
      queryClient.refetchQueries([API_QUERY_KEY.FOLDER_LIST, workspaceId]);
      if (isPopUp) {
        setCurrentFolderId && setCurrentFolderId(createFolder.data);
      } else {
        history.push(
          `/workspaces/${workspaceId}/media-manager?folder=${createFolder.data}`
        );
      }
      hideModal();
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_created_successfully', {
          entity: t('common.labels.folder'),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createFolder.isSuccess, t]);

  useEffect(() => {
    if (updateFolder.isSuccess) {
      queryClient.refetchQueries([API_QUERY_KEY.FOLDER_LIST, workspaceId]);
      queryClient.refetchQueries([API_QUERY_KEY.SUB_FOLDER_LIST, workspaceId]);
      hideModal();
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_renamed_successfully', {
          entity: t('common.labels.folder'),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFolder.isSuccess, t]);

  const onFormChange = () => {
    setInputChanged(true);
  };

  return {
    t,
    isInputChanged,
    onSave,
    form,
    createFolder,
    updateFolder,
    onFormChange,
  };
};
export default useCreateUpdateFolderController;
