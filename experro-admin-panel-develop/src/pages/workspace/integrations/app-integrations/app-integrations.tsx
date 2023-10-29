import { Switch, Route } from 'react-router-dom';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../../utills';
import useAppIntegrationsController from './app-integrations-controller';
import AppList from './app-list';
import ContentfulComponent from './contentful-component';
import AlgoliaComponent from './algolia-component';
import AffirmComponent from './affirm-component';
import SubSideBar from '../../../../components/sub-sidebar';
import React from 'react';
import B2bNinjaComponent from './b2b-ninja-component';
import MailchimpComponent from './mailchimp-component';
import YotpoComponent from './yotpo-component';
import GoogleAnalyticsComponent from './google-analytics-4-component';
import UserwayComponent from './userway-component';
import AcquireComponent from './acquire-component';
import SalesmateComponent from './salesmate-component';
import ContentstackComponent from './contentstack-component';
import KlaviyoComponent from './klaviyo-component';
import StampedComponent from './stamped-component';
import PowerreviewComponent from './powerreview-component';
import BazaarvoiceComponent from './bazzarvoice-component';

interface IAppIntegrations {
  onMainSidebarActiveItem?: (val: string) => void;
}

const AppIntegrations: React.FC<IAppIntegrations> = ({
  onMainSidebarActiveItem,
}) => {
  const { path, t } = useAppIntegrationsController({ onMainSidebarActiveItem });

  return (
    <>
      <div className="page-wrapper">
        <SubSideBar
          sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
          subSidebarActiveItemKey={
            SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.INTEGRATIONS.APPS
          }
          isEnvironmentSelectorVisible={true}
          isEnvironmentSelectorDisable={true}
          environmentSelectDefaultValue={'All'}
          disableEnvironmentToolTipMessage={t(
            'common.messages.environment_is_not_applicable'
          )}>
          <Switch>
            <Route exact path={`${path}/`}>
              <AppList />
            </Route>
            <Route path={`${path}/contentful`}>
              <ContentfulComponent />
            </Route>
            <Route path={`${path}/algolia`}>
              <AlgoliaComponent />
            </Route>
            <Route path={`${path}/affirm_marketing`}>
              <AffirmComponent />
            </Route>
            <Route path={`${path}/b2b_ninja_quote_request_&_management`}>
              <B2bNinjaComponent />
            </Route>
            <Route path={`${path}/mailchimp`}>
              <MailchimpComponent />
            </Route>
            <Route path={`${path}/yotpo`}>
              <YotpoComponent />
            </Route>
            <Route path={`${path}/google_analytics_4`}>
              <GoogleAnalyticsComponent />
            </Route>
            <Route path={`${path}/accessibility_by_userway`}>
              <UserwayComponent />
            </Route>
            <Route path={`${path}/acquire`}>
              <AcquireComponent />
            </Route>
            <Route path={`${path}/salesmate_crm`}>
              <SalesmateComponent />
            </Route>
            <Route path={`${path}/contentstack`}>
              <ContentstackComponent />
            </Route>
            <Route path={`${path}/klaviyo`}>
              <KlaviyoComponent />
            </Route>
            <Route path={`${path}/stamped`}>
              <StampedComponent />
            </Route>
            <Route path={`${path}/power_reviews`}>
              <PowerreviewComponent />
            </Route>
            <Route path={`${path}/bazzar_voice`}>
              <BazaarvoiceComponent />
            </Route>
          </Switch>
        </SubSideBar>
      </div>
    </>
  );
};
export default AppIntegrations;
