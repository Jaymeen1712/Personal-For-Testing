import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import useWorkspaceRoute from '../../../../../hooks/workspace-route';
import useError from '../../../../../hooks/error';
import {
  useCreateWidget,
  useGetWidgetDetails,
  useUpdateWidget,
} from '../../services';

const useCreateUpdateWidgetController = (
  environment: string | null,
  isEditWidget: boolean,
  onSetWidgetModalVisible: (val: boolean) => void,
  onSetEditWidget: (val: boolean) => void
) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { push } = useWorkspaceRoute();

  const { workspaceId, subMenu, parentMenu } = useParams<{
    workspaceId: string;
    parentMenu: string;
    subMenu: string;
  }>();
  const [disableSave, setDisableSave] = useState(true);

  const getWidgetDetails = useGetWidgetDetails(
    subMenu,
    workspaceId,
    environment
  );
  const createWidget = useCreateWidget(workspaceId);

  const updateWidget = useUpdateWidget(subMenu, workspaceId, environment);

  useError({
    mutation: createWidget,
    entity: t('common.labels.widget'),
  });

  useError({
    mutation: updateWidget,
    entity: t('common.labels.widget'),
  });

  const onFinish = async () => {
    try {
      const values = await form.validateFields();

      if (values.name.trim().length === 0) {
        form.setFields([
          {
            name: 'name',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else {
        values.name = values.name.trim();
        values.internalName = values.name.replaceAll(' ', '_').toLowerCase();
        values.isSystemGenerated = false;
        values.environmentsId = [environment];
        if (isEditWidget) {
          updateWidget.mutate(values);
        } else {
          createWidget.mutate(values);
        }
      }
    } catch (err) {
      openNotificationWithIcon(
        'error',
        t('common.messages.provide_all_details')
      );
    }
  };

  const onCancel = () => {
    queryClient.removeQueries([API_QUERY_KEY.WIDGET_LIST, workspaceId]);
    queryClient.removeQueries([API_QUERY_KEY.WIDGET_DETAILS, workspaceId]);
    onSetWidgetModalVisible(false);
    form.resetFields();
  };

  const onCancelModal = () => {
    onSetWidgetModalVisible(false);
    form.resetFields();
  };

  const onHandleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.name) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  };

  useEffect(() => {
    if (isEditWidget && getWidgetDetails.isSuccess) {
      form.setFieldsValue({
        name: getWidgetDetails?.data?.name,
        description: getWidgetDetails?.data?.description,
      });
    }
    // eslint-disable-next-line
  }, [getWidgetDetails?.data, isEditWidget, getWidgetDetails?.isSuccess]);

  useEffect(() => {
    if (createWidget.isSuccess) {
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.created_successfully')
      );
      push(
        `/personalization/custom-widget/${createWidget?.data?.id}/list-records`
      );
    }
    // eslint-disable-next-line
  }, [createWidget.isSuccess]);

  useEffect(() => {
    if (updateWidget.isSuccess) {
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      push(`/personalization/${parentMenu}/${subMenu}/list-records`);
    }
    // eslint-disable-next-line
  }, [updateWidget.isSuccess]);

  return {
    t,
    form,
    workspaceId,
    disableSave,
    getWidgetDetails,
    onFinish,
    onCancelModal,
    onHandleFieldChange,
    isWidgetLoading: createWidget.isLoading || updateWidget.isLoading,
  };
};

export default useCreateUpdateWidgetController;
