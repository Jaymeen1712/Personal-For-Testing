import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SIDEBAR_KEYS } from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar';
import useAudienceController from './audience-controller';
import ListAudience from './list';
import DetailsAudience from './details/audience-details';

interface IAudience {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Audience: React.FC<IAudience> = ({ onMainSidebarActiveItem }) => {
  const {
    environment,
    menuItems,
    onEnvironmentChange,
    path,
    onSubSidebarMenuItemClick,
  } = useAudienceController({ onMainSidebarActiveItem });

  return (
    <SubSideBar
      sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.AUDIENCE}
      subSidebarActiveItemKey={'all-audiance'}
      isGlobalPage={false}
      subSidebarMenuItems={menuItems}
      isEnvironmentSelectorVisible={true}
      onEnvironmentSelectValueChange={onEnvironmentChange}
      onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}>
      <Switch>
        <Route exact path={`${path}`}>
          <ListAudience environment={environment} />
        </Route>
        <Route exact path={`${path}/:audienceId/details`}>
          <DetailsAudience environmentId={environment} />
        </Route>
      </Switch>
    </SubSideBar>
  );
};

export default Audience;
