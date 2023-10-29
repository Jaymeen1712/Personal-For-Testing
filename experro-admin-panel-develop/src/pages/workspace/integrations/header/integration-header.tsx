import React, { ReactElement } from 'react';
import { onSidebarToggle } from '../../../../utills';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import { Button, Dropdown, Menu } from 'antd';
import LogoBigIcon from '../../../../images/icons/logo-big-icon';
import ConnectIcon from '../../../../images/icons/connect-icon';
import ArrowLeftIcon from '../../../../images/icons/arrow-left-icon';
import OpenInNewWindowIcon from '../../../../images/icons/open-in-new-window-icon';
import useIntegationHeaderController from './integrations-header-controller';
import { InfoCircleOutlined } from '@ant-design/icons';
import PlusIcon from '../../../../images/icons/plus-icon';
import DeleteIcon from '../../../../images/icons/delete-icon';
import AppIntegrationIcon from '../../../../images/icons/app-integration-icon';

type IIntegrationType = 'platforms' | 'apps';

interface IPlatformHeader {
  isListHeader: boolean;
  type?: IIntegrationType;
  onBackButtonClick?: () => void;
  integrationName?: string;
  onGetThisAppButtonClick?: () => void;
  onAppUninstallButtonClick?: () => void;
  isAppInstalled?: boolean;
  isHideButton?: boolean;
  isAppUninstallIsLoading?: boolean;
  icon?: ReactElement;
  titleText?: string;
  canInstallOrRemoveApp?: boolean;
  onVisitWebsiteButtonClick?: () => void;
  installationGuideLink?: string;
}

const IntegrationsHeader: React.FC<IPlatformHeader> = ({
  isListHeader,
  type,
  integrationName,
  isAppInstalled,
  isAppUninstallIsLoading,
  isHideButton,
  onAppUninstallButtonClick,
  icon,
  onBackButtonClick,
  onGetThisAppButtonClick,
  titleText,
  canInstallOrRemoveApp,
  onVisitWebsiteButtonClick,
  installationGuideLink,
}) => {
  const { t } = useIntegationHeaderController();
  return (
    <>
      {isListHeader ? (
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon" onClick={onSidebarToggle}>
              <HamburgerIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {t(`common.labels.${type}`)}
              </span>
              <span className="ant-page-header-heading-sub-title m-t-4">
                {t(`common.labels.${type}_subtitle`)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="headerinner">
          <div className="ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon ant-row" onClick={onBackButtonClick}>
              <ArrowLeftIcon />
            </div>
            <div className="w-100">
              <span className="ant-page-header-heading-title">
                {integrationName}
              </span>
            </div>
          </div>
          <div className="ant-row ant-row-space-between header-bottom-section">
            {isHideButton ? (
              <div className="headerleft">
                <div className="combine-icon-section">
                  <div className="big-icon">
                    <LogoBigIcon />
                  </div>
                  <div className="connect-icon ant-row">
                    <ConnectIcon />
                  </div>
                  <div className="big-icon">{icon}</div>
                </div>
                <h3 className="m-0">Connect Experro to {titleText}</h3>
                <p className="m-0">
                  There is some description here about the app.
                </p>
              </div>
            ) : (
              <div className="headerleft">
                <div className="ant-row">
                  <div className="m-r-16 single-logo-icon ant-row">{icon}</div>
                  <div>
                    <h2 className="m-0 h6">{titleText}</h2>
                    <p className="m-0 light-gray">
                      By{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.experro.com/">
                        Experro
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isHideButton && (
              <div className="headerright">
                <div className="ant-row ant-row-end ant-space-align-center platforms-action-btn">
                  <Button
                    key="headerVisitWebsite"
                    type="link"
                    icon={<OpenInNewWindowIcon />}
                    onClick={onVisitWebsiteButtonClick}>
                    {t('common.labels.visit_website')}
                  </Button>
                  {isAppInstalled ? (
                    <>
                      <Dropdown
                        placement="bottomRight"
                        trigger={['click']}
                        overlay={
                          <div className="table-dropdown file-action-dropdown">
                            <Menu>
                              <Menu.Item key="installation-guide">
                                <Button
                                  type="text"
                                  target="_blank"
                                  htmlType="button"
                                  key="installation-guide"
                                  href={installationGuideLink}>
                                  {t('common.labels.installation_guide')}
                                </Button>
                              </Menu.Item>
                              {/*<Menu.Item key="user-guide">*/}
                              {/*  <Button*/}
                              {/*    type="text"*/}
                              {/*    target="_blank"*/}
                              {/*    htmlType="button"*/}
                              {/*    key="user-guide"*/}
                              {/*    href={'#'}>*/}
                              {/*    {t('common.labels.user_guide')}*/}
                              {/*  </Button>*/}
                              {/*</Menu.Item>*/}
                              <Menu.Item key="contact-support">
                                <Button
                                  type="text"
                                  target="_blank"
                                  htmlType="button"
                                  key="contact-support"
                                  href={'https://www.experro.com/contact-us/'}>
                                  {t('common.labels.contact_support')}
                                </Button>
                              </Menu.Item>
                            </Menu>
                          </div>
                        }>
                        <Button key="headerHelp" icon={<InfoCircleOutlined />}>
                          {t('Help')}
                        </Button>
                      </Dropdown>
                      <Button
                        loading={isAppUninstallIsLoading}
                        key="headerAddRecord"
                        type="primary"
                        className="delete-icon-btn"
                        danger
                        onClick={() => {
                          onAppUninstallButtonClick &&
                            onAppUninstallButtonClick();
                        }}
                        disabled={
                          canInstallOrRemoveApp !== undefined &&
                          !canInstallOrRemoveApp
                        }
                        icon={<DeleteIcon />}>
                        {t('common.labels.uninstall')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      key="headerAddRecord"
                      type="primary"
                      icon={
                        type === 'platforms' ? (
                          <span className="anticon">
                            <PlusIcon />
                          </span>
                        ) : (
                          <AppIntegrationIcon />
                        )
                      }
                      onClick={() => {
                        onGetThisAppButtonClick && onGetThisAppButtonClick();
                      }}
                      disabled={
                        canInstallOrRemoveApp !== undefined &&
                        !canInstallOrRemoveApp
                      }>
                      {type === 'platforms'
                        ? t('common.labels.add_platform')
                        : t('common.labels.get_this_app')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default IntegrationsHeader;
