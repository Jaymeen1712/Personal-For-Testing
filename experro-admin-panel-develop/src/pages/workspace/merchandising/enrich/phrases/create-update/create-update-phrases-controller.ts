import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import queryClient from '../../../../../../query-client';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
} from '../../../../../../utills';
import { FormInstance } from 'antd/es/form';
import { useCreatePhrases, useUpdatePhrases } from '../../../services';
import useError from '../../../../../../hooks/error';

const useCreateUpdatePhrasesController = (
  form: FormInstance,
  phraseId: string,
  setIsModalVisible: (isModalVisible: boolean) => void,
  setPhraseId: (phraseId: string[]) => void
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

  const createPhrase = useCreatePhrases(workspaceId);
  const updatePhrase = useUpdatePhrases(phraseId, workspaceId);

  useError({
    mutation: createPhrase,
    entity: t('common.labels.phrase'),
  });

  useError({
    mutation: updatePhrase,
    entity: t('common.labels.phrase'),
  });

  const onCancel = useCallback(() => {
    form.resetFields();
    setIsModalVisible(false);
    setPhraseId([]);
    // eslint-disable-next-line
  }, [form]);

  const onSave = async () => {
    const values = await form.validateFields();

    if (values.phrase.trim().length === 0) {
      form.setFields([
        {
          name: 'phrase',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.phrase.trim().length > 255) {
      form.setFields([
        {
          name: 'phrase',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.phrase'),
            }),
          ],
        },
      ]);
    } else {
      values.phrase = values.phrase.trim();
      if (phraseId.length) {
        updatePhrase.mutate({
          canonicalForm: values.phrase,
          surfaceForm: [values.phrase],
          displayForm: [values.phrase],
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      } else {
        createPhrase.mutate({
          canonicalForm: values.phrase,
          surfaceForm: [values.phrase],
          displayForm: [values.phrase],
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      }
    }
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.phrase) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  useEffect(() => {
    if (createPhrase.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
    }
  }, [form, t, workspaceId, createPhrase.isSuccess, onCancel]);

  useEffect(() => {
    if (updatePhrase.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
  }, [form, t, workspaceId, updatePhrase.isSuccess, onCancel]);

  return {
    t,
    form,
    handleFieldChange,
    disableSave,
    isLoading: createPhrase.isLoading || updatePhrase.isLoading,
    onCancel,
    onSave,
  };
};
export default useCreateUpdatePhrasesController;
