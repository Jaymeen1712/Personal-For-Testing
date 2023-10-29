import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';

import { ContentLibraryContext } from '../../context';
import { useUpdateVersionName } from '../../services';
import { useParams } from 'react-router-dom';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';

const useUpdateVersionNameModalController = (
  changeUpdateVersionNameModalVisibility: (val: boolean) => void,
  updateVersionId?: string,
  versionDetailUpdateSuccessfully?: () => void,
  versionName?: string
) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [isUpdateVersionButtonDisabled, setIsUpdateVersionButtonDisabled] =
    useState(true);

  const { workspaceId, contentModalId, contentModalDataId, versionId } =
    useParams<{
      workspaceId: string;
      contentModalId: string;
      contentModalDataId: string;
      versionId: string;
      languageName: string;
    }>();

  const id = updateVersionId ? updateVersionId : versionId;

  const updateVersionName = useUpdateVersionName(
    workspaceId,
    contentModalId,
    contentModalDataId,
    id
  );

  const onFormValueChange = (value: { versionName: string }) => {
    if (versionName && versionName !== value.versionName && value.versionName) {
      setIsUpdateVersionButtonDisabled(false);
    } else {
      setIsUpdateVersionButtonDisabled(true);
    }
  };

  const onSave = () => {
    form
      .validateFields()
      .then((data) => {
        updateVersionName.mutate(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (updateVersionName.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.version_name_updated')
      );
      contentLibraryContext?.ChangeIsFieldDirty({});
      changeUpdateVersionNameModalVisibility(false);
      if (versionDetailUpdateSuccessfully) {
        versionDetailUpdateSuccessfully();
      }

      queryClient.removeQueries([
        API_QUERY_KEY.GET_VERSION_LIST,
        contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
        'us-en',
        id,
      ]);

      queryClient.refetchQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentLibraryContext?.newRecordFieldDetails?.contentModalId,
        contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
        contentLibraryContext?.newRecordFieldDetails?.language,
        id,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateVersionName.isSuccess]);

  useEffect(() => {
    if (updateVersionName.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_in_updating_version_name')
      );
    }
  }, [t, updateVersionName.isError]);

  return {
    t,
    onSave,
    form,
    updateVersionName,
    isUpdateVersionButtonDisabled,
    onFormValueChange,
  };
};
export default useUpdateVersionNameModalController;
