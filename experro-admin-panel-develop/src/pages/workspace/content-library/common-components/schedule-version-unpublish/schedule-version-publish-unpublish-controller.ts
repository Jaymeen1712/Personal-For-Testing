// @ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from 'antd';

import { ContentLibraryContext } from '../../context';
import {
  useScheduleVersionUnPublish,
  useUnPublishVersion,
} from '../../services';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import { useTranslation } from 'react-i18next';
import useUser from '../../../../../hooks/user';

const useScheduleVersionPublishUnPublishController = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const user = useUser();
  const { workspaceId, contentModalId, contentModalDataId, versionId } =
    useParams<{
      workspaceId: string;
      contentModalId: string;
      contentModalDataId: string;
      versionId: string;
    }>();

  const contentLibraryContext = useContext(ContentLibraryContext);

  const scheduleVersionUnPublish = useScheduleVersionUnPublish(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId
  );

  const unPublishVersion = useUnPublishVersion(workspaceId);

  const [publishButtonState, setPublishButtonState] = useState('now');

  const [timeZone, setTimeZone] = useState('');

  const [isEnvironmentSelected, setIsEnvironmentSelected] = useState(false);

  // const [environmentList, setEnvironmentList] = useState<IListEnvironments[]>();

  const onSave = async () => {
    try {
      // const result = await form.validateFields();
      unPublishVersion.mutate({
        contentModalId:
          contentLibraryContext?.newRecordFieldDetails?.contentModalId,
        contentModelDataId:
          contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
        versionId: contentLibraryContext?.newRecordFieldDetails?.versionId,
        environmentsId: [localStorage.getItem(`${workspaceId}/environmentId`)],
      });
      // if (result.publish === 'now') {
      //   unPublishVersion.mutate({
      //     contentModalId:
      //       contentLibraryContext?.newRecordFieldDetails?.contentModalId,
      //     contentModelDataId:
      //       contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
      //     versionId: contentLibraryContext?.newRecordFieldDetails?.versionId,
      //     environmentsId: result.environment,
      //   });
      // } else {
      //   if (result.endDate) {
      //     const submitData = {
      //       unpublishAt: convertCurrentTimeZoneToUtc(result.endDate),
      //       environmentsId: result.environment,
      //     };
      //     scheduleVersionUnPublish.mutate(submitData);
      //   }
      // }
    } catch (err) {}
  };

  const onChange = (val) => {
    if (val.publish) {
      form.resetFields(['startDate', 'endDate']);
      setPublishButtonState(val.publish);
    }
    if (val.environment) {
      if (val.environment.length > 0) {
        setIsEnvironmentSelected(true);
      } else {
        setIsEnvironmentSelected(false);
      }
    }
  };
  const onCancel = () => {
    contentLibraryContext?.changeScheduleVersionPublish({
      publish: false,
      unpublish: false,
    });
    setPublishButtonState('now');
    form.resetFields();
    setIsEnvironmentSelected(false);
  };

  // useEffect(() => {
  //   const tempArray = [];
  //   if (contentLibraryContext?.environmentList) {
  //     contentLibraryContext?.environmentList.map((item) => {
  //       const result = ModelPermissionCheck('publish', item.id);
  //       if (result) {
  //         item['isDisable'] = false;
  //         tempArray.push(item);
  //       } else {
  //         item['isDisable'] = true;
  //         tempArray.push(item);
  //       }
  //       return '';
  //     });
  //     setEnvironmentList([...tempArray]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    if (user.AllWorkspacesList) {
      user?.AllWorkspacesList.map((item) => {
        if (item.id === workspaceId) {
          setTimeZone(item.timezone);
        }
        return '';
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.AllWorkspacesList]);

  useEffect(() => {
    if (scheduleVersionUnPublish.isSuccess) {
      setPublishButtonState('now');
      contentLibraryContext?.changeScheduleVersionPublish(false);
      queryClient.refetchQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentModalId,
        contentModalDataId,
        'en-us',
        versionId,
      ]);
      queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.schedule_version_unpublish_successfully')
      );
      contentLibraryContext?.changeScheduleVersionPublish(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleVersionUnPublish.isSuccess]);

  useEffect(() => {
    if (scheduleVersionUnPublish.isError) {
      setPublishButtonState('now');
      openNotificationWithIcon(
        'error',
        t('common.messages.error_unpublish_schedule')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleVersionUnPublish.isError]);

  useEffect(() => {
    setPublishButtonState('now');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (unPublishVersion.isSuccess) {
      setPublishButtonState('now');
      contentLibraryContext?.changeScheduleVersionPublish(false);

      queryClient.removeQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentLibraryContext?.newRecordFieldDetails?.contentModalId,
        contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
        contentLibraryContext?.newRecordFieldDetails?.language,
        contentLibraryContext?.newRecordFieldDetails?.versionId,
      ]);

      queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      contentLibraryContext?.changeVersionStatus('DRAFT');
      openNotificationWithIcon(
        'success',
        t('common.messages.version_un_published')
      );
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unPublishVersion.isSuccess]);

  useEffect(() => {
    if (unPublishVersion.isError) {
      openNotificationWithIcon('error', unPublishVersion.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unPublishVersion.isError]);

  return {
    onSave,
    onCancel,
    form,
    t,
    // environmentList,
    publishButtonState,
    onChange,
    isUnPublishLoading: unPublishVersion.isLoading,
    timeZone,
    isEnvironmentSelected,
  };
};

export default useScheduleVersionPublishUnPublishController;
