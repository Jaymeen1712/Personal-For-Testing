import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';

import useSubMenuController from './sub-menu-controller';
import PlusArrowIcon from '../../../images/icons/plusarrow-icon';
import { SIDEBAR_KEYS } from '../../../utills';
import EnvironmentSelector from '../../environment-select';

const { Sider } = Layout;

interface SubMenuProps {
  isOpen: boolean;
  showPlusIcon: boolean;
  sidebarActiveItemKey: string;
  subSidebarActiveItemKey?: string;
  subSidebarMenuItems?: {
    key: string;
    icon: JSX.Element;
    expandIcon?: JSX.Element;
    label: string | JSX.Element;
    children?: { key: string; label: string | JSX.Element }[];
  }[];
  onSubSidebarMenuItemClick?: (menuItem: MenuInfo) => void;
  onSubSidebarParentMenuItemClick?: (key: string) => void;
  openSubSidebarMenuItems?: string[];
  isEnvironmentSelectorVisible?: boolean;
  environmentSelectDefaultValue?: string;
  onEnvironmentSelectValueChange?: (val: string) => void;
  isEnvironmentSelectorDisable?: boolean;
  disableEnvironmentToolTipMessage?: string;
  defaultOpenKeys?: string[];
}

const SubMenu: React.FC<SubMenuProps> = ({
  isOpen,
  showPlusIcon,
  sidebarActiveItemKey,
  subSidebarActiveItemKey,
  subSidebarMenuItems,
  onSubSidebarMenuItemClick,
  onSubSidebarParentMenuItemClick,
  openSubSidebarMenuItems,
  isEnvironmentSelectorVisible,
  environmentSelectDefaultValue,
  onEnvironmentSelectValueChange,
  isEnvironmentSelectorDisable,
  disableEnvironmentToolTipMessage,
}) => {
  const { title, menuItems, openKeys, onOpenChange } = useSubMenuController({
    sidebarActiveItemKey,
    onSubSidebarParentMenuItemClick,
    openSubSidebarMenuItems,
  });

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={
        (subSidebarMenuItems || menuItems).length === 0 ? true : isOpen
      }>
      <div
        className={`sidebar-submenu ${title
          .replace(' ', '-')
          .toLowerCase()}-menu`}>
        <EnvironmentSelector
          isEnvironmentSelectorVisible={isEnvironmentSelectorVisible}
          environmentSelectDefaultValue={environmentSelectDefaultValue}
          onEnvironmentSelectValueChange={onEnvironmentSelectValueChange}
          isEnvironmentSelectorDisable={isEnvironmentSelectorDisable}
          disableEnvironmentToolTipMessage={disableEnvironmentToolTipMessage}
        />
        <h2>{title}</h2>
        <Layout>
          {(sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER ||
          SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL
            ? !isOpen
            : true) && (
            <Menu
              theme="light"
              mode="inline"
              items={subSidebarMenuItems || menuItems}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              selectedKeys={[subSidebarActiveItemKey || '']}
              onClick={onSubSidebarMenuItemClick}
              expandIcon={
                <>
                  {showPlusIcon && (
                    <div className="ant-menu-submenu-arrows">
                      <Button type="link" size="small" className="plusarrow">
                        <PlusArrowIcon />
                      </Button>
                    </div>
                  )}
                </>
              }
            />
          )}
        </Layout>
      </div>
    </Sider>
  );
};

export default SubMenu;
