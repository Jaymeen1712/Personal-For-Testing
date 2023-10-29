import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { MenuInfo } from 'rc-menu/lib/interface';

import DownArrowIcon from '../../../images/icons/downarrow-icon';
import { IWorkspaceParams, ContentModelList } from '../../../types';
import { useTranslation } from 'react-i18next';
import PlusArrowIcon from '../../../images/icons/plusarrow-icon';
import FolderOpenIcon from '../../../images/icons/folder-open-icon';
import FolderIcon from '../../../images/icons/folder-icon';
import { useGetModelGroupList, useGetModelList } from './services/models';
import {
  useGetComponentModelList,
  useGetComponentGroupList,
} from './services/components';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import EditIcon from '../../../images/icons/edit-icon';
import { openNotificationWithIcon, SIDEBAR_KEYS } from '../../../utills';
import usePermissions from './permission';
import ReorderIcon from '../../../images/icons/reorder-icon';
import BulletIcon from '../../../images/icons/bullet-icon';

interface IUseContentModelController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useContentModelController = ({
  onMainSidebarActiveItem,
}: IUseContentModelController) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const [isAddNewModelVisible, setAddNewModelVisible] = useState(false);
  const [isAddNewFolderVisible, setAddNewFolderVisible] = useState(false);
  const [modelGroupList, setModelGroupList] = useState<
    { id: string; name: string; position: number }[]
  >([]);
  const [modelList, setModelList] = useState<ContentModelList[]>([]);

  const [componentGroupList, setComponentGroupList] = useState<
    { id: string; name: string; position: number }[]
  >([]);
  const [componentList, setComponentList] = useState<ContentModelList[]>([]);

  const [menuDataObject, setMenuDataObject] = useState<
    {
      id: string;
      label: string;
      position: number;
      children: ContentModelList[];
    }[]
  >([]);

  const [componentMenuDataObject, setComponentMenuDataObject] = useState<
    {
      id: string;
      label: string;
      position: number;
      children: ContentModelList[];
    }[]
  >([]);

  const [selectedContentModelId, setSelectedContentModelId] = useState('');

  const [isHeaderButtonVisible, setHeaderButtonVisible] = useState(false);

  const [isCreateFieldModalVisible, setIsCreateFieldModalVisible] =
    useState(false);
  const [isCreateFieldFormModalVisible, setIsCreateFieldFormModalVisible] =
    useState(false);
  const [editFieldIdAndStatus, setEditFieldAndStatus] = useState({
    id: '',
    status: false,
  });
  const [titleSubTitle, setTitleSubTitle] = useState({
    title: '',
    subTitle: '',
  });
  const [actAsWebPage, setActAsWebPage] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState('');
  const [isLocalizationEnable, setIsLocalizationEnable] = useState(false);
  const [selectedContentDetails, setSelectedContentDetails] = useState<{
    key: string;
    label: string;
    description?: string;
  }>({
    key: '',
    label: '',
    description: '',
  });
  const [editModelStatus, setEditModelStatus] = useState({
    contentModelId: '',
    status: false,
  });

  const [editFolderStatus, setEditFolderStatus] = useState({
    folderId: '',
    folderName: '',
    position: 0,
    status: false,
  });

  const [isReorderModalVisible, setReorderModalVisible] = useState(false);

  const [reorderType, setReorderType] = useState('model');

  const [openFolderId, setOpenFolderId] = useState(['model']);
  const [addNewType, setAddNewType] = useState('model');
  const [modelInternalName, setModelInternalName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [environmentId, setEnvironmentId] = useState(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );
  const [isMenuPopUpIsVisible, setIsMenuPopUpIsVisible] = useState(false);

  const [sortable, setSortable] = useState(false);

  const getModelGroupList = useGetModelGroupList(workspaceId);
  const getModelList = useGetModelList(workspaceId, environmentId);

  const getComponentModelList = useGetComponentModelList(workspaceId);
  const getComponentGroupList = useGetComponentGroupList(workspaceId);

  const {
    canCreateContentModelField,
    canUpdateContentModel,
    canCreateContentModel,
    canCreateComponent,
    canUpdateComponent,
  } = usePermissions(modelInternalName);

  const onAddNewModelVisibilityChange = (val: boolean) => {
    setAddNewModelVisible(val);
  };

  const onAddNewFolderVisibilityChange = (
    val: boolean,
    isEmptyData: boolean
  ) => {
    setAddNewFolderVisible(val);
    if (!val && isEmptyData) {
      setEditFolderStatus({
        folderId: '',
        folderName: '',
        position: 0,
        status: false,
      });
    }
  };

  const onAddFieldClick = () => {
    setIsCreateFieldModalVisible(true);
  };

  const onCreateField = (id: string) => {
    setSelectedFieldType(id);
    setIsCreateFieldFormModalVisible(true);
    setIsCreateFieldModalVisible(false);
  };

  const onEditFieldStatusChange = (id: string, status: boolean) => {
    setEditFieldAndStatus({
      id: id,
      status: status,
    });
  };

  const hideCreateFormFieldModal = () => {
    setIsCreateFieldFormModalVisible(false);
    setIsCreateFieldModalVisible(true);
  };

  const editNewModelStatusChange = (id: string, status: boolean) => {
    setEditModelStatus({
      contentModelId: id,
      status: status,
    });
  };

  const hideUpdateFormFieldModal = useCallback(() => {
    setIsCreateFieldFormModalVisible(false);
    setIsCreateFieldModalVisible(false);
    setEditFieldAndStatus({
      id: '',
      status: false,
    });
  }, []);

  const hideCreateFieldModal = useCallback(() => {
    setIsCreateFieldModalVisible(false);
  }, []);

  const onEditModelDetails = () => {
    setAddNewModelVisible(true);
    setEditModelStatus({
      contentModelId: location.pathname.split('/')[5],
      status: true,
    });
  };

  const onAddNewType = (val: string) => {
    setAddNewType(val);
  };

  const onGroupEditClick = (
    event: React.MouseEvent<HTMLElement>,
    label: string,
    key: string,
    position: number
  ) => {
    event.stopPropagation();
    setEditFolderStatus({
      folderId: key,
      folderName: label,
      position: position,
      status: true,
    });
    setAddNewFolderVisible(true);
  };

  const onReorderModalCancelClick = () => {
    setReorderModalVisible(false);
  };

  const titleAndSubtitleChange = (title: string, subTitle: string) => {
    setTitleSubTitle({
      title,
      subTitle,
    });
  };

  const changeModalAndGroupList = (modelData: [], groupData: []) => {
    setModelList(modelData);
    setModelGroupList(groupData);
  };

  const changeTableSortOrderStatus = (val: boolean) => {
    setSortable(val);
  };

  const onSubSidebarOpenChange = useCallback(
    (key: string) => {
      setSelectedFolderId(key.split('/')[0]);
      if (key.split('/')[1] === 'component') {
        const result = componentMenuDataObject.find(
          (value) => value.id === key.split('/')[0]
        );

        if (result) {
          if (result.children.length === 0) {
            history.push(`/workspaces/${workspaceId}/content-model/component/`);
            setTitleSubTitle({
              title: result.label,
              subTitle: '',
            });
            setSelectedContentModelId(key);
          }
        }
      } else {
        const result = menuDataObject.find(
          (value) => value.id === key.split('/')[0]
        );

        if (result) {
          if (result.children.length === 0) {
            history.push(`/workspaces/${workspaceId}/content-model/model/`);
            setTitleSubTitle({
              title: result.label,
              subTitle: '',
            });
            setSelectedContentModelId(key);
          }
        }
      }
    },
    [menuDataObject, componentMenuDataObject, history, workspaceId]
  );

  const onSubSidebarMenuItemClick = useCallback(
    (menu: MenuInfo) => {
      const urlData = menu.key.split('/');
      setSelectedContentModelId(menu.key);
      if (urlData[1] === 'component') {
        const find = componentList.find((item) => item.id === urlData[0]);
        if (find) {
          setModelInternalName(find.internalName);
        }
        setAddNewType('component');
        history.push(
          `/workspaces/${workspaceId}/content-model/component/${urlData[0]}/list-field/${urlData[1]}`
        );
      } else {
        const find = modelList.find((item) => item.id === urlData[0]);
        if (find) {
          setModelInternalName(find.internalName);
        }
        setAddNewType('model');
        history.push(
          `/workspaces/${workspaceId}/content-model/model/${urlData[0]}/list-field/${urlData[1]}`
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, workspaceId, modelList, componentList]
  );

  const menuItems = useMemo(
    () => [
      {
        key: 'model',
        label: t('common.labels.models'),
        icon: (
          <div className={`ant-menu-submenu-arrows`}>
            <DownArrowIcon />
          </div>
        ),
        expandIcon: (
          <div className="ant-menu-submenu-arrows">
            <Tooltip placement="bottom" title="Reorder">
              <Button
                className="OnlyIcon on-hover dragicon-menu"
                type="link"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  setReorderModalVisible(true);
                  setReorderType('model');
                }}>
                <ReorderIcon />
              </Button>
            </Tooltip>
            <Tooltip
              placement="right"
              title={t('common.labels.add_new_folder_or_models')}>
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div
                    className={`table-dropdown ${
                      !isMenuPopUpIsVisible && 'ant-dropdown-hidden'
                    }`}>
                    <Menu>
                      <Menu.Item key="model">
                        <Tooltip
                          placement="right"
                          title={
                            !canCreateContentModel() &&
                            t('common.messages.error_model_create')
                          }>
                          <Button
                            disabled={!canCreateContentModel()}
                            onClick={(event) => {
                              event.stopPropagation();
                              setAddNewModelVisible(true);
                              setEditModelStatus({
                                contentModelId: '',
                                status: false,
                              });
                              setAddNewType('model');
                              setIsMenuPopUpIsVisible(false);
                            }}>
                            {t('common.labels.add_new_modal')}
                          </Button>
                        </Tooltip>
                      </Menu.Item>
                      <Menu.Item key="folder">
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            setAddNewFolderVisible(true);
                            setAddNewType('model');
                            setIsMenuPopUpIsVisible(false);
                          }}>
                          {t('common.labels.new_folder')}
                        </Button>
                      </Menu.Item>
                    </Menu>
                  </div>
                }>
                <Button
                  className="OnlyIcon plusarrow on-hover"
                  type="link"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuPopUpIsVisible(true);
                  }}>
                  <PlusArrowIcon />
                </Button>
              </Dropdown>
            </Tooltip>
          </div>
        ),
        children: menuDataObject.map((group) => ({
          key: `${group.id}/model`,
          label: (
            <Tooltip mouseLeaveDelay={0} title={group.label} placement="bottom">
              {group.label}
            </Tooltip>
          ),
          icon: (
            <>
              <div className="folders-icon ant-row">
                <div className="unselected-icon">{<FolderIcon />}</div>
                <div className="selected-icon">
                  <FolderOpenIcon />
                </div>
              </div>
            </>
          ),
          expandIcon: (
            <>
              <span className="object-count count-hover-disable">
                {group.children && group.children.length}
              </span>
              <div className="ant-menu-submenu-arrows editicon-gray">
                <Button
                  className="OnlyIcon"
                  type="link"
                  key={group.label}
                  onClick={(event) => {
                    onGroupEditClick(
                      event,
                      group.label,
                      group.id,
                      group.position
                    );
                    setAddNewType('model');
                  }}>
                  <EditIcon />
                </Button>
              </div>
            </>
          ),
          children: group.children.map((item) => ({
            key: `${item.id}/${item.type}`,
            label: (
              <Tooltip mouseLeaveDelay={0} title={item.name} placement="bottom">
                {item.name}
              </Tooltip>
            ),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          })),
        })),
      },
      {
        key: 'component',
        label: t('common.labels.component'),
        icon: (
          <div className={`ant-menu-submenu-arrows`}>
            <DownArrowIcon />
          </div>
        ),
        expandIcon: (
          <div className="ant-menu-submenu-arrows">
            <Tooltip placement="bottom" title="Reorder">
              <Button
                className="OnlyIcon on-hover dragicon-menu"
                type="link"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  setReorderModalVisible(true);
                  setReorderType('component');
                }}>
                <ReorderIcon />
              </Button>
            </Tooltip>
            <Tooltip
              placement="right"
              title={t('common.labels.add_new_folder_or_components')}>
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div
                    className={`table-dropdown ${
                      !isMenuPopUpIsVisible && 'ant-dropdown-hidden'
                    }`}>
                    <Menu>
                      <Menu.Item key="component">
                        <Tooltip
                          placement="right"
                          title={
                            !canCreateComponent() &&
                            t('common.messages.error_component_create')
                          }>
                          <Button
                            disabled={!canCreateComponent()}
                            onClick={(event) => {
                              event.stopPropagation();
                              setAddNewModelVisible(true);
                              setEditModelStatus({
                                contentModelId: '',
                                status: false,
                              });
                              setAddNewType('component');
                              setIsMenuPopUpIsVisible(false);
                            }}>
                            {t('common.labels.add_new_component')}
                          </Button>
                        </Tooltip>
                      </Menu.Item>
                      <Menu.Item key="folder">
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            setAddNewFolderVisible(true);
                            setAddNewType('component');
                            setIsMenuPopUpIsVisible(false);
                          }}>
                          {t('common.labels.new_folder')}
                        </Button>
                      </Menu.Item>
                    </Menu>
                  </div>
                }>
                <Button
                  className="plusarrow"
                  type="link"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuPopUpIsVisible(true);
                  }}>
                  <PlusArrowIcon />
                </Button>
              </Dropdown>
            </Tooltip>
          </div>
        ),
        children: componentMenuDataObject.map((group) => ({
          key: `${group.id}/component`,
          label: (
            <Tooltip mouseLeaveDelay={0} title={group.label} placement="bottom">
              {group.label}
            </Tooltip>
          ),
          icon: (
            <>
              <div className="folders-icon ant-row">
                <div className="unselected-icon">{<FolderIcon />}</div>
                <div className="selected-icon">
                  <FolderOpenIcon />
                </div>
              </div>
            </>
          ),
          expandIcon: (
            <>
              <span className="object-count count-hover-disable">
                {group.children && group.children.length}
              </span>
              <div className="ant-menu-submenu-arrows editicon-gray">
                <Button
                  className="OnlyIcon"
                  type="link"
                  key={group.label}
                  onClick={(event) => {
                    onGroupEditClick(
                      event,
                      group.label,
                      group.id,
                      group.position
                    );
                    setAddNewType('component');
                  }}>
                  <EditIcon />
                </Button>
              </div>
            </>
          ),
          children: group.children.map((item) => ({
            key: `${item.id}/component`,
            label: (
              <Tooltip mouseLeaveDelay={0} title={item.name} placement="bottom">
                {item.name}
              </Tooltip>
            ),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          })),
        })),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      t,
      menuDataObject,
      modelList,
      modelGroupList,
      componentList,
      componentGroupList,
      componentMenuDataObject,
      selectedFolderId,
      isAddNewModelVisible,
      isAddNewFolderVisible,
      isMenuPopUpIsVisible,
    ]
  );

  useEffect(() => {
    const envChange = () => {
      const result = modelList.find(
        (item) => item.id === selectedContentModelId.split('/')[0]
      );
      if (result) {
        if (result.environmentId.length > 0) {
          if (
            !result.environmentId.includes(
              //@ts-ignore
              localStorage.getItem(`${workspaceId}/environmentId`)
            )
          ) {
            history.push(`/workspaces/${workspaceId}/content-model/`);
          }
        }
      }
      setEnvironmentId(localStorage.getItem(`${workspaceId}/environmentId`));
      getModelList.remove();
    };
    document.addEventListener('environmentChange', envChange);

    return () => {
      document.removeEventListener('environmentChange', envChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContentModelId, modelList]);

  useEffect(() => {
    if (location.pathname.search('list-field') !== -1) {
      const contentModelId = location.pathname.split('/')[5];
      setHeaderButtonVisible(true);
      if (addNewType === 'component') {
        const result = componentList.find((item) => item.id === contentModelId);
        if (result) {
          setTitleSubTitle({
            title: result.name,
            subTitle: result.description,
          });
          setActAsWebPage(result.actAsWebPage);
          setIsLocalizationEnable(result.isLocalizationEnabled);
          setSelectedContentDetails({
            key: result.id,
            label: result.name,
            description: result.description,
          });
        }
      } else {
        const result = modelList.find((item) => item.id === contentModelId);
        if (result) {
          setTitleSubTitle({
            title: result.name,
            subTitle: result.description,
          });

          setActAsWebPage(result.actAsWebPage);
          setIsLocalizationEnable(result.isLocalizationEnabled);
          setSelectedContentDetails({
            key: result.id,
            label: result.name,
            description: result.description,
          });
        }
      }
    } else {
      setHeaderButtonVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (getModelGroupList.isFetched && getModelList.isFetched) {
      const groupArray: {
        id: string;
        label: string;
        position: number;
        children: ContentModelList[];
      }[] = [];

      modelGroupList.map((group) => {
        const filterData = modelList.filter(
          (item) => item.groupId === group.id
        );

        groupArray.push({
          id: group.id,
          label: group.name,
          position: group.position,
          children: filterData,
        });
        return '';
      });

      if (groupArray.length > 0) {
        const urlData = location.pathname.split('/');
        if (!urlData[5]) {
          for (let i = 0; i <= groupArray.length; i++) {
            if (groupArray[i]?.children.length > 0) {
              history.replace(
                `/workspaces/${workspaceId}/content-model/model/${groupArray[i].children[0].id}/list-field/${groupArray[i].children[0].type}`
              );
              setSelectedContentModelId(
                `${groupArray[i].children[0].id}/${groupArray[i].children[0].type}`
              );
              setActAsWebPage(groupArray[i].children[0].actAsWebPage);
              setIsLocalizationEnable(
                groupArray[i].children[0].isLocalizationEnabled
              );
              setOpenFolderId([`${groupArray[i].children[0].groupId}/model`]);
              setModelInternalName(groupArray[i].children[0].internalName);
              setSelectedFolderId(groupArray[i].children[0].groupId);
              setSelectedContentDetails({
                key: groupArray[i].children[0].id,
                label: groupArray[i].children[0].name,
                description: groupArray[i].children[0].description,
              });
              break;
            }
          }
        }
      }
      setMenuDataObject([...groupArray]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    modelList,
    modelGroupList,
    getModelGroupList.isFetched,
    getModelList.isFetched,
    getModelGroupList.data,
    getModelList.data,
    // location,
  ]);

  useEffect(() => {
    if (getComponentModelList.isFetched && getComponentGroupList.isFetched) {
      const groupArray: {
        id: string;
        label: string;
        position: number;
        children: ContentModelList[];
      }[] = [];

      componentGroupList.map((group) => {
        const filterData = componentList.filter(
          (item) => item.groupId === group.id
        );
        groupArray.push({
          id: group.id,
          label: group.name,
          position: group.position,
          children: filterData,
        });
        return '';
      });

      setComponentMenuDataObject([...groupArray]);
    }
  }, [
    componentList,
    componentGroupList,
    getComponentGroupList.isFetched,
    getComponentModelList.isFetched,
    getComponentGroupList.data,
    getComponentModelList.data,
  ]);

  useEffect(() => {
    if (getModelGroupList.isSuccess) {
      setModelGroupList(getModelGroupList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getModelGroupList.isSuccess]);

  useEffect(() => {
    if (getModelGroupList.isError) {
      console.log(getModelGroupList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getModelGroupList.isError]);

  useEffect(() => {
    if (getModelList.isSuccess) {
      setModelList(getModelList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getModelList.isSuccess]);

  useEffect(() => {
    if (getModelList.isError) {
      console.log(getModelList.error);
      if (
        getModelList.error.response.Error?.code === 'EX-00024' ||
        getModelList.error.response.Error?.code === 'EX-00006'
      ) {
        openNotificationWithIcon(
          'error',
          t('common.messages.you_dont_have_access')
        );
        history.push(`/workspaces/${workspaceId}/dashboard/traffic`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getModelList.isError]);

  useEffect(() => {
    const urlData = location.pathname.split('/');
    if (urlData[4] === 'model' && urlData[5]) {
      setAddNewType('model');
      if (modelList.length > 0) {
        const result = modelList.find((item) => item.id === urlData[5]);
        if (result) {
          setTitleSubTitle({
            title: result.name,
            subTitle: result.description,
          });
          setSelectedContentDetails({
            key: result.id,
            label: result.name,
            description: result.description,
          });
          setSelectedContentModelId(`${result.id}/${result.type}`);
          setActAsWebPage(result.actAsWebPage);
          setIsLocalizationEnable(result.isLocalizationEnabled);
          setOpenFolderId([`${result.groupId}/model`]);
          setModelInternalName(result.internalName);
          setSelectedFolderId(result.id);
        }
      }
    } else if (urlData[4] === 'component' && urlData[5]) {
      setAddNewType('component');
      if (componentList.length > 0) {
        const result = componentList.find((item) => item.id === urlData[5]);
        if (result) {
          setTitleSubTitle({
            title: result.name,
            subTitle: result.description,
          });
          setSelectedContentModelId(`${result.id}/component`);
          setActAsWebPage(result.actAsWebPage);
          setIsLocalizationEnable(result.isLocalizationEnabled);
          setOpenFolderId([`${result.groupId}/component`]);
          setModelInternalName(result.internalName);
          setSelectedFolderId(result.id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelList, componentList]);

  useEffect(() => {
    if (getComponentModelList.isSuccess) {
      setComponentList(getComponentModelList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getComponentModelList.isSuccess]);

  useEffect(() => {
    if (getComponentModelList.isError) {
      console.log(getComponentModelList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getComponentModelList.isError]);

  useEffect(() => {
    if (getComponentGroupList.isSuccess) {
      setComponentGroupList(getComponentGroupList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getComponentGroupList.isSuccess]);

  useEffect(() => {
    if (getComponentGroupList.isError) {
      console.log(getComponentGroupList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getComponentGroupList.isError]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMenuPopUpIsVisible) {
      setIsMenuPopUpIsVisible(false);
    }
    if (isAddNewModelVisible) {
      setAddNewModelVisible(false);
    }
    if (isAddNewFolderVisible) {
      setAddNewFolderVisible(false);
    }
    if (isCreateFieldModalVisible) {
      setIsCreateFieldModalVisible(false);
    }
    if (isCreateFieldFormModalVisible) {
      setIsCreateFieldFormModalVisible(false);
    }

    const urlData = location.pathname.split('/');
    if (urlData.includes('component')) {
      setSelectedContentModelId(`${urlData[5]}/component`);
    } else if (urlData.includes('model') && urlData.includes('collection')) {
      setSelectedContentModelId(`${urlData[5]}/collection`);
    } else if (urlData.includes('model') && urlData.includes('single')) {
      setSelectedContentModelId(`${urlData[5]}/single`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return {
    t,
    menuItems,
    path,
    isAddNewModelVisible,
    onAddNewModelVisibilityChange,
    isAddNewFolderVisible,
    onAddNewFolderVisibilityChange,
    modelGroupList,
    onSubSidebarMenuItemClick,
    selectedContentModelId,
    onSubSidebarOpenChange,
    isHeaderButtonVisible,
    onAddFieldClick,
    isCreateFieldModalVisible,
    setIsCreateFieldModalVisible,
    isCreateFieldFormModalVisible,
    setIsCreateFieldFormModalVisible,
    onEditFieldStatusChange,
    editFieldIdAndStatus,
    onCreateField,
    titleSubTitle,
    hideCreateFieldModal,
    actAsWebPage,
    hideCreateFormFieldModal,
    hideUpdateFormFieldModal,
    selectedFieldType,
    isLocalizationEnable,
    selectedContentDetails,
    editModelStatus,
    onEditModelDetails,
    editNewModelStatusChange,
    editFolderStatus,
    openFolderId,
    addNewType,
    componentGroupList,
    onAddNewType,
    componentsList: getComponentModelList.data
      ? getComponentModelList?.data
      : [],
    canCreateContentModelField:
      addNewType === 'component'
        ? canCreateComponent()
        : canCreateContentModelField(modelInternalName),
    canUpdateContentModel:
      addNewType === 'component'
        ? canUpdateComponent()
        : canUpdateContentModel(modelInternalName),
    modelInternalName,
    modelList,
    isReorderModalVisible,
    reorderType,
    menuDataObject,
    componentMenuDataObject,
    onReorderModalCancelClick,
    titleAndSubtitleChange,
    changeModalAndGroupList,
    sortable,
    changeTableSortOrderStatus,
  };
};

export default useContentModelController;
