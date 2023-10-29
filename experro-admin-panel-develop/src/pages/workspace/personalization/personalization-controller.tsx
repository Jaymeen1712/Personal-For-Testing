import React, { useEffect, useMemo, useState } from 'react';
import DownArrowIcon from '../../../images/icons/downarrow-icon';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import PlusArrowIcon from '../../../images/icons/plusarrow-icon';
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { IListWidget, IWorkspaceParams } from '../../../types';
import { MenuInfo } from 'rc-menu/lib/interface';
import EllipsisIcon from '../../../images/icons/ellipsis-icon';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_KEYS } from '../../../utills';
import { useListWidget } from './services';

const usePersonalizationController = (
  onMainSidebarActiveItem?: (val: string) => void
) => {
  const location = useLocation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const history = useHistory();
  const { path } = useRouteMatch();
  const [environment, setEnvironment] = useState<string | null>(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const [titleSubTitle, setTitleSubTitle] = useState<{
    title: string;
    subTitle?: string;
  }>();
  const [selectedWidget, setSelectedWidget] = useState<{
    id: string;
    type: string;
  }>();

  const [widgetData, setWidgetData] = useState<IListWidget[]>([]);
  const [customWidgetData, setCustomWidgetData] = useState<IListWidget[]>([]);

  const [isAddWidgetModalVisible, setAddWidgetModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isAddRuleModalVisible, SetAddRuleModalVisible] = useState(false);

  const [isEditWidget, setEditWidget] = useState(false);
  const [isEditRule, setEditRule] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const listWidget = useListWidget(workspaceId, environment);

  const onEnvironmentChange = (environment: string) => {
    setEnvironment(environment);
  };

  const onDeleteModalVisible = (val: boolean) => {
    setDeleteModalVisible(val);
  };

  const onAddEditRuleModalVisible = (val: boolean) => {
    SetAddRuleModalVisible(val);
  };

  const onSetEditRule = (val: boolean) => {
    setEditRule(val);
  };

  const onSubSidebarMenuItemClick = (menu: MenuInfo) => {
    history.push(
      `/workspaces/${workspaceId}/personalization/${menu.keyPath[1]}/${menu.key}/list-records`
    );
  };

  const onSetWidgetModalVisible = (val: boolean) => {
    setAddWidgetModalVisible(val);
  };

  const onSetEditWidget = (val: boolean) => {
    setEditWidget(val);
  };

  const onEditWidget = (id: string) => {
    setSelectedId(id);
    setEditWidget(true);
    onSetWidgetModalVisible(true);
  };

  const onDeleteWidget = (id: string) => {
    setSelectedId(id);
    setDeleteModalVisible(true);
  };

  const onAddWidget = (event: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    onSetEditWidget(false);
    setAddWidgetModalVisible(true);
  };

  const { t } = useTranslation();

  const menuItems = useMemo(() => {
    if (location.pathname.search('create-edit') !== -1) {
      return [];
    }
    return [
      {
        key: 'widget',
        label: t('common.labels.widgets'),
        icon: (
          <div
            className={`ant-menu-submenu-arrows ${
              widgetData && !widgetData.length && `inactive`
            }`}>
            <DownArrowIcon />
          </div>
        ),
        children:
          widgetData?.map((item) => {
            return {
              key: item.id,
              label: (
                <Tooltip
                  placement="bottom"
                  title={item.name}
                  mouseLeaveDelay={0}>
                  {item.name}
                </Tooltip>
              ),
            };
          }) || [],
      },
      {
        key: 'custom-widget',
        label: t('common.labels.custom_widget'),
        icon: (
          <div
            className={`ant-menu-submenu-arrows ${
              customWidgetData && customWidgetData.length === 0 && `inactive`
            }`}>
            <DownArrowIcon />
          </div>
        ),
        expandIcon: (
          <>
            <div className="ant-menu-submenu-arrows">
              <Button
                type="link"
                size="small"
                className="OnlyIcon plusarrow on-hover"
                onClick={(event) => onAddWidget(event)}>
                <PlusArrowIcon />
              </Button>
            </div>
          </>
        ),
        children:
          customWidgetData?.map((item) => ({
            key: item.id,
            label: (
              <>
                <div className="ant-row media-menu-button">
                  <span>
                    <Tooltip
                      placement="bottom"
                      title={item.name}
                      mouseLeaveDelay={0}>
                      {item.name}
                    </Tooltip>
                  </span>
                  <>
                    <div className="ant-row ant-row-middle ant-row-no-wrap ant-row-space-between media-menu-button-dots">
                      <Dropdown
                        placement="bottomRight"
                        trigger={['click']}
                        overlay={
                          <div className="table-dropdown">
                            <Menu>
                              <Menu.Item
                                onClick={(event) => {
                                  event.domEvent.stopPropagation();
                                  onEditWidget(item.id);
                                }}>
                                {t('common.labels.edit')}
                              </Menu.Item>
                              <Menu.Item
                                className="text-red"
                                onClick={(event) => {
                                  event.domEvent.stopPropagation();
                                  onDeleteWidget(item.id);
                                }}>
                                {t('common.labels.delete')}
                              </Menu.Item>
                            </Menu>
                          </div>
                        }>
                        <Button
                          type="text"
                          size="small"
                          onClick={(event) => event.stopPropagation()}
                          className="on-hover"
                          icon={<EllipsisIcon />}
                          style={{ float: 'right' }}></Button>
                      </Dropdown>
                    </div>
                  </>
                </div>
              </>
            ),
          })) || [],
      },
    ];
    // eslint-disable-next-line
  }, [widgetData, customWidgetData, location, environment]);

  useEffect(() => {
    if (listWidget.data) {
      const data = listWidget?.data?.filter(
        (widget) => widget.isSystemGenerated
      );

      setWidgetData(data);

      const customData = listWidget?.data?.filter(
        (widget) => !widget.isSystemGenerated
      );

      setCustomWidgetData(customData);
    }
  }, [listWidget.data]);

  useEffect(() => {
    if (listWidget.isSuccess) {
      if (
        location.pathname.search('widget') === -1 &&
        location.pathname.search('custom-widget') === -1
      ) {
        const record = listWidget?.data?.filter(
          (widget) => widget.isSystemGenerated
        );
        if (record) {
          setSelectedWidget({
            id: record[0].id,
            type: 'widget',
          });
          history.push(
            `/workspaces/${workspaceId}/personalization/widget/${record[0].id}/list-records`
          );
        }
      } else if (
        location.pathname.search('create-edit') === -1 &&
        (location.pathname.search('widget') !== -1 ||
          location.pathname.search('custom-widget') !== -1)
      ) {
        setSelectedWidget({
          id: location.pathname.split('/')[5],
          type: location.pathname.split('/')[4],
        });
      }
    }
    // eslint-disable-next-line
  }, [location, listWidget.isSuccess]);

  useEffect(() => {
    if (selectedWidget) {
      const result = listWidget?.data?.find(
        (widget) => widget.id === selectedWidget?.id
      );
      if (result) {
        setTitleSubTitle({
          title: result.name,
          subTitle: result.description,
        });
      }
    }
    // eslint-disable-next-line
  }, [listWidget.isSuccess, selectedWidget, location]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.PERSONALIZATION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    path,
    location,
    selectedWidget,
    menuItems,
    environment,
    titleSubTitle,
    isEditRule,
    isEditWidget,
    selectedId,
    widgetData,
    customWidgetData,
    isAddRuleModalVisible,
    onSubSidebarMenuItemClick,
    isAddWidgetModalVisible,
    isDeleteModalVisible,
    onDeleteModalVisible,
    onSetWidgetModalVisible,
    onEnvironmentChange,
    onSetEditWidget,
    onSetEditRule,
    onAddEditRuleModalVisible,
  };
};

export default usePersonalizationController;
