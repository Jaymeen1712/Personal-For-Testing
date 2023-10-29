import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar';
import useGroupController from './group-controller';
import ListGroup from './list';
import CreateUpdateGroup from './create-update';

interface IGroup {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Group: React.FC<IGroup> = ({ onMainSidebarActiveItem }) => {
  const { path } = useGroupController({ onMainSidebarActiveItem });

  return (
    <div className="page-wrapper">
      <SubSideBar
        isGlobalPage={true}
        sidebarActiveItemKey={SIDEBAR_KEYS.GLOBAL.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.GROUPS
        }>
        <Switch>
          <Route exact path={`${path}`}>
            <ListGroup />
          </Route>
          <Route exact path={`${path}/create`}>
            <CreateUpdateGroup />
          </Route>
          <Route exact path={`${path}/:groupId`}>
            <CreateUpdateGroup />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default Group;
