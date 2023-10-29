import React from 'react';
import SubSideBar from '../../../../components/sub-sidebar';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../../utills';
import { Route, Switch } from 'react-router-dom';
import usePlatformsController from './platforms-controller';
import PlatformList from './platform-list';
import BigcommerceComponent from './bigcommerce-cmponent';
import ShopifyComponent from './shopify-component/shopify-component';

interface IPlatforms {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Platforms: React.FC<IPlatforms> = ({ onMainSidebarActiveItem }) => {
  const { path, t } = usePlatformsController(onMainSidebarActiveItem);
  return (
    <SubSideBar
      sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
      subSidebarActiveItemKey={
        SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.INTEGRATIONS.PLATFORMS
      }
      isEnvironmentSelectorDisable={true}
      isEnvironmentSelectorVisible={true}
      environmentSelectDefaultValue="All"
      disableEnvironmentToolTipMessage={t(
        'common.messages.environment_is_not_applicable'
      )}>
      <Switch>
        <Route exact path={`${path}/`}>
          <PlatformList />
        </Route>
        <Route path={`${path}/bigcommerce`}>
          <BigcommerceComponent />
        </Route>
        <Route path={`${path}/shopify`}>
          <ShopifyComponent />
        </Route>
      </Switch>
    </SubSideBar>
  );
};

export default Platforms;
