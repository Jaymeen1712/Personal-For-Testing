import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';

import SubMenu from './sub-menu';
import useSubSidebarController from './sub-sidebar-controller';

import './header.scss';
import './user.scss';
// import DownArrowIcon from '../../images/icons/arrow-left-icon';

const { Content } = Layout;

interface PageProps {
  title?: string | ReactNode;
  subTitle?: string | false | null;
  header?: ReactNode;
  children?: ReactNode;
  showPlusIcon?: boolean;
  isGlobalPage?: boolean;
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
  hideMenu?: boolean;
  pathName?: string;
  isShowHeader?: boolean;
  isEnvironmentSelectorVisible?: boolean;
  environmentSelectDefaultValue?: string;
  onEnvironmentSelectValueChange?: (val: string) => void;
  isEnvironmentSelectorDisable?: boolean;
  onBackButtonClick?: () => void;
  showSubmenuIcon?: boolean;
  isSubSidebarClose?: boolean;
  openCloseSidebar?: (val: () => void) => void;
  disableEnvironmentToolTipMessage?: string;
  defaultOpenKeys?: string[];
}

const SubSideBar: React.FC<PageProps> = ({
  title,
  subTitle,
  header,
  children,
  showPlusIcon = false,
  isGlobalPage = false,
  sidebarActiveItemKey,
  subSidebarActiveItemKey,
  subSidebarMenuItems,
  onSubSidebarMenuItemClick,
  onSubSidebarParentMenuItemClick,
  openSubSidebarMenuItems,
  hideMenu,
  pathName,
  isShowHeader = true,
  isEnvironmentSelectorVisible,
  environmentSelectDefaultValue,
  onEnvironmentSelectValueChange,
  isEnvironmentSelectorDisable,
  onBackButtonClick,
  showSubmenuIcon = true,
  isSubSidebarClose,
  openCloseSidebar,
  disableEnvironmentToolTipMessage,
}) => {
  // const { isOpen, toggleMenu } = usePageController();

  const { isSidebarClose } = useSubSidebarController();

  return (
    <>
      <div
        className={`submenu ${
          isSubSidebarClose || isSidebarClose ? 'sidebar-close' : ''
        }`}>
        <SubMenu
          isOpen={false}
          showPlusIcon={showPlusIcon}
          sidebarActiveItemKey={sidebarActiveItemKey}
          subSidebarActiveItemKey={subSidebarActiveItemKey}
          subSidebarMenuItems={subSidebarMenuItems}
          onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}
          onSubSidebarParentMenuItemClick={onSubSidebarParentMenuItemClick}
          openSubSidebarMenuItems={openSubSidebarMenuItems}
          isEnvironmentSelectorVisible={isEnvironmentSelectorVisible}
          environmentSelectDefaultValue={environmentSelectDefaultValue}
          onEnvironmentSelectValueChange={onEnvironmentSelectValueChange}
          isEnvironmentSelectorDisable={isEnvironmentSelectorDisable}
          disableEnvironmentToolTipMessage={disableEnvironmentToolTipMessage}
        />
      </div>
      <Layout>
        <Content>{children}</Content>
      </Layout>
    </>
  );
};

export default SubSideBar;
