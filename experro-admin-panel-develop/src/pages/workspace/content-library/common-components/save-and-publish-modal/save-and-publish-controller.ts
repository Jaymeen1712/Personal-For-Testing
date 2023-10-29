import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';

import { useSaveAndPublish } from '../../services';

import { ContentLibraryContext } from '../../context';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useQuery from '../../../../../hooks/queryParameter';
import Cookies from 'js-cookie';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';

const useSaveAndPublishModal = () => {
  const { workspaceId, contentModalId, contentModalDataId } = useParams<{
    workspaceId: string;
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
  }>();

  const location = useLocation();
  const history = useHistory();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const query = useQuery();
  const contentLibraryContext = useContext(ContentLibraryContext);

  const saveAndPublish = useSaveAndPublish(workspaceId);

  const [isEnvironmentSelected, setIsEnvironmentSelected] = useState(false);

  const onSave = async () => {
    // try {
    //   const result = await form.validateFields();
    //   const requestObject = await saveData();
    //   //@ts-ignore
    //   requestObject['environments_id'] = result.environment;
    //   if (query.get('isPageEditor') === 'true') {
    //     //@ts-ignore
    //     requestObject['isCallFromiFrame'] = true;
    //   }
    //   saveAndPublish.mutate({ ...requestObject });
    // } catch (err) {}
  };

  const onCancel = () => {
    // contentLibraryContext?.changeSaveAndPublish(false);
  };

  const onChange = (val: { environment: string[] }) => {
    if (val.environment) {
      if (val.environment.length > 0) {
        setIsEnvironmentSelected(true);
      } else {
        setIsEnvironmentSelected(false);
      }
    }
  };

  useEffect(() => {
    if (saveAndPublish.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      if (query.get('isPageEditor') === 'true') {
        history.push(
          `/workspaces/${workspaceId}/content-library/${
            location.pathname.split('/')[4]
          }/${contentModalId}/field/${contentModalDataId}/version/${
            saveAndPublish.data.versionId
          }/language/en-us?isPageEditor=true`
        );

        contentLibraryContext?.changeIFrameVisible({
          isVisible: true,
          url: `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${contentLibraryContext?.titleAndSubtitle?.subTitle}?wh=${contentLibraryContext?.storeLink}${process.env.REACT_APP_PAGE_EDITOR_PREVIEW_HOST_PATH_NAME}&vid=${saveAndPublish.data.versionId}&lang=${contentLibraryContext?.newRecordFieldDetails?.language}`,
        });

        Cookies.set(
          'pageEditorPopUp',
          `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${contentLibraryContext?.titleAndSubtitle?.subTitle}?wh=${contentLibraryContext?.storeLink}${process.env.REACT_APP_PAGE_EDITOR_PREVIEW_HOST_PATH_NAME}&vid=${saveAndPublish.data.versionId}&lang=${contentLibraryContext?.newRecordFieldDetails?.language}`
        );
      } else {
        history.push(
          `/workspaces/${workspaceId}/content-library/${
            location.pathname.split('/')[4]
          }/${contentModalId}/field/${contentModalDataId}/version/${
            saveAndPublish.data.versionId
          }/language/en-us`
        );
      }

      openNotificationWithIcon(
        'success',
        t('common.messages.save_and_publish_success')
      );
      form.resetFields();
      // contentLibraryContext?.changeSaveAndPublish(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAndPublish.isSuccess]);

  useEffect(() => {
    if (saveAndPublish.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.save_and_publish_error')
      );
      console.log(saveAndPublish.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAndPublish.isError]);

  return {
    t,
    onSave,
    onCancel,
    form,
    environmentList: contentLibraryContext?.environmentList,
    // isModalVisibility: contentLibraryContext?.isSaveAndPublishVisible,
    isEnvironmentSelected,
    onChange,
    loading: saveAndPublish.isLoading,
  };
};

export default useSaveAndPublishModal;
