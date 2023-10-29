import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useParams,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { Form } from 'antd';

import { ContentLibraryContext } from '../../context';
import {
  useCreateTitle,
  useGetRecordListById,
  useUpdateRecord,
  useGetModelList,
} from '../../services';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import useError from '../../../../../hooks/error';
import { ContentModelList } from '../../../../../types';

const useAddNewModalController = (
  onAddNewRecordButtonClick: (values: boolean) => void,
  recordEditDetails?: {
    isEdit: boolean;
    contentModalDataId: string;
    versionId: string;
  }
) => {
  const contentLibraryContext = useContext(ContentLibraryContext);

  const [contentModalList, setContentModalList] = useState<ContentModelList[]>(
    []
  );

  const [pageTemple, setPageTemple] = useState(false);

  const [form] = Form.useForm();
  const { path } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const { workspaceId, contentModalId } = useParams<{
    workspaceId: string;
    contentModalId: string;
  }>();
  const { t } = useTranslation();

  const [isAddNewRecordButtonDisabled, setIsAddNewRecordButtonDisabled] =
    useState(true);

  const createTitle = useCreateTitle(workspaceId);

  const getContentModalList = useGetModelList(
    workspaceId,
    localStorage.getItem(`${workspaceId}/environmentId`)
  );
  const getRecordById = useGetRecordListById(
    workspaceId,
    contentModalId,
    recordEditDetails?.contentModalDataId,
    recordEditDetails?.versionId,
    'en-us',
    //@ts-ignore
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const updateRecord = useUpdateRecord(
    workspaceId,
    contentModalId,
    recordEditDetails?.contentModalDataId,
    recordEditDetails?.versionId
  );

  useError({
    mutation: createTitle,
    entity: t('common.labels.content_library'),
    dependentEntities: t('common.labels.title'),
  });

  useError({
    mutation: updateRecord,
    entity: t('common.labels.content_library'),
    dependentEntities: t('common.labels.title'),
  });

  const generatePageSlug = (value: string) => {
    return value
      .replace(/[^a-zA-Z0-9-_/ ]/g, '')
      .replaceAll(' ', '-')
      .toLowerCase();
  };

  const showModal = () => {
    onAddNewRecordButtonClick(true);
  };

  const handleCancel = () => {
    onAddNewRecordButtonClick(false);
    form.resetFields();
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
    if (pageTemple) {
      if (
        (form.getFieldValue('title') ===
          getRecordById.data?.contentModelData?.title &&
          form.getFieldValue('pageSlug') ===
            getRecordById.data?.contentModelData?.pageSlug) ||
        !form.getFieldValue('title') ||
        !form.getFieldValue('pageSlug')
      ) {
        setIsAddNewRecordButtonDisabled(true);
      } else {
        setIsAddNewRecordButtonDisabled(false);
      }
    } else {
      if (
        form.getFieldValue('title') ===
          getRecordById.data?.contentModelData?.title ||
        !form.getFieldValue('title')
      ) {
        setIsAddNewRecordButtonDisabled(true);
      } else {
        setIsAddNewRecordButtonDisabled(false);
      }
    }
  };

  const onSave = async () => {
    const result = await form.validateFields();
    if (result.pageSlug) {
      if (result.pageSlug.charAt(0) !== '/') {
        result.pageSlug = `/${result.pageSlug}`;
      }
    }
    result['contentModalId'] = contentModalId;
    if (recordEditDetails?.isEdit) {
      result['environmentId'] = localStorage.getItem(
        `${workspaceId}/environmentId`
      );
      updateRecord.mutate(result);
    } else {
      createTitle.mutate(result);
    }
  };

  useEffect(() => {
    document.addEventListener('environmentChange', () => {
      getContentModalList.remove();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      contentModalId: contentModalId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, recordEditDetails]);

  useEffect(() => {
    if (getContentModalList.isSuccess) {
      setContentModalList(getContentModalList.data);
      getContentModalList.data.map((item) => {
        if (contentModalId === item.id) {
          if (item.actAsWebPage) {
            return setPageTemple(true);
          }
          setPageTemple(false);
        }
        return '';
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContentModalList.isSuccess, getContentModalList.data, contentModalId]);

  useEffect(() => {
    if (createTitle.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.record_created_successfully')
      );
      if (createTitle.data) {
        history.replace({
          pathname: `field/${createTitle.data.contentModelDataId}/version/${createTitle.data.versionId}/language/en-us`,
        });
      }
      form.resetFields();
      queryClient.removeQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentModalId,
      ]);
      onAddNewRecordButtonClick(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTitle.isSuccess]);

  useEffect(() => {
    if (getRecordById.isSuccess) {
      if (getRecordById.data) {
        setIsAddNewRecordButtonDisabled(true);
        form.setFieldsValue({
          title: getRecordById.data?.contentModelData?.title,
        });
        if (getRecordById.data?.contentModelData?.pageSlug) {
          form.setFieldsValue({
            pageSlug: getRecordById.data?.contentModelData?.pageSlug,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecordById.isSuccess]);

  useEffect(() => {
    if (updateRecord.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.record_update_successfully')
      );
      if (location.pathname.search('list-records') !== -1) {
        queryClient.removeQueries([
          API_QUERY_KEY.RECORD_TABLE_LIST,
          form.getFieldValue('contentModalId'),
          '',
        ]);
      } else {
        contentLibraryContext?.ChangeIsFieldDirty({});
        queryClient.refetchQueries([
          API_QUERY_KEY.GET_RECORD_LIST,
          contentLibraryContext?.newRecordFieldDetails?.contentModalId,
          contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
          contentLibraryContext?.newRecordFieldDetails?.language,
          contentLibraryContext?.newRecordFieldDetails?.versionId,
        ]);
      }
      onAddNewRecordButtonClick(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRecord.isSuccess]);

  return {
    handleCancel,
    showModal,
    t,
    contentModalList,
    form,
    onValueChange,
    contentModalType: path.split('/')[4].split('-')[0],
    onSave,
    contentModalId,
    pageTemple,
    createTitle,
    updateRecord,
    isAddNewRecordButtonDisabled,
  };
};
export default useAddNewModalController;
