import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import usePermissionCheckForRecords from '../../../utils/prermission-check-for-records';
import { ContentLibraryContext } from '../../../context';
import useQuery from '../../../../../../hooks/queryParameter';
import {
  onMainSidebarCollapsed,
  openNotificationWithIcon,
  removeCookies,
  onSubSidebarCollapse,
} from '../../../../../../utills';
import { IListEnvironments } from '../../../../../../types';

const useFieldListHeaderController = (
  selectedContentModalInternlaName: string,
  headerTitleAndSubtitle: {
    title: '';
    subtitle: '';
  },
  currentVersionStatus: {
    id: string;
    name: string;
    status: string;
  }[],
  currentVersionId: string,
  selectedContentModalType: string
) => {
  const {
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    languageName,
  } = useParams<{
    workspaceId: string;
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
    languageName: string;
  }>();
  const { t } = useTranslation();
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();
  const contentLibraryContext = useContext(ContentLibraryContext);
  const { recordPermissionCheck } = usePermissionCheckForRecords(
    selectedContentModalInternlaName
  );

  const [environmentStatus, setEnvironmentStatus] = useState('');

  const [environmentList, setEnvironmentList] = useState<IListEnvironments[]>(
    []
  );
  const onEnvChange = (val: string) => {
    contentLibraryContext?.changeTempPageEditor(false);
    removeCookies();
    const result = environmentList?.find((item) => item.id === val);
    if (result) {
      contentLibraryContext?.changeIFrameVisible({
        isVisible: true,
        url: `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${headerTitleAndSubtitle.subtitle}?wh=${result.workspaceDomain}&vid=${versionId}&lang=${languageName}`,
      });

      Cookies.set(
        'pageEditorPopUp',
        `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${headerTitleAndSubtitle.subtitle}?wh=${result.workspaceDomain}&vid=${versionId}&lang=${languageName}`
      );

      history.push(`${location.pathname}?isPageEditor=true&env=${val}`);
      // @ts-ignore
      window.openMediaManager = function () {
        contentLibraryContext?.ChangeIFrameORMediaManagerVisible(true);
        return true;
      };
      setTimeout(() => {
        contentLibraryContext?.changeTempPageEditor(true);
      }, 1000);
    }
  };

  const onPreviewButtonClick = () => {
    if (headerTitleAndSubtitle.subtitle) {
      if (contentLibraryContext?.isIFrameVisible?.isVisible) {
        let envId = '';
        if (query.get('env')) {
          //@ts-ignore
          envId = query.get('env');
        } else {
          //@ts-ignore
          envId = localStorage.getItem(`${workspaceId}/environmentId`);
        }
        const value = environmentList.find((item) => item.id === envId);
        if (value?.customDomain) {
          window.open(
            `https://${value.customDomain}${headerTitleAndSubtitle.subtitle}?vid=${versionId}&lang=${languageName}`,
            '_blank'
          );
        } else if (value?.cacheDomain) {
          window.open(
            `https://${value.cacheDomain}${headerTitleAndSubtitle.subtitle}?vid=${versionId}&lang=${languageName}`,
            '_blank'
          );
        } else {
          window.open(
            `http://${value?.workspaceDomain}${headerTitleAndSubtitle.subtitle}?vid=${versionId}&lang=${languageName}`,
            '_blank'
          );
        }
      } else {
        const value = environmentList.find(
          (item) =>
            item.id === localStorage.getItem(`${workspaceId}/environmentId`)
        );
        if (value?.customDomain) {
          window.open(
            `https://${value.customDomain}${headerTitleAndSubtitle.subtitle}?vid=${versionId}&lang=${languageName}`,
            '_blank'
          );
        } else if (value?.cacheDomain) {
          window.open(
            `https://${value.cacheDomain}${headerTitleAndSubtitle.subtitle}?vid=${versionId}&lang=${languageName}`,
            '_blank'
          );
        } else {
          window.open(
            `http://${value?.workspaceDomain}${headerTitleAndSubtitle.subtitle}?vid=${versionId}&lang=${languageName}`,
            '_blank'
          );
        }
      }
    } else {
      openNotificationWithIcon(
        'error',
        t('common.messages.page_slug_no_available')
      );
    }
  };

  const onIFramePopCloseButtonClick = () => {
    onMainSidebarCollapsed(false);
    onSubSidebarCollapse(false);
    if (contentLibraryContext?.isIFrameVisible?.isVisible) {
      history.push(`${location.pathname}`);
      removeCookies();

      contentLibraryContext?.changeIFrameVisible({
        isVisible: false,
        url: '',
      });

      contentLibraryContext?.ChangeIFrameORMediaManagerVisible(false);
      onSubSidebarCollapse(false);
    } else {
      //@ts-ignore
      if (!Object.values(contentLibraryContext?.isFieldDirty).includes(false)) {
        localStorage.removeItem(`${versionId}/contentFieldData`);
        localStorage.removeItem(`${versionId}/contentEpe`);
        history.push(
          `/workspaces/${workspaceId}/content-library/collection-type/${contentModalId}/list-records`
        );
      } else {
        contentLibraryContext?.changeWarningPopupVisible({
          version: false,
          sidebar: false,
          relation: false,
          refresh: false,
          goBack: true,
        });
      }
    }
  };

  const onCollapseChange = () => {
    document.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  const onVersionHistoryButtonClick = () => {
    contentLibraryContext?.ChangeIsFieldDirty({});
    onSubSidebarCollapse(true);
    history.push(
      `/workspaces/${workspaceId}/content-library/${selectedContentModalType}-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${languageName}/version-history/${currentVersionId}`
    );
  };

  const onCopyUrlClick = () => {
    const value = environmentList.find(
      (item) => item.id === localStorage.getItem(`${workspaceId}/environmentId`)
    );
    if (value?.customDomain) {
      navigator.clipboard.writeText(
        `https://${value.customDomain}${headerTitleAndSubtitle.subtitle}`
      );
    } else if (value?.cacheDomain) {
      navigator.clipboard.writeText(
        `https://${value.cacheDomain}${headerTitleAndSubtitle.subtitle}`
      );
    } else {
      navigator.clipboard.writeText(
        `http://${value?.workspaceDomain}${headerTitleAndSubtitle.subtitle}`
      );
    }
    openNotificationWithIcon(
      'success',
      t('common.messages.copied_successfully')
    );
  };

  useEffect(() => {
    if (contentLibraryContext?.environmentList) {
      if (contentLibraryContext?.environmentList.length > 0) {
        setEnvironmentList(contentLibraryContext?.environmentList);
      }
    }
  }, [contentLibraryContext?.environmentList]);

  useEffect(() => {
    let envId: string | null = '';
    if (query.get('env')) {
      envId = query.get('env');
    } else {
      envId = localStorage.getItem(`${workspaceId}/environmentId`);
    }
    const findData = currentVersionStatus.find((item) => item.id === envId);

    if (findData) {
      setEnvironmentStatus(findData.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVersionStatus, query.get('env')]);

  return {
    t,
    canUpdateRecord: recordPermissionCheck('update'),
    canDeleteRecord: recordPermissionCheck('delete'),
    isIFrameVisible: contentLibraryContext?.isIFrameVisible?.isVisible,
    defaultEnvironmentId:
      query.get('env') || localStorage.getItem(`${workspaceId}/environmentId`),
    environmentList,
    onEnvChange,
    onPreviewButtonClick,
    onIFramePopCloseButtonClick,
    environmentStatus,
    canPublishRecord: recordPermissionCheck(
      'publish',
      localStorage.getItem(`${workspaceId}/environmentId`)
    ),
    onCollapseChange,
    onVersionHistoryButtonClick,
    isModalIsEcommerceBrand:
      selectedContentModalInternlaName?.includes('ecommerce_'),
    onCopyUrlClick,
  };
};

export default useFieldListHeaderController;
