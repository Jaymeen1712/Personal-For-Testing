// @ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';

import { ContentLibraryContext } from '../../context';
import {
  useCreatUpdateNewRecord,
  usePublishVersion,
  useScheduleVersionPublish,
  useScheduleVersionUnPublish,
} from '../../services';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import { convertCurrentTimeZoneToUtc } from '../../../../../utills';
import useUser from '../../../../../hooks/user';

const useScheduleVersionPublishUnPublishController = (
  changeScheduleVersionPublishModalVisibility: (val: boolean) => void,
  saveFormData: () => void
) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const user = useUser();
  const history = useHistory();
  const location = useLocation();
  const { workspaceId, contentModalId, contentModalDataId, versionId } =
    useParams<{
      workspaceId: string;
      contentModalId: string;
      contentModalDataId: string;
      versionId: string;
    }>();

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const contentLibraryContext = useContext(ContentLibraryContext);

  const scheduleVersionPublish = useScheduleVersionPublish(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId
  );

  const scheduleVersionUnPublish = useScheduleVersionUnPublish(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId
  );

  const creatUpdateNewRecord = useCreatUpdateNewRecord(workspaceId);

  const publishVersion = usePublishVersion(workspaceId);

  const [publishButtonState, setPublishButtonState] = useState('now');

  const [timeZone, setTimeZone] = useState('');

  const [isEnvironmentSelected, setIsEnvironmentSelected] = useState(false);

  const publishNow = async () => {
    try {
      const result = await form.validateFields();
      if (result.publish === 'now') {
        publishVersion.mutate({
          contentModalId:
            contentLibraryContext?.newRecordFieldDetails?.contentModalId,
          contentModelDataId:
            contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
          versionId: contentLibraryContext?.newRecordFieldDetails?.versionId,
          environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
        });
      } else {
        if (result.startDate) {
          const submitData = {
            publishAt: convertCurrentTimeZoneToUtc(result.startDate),
            environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
          };
          scheduleVersionPublish.mutate(submitData);
        }

        // if (result.endDate) {
        //   const submitData = {
        //     unpublishAt: convertCurrentTimeZoneToUtc(result.endDate),
        //     environmentsId: result.environment,
        //   };
        //   scheduleVersionUnPublish.mutate(submitData);
        // }
      }
    } catch (err) {}
  };

  const onSave = async () => {
    try {
      const requestObject = await saveFormData();
      if (requestObject) {
        if (
          !Object.values(contentLibraryContext?.isFieldDirty).includes(false)
        ) {
          publishNow();
        } else {
          try {
            await form.validateFields();
            creatUpdateNewRecord.mutate(requestObject);
          } catch (err) {
            if (err.errorFields.length > 0) {
              openNotificationWithIcon(
                'error',
                t('common.messages.error_can_not_publish_field_required')
              );
            }
          }
        }
      }
    } catch (err) {}
  };

  const onChange = (val) => {
    if (!form.getFieldValue('startDate')) {
      setIsSaveButtonDisabled(true);
    } else {
      setIsSaveButtonDisabled(false);
    }
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
    if (creatUpdateNewRecord.isSuccess) {
      contentLibraryContext.ChangeIsFieldDirty({});
      if (creatUpdateNewRecord.data.versionId) {
        async function publishNewVersion() {
          try {
            const result = await form.validateFields();
            if (result.publish === 'now') {
              publishVersion.mutate({
                contentModalId:
                  contentLibraryContext?.newRecordFieldDetails?.contentModalId,
                contentModelDataId:
                  contentLibraryContext?.newRecordFieldDetails
                    ?.contentModalDataId,
                versionId: creatUpdateNewRecord.data.versionId,
                environmentId: localStorage.getItem(
                  `${workspaceId}/environmentId`
                ),
              });
            } else {
              if (result.startDate) {
                const submitData = {
                  publishAt: convertCurrentTimeZoneToUtc(result.startDate),
                  environmentId: localStorage.getItem(
                    `${workspaceId}/environmentId`
                  ),
                };
                scheduleVersionPublish.mutate(submitData);
              }
            }
          } catch (err) {}
        }

        publishNewVersion();

        history.push(
          `/workspaces/${workspaceId}/content-library/${
            location.pathname.split('/')[4]
          }/${contentModalId}/field/${contentModalDataId}/version/${
            creatUpdateNewRecord.data.versionId
          }/language/en-us`
        );
        // queryClient.removeQueries([
        //   API_QUERY_KEY.GET_VERSION_LIST,
        //   contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
        //   'en-us',
        //   creatUpdateNewRecord.data.versionId,
        // ]);
        queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      } else {
        publishNow();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatUpdateNewRecord.isSuccess]);

  useEffect(() => {
    if (creatUpdateNewRecord.isError) {
      openNotificationWithIcon('error', creatUpdateNewRecord.error?.message);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatUpdateNewRecord.isError]);

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
    if (scheduleVersionPublish.isSuccess) {
      if (form.getFieldValue('endDate')) {
        const submitData = {
          unpublishAt: convertCurrentTimeZoneToUtc(
            form.getFieldValue('endDate')
          ),
          environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
        };
        scheduleVersionUnPublish.mutate(submitData);
      } else {
        openNotificationWithIcon(
          'success',
          t('common.messages.scheduled_publish_successfully')
        );
        changeScheduleVersionPublishModalVisibility(false);
        queryClient.refetchQueries([
          API_QUERY_KEY.GET_RECORD_LIST,
          contentModalId,
          contentModalDataId,
          'en-us',
          versionId,
        ]);
        queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
        setPublishButtonState('now');
        form.resetFields();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleVersionPublish.isSuccess]);

  useEffect(() => {
    if (scheduleVersionPublish.isError) {
      openNotificationWithIcon('error', scheduleVersionPublish.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleVersionPublish.isError]);

  useEffect(() => {
    if (scheduleVersionUnPublish.isSuccess) {
      setPublishButtonState('now');
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
        t('common.messages.scheduled_publish_successfully')
      );
      changeScheduleVersionPublishModalVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleVersionUnPublish.isSuccess]);

  useEffect(() => {
    if (scheduleVersionUnPublish.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_unpublish_schedule')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleVersionUnPublish.isError]);

  useEffect(() => {
    setPublishButtonState('now');
  }, []);

  useEffect(() => {
    if (publishVersion.isSuccess) {
      setPublishButtonState('now');
      changeScheduleVersionPublishModalVisibility(false);

      queryClient.removeQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentLibraryContext?.newRecordFieldDetails?.contentModalId,
        contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
        contentLibraryContext?.newRecordFieldDetails?.language,
        contentLibraryContext?.newRecordFieldDetails?.versionId,
      ]);
      queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      openNotificationWithIcon(
        'success',
        t('common.messages.version_published')
      );
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishVersion.isSuccess]);

  useEffect(() => {
    if (publishVersion.isError) {
      openNotificationWithIcon('error', publishVersion.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishVersion.isError]);

  return {
    onSave,
    onCancel,
    form,
    t,
    // environmentList,
    publishButtonState,
    onChange,
    isPublishLoading:
      publishVersion.isLoading ||
      scheduleVersionPublish.isLoading ||
      scheduleVersionUnPublish.isLoading,
    timeZone,
    isEnvironmentSelected,
    isRecordCreatedLoading: creatUpdateNewRecord.isLoading,
    isSaveButtonDisabled,
  };
};
export default useScheduleVersionPublishUnPublishController;
