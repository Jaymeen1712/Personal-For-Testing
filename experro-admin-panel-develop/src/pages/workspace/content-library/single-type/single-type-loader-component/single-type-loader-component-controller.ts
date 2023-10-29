//@ts-nocheck
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {useContext, useEffect} from 'react';

import {
  useCreateTitle,
  useGetRecordList,
} from '../../services';
import {ContentLibraryContext} from '../../context';
import {openNotificationWithIcon} from '../../../../../utills';
import {ContentModelList} from '../../../../../types';
import usePermissionCheckForRecords from '../../utils/prermission-check-for-records';

const useSingleTypeLoaderComponentController = (
  selectedContentModalDetails: ContentModelList
) => {
  const {recordPermissionCheck} = usePermissionCheckForRecords(
    selectedContentModalDetails.internalName
  );
  const history = useHistory();
  const {t} = useTranslation();
  const location = useLocation();
  const contentLibraryContext = useContext(ContentLibraryContext);
  const {workspaceId, contentModalId} = useParams<{
    contentModalId: string;
    workspaceId: string;
  }>();

  const getRecordList = useGetRecordList(
    workspaceId,
    1,
    20,
    [''],
    contentModalId,
    ''
  );
  const createTitle = useCreateTitle(workspaceId);

  useEffect(() => {
    contentLibraryContext?.changeFieldComponentLoader(true);
    if (getRecordList.isSuccess) {
      if (getRecordList.data.items && getRecordList.data.items.length > 0) {
        if (recordPermissionCheck('read') || recordPermissionCheck('update')) {
          getRecordList.data.items.map((item) => {
            history.replace(
              `/workspaces/${workspaceId}/content-library/single-type/${contentModalId}/field/${item.id}/version/${item.currentVersionId}/language/en-us`
            );
            return true;
          });
        } else {
          history.goBack();
          openNotificationWithIcon(
            'error',
            t('common.messages.error_view_permission')
          );
        }
      } else {
        if (recordPermissionCheck('create')) {
          createTitle.mutate({
            title: contentLibraryContext?.menuItemChange.recordTitle,
            contentModalId:
            contentLibraryContext?.menuItemChange.contentModalId,
          });
          contentLibraryContext?.changeFieldComponentLoader(false);
        } else {
          history.goBack();
          openNotificationWithIcon(
            'error',
            t('common.messages.error_create_record')
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecordList.isSuccess, getRecordList.data, location]);

  useEffect(() => {
    if (getRecordList.isError) {
      console.log(getRecordList.error);
      history.goBack();
      openNotificationWithIcon(
        'error',
        t('common.messages.error_view_permission')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecordList.isError, t]);

  useEffect(() => {
    if (createTitle.isSuccess) {
      contentLibraryContext?.changeFieldComponentLoader(true);
      if (createTitle.data) {
        history.push(
          `/workspaces/${workspaceId}/content-library/single-type/${contentModalId}/field/${createTitle.data.contentModelDataId}/version/${createTitle.data.versionId}/language/en-us`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTitle.isSuccess]);

  useEffect(() => {
    if (createTitle.isError) {
      console.log(createTitle.error);
      history.goBack();
      openNotificationWithIcon(
        'error',
        t('common.messages.error_create_record')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTitle.isError, t]);

  return {};
};
export default useSingleTypeLoaderComponentController;
