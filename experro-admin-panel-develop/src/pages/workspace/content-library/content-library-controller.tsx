//@ts-nocheck

import {useHistory, useLocation, useParams} from 'react-router-dom';
import {Tooltip} from 'antd';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {MenuInfo} from 'rc-menu/lib/interface';
import {ContentLibraryContext} from './context';
import {
  useGetModelList,
  useWorkspaces,
  useListEnvironments,
  useGetModelGroupList,
} from './services';
import {ContentModelList, IListEnvironments} from '../../../types';
import DownArrowIcon from '../../../images/icons/downarrow-icon';
import BulletIcon from '../../../images/icons/bullet-icon';
import {SIDEBAR_KEYS} from '../../../utills';
import useUser from '../../../hooks/user';
import usePermissions from '../../../hooks/permissions';
import {useHandleForbiddenError} from './utils';

interface IContentLibraryController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ContentLibraryController = ({
                                    onMainSidebarActiveItem,
                                  }: IContentLibraryController) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const {workspaceId} = useParams<{
    contentModalId: string;
    workspaceId: string;
  }>();
  const history = useHistory();
  const location = useLocation();
  const user = useUser();
  const permissions = useMemo(() => user?.user?.permissions || {}, [user]);
  const {canManageGlobalWorkspace} = usePermissions();
  const {handleForbiddenError} = useHandleForbiddenError();

  const listWorkspaces = useWorkspaces();
  const getEnvironmentsList = useListEnvironments(workspaceId);
  const getGroupList = useGetModelGroupList(workspaceId);

  // const moveToDraft = useMoveVersionToDraft(workspaceId)
  const [environmentList, setEnvironmentList] = useState<IListEnvironments[]>(
    []
  );

  const [contentModelList, setContentModelList] = useState([]);

  const [contentModelGroupList, setContentModelGroupList] = useState([]);

  const [menuItemData, setMenuItemData] = useState([]);

  const [envId, setEnvId] = useState(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const [selectedContentModalDetails, setSelectedContentModalDetails] =
    useState<ContentModelList>({});

  const getModelList = useGetModelList(workspaceId, envId);

  const onSubSidebarMenuItemClick = useCallback(
    (menu: MenuInfo) => {
      const contentResult = contentModelList.find(
        (item) => item.id === menu.key
      );

      if (!Object.values(contentLibraryContext?.isFieldDirty).includes(false)) {
        if (contentResult) {
          setSelectedContentModalDetails(contentResult);
        }
        contentLibraryContext?.changeIFrameVisible({
          isVisible: false,
          url: '',
        });

        contentLibraryContext?.changeSubSidebarActiveKey({
          type: menu.key,
          id: menu.key,
        });

        contentLibraryContext?.changeTitleAndSubtitle('', '');

        contentLibraryContext?.changeTitleAndSubtitle(
          contentResult.name,
          contentResult.description
        );

        contentLibraryContext?.changeRecordFilterData('', '');

        if (contentResult.type === 'collection') {
          contentLibraryContext?.changeMenuItemChange({
            type: 'collection',
            menu,
            contentResult,
            contentModalId: '',
            recordTitle: contentResult.name,
          });

          history.push(
            `/workspaces/${workspaceId}/content-library/collection-type/${menu.key}/list-records`
          );
        } else {
          contentLibraryContext?.changeMenuItemChange({
            type: 'single',
            menu,
            contentResult,
            contentModalId: menu.key,
            recordTitle: contentResult.name,
          });

          history.push(
            `/workspaces/${workspaceId}/content-library/single-type/${menu.key}/list-records`
          );
        }
      } else {
        if (contentResult.type === 'collection') {
          contentLibraryContext?.changeWarningPopupVisible({
            version: false,
            sidebar: true,
            relation: false,
            refresh: false,
            goBack: false,
          });
          contentLibraryContext?.changeMenuItemChange({
            type: 'collection',
            menu,
            contentResult,
            contentModalId: menu.key,
            recordTitle: contentResult.name,
          });
        } else {
          contentLibraryContext?.changeWarningPopupVisible({
            version: false,
            sidebar: true,
            relation: false,
            refresh: false,
            goBack: false,
          });
          contentLibraryContext?.changeMenuItemChange({
            type: 'single',
            menu,
            contentResult,
            contentModalId: menu.key,
            recordTitle: contentResult.name,
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      history,
      workspaceId,
      contentLibraryContext,
      contentLibraryContext?.menuItemChange.contentModalId,
      menuItemData,
    ]
  );

  // const onMoveToDraftClick = () => {
  //   const values = {
  //     contentModalId:
  //       contentLibraryContext?.newRecordFieldDetails?.contentModalId,
  //     contentModalDataId:
  //       contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
  //     versionId: contentLibraryContext?.newRecordFieldDetails?.versionId,
  //   };
  //   moveToDraft.mutate(values);
  // };

  const onSubSidebarOpenChange = useCallback(
    (key: string) => {
      // const result = menuItemData.find((item) => item.key === key);
      // if (result.children.length === 0) {
      //   setSelectedContentModalDetails({});
      //   contentLibraryContext?.changeSubSidebarActiveKey(null);
      //   contentLibraryContext?.changeTitleAndSubtitle('', '');
      //   history.push(
      //     `/workspaces/${workspaceId}/content-library/no-model-found`
      //   );
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menuItemData]
  );

  const menuItems = useMemo(
    () =>
      menuItemData.map((item) => {
        return {
          key: item.key,
          label: (
            <Tooltip mouseLeaveDelay={0} title={item.label} placement="bottom">
              {item.label}
            </Tooltip>
          ),
          icon: (
            <>
              <div className="ant-row arrow-folder-icon">
                <div className={`ant-menu-submenu-arrows `}>
                  <DownArrowIcon/>
                </div>
              </div>
            </>
          ),
          expandIcon: (
            <span className="object-count">
              {item.children && item.children.length}
            </span>
          ),
          children: item.children.map((item) => ({
            key: `${item.id}`,
            label: (
              <Tooltip mouseLeaveDelay={0} title={item.name} placement="bottom">
                {item.name}
              </Tooltip>
            ),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon/>
                </div>
              </>
            ),
          })),
        };
      }),
    [menuItemData]
  );

  useEffect(() => {
    const envChange = () => {
      const result = contentModelList.find(
        (item) => item.id === contentLibraryContext?.subSidebarActiveItemKey?.id
      );
      setSelectedContentModalDetails(result);

      if (result) {
        if (result.environmentId) {
          if (result.environmentId.length > 0) {
            if (
              !result.environmentId.includes(
                localStorage.getItem(`${workspaceId}/environmentId`)
              )
            ) {
              history.push(`/workspaces/${workspaceId}/content-library/`);
            }
          } else {
          }
        }

        setEnvId(localStorage.getItem(`${workspaceId}/environmentId`));
        getModelList.remove();
      }
    };
    document.addEventListener('environmentChange', envChange);

    return () => {
      document.removeEventListener('environmentChange', envChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentModelList, contentLibraryContext?.subSidebarActiveItemKey?.id]);

  useEffect(() => {
    if (contentLibraryContext?.subSidebarActiveItemKey?.id) {
      const result = contentModelList.find(
        (item) => item.id === contentLibraryContext?.subSidebarActiveItemKey?.id
      );
      if (result) {
        if (result.environmentId) {
          const tempArray = [];
          environmentList.map((item) => {
            if (result.environmentId.includes(item.id)) {
              tempArray.push(item);
            }
            return true;
          });
          setEnvironmentList([...tempArray]);
        } else {
          setEnvironmentList([...contentLibraryContext.environmentList]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contentLibraryContext?.subSidebarActiveItemKey?.id,
    contentLibraryContext.environmentList,
  ]);

  useEffect(() => {
    if (listWorkspaces.isSuccess) {
      if (listWorkspaces.data) {
        const workspace = listWorkspaces?.data?.find(
          (workspace) => workspace.id === workspaceId
        );
        contentLibraryContext?.changeStoreLink(workspace?.storeLink);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listWorkspaces.isSuccess]);

  useEffect(() => {
    if (getEnvironmentsList.isSuccess) {
      if (getEnvironmentsList.data) {
        if (getEnvironmentsList.data.length > 0) {
          const tempArray = [...getEnvironmentsList.data];
          tempArray.map((envData, index) => {
            if (envData.type === 'DEV') {
              tempArray.splice(index, 1);
              tempArray.unshift(envData);
            } else if (envData.type === 'PRODUCTION') {
              tempArray.splice(index, 1);
              tempArray.push(envData);
            }
            return '';
          });
          setEnvironmentList(tempArray);
          contentLibraryContext?.changeEnvironmentList(tempArray);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentsList.isSuccess]);

  useEffect(() => {
    if (menuItemData) {
      if (
        location.pathname.search('field') === -1 &&
        location.pathname.search('version') === -1 &&
        location.pathname.search('language') === -1 &&
        location.pathname.search('list-records') === -1
      ) {
        const result = menuItemData.find((value) => value.children.length > 0);
        if (result) {
          if (result.children.length > 0) {
            setSelectedContentModalDetails(result.children[0]);
            contentLibraryContext?.changeSubSidebarActiveKey({
              type: result.children[0].type,
              id: result.children[0].id,
            });
            contentLibraryContext?.changeOpenSubSidebarMenuItems([result.key]);
            if (result.children[0].type === 'collection') {
              history.replace(`/workspaces/${workspaceId}/content-library/collection-type/${result.children[0].id}/list-records`)
            } else {
              history.replace(`/workspaces/${workspaceId}/content-library/single-type/${result.children[0].id}/list-records`)
            }
          }
        }
      } else if (location.pathname.search('single-type') !== -1) {
        const result = contentModelList.find(
          (item) => item.id === location.pathname.split('/')[5]
        );
        setSelectedContentModalDetails(result);
        if (result) {
          contentLibraryContext?.changeOpenSubSidebarMenuItems([
            result.groupId,
          ]);
        }
      } else if (location.pathname.search('collection-type') !== -1) {
        const result = contentModelList.find(
          (item) => item.id === location.pathname.split('/')[5]
        );
        setSelectedContentModalDetails(result);
        if (result) {
          contentLibraryContext?.changeOpenSubSidebarMenuItems([
            result.groupId,
          ]);
        }
      }
      const usrData = location.pathname.split('/');
      if (usrData[5]) {
        contentLibraryContext?.changeSubSidebarActiveKey({
          type: usrData[5],
          id: usrData[5],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItemData, location]);

  useEffect(
    () => {
      if (getModelList.isSuccess) {
        const tempObject = {};
        const tempArray = [];
        if (getModelList.data) {
          if (getModelList.data.length > 0) {
            getModelList.data.map((item) => {
              if (
                permissions[
                  `content_library.${item.internalName}.permissions.read`
                  ] ||
                canManageGlobalWorkspace()
              ) {
                tempObject[item.id] = item.internalName;
                tempArray.push(item);
              }
              return '';
            });
            if (tempArray.length === 0) {
              history.push(
                `/workspaces/${workspaceId}/content-library/no-model-found`
              );
            } else {
              setContentModelList(tempArray);
              contentLibraryContext?.changeContentModelList(tempArray);
              contentLibraryContext?.changeContentModalData(tempObject);
            }
          } else {
            history.push(
              `/workspaces/${workspaceId}/content-library/no-model-found`
            );
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getModelList.isSuccess, getModelList.data, permissions]
  );

  useEffect(() => {
    if (getModelList.isError) {
      handleForbiddenError(getModelList.error.response.Error?.code);
      console.log(getModelList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getModelList.isError]);

  useEffect(() => {
    if (getGroupList.isSuccess) {
      setContentModelGroupList(getGroupList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGroupList.isSuccess]);

  useEffect(() => {
    if (getGroupList.isError) {
      console.log(getGroupList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGroupList.isError]);

  useEffect(() => {
    const tempArray: {
      key: string;
      label: string;
      position: number;
      children: ContentModelList[];
    }[] = [];
    if (getGroupList.data && getModelList.data) {
      contentModelGroupList.map((group) => {
        const filterData = contentModelList.filter(
          (item) => item.groupId === group.id
        );
        tempArray.push({
          key: group.id,
          label: group.name,
          position: group.position,
          children: filterData,
        });
        return '';
      });
      setMenuItemData([...tempArray]);
    }
  }, [
    getModelList.data,
    getGroupList.data,
    contentModelList,
    contentModelGroupList,
  ]);

  useEffect(() => {
    if (contentLibraryContext?.subSidebarActiveItemKey?.id) {
      const contentResult = contentModelList.find(
        (item) => item.id === contentLibraryContext?.subSidebarActiveItemKey?.id
      );
      if (contentResult) {
        setSelectedContentModalDetails(contentResult);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLibraryContext?.subSidebarActiveItemKey?.id]);

  // useEffect(() => {
  //   if (moveToDraft.isSuccess) {
  //     queryClient.refetchQueries([
  //       API_QUERY_KEY.GET_RECORD_LIST,
  //       contentLibraryContext?.newRecordFieldDetails?.contentModalId,
  //       contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
  //       contentLibraryContext?.newRecordFieldDetails?.language,
  //       contentLibraryContext?.newRecordFieldDetails?.versionId,
  //     ]);
  //     openNotificationWithIcon('success',t('common.messages.move_to_draft_successfully'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [moveToDraft.isSuccess]);
  //
  // useEffect(() => {
  //   if (moveToDraft.isError) {
  //     openNotificationWithIcon('error',t("common.messages.error_in_move_to_draft"));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [moveToDraft.isError]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    menuItems,
    onSubSidebarMenuItemClick,
    selectedContent: contentLibraryContext?.subSidebarActiveItemKey,
    onSubSidebarOpenChange,
    titleAndSubtitle: contentLibraryContext?.titleAndSubtitle,
    isHeaderButtonVisible: contentLibraryContext?.isHeaderButtonVisible,
    // onMoveToDraftClick,
    environmentList,
    openSubSidebarMenuItems: contentLibraryContext?.openSubSidebarMenuItems,
    selectedContentModalDetails,
  };
};
export default ContentLibraryController;
