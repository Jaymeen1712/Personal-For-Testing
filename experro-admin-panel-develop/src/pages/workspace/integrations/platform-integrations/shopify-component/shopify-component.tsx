import useShopifyComponentController from './shopify-component-controller';
import AppInstalledComponent from './components/app-installed-component';
import AboutAppComponent from './components/about-app-component';
import { Route, Switch } from 'react-router-dom';
import AppIntegrationComponent from './components/integration-component';
import StoreField from './components/store-field';
import StatisticsComponent from './components/statistics-component';

const ShopifyComponent = () => {
  const { path } = useShopifyComponentController();
  return (
    <div className="apps-page-main">
      <Switch>
        <Route exact path={`${path}/:id/:categoryId/accept`}>
          <AppIntegrationComponent />
        </Route>
        <Route exact path={`${path}/:id/:categoryId/installed`}>
          <AppInstalledComponent />
        </Route>
        <Route exact path={`${path}/:id/:categoryId/installed/add-store`}>
          <StoreField />
        </Route>
        <Route
          exact
          path={`${path}/:id/:categoryId/installed/:storeId/statistics`}>
          <StatisticsComponent />
        </Route>
        <Route exact path={`${path}/:id/:categoryId`}>
          <AboutAppComponent />
        </Route>
      </Switch>
    </div>
  );
};
export default ShopifyComponent;
