import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import useEmailsController from './emails-controller';
import SubSideBar from '../../../components/sub-sidebar';
import ListEmails from './list/list-emails';
import CreateUpdateTemplates from './templates/create-update';

interface IEmails {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Emails: React.FC<IEmails> = ({ onMainSidebarActiveItem }) => {
  const { path, t, onSubSideBarMenuItemClick } = useEmailsController({
    onMainSidebarActiveItem,
  });

  return (
    <>
      <div className="page-wrapper">
        <SubSideBar
          isGlobalPage={false}
          sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
          subSidebarActiveItemKey={
            SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.EMAILS
          }
          isEnvironmentSelectorVisible={true}
          isEnvironmentSelectorDisable={true}
          environmentSelectDefaultValue={'All'}
          disableEnvironmentToolTipMessage={t(
            'common.messages.environment_is_not_applicable'
          )}
          onSubSidebarMenuItemClick={onSubSideBarMenuItemClick}>
          <Switch>
            <Route
              exact
              path={`${path}/:source/:templateId/create-update/:cloned/:masterTemplateId`}>
              <CreateUpdateTemplates />
            </Route>

            <Route path={`${path}`}>
              <ListEmails />
            </Route>
          </Switch>
        </SubSideBar>
      </div>
    </>
  );
};

export default Emails;
