import { useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';

import useWorkspaceRoute from '../../../../../hooks/workspace-route';
import useError from '../../../../../hooks/error';
import { IFileDetails } from '../../../../../types';
import {
  openNotificationWithIcon,
  TEXT_REGEX_PATTERN,
} from '../../../../../utills';
import { useUpdateFile } from '../../services';
import useListEnvironments from '../../../../../apis/environments/list';

const useEditFileController = (
  workspaceId: string,
  folderId: string,
  fileId: string,
  refetchFolderData: () => void,
  onFileEdited: () => void
) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { push } = useWorkspaceRoute();

  const [domainName, setDomainName] = useState<string>('');
  const updateFile = useUpdateFile(workspaceId, folderId, fileId);
  const [isDeleteFileModalVisible, setDeleteFileModalVisible] = useState(false);

  const getEnvironmentList = useListEnvironments(workspaceId);
  const [isFileDetailsChange, setFileDetailsChange] = useState(false);

  useEffect(() => {
    if (getEnvironmentList.isSuccess) {
      if (getEnvironmentList.data && getEnvironmentList.data.length > 0) {
        const environmentDetails = getEnvironmentList.data.find(
          (item) => item.type === 'PRODUCTION'
        );
        if (environmentDetails) {
          if (environmentDetails.customDomain) {
            setDomainName(environmentDetails.customDomain);
          } else if (environmentDetails.cacheDomain) {
            setDomainName(environmentDetails.cacheDomain);
          } else {
            setDomainName('');
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentList.isSuccess, getEnvironmentList.data]);

  useEffect(() => {
    if (getEnvironmentList.isError) {
      console.log(getEnvironmentList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentList.isError]);

  useError({
    mutation: updateFile,
    entity: t('common.labels.file'),
    dependentEntities: t('common.labels.file'),
  });

  const onFinish = useCallback(
    (values: IFileDetails) => {
      if (values.name.trim().length >= 255) {
        form.setFields([
          {
            name: 'name',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.file_name'),
              }),
            ],
          },
        ]);
      } else if (values.caption.trim().length >= 255) {
        form.setFields([
          {
            name: 'caption',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.title_caption'),
              }),
            ],
          },
        ]);
      } else if (
        values.name.trim().length > 0 &&
        !TEXT_REGEX_PATTERN.test(values.name)
      ) {
        form.setFields([
          {
            name: 'name',
            errors: [
              t('common.messages.format', {
                entity: t('common.labels.file_name'),
              }),
            ],
          },
        ]);
      } else {
        values.name = values.name.trim();
        values.caption = values.caption.trim();
        updateFile.mutate(values);
      }
    },
    // eslint-disable-next-line
    [updateFile]
  );

  const onCancel = useCallback(() => {
    push(`/media-manager?folder=${folderId}`);
  }, [folderId, push]);

  const onLinkCopy = useCallback(
    () =>
      openNotificationWithIcon('success', t('common.messages.linked_copied')),
    [t]
  );

  const onFormChange = () => {
    setFileDetailsChange(true);
  };

  const onHideDeleteFileModal = () => {
    setDeleteFileModalVisible(false);
  };

  const onDeleteFileClick = () => {
    setDeleteFileModalVisible(true);
  };

  const onDeleteFile = useCallback(() => {
    push(`/media-manager?folder=${folderId}`);
    refetchFolderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, push]);

  useEffect(() => {
    if (updateFile.isSuccess) {
      onFileEdited();
      setFileDetailsChange(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.media_details_updated')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFile.isSuccess]);

  return {
    t,
    isFileDetailsChange,
    isDeleteFileModalVisible,
    form,
    isLoading: updateFile.isLoading,
    onFinish,
    onCancel,
    domainName,
    onLinkCopy,
    onHideDeleteFileModal,
    onDeleteFileClick,
    onDeleteFile,
    onFormChange,
  };
};

export default useEditFileController;
