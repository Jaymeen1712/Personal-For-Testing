import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar';
import useUserController from './user-controller';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ListUser from './list';
import CreateUpdateUser from './create-update';
import UserDetails from './details';

interface IUser {
  onMainSidebarActiveItem?: (val: string) => void;
}

const User: React.FC<IUser> = ({ onMainSidebarActiveItem }) => {
  const { path } = useUserController({ onMainSidebarActiveItem });

  return (
    <div className="page-wrapper">
      <SubSideBar
        isGlobalPage
        sidebarActiveItemKey={SIDEBAR_KEYS.GLOBAL.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.USERS
        }>
        <Switch>
          <Route exact path={`${path}`}>
            <ListUser />
          </Route>
          <Route exact path={`${path}/create`}>
            <CreateUpdateUser />
          </Route>
          <Route exact path={`${path}/:userId`}>
            <CreateUpdateUser />
          </Route>
          <Route exact path={`${path}/:userId/details`}>
            <UserDetails />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};
export default User;
