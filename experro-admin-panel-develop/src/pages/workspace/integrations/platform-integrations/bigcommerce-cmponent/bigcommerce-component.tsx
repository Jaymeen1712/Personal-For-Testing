import AppInstalledComponent from './components/app-installed-component';
import AboutAppComponent from './components/about-app-component';
import { Route, Switch } from 'react-router-dom';
// import AppIntegrationComponent from './components/integration-component';
import useBigcommerceComponentController from './bigcommerce-component-controller';
import CreateUpdateBigcommerceStore from './components/bigcommerce-store/create-update';
import DetailsBigcommerceStore from './components/bigcommerce-store/details';

const BigcommerceComponent = () => {
  const { path } = useBigcommerceComponentController();
  return (
    <div className="apps-page-main">
      <Switch>
        {/* <Route exact path={`${path}/:id/:categoryId/accept`}>
          <AppIntegrationComponent />
        </Route> */}
        <Route exact path={`${path}/:id/:categoryId/installed`}>
          <AppInstalledComponent />
        </Route>
        <Route exact path={`${path}/:id/:categoryId/installed/add-store`}>
          <CreateUpdateBigcommerceStore />
        </Route>
        <Route
          exact
          path={`${path}/:id/:categoryId/installed/:storeId/statistics`}>
          <DetailsBigcommerceStore />
        </Route>
        <Route exact path={`${path}/:id/:categoryId`}>
          <AboutAppComponent />
        </Route>
      </Switch>
    </div>
  );
};
export default BigcommerceComponent;
