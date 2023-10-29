import { Form, RadioChangeEvent } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import useWorkspaceRoute from '../../../../../hooks/workspace-route';
import useError from '../../../../../hooks/error';
import {
  useCreateWidgetRule,
  useGetWidgetDetails,
  useWidgetPatchRule,
  useWidgetRuleDetails,
} from '../../services';

const useCreateUpdateRuleController = (
  environment: string | null,
  onCancelRuleModalVisible: (val: boolean) => void,
  onSetEditRule?: (val: boolean) => void,
  isEditRule?: boolean
) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { push } = useWorkspaceRoute();

  const {
    workspaceId,
    versionId,
    contentModalId,
    contentModalDataId,
    subMenu,
    parentMenu,
  } = useParams<{
    workspaceId: string;
    versionId: string;
    contentModalId: string;
    contentModalDataId: string;
    environmentId: string;
    parentMenu: string;
    subMenu: string;
  }>();
  const [applicableValue, setApplicableValue] = useState('');
  const [disableSave, setDisableSave] = useState(true);

  const getWidgetDetails = useGetWidgetDetails(
    subMenu,
    workspaceId,
    environment
  );
  const widgetRulesDetails = useWidgetRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    environment
  );

  const createWidgetRule = useCreateWidgetRule(workspaceId);

  const updateWidgetRule = useWidgetPatchRule(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  useError({
    mutation: createWidgetRule,
    entity: t('common.labels.widget_rule'),
  });

  useError({
    mutation: updateWidgetRule,
    entity: t('common.labels.widget_rule'),
  });

  const options = [
    { label: 'Global', value: 'global' },
    { label: 'Page Specific', value: 'page' },
    { label: 'Keyword Specific', value: 'keyword' },
  ];

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      if (values.title.trim().length === 0) {
        form.setFields([
          {
            name: 'title',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else {
        // eslint-disable-next-line
        const widgetRuleValues: any = {
          title: values.title.trim(),
          description: values.description,
          environmentsId: [environment],
          dynamicFieldsData: {
            environmentId: [environment],
            ruleTitleEti: values.title,
            descriptionEti: values.description,
            widgetTitleEti: getWidgetDetails?.data?.name
              .toLowerCase()
              .replaceAll(' ', '_'),
            widgetDescriptionEti: getWidgetDetails?.data?.description,
            widgetIdEsi: getWidgetDetails?.data?.id,
            widgetRuleApplicableOnEsi: values.widgetType
              ? values.widgetType
              : 'global',
            statusEsi: 'active',
            isSystemGeneratedEbi: getWidgetDetails?.data?.isSystemGenerated,
            algorithmInternalNameEsi:
              getWidgetDetails?.data?.algorithmInternalName,
            name: getWidgetDetails?.data?.name.toString(),
          },
        };

        if (isEditRule) {
          updateWidgetRule.mutate(values);
        } else {
          createWidgetRule.mutate(widgetRuleValues);
        }
      }
    } catch (err) {
      openNotificationWithIcon(
        'error',
        t('common.messages.provide_all_details')
      );
    }
  };

  const onCancelModal = () => {
    onCancelRuleModalVisible(false);
    form.resetFields();
    onSetEditRule && onSetEditRule(false);
  };

  const onCancel = () => {
    form.resetFields();
    onCancelRuleModalVisible(false);
    onSetEditRule && onSetEditRule(false);
    queryClient.removeQueries([API_QUERY_KEY.WIDGET_RULE_LIST, workspaceId]);
    queryClient.removeQueries([API_QUERY_KEY.WIDGET_RULE_DETAILS, workspaceId]);
  };

  useEffect(() => {
    if (isEditRule && widgetRulesDetails.data) {
      form.setFieldsValue({
        title: widgetRulesDetails.data?.contentModelData.title,
        description: widgetRulesDetails.data?.contentModelData.description
          ? typeof widgetRulesDetails.data?.contentModelData.description ===
            'string'
            ? widgetRulesDetails.data?.contentModelData.description
            : widgetRulesDetails.data?.contentModelData.description[0]
          : '',
      });
    }
    // eslint-disable-next-line
  }, [widgetRulesDetails.isSuccess, widgetRulesDetails.data, isEditRule]);

  useEffect(() => {
    if (createWidgetRule.isSuccess) {
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.created_successfully')
      );
      push(`/personalization/${parentMenu}/${subMenu}/list-records`);
    }
    // eslint-disable-next-line
  }, [createWidgetRule.isSuccess]);

  useEffect(() => {
    if (updateWidgetRule.isSuccess) {
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
    // eslint-disable-next-line
  }, [updateWidgetRule.isSuccess]);

  const onChangeApplicable = ({ target: { value } }: RadioChangeEvent) => {
    setApplicableValue(value);
  };

  const onHandleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.title) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  };

  return {
    t,
    form,
    workspaceId,
    onFinish,
    options,
    applicableValue,
    disableSave,
    onChangeApplicable,
    onHandleFieldChange,
    onCancelModal,
    isLoading: createWidgetRule.isLoading,
  };
};

export default useCreateUpdateRuleController;
