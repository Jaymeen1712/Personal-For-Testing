import React from 'react';
import { Alert, Tabs } from 'antd';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import useListThemeController from './theme-controller';
import SubSideBar from '../../../components/sub-sidebar';
import HeaderListTheme from './header-list-theme';
import ListGeneral from './list/general/list-general';
import ListHistory from './list/history/list-history';

interface IListTheme {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ListTheme: React.FC<IListTheme> = ({ onMainSidebarActiveItem }) => {
  const {
    t,
    isPublishButtonDisabled,
    listEnvironments,
    setIsPublishButtonDisabled,
    themePublishStatus,
    isThemePublished,
    setIsThemePublished,
  } = useListThemeController({
    onMainSidebarActiveItem,
  });

  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.THEME
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        isGlobalPage={false}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <HeaderListTheme t={t} />
        {isPublishButtonDisabled && (
          <Alert
            message={t('common.messages.theme_publishing_in_progress')}
            type="warning"
          />
        )}
        <div className="apperance-theme-tab">
          <Tabs defaultActiveKey="1" className='position-inherit'>
            <Tabs.TabPane tab={t('common.labels.general')} key="1" forceRender>
              <ListGeneral
                listEnvironments={listEnvironments}
                themePublishStatus={themePublishStatus}
                isThemePublished={isThemePublished}
                setIsThemePublished={setIsThemePublished}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.labels.history')} key="2" forceRender>
              <ListHistory
                listEnvironments={listEnvironments}
                isPublishButtonDisabled={isPublishButtonDisabled}
                setIsPublishButtonDisabled={setIsPublishButtonDisabled}
                isThemePublished={isThemePublished}
                setIsThemePublished={setIsThemePublished}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </SubSideBar>
    </div>
  );
};

export default ListTheme;
