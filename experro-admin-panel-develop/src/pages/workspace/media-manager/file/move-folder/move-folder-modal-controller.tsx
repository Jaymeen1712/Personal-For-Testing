import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { IFolder, IWorkspaceParams } from '../../../../../types';
import { useListFolder } from '../../services';

const useMoveFolderModalController = (folderId?: string) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [folders, setFolders] = useState<IFolder[]>();
  const [search, setSearch] = useState('');
  const [targetFolderId, setTargetFolderId] = useState('');

  const listFolder = useListFolder(workspaceId);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = e;

      setSearch(value);
      setFolders(
        listFolder.data?.filter(
          (folder) =>
            folder.name.toLowerCase().includes(value.toLowerCase()) &&
            folder.id !== folderId
        )
      );
    },
    [folderId, listFolder.data]
  );

  const onFolderClick = useCallback((folderId: string) => {
    setTargetFolderId(folderId);
  }, []);

  useEffect(() => {
    setFolders(listFolder.data?.filter((folder) => folder.id !== folderId));
  }, [folderId, listFolder.data]);

  return {
    t,
    search,
    folders,
    listFolder,
    targetFolderId,
    onSearchChange,
    onFolderClick,
  };
};

export default useMoveFolderModalController;
