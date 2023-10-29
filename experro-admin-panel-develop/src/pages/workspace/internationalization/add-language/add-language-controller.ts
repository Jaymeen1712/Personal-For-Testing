import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { IWorkspaceParams } from '../../../../types';
import useError from '../../../../hooks/error';
import { openNotificationWithIcon } from '../../../../utills';
import { useAddWorkspaceLanguage, useListWorkspaceLanguage } from '../services';

interface ISelectedLanguage {
  language: string;
}

const useAddLanguageController = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<IWorkspaceParams>();

  const [isAddButtonVisible, setIsAddButtonVisible] = useState<boolean>(true);

  const addWorkspaceLanguage = useAddWorkspaceLanguage();
  const listWorkspaceLanguage = useListWorkspaceLanguage(workspaceId);

  useError({
    mutation: addWorkspaceLanguage,
    entity: t('common.labels.language'),
  });

  const onFinish = (values: ISelectedLanguage) => {
    addWorkspaceLanguage.mutate({ languageId: values.language, workspaceId });
  };

  useEffect(() => {
    if (addWorkspaceLanguage.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
      form.resetFields();
      listWorkspaceLanguage.refetch();
      setIsAddButtonVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addWorkspaceLanguage.isSuccess, t]);

  const onChangeLanguage = (value: string) => {
    if (value !== '') {
      setIsAddButtonVisible(false);
    }
  };

  return {
    form,
    onFinish,
    t,
    addWorkspaceLanguage,
    isAddButtonVisible,
    onChangeLanguage,
  };
};

export default useAddLanguageController;
