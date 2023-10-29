import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import {
  API_QUERY_KEY,
  generateInternalFieldName,
  openNotificationWithIcon,
} from '../../../../utills';
import {
  useCreateModel,
  useDeleteModel,
  useGetModelDetailsById,
  useUpdateModel,
} from '../services/models';

import {
  useCreateComponentModel,
  useUpdateComponentModel,
  useGetComponentModelDetailsById,
  useDeleteComponentModel,
} from '../services/components';

import queryClient from '../../../../query-client';
import useError from '../../../../hooks/error';
import usePermissions from '../permission';

interface FormValue {
  name: string;
  internalName: string;
  description: string;
  groupId: string;
  isLocalizationEnable: boolean;
  actAsWebPage: boolean;
  type: string;
  template: string;
}

const useCreateUpdateModelController = (
  onModalVisibilityChange: (val: boolean) => void,
  editModelStatus: { contentModelId: string; status: boolean },
  editNewModelStatusChange: (id: string, status: boolean) => void,
  addNewType: string,
  modelInternalName: string,
  changeModalAndGroupList: (modelData: [], groupData: []) => void
) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { workspaceId } = useParams<{
    workspaceId: string;
    category: string;
  }>();
  const {
    canDeleteContentModel,
    canDeleteComponent,
    canManageGlobalWorkspace,
  } = usePermissions(modelInternalName);

  const [enableActAsWebPage, setEnableActAsWebPage] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState('single');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const createModel = useCreateModel(workspaceId);
  const deleteModel = useDeleteModel(workspaceId);
  const updateModel = useUpdateModel(workspaceId);
  const getModelDetailsById = useGetModelDetailsById(
    workspaceId,
    editModelStatus.contentModelId,
    addNewType
  );

  const createComponentModel = useCreateComponentModel(workspaceId);
  const deleteComponentModel = useDeleteComponentModel(workspaceId);
  const updateComponentModel = useUpdateComponentModel(workspaceId);
  const getComponentModelDetailsById = useGetComponentModelDetailsById(
    workspaceId,
    editModelStatus.contentModelId,
    addNewType
  );

  const onFormValueChange = (values: FormValue) => {
    if (values.type) {
      setSelectedContentType(values.type);
      if (values.type === 'single') {
        form.resetFields(['enableWebPage']);
      }
    }
    if (values.name && !editModelStatus.status) {
      form.setFieldsValue({
        internalName: generateInternalFieldName(values.name),
      });
    }

    if (values.internalName) {
      form.setFieldsValue({
        internalName: generateInternalFieldName(values.internalName),
      });
    }

    if (!form.getFieldValue('name') || !form.getFieldValue('groupId')) {
      setIsSaveButtonDisabled(true);
    } else {
      if (addNewType === 'component') {
        if (
          getComponentModelDetailsById?.data?.name ===
            form.getFieldValue('name') &&
          getComponentModelDetailsById?.data?.description ===
            form.getFieldValue('description') &&
          getComponentModelDetailsById?.data?.groupId ===
            form.getFieldValue('groupId')
        ) {
          setIsSaveButtonDisabled(true);
        } else {
          setIsSaveButtonDisabled(false);
        }
      } else {
        if (
          !form.getFieldValue('internalName') ||
          (getModelDetailsById?.data?.name === form.getFieldValue('name') &&
            getModelDetailsById?.data?.description ===
              form.getFieldValue('description') &&
            getModelDetailsById?.data?.groupId ===
              form.getFieldValue('groupId'))
        ) {
          setIsSaveButtonDisabled(true);
        } else {
          setIsSaveButtonDisabled(false);
        }
      }
    }
  };

  const onActAsWebPageChange = (val: boolean) => {
    setEnableActAsWebPage(val);
  };

  const onSave = async () => {
    try {
      const result = await form.validateFields();
      if (addNewType === 'component') {
        if (editModelStatus.status) {
          result['isVisible'] = getModelDetailsById.data?.isVisible;
          result['contentModelId'] = editModelStatus.contentModelId;
          result['position'] = getComponentModelDetailsById.data?.position;
          if (result.isLocalizationEnabled) {
            result.isLocalizationEnabled = true;
          } else {
            result.isLocalizationEnabled = false;
          }
          updateComponentModel.mutate(result);
        } else {
          result['isVisible'] = true;
          if (result.isLocalizationEnabled) {
            result.isLocalizationEnabled = true;
          } else {
            result.isLocalizationEnabled = false;
          }
          createComponentModel.mutate(result);
        }
      } else {
        if (editModelStatus.status) {
          result['isVisible'] = getModelDetailsById.data?.isVisible;
          result['position'] = getModelDetailsById.data?.position;
          result['contentModelId'] = editModelStatus.contentModelId;
          if (result.isLocalizationEnabled) {
            result.isLocalizationEnabled = true;
          } else {
            result.isLocalizationEnabled = false;
          }
          updateModel.mutate(result);
        } else {
          result['isVisible'] = true;
          if (result.isLocalizationEnabled) {
            result.isLocalizationEnabled = true;
          } else {
            result.isLocalizationEnabled = false;
          }
          createModel.mutate(result);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = () => {
    setIsDeleteModalVisible(true);
    onModalVisibilityChange(false);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
    onModalVisibilityChange(true);
  };

  const onDeleteModel = () => {
    if (
      type === 'component' ||
      addNewType === 'component' ||
      location.pathname.split('/')[4] === 'component'
    ) {
      deleteComponentModel.mutate(editModelStatus.contentModelId);
    } else {
      deleteModel.mutate(editModelStatus.contentModelId);
    }
  };

  const onCancelModelClick = () => {
    form.resetFields();
    editNewModelStatusChange('', false);
    onModalVisibilityChange(false);
    setSelectedContentType('single');
    setEnableActAsWebPage(false);
    setIsSaveButtonDisabled(true);
  };

  useEffect(() => {
    setType(location.pathname.split('/')[7]);
  }, [location, editModelStatus]);

  useEffect(() => {
    if (addNewType === 'component') {
      getComponentModelDetailsById.refetch();
    } else {
      getModelDetailsById.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModelStatus, addNewType]);

  useEffect(() => {
    if (getModelDetailsById.isSuccess) {
      if (Object.keys(getModelDetailsById.data).length > 0) {
        form.setFieldsValue({
          name: getModelDetailsById.data.name,
          internalName: getModelDetailsById.data.internalName,
          description: getModelDetailsById.data.description,
          groupId: getModelDetailsById.data.groupId,
          isLocalizationEnabled: getModelDetailsById.data.isLocalizationEnabled,
          type: getModelDetailsById.data.type,
          actAsWebPage: getModelDetailsById.data.actAsWebPage,
          template: getModelDetailsById.data.template,
          position: getModelDetailsById.data.position,
        });
        setSelectedContentType(getModelDetailsById.data.type);
        setEnableActAsWebPage(getModelDetailsById.data.actAsWebPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getModelDetailsById.isSuccess]);

  useEffect(() => {
    if (getComponentModelDetailsById.isSuccess) {
      if (Object.keys(getComponentModelDetailsById.data).length > 0) {
        form.setFieldsValue({
          name: getComponentModelDetailsById.data.name,
          description: getComponentModelDetailsById.data.description,
          groupId: getComponentModelDetailsById.data.groupId,
          isLocalizationEnabled:
            getComponentModelDetailsById.data.isLocalizationEnabled,
          type: getComponentModelDetailsById.data.type,
          actAsWebPage: getComponentModelDetailsById.data.actAsWebPage,
          template: getComponentModelDetailsById.data.template,
          position: getComponentModelDetailsById.data.position,
        });
        setEnableActAsWebPage(getComponentModelDetailsById.data.actAsWebPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getComponentModelDetailsById.isSuccess]);

  useEffect(() => {
    if (createModel.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.NAVIGATION_CONTENTS]);
      if (canManageGlobalWorkspace()) {
        queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
        queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      } else {
        queryClient.removeQueries([
          API_QUERY_KEY.PERMISSIONS,
          workspaceId,
          false,
        ]);
      }

      openNotificationWithIcon(
        'success',
        t('common.messages.success_model_added')
      );
      onModalVisibilityChange(false);
      setIsSaveButtonDisabled(true);
      history.push(
        `/workspaces/${workspaceId}/content-model/model/${
          createModel.data
        }/list-field/${form.getFieldValue('type')}`
      );
      form.resetFields();
      setSelectedContentType('single');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModel.isSuccess]);

  useError({
    mutation: createModel,
    entity: t('common.labels.content_model'),
    dependentEntities: t('common.labels.content_model'),
  });

  useEffect(() => {
    if (deleteModel.isSuccess) {
      setIsDeleteModalVisible(false);
      history.push(`/workspaces/${workspaceId}/content-model/`);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.NAVIGATION_CONTENTS]);
      changeModalAndGroupList([], []);
      openNotificationWithIcon(
        'success',
        t('common.messages.delete_model_success')
      );
      form.resetFields();
      setSelectedContentType('single');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteModel.isSuccess]);

  useError({
    mutation: deleteModel,
    entity: t('common.labels.content_model'),
    dependentEntities: t('common.labels.content_model'),
  });

  useEffect(() => {
    if (updateModel.isSuccess) {
      editNewModelStatusChange('', false);
      form.resetFields();
      // queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.content_modal_updated_successfully')
      );
      onModalVisibilityChange(false);
      setIsSaveButtonDisabled(true);
      setSelectedContentType('single');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateModel.isSuccess]);

  useError({
    mutation: updateModel,
    entity: t('common.labels.content_model'),
    dependentEntities: t('common.labels.page_template'),
  });

  useEffect(() => {
    if (createComponentModel.isSuccess) {
      form.resetFields();
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.component_created_successfully')
      );
      onModalVisibilityChange(false);
      setIsSaveButtonDisabled(true);
      history.push(
        `/workspaces/${workspaceId}/content-model/component/${createComponentModel.data.id}/list-field/component`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createComponentModel.isSuccess]);

  useError({
    mutation: createComponentModel,
    entity: t('common.labels.content_model'),
    dependentEntities: t('common.labels.content_model'),
  });

  useEffect(() => {
    if (deleteComponentModel.isSuccess) {
      setIsDeleteModalVisible(false);
      history.push(`/workspaces/${workspaceId}/content-model/`);
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.delete_Component_success')
      );
      form.resetFields();
      setSelectedContentType('single');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteComponentModel.isSuccess]);

  useError({
    mutation: deleteComponentModel,
    entity: t('common.labels.field_component_title'),
    dependentEntities: t('common.labels.field_component_title'),
  });

  useEffect(() => {
    if (updateComponentModel.isSuccess) {
      editNewModelStatusChange('', false);
      form.resetFields();
      // queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.component_updated_successfully')
      );
      onModalVisibilityChange(false);
      setIsSaveButtonDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateComponentModel.isSuccess]);

  useError({
    mutation: updateComponentModel,
    entity: t('common.labels.content_model'),
    dependentEntities: t('common.labels.page_template'),
  });

  return {
    t,
    form,
    enableActAsWebPage,
    onFormValueChange,
    selectedContentType,
    onSave,
    loading:
      addNewType === 'component'
        ? createComponentModel.isLoading
        : createModel.isLoading,
    onDelete,
    isDeleteModalVisible,
    hideDeleteModal,
    onDeleteModel,
    type,
    getModelDetailsById,
    getComponentModelDetailsById,
    deleteLoading:
      addNewType === 'component'
        ? deleteComponentModel.isLoading
        : deleteModel.isLoading,
    onCancelModelClick,
    canDeleteContentModel,
    onActAsWebPageChange,
    canDeleteComponent,
    updateLoading:
      addNewType === 'component'
        ? updateComponentModel.isLoading
        : updateModel.isLoading,
    isSystemCreated: getModelDetailsById?.data?.isSystemCreated,
    isGetModelDetailsByIdIsLoading: getModelDetailsById.isLoading,
    isSaveButtonDisabled,
  };
};
export default useCreateUpdateModelController;
