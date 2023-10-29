import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import useError from '../../../../../hooks/error';
import queryClient from '../../../../../query-client';
import { IFolder, IWorkspaceParams } from '../../../../../types';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import { useDeleteFolder } from '../../services';

const useDeleteFolderModalController = (
  hideModal: () => void,
  selectedFolder?: IFolder,
  parentFolderId?: string,
  isPopUp?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCurrentFolderId?: (folderId: any) => void,
  onDeleted?:() => void
) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const deleteFolder = useDeleteFolder(workspaceId);

  useError({
    mutation: deleteFolder,
    entity: t('common.labels.folder'),
    dependentEntities: t('common.labels.file_or_folder'),
    cb: hideModal,
  });

  const onDeleteFolder = () => {
    if (selectedFolder) deleteFolder.mutate(selectedFolder.id);
  };

  useEffect(() => {
    if (deleteFolder.isSuccess) {
      onDeleted?.()
      queryClient.refetchQueries([API_QUERY_KEY.FOLDER_LIST, workspaceId]);
      queryClient.refetchQueries([API_QUERY_KEY.SUB_FOLDER_LIST, workspaceId]);
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_deleted_successfully', {
          entity: t('common.labels.folder'),
        })
      );
      if (isPopUp) {
        setCurrentFolderId && setCurrentFolderId(parentFolderId);
      } else {
        history.push(
          `/workspaces/${workspaceId}/media-manager?folder=${parentFolderId}`
        );
      }
      hideModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFolder.isSuccess]);

  return {
    t,
    onDeleteFolder,
    isDeleteLoading: deleteFolder.isLoading,
  };
};

export default useDeleteFolderModalController;
