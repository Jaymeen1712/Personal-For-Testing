import { SIDEBAR_KEYS } from '../../../utills';
import { Route, Switch } from 'react-router-dom';
import React from 'react';
import SubSideBar from '../../../components/sub-sidebar';
import usePersonalizationController from './personalization-controller';
import ListWidgetRule from './list/list-widget-rule';
import UpdateWidgetRule from './update-rule/update-widget-rule';

const PersonalizationNew: React.FC<{
  onMainSidebarActiveItem?: (val: string) => void;
}> = ({ onMainSidebarActiveItem }) => {
  const {
    path,
    location,
    selectedWidget,
    menuItems,
    environment,
    titleSubTitle,
    isEditWidget,
    isEditRule,
    selectedId,
    widgetData,
    customWidgetData,
    onSubSidebarMenuItemClick,
    isAddWidgetModalVisible,
    isDeleteModalVisible,
    onDeleteModalVisible,
    onSetWidgetModalVisible,
    onEnvironmentChange,
    onSetEditWidget,
    onSetEditRule,
    onAddEditRuleModalVisible,
    isAddRuleModalVisible,
  } = usePersonalizationController(onMainSidebarActiveItem);

  return (
    <div
      className={
        location.pathname.search('list-records') !== -1
          ? 'page-wrapper'
          : 'page-wrapper merchandising-content'
      }>
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.PERSONALIZATION}
        subSidebarMenuItems={menuItems}
        onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}
        // onSubSidebarParentMenuItemClick={onSubSidebarParentMenuItemClick}
        subSidebarActiveItemKey={
          menuItems && menuItems.length > 0 ? selectedWidget?.id : ''
        }
        openSubSidebarMenuItems={['widget', 'custom-widget']}
        title={titleSubTitle?.title}
        subTitle={titleSubTitle?.subTitle}
        isEnvironmentSelectorVisible={true}
        onEnvironmentSelectValueChange={onEnvironmentChange}>
        <Switch>
          <Route path={`${path}/:parentMenu/:subMenu/list-records`}>
            <ListWidgetRule
              selectedWidget={selectedWidget}
              selectedId={selectedId}
              titleSubTitle={titleSubTitle}
              isEditWidget={isEditWidget}
              isEditRule={isEditRule}
              isAddRuleModalVisible={isAddRuleModalVisible}
              environment={environment}
              widgetData={widgetData}
              customWidgetData={customWidgetData}
              isAddWidgetModalVisible={isAddWidgetModalVisible}
              isDeleteModalVisible={isDeleteModalVisible}
              onDeleteModalVisible={onDeleteModalVisible}
              onSetWidgetModalVisible={onSetWidgetModalVisible}
              onSetEditWidget={onSetEditWidget}
              onSetEditRule={onSetEditRule}
              onAddEditRuleModalVisible={onAddEditRuleModalVisible}
            />
          </Route>
          <Route
            path={`${path}/:parentMenu/:subMenu/create-edit/:versionId/:contentModalId/:contentModalDataId/:environmentId`}>
            <UpdateWidgetRule
              selectedWidget={selectedWidget}
              isEditRule={isEditRule}
              onSetEditRule={onSetEditRule}
              isAddRuleModalVisible={isAddRuleModalVisible}
              onAddEditRuleModalVisible={onAddEditRuleModalVisible}
            />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default PersonalizationNew;
