import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import queryClient from '../../../../../../query-client';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
} from '../../../../../../utills';
import { FormInstance } from 'antd/es/form';
import { useCreateStopWords, useUpdateStopWords } from '../../../services';
import useError from '../../../../../../hooks/error';

const useCreateUpdateStopWordsController = (
  form: FormInstance,
  stopWordId: string,
  setStopWordId: (stopWordId: string[]) => void,
  setIsModalVisible: (isModalVisible: boolean) => void
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const [environmentId] = useState<string>(
    // @ts-ignore
    localStorage.getItem(`${workspaceId}/environmentId`)
  );
  const [disableSave, setIsDisableSave] = useState(true);

  const createStopWords = useCreateStopWords(workspaceId);
  const updateStopWords = useUpdateStopWords(stopWordId, workspaceId);

  useError({
    mutation: createStopWords,
    entity: t('common.labels.stopword'),
  });

  useError({
    mutation: updateStopWords,
    entity: t('common.labels.stopword'),
  });

  const onCancel = useCallback(() => {
    form.resetFields();
    setIsModalVisible(false);
    setStopWordId([]);
    // eslint-disable-next-line
  }, [form]);

  const onSave = async () => {
    const values = await form.validateFields();

    if (values.term.trim().length === 0) {
      form.setFields([
        {
          name: 'term',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.term.trim().length > 255) {
      form.setFields([
        {
          name: 'term',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.term'),
            }),
          ],
        },
      ]);
    } else {
      values.term = values.term.trim();
      if (stopWordId.length) {
        updateStopWords.mutate({
          canonicalForm: values.term,
          surfaceForm: [values.term],
          displayForm: [values.term],
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      } else {
        createStopWords.mutate({
          canonicalForm: values.term,
          surfaceForm: [values.term],
          displayForm: [values.term],
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      }
    }
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.term) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  useEffect(() => {
    if (createStopWords.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_STOP_WORDS]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
    }
  }, [form, t, workspaceId, createStopWords.isSuccess, onCancel]);

  useEffect(() => {
    if (updateStopWords.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_STOP_WORDS]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
  }, [form, t, workspaceId, updateStopWords.isSuccess, onCancel]);

  return {
    t,
    form,
    isLoading: createStopWords.isLoading || updateStopWords.isLoading,
    handleFieldChange,
    disableSave,
    onCancel,
    onSave,
  };
};
export default useCreateUpdateStopWordsController;
