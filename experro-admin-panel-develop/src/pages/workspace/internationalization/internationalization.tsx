import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar';
import useInternationalizationController from './internationalization-controller';
import HeaderInternationalization from './header-internationalization';
import BannerInternationalization from './banner';
import AddReorderInternationalization from './add-reorder';

interface IInternationalization {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Internationalization: React.FC<IInternationalization> = ({
  onMainSidebarActiveItem,
}) => {
  const { t, path } = useInternationalizationController({
    onMainSidebarActiveItem,
  });

  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.INTERNATIONALIZATION
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <HeaderInternationalization t={t} />
        <Route exact path={`${path}`}>
          <AddReorderInternationalization />
        </Route>
        <Switch>
          <Route exact path={`${path}/intro`}>
            <BannerInternationalization />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default Internationalization;
