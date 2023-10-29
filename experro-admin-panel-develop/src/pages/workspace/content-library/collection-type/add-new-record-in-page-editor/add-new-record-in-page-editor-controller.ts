import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useCreateTitle } from '../../services';
import { useEffect } from 'react';
import { openNotificationWithIcon } from '../../../../../utills';
import useError from '../../../../../hooks/error';
import useQuery from '../../../../../hooks/queryParameter';

const useAddNewRecordInPageEditorController = (
  onNewRecordInPopupVisibilityChange: (val: boolean) => void,
  contentModalId: string,
  contentModalInternalName: string
) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const query = useQuery();

  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const createTitle = useCreateTitle(workspaceId);

  useError({
    mutation: createTitle,
    entity: t('common.labels.content_library'),
    dependentEntities: t('common.labels.title'),
  });

  const generatePageSlug = (value: string) => {
    return value
      .replace(/[^a-zA-Z0-9-_/ ]/g, '')
      .replaceAll(' ', '-')
      .toLowerCase();
  };
  const onValueChange = (values: {
    title: string;
    pageSlug: string;
    contentModalId: string;
  }) => {
    if (values.title) {
      form.setFieldsValue({
        pageSlug: `/${generatePageSlug(values.title)}/`,
      });
    }
    if (values.pageSlug) {
      form.setFieldsValue({
        pageSlug: `${generatePageSlug(values.pageSlug)}`,
      });
    }
  };

  const onSaveButtonClick = async () => {
    try {
      const result = await form.validateFields();
      result['contentModalId'] = contentModalId;
      result['isForceUpdate'] = true;
      if (query.get('env')) {
        result['environmentId'] = query.get('env');
      } else {
        result['environmentId'] = localStorage.getItem(`${workspaceId}/environmentId`);
      }

      createTitle.mutate(result);
    } catch (err) {
      openNotificationWithIcon(
        'error',
        t('common.messages.provide_all_details')
      );
    }
  };

  useEffect(() => {
    if (createTitle.isSuccess) {
      if (createTitle.data) {
        openNotificationWithIcon(
          'success',
          t('common.messages.created_successfully')
        );
        form.resetFields();
        //@ts-ignore
        window.openContentLibrary(
          contentModalId,
          createTitle.data.contentModelDataId,
          createTitle.data.versionId,
          contentModalInternalName
        );
        onNewRecordInPopupVisibilityChange(false);
      }
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTitle.isSuccess]);

  return {
    t,
    onSaveButtonClick,
    form,
    onValueChange,
    loading: createTitle.isLoading,
  };
};
export default useAddNewRecordInPageEditorController;
