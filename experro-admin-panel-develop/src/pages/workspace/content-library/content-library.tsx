import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { SIDEBAR_KEYS } from '../../../utills';
import UseContentLibraryController from './content-library-controller';
import NoRecordFound from './common-components/no-record-found';
import {
  CreateUpdateCollectionField,
  ListRecordsCollectionType,
} from './collection-type';
import AddNewRecordBanner from './common-components/add-new-record-banner';
import {
  CreateUpdateSingleField,
  SingleTypeLoaderComponent,
} from './single-type';
import VersionHistoryModule from './common-components/version-history-module';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';

const ContentLibrary: React.FC<{
  onMainSidebarActiveItem?: (val: string) => void;
}> = ({ onMainSidebarActiveItem }) => {
  const {
    menuItems,
    onSubSidebarMenuItemClick,
    selectedContent,
    onSubSidebarOpenChange,
    titleAndSubtitle,
    openSubSidebarMenuItems,
    selectedContentModalDetails,
  } = UseContentLibraryController({ onMainSidebarActiveItem });
  const { path } = useRouteMatch();
  return (
    <div className="content-library-main page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY}
        subSidebarMenuItems={
          menuItems.length > 0
            ? menuItems
            : [
                {
                  key: SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY,
                  label: '',
                  icon: <></>,
                },
              ]
        }
        onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}
        subSidebarActiveItemKey={selectedContent?.id}
        onSubSidebarParentMenuItemClick={onSubSidebarOpenChange}
        openSubSidebarMenuItems={openSubSidebarMenuItems}
        isEnvironmentSelectorVisible={true}
        subTitle={titleAndSubtitle?.subTitle}
        isShowHeader={false}>
        <Switch>
          <Route path={`${path}/collection-type`}>
            <Switch>
              <Route
                exact
                path={`${path}/collection-type/:contentModalId/list-records`}>
                {selectedContentModalDetails && (
                  <ListRecordsCollectionType
                    selectedContentModalDetails={selectedContentModalDetails}
                  />
                )}
              </Route>

              <Route
                exact
                path={`${path}/collection-type/:contentModalId/field/:contentModalDataId/version/:versionId/language/:languageName`}>
                <CreateUpdateCollectionField
                  selectedContentModalDetails={selectedContentModalDetails}
                />
              </Route>

              <Route
                exact
                path={`${path}/collection-type/:contentModalId/field/:contentModalDataId/version/:versionId/language/:languageName/version-history/:currentVersionId`}>
                <VersionHistoryModule
                  selectedContentModalDetails={selectedContentModalDetails}
                />
              </Route>

              <Route exact path={`${path}/collection-type/:contentModalId/`}>
                <AddNewRecordBanner />
              </Route>
            </Switch>
          </Route>

          <Route path={`${path}/single-type`}>
            <Switch>
              <Route
                exact
                path={`${path}/single-type/:contentModalId/field/:contentModalDataId/version/:versionId/language/:languageName`}>
                <CreateUpdateSingleField
                  selectedContentModalDetails={selectedContentModalDetails}
                />
              </Route>

              <Route
                exact
                path={`${path}/single-type/:contentModalId/field/:contentModalDataId/version/:versionId/language/:languageName/version-history/:currentVersionId`}>
                <VersionHistoryModule
                  selectedContentModalDetails={selectedContentModalDetails}
                />
              </Route>

              <Route
                exact
                path={`${path}/single-type/:contentModalId/list-records`}>
                <SingleTypeLoaderComponent
                  selectedContentModalDetails={selectedContentModalDetails}
                />
              </Route>

              <Route exact path={`${path}/single-type/:contentModalId/`}>
                <AddNewRecordBanner />
              </Route>
            </Switch>
          </Route>

          <Route exact path={`${path}/no-model-found`}>
            <NoRecordFound />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default ContentLibrary;
