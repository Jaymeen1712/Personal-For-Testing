import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Avatar, Button, Form, Tooltip, Typography } from 'antd';
import Cookies from 'js-cookie';

import ContentIcon from '../../images/icons/content-icon';
import ContentSolidIcon from '../../images/icons/content-solid-icon';
import SettingsIcon from '../../images/icons/settings-icon';
import SettingsSolidIcon from '../../images/icons/settings-solid-icon';
import DashboardIcon from '../../images/icons/dashboard-icon';
import DashboardSolidIcon from '../../images/icons/dashboard-solid-icon';
import ContentModelIcon from '../../images/icons/contentmodel-icon';
import ContentModelSolidIcon from '../../images/icons/contentmodel-solid-icon';
import MediaLibraryIcon from '../../images/icons/medialibrary-icon';
import MediaLibrarySolidIcon from '../../images/icons/medialibrary-solid-icon';
// import MerchandisingIcon from '../../images/icons/merchandising-icon';
// import MerchandisingSolidIcon from '../../images/icons/merchandising-solid-icon';
import CopyIcon from '../../images/icons/copy-icon';
import DownArrowIcon from '../../images/icons/downarrow-icon';
import WorkspacesIcon from '../../images/icons/workspace-icon';
import WorkspacesSolidIcon from '../../images/icons/workspace-solid-icon';
import SwitchIcon from '../../images/icons/switch-icon';
import AudienceIcon from '../../images/icons/audience-icon';
import AudienceSolidIcon from '../../images/icons/audience-solid-icon';
// import BellIcon from '../../../images/icons/bell-icon';
// import PersonalizationIcon from '../../../images/icons/personalization-icon';
// import PersonalizationSolidIcon from '../../../images/icons/personalization-solid-icon';
import usePermissions from '../../hooks/permissions';
import { useWorkspaces } from '../../apis/authentication';
import useUser from '../../hooks/user';
import {
  API_QUERY_KEY,
  USER_ACCESS_KEY,
  SIDEBAR_KEYS,
  APIS_ROUTES,
  removeCookies,
  openNotificationWithIcon,
  avatarColorCode,
  NUMBER_REGEX_PATTERN,
  allowSpecificDomain,
} from '../../utills';
import { ILinkData, IMenuItem } from '../../types';
import queryClient from '../../query-client';
import { useTranslation } from 'react-i18next';
import { useSwitchWorkspace } from '../../apis/workspace';
import {
  useLinksOrganization,
  useTokenOrganization,
} from '../../apis/organization';
import useLogout from '../../apis/logout';
import {
  useValidateAuthAppCodeTwoFactorAuthentication,
  useValidateInternalEmailCodeTwoFactorAuthentication,
  useValidateInternalRecoveryKey,
  useResendInternalEmailCodeTwoFactorAuthentication,
} from '../../apis/two-factor-authentication';
import useError from '../../hooks/error';
import PersonalizationSolidIcon from '../../images/icons/personalization-solid-icon';
import PersonalizationIcon from '../../images/icons/personalization-icon';
import DiscoverySolidIcon from '../../images/icons/discovery-solid-icon';
import DiscoveryIcon from '../../images/icons/discovery-icon';

const { Paragraph } = Typography;

const useMenuController = ({
  isGlobalPage,
  sidebarActiveItemKey,
}: {
  isGlobalPage: boolean;
  sidebarActiveItemKey: string;
}) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const history = useHistory();

  const [form] = Form.useForm();
  const [twoFactorUsingEmail] = Form.useForm();
  const [twoFactorAuthenticationUsingAuthApp] = Form.useForm();

  const [isLogout, setIsLogout] = useState<boolean>(false);
  const [newWorkspaceId, setNewWorkspaceId] = useState('');
  const [selectedOrganizationData, setSelectedOrganizationData] =
    useState<ILinkData>();
  const [
    isVisibleSwitchOrganizationModal,
    setIsVisibleSwitchOrganizationModal,
  ] = useState<boolean>(false);
  const [isSwitchButtonVisible, setIsSwitchButtonVisible] =
    useState<boolean>(false);
  const [newAccessToken, setNewAccessToken] = useState<string | undefined>('');
  const [authenticationUsingEmail, setAuthenticationUsingEmail] =
    useState<boolean>(false);
  const [authenticationUsingApp, setAuthenticationUsingApp] =
    useState<boolean>(false);
  const [authenticationUsingBoth, setAuthenticationUsingBoth] =
    useState<boolean>(false);
  const [preference, setPreference] = useState<string>('');
  const [isResendInvitationCode, setIsResendInvitationCode] =
    useState<boolean>(false);
  const [sendInitialMail, setSendInitialMail] = useState<boolean>(false);
  const [isRecoveryKeyVisible, setIsRecoveryKeyVisible] =
    useState<boolean>(false);

  const subscriptionModuleList = [
    'dashboard',
    'content_model',
    'merchandising',
    'content_library',
    'media_manager',
  ];

  const permissions = usePermissions();
  const user = useUser();
  const workspaces = useWorkspaces();
  const switchWorkspace = useSwitchWorkspace();
  const linksOrganization = useLinksOrganization();
  const tokenOrganization = useTokenOrganization();
  const logout = useLogout(isLogout);

  const validateInternalEmailCodeTwoFactorAuthentication =
    useValidateInternalEmailCodeTwoFactorAuthentication();
  const validateAuthAppCodeTwoFactorAuthentication =
    useValidateAuthAppCodeTwoFactorAuthentication();
  const validateInternalRecoveryKey = useValidateInternalRecoveryKey();
  const resendInternalEmailCodeTwoFactorAuthentication =
    useResendInternalEmailCodeTwoFactorAuthentication(
      isResendInvitationCode,
      sendInitialMail,
      newAccessToken
    );

  useEffect(() => {
    if (validateInternalEmailCodeTwoFactorAuthentication.isError) {
      if (
        validateInternalEmailCodeTwoFactorAuthentication.error.response.data
          .Error?.code === 'EX-00161'
      ) {
        openNotificationWithIcon('error', t('common.messages.invalid_otp'));
      }
      if (
        validateInternalEmailCodeTwoFactorAuthentication.error.response.data
          .Error?.code === 'EX-00162'
      ) {
        openNotificationWithIcon('error', t('common.messages.otp_expired'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateInternalEmailCodeTwoFactorAuthentication.isError, t]);

  useEffect(() => {
    if (validateInternalRecoveryKey.isError) {
      if (
        validateInternalRecoveryKey.error.response.data.Error?.code ===
        'EX-00163'
      ) {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_recovery_code')
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateInternalRecoveryKey.isError, t]);

  useError({
    mutation: validateAuthAppCodeTwoFactorAuthentication,
    entity: t('common.labels.auth_code'),
  });

  useError({
    mutation: tokenOrganization,
  });

  const onTenantClick = () => {
    form.resetFields();
    setIsVisibleSwitchOrganizationModal(true);
  };

  const currentWorkspace = useMemo(() => {
    return workspaces.data?.find((workspace) => workspace.id === workspaceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces.data, workspaceId]);

  const menuItems = useMemo(() => {
    const menuItems = [] as IMenuItem[];

    if (isGlobalPage) {
      if (
        workspaces.isSuccess &&
        workspaces.data &&
        workspaces.data.length > 0
      ) {
        menuItems.push({
          key: SIDEBAR_KEYS.GLOBAL.WORKSPACE,
          label: t('common.labels.workspaces'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.GLOBAL.WORKSPACE ? (
              <WorkspacesSolidIcon />
            ) : (
              <WorkspacesIcon />
            ),
        });
      }
      menuItems.push({
        key: 'separator-0',
        label: '',
        className: 'separator',
      });
      if (permissions.canManageGlobalUserAndSecurity()) {
        menuItems.push({
          key: SIDEBAR_KEYS.GLOBAL.SETTINGS,
          label: t('common.labels.settings'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.GLOBAL.SETTINGS ? (
              <SettingsSolidIcon />
            ) : (
              <SettingsIcon />
            ),
        });
      }
    } else {
      if (
        permissions.canAccessDashboard() &&
        subscriptionModuleList.includes('dashboard')
      ) {
        menuItems.push({
          key: SIDEBAR_KEYS.WORKSPACE.DASHBOARD,
          label: t('common.labels.dashboard'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.DASHBOARD ? (
              <DashboardSolidIcon />
            ) : (
              <DashboardIcon />
            ),
        });
      }
      menuItems.push({
        key: 'separator-1',
        label: '',
        className: 'separator',
      });
      if (subscriptionModuleList.includes('content_library')) {
        menuItems.push({
          key: SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY,
          label: t('common.labels.content_library'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY ? (
              <ContentSolidIcon />
            ) : (
              <ContentIcon />
            ),
        });
      }
      if (subscriptionModuleList.includes('content_model')) {
        menuItems.push({
          key: SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL,
          label: t('common.labels.content_model'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL ? (
              <ContentModelSolidIcon />
            ) : (
              <ContentModelIcon />
            ),
        });
      }
      if (
        permissions.canAccessMediaManager() &&
        subscriptionModuleList.includes('media_manager')
      ) {
        menuItems.push({
          key: SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER,
          label: t('common.labels.media_manager'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER ? (
              <MediaLibrarySolidIcon />
            ) : (
              <MediaLibraryIcon />
            ),
        });
      }
      menuItems.push({
        key: 'separator-2',
        label: '',
        className: 'separator',
      });

      if (allowSpecificDomain(user?.user?.email)) {
        if (permissions.canAccessPersonalization()) {
          menuItems.push({
            key: SIDEBAR_KEYS.WORKSPACE.PERSONALIZATION,
            label: t('common.labels.personalization'),
            icon:
              sidebarActiveItemKey ===
              SIDEBAR_KEYS.WORKSPACE.PERSONALIZATION ? (
                <PersonalizationSolidIcon />
              ) : (
                <PersonalizationIcon />
              ),
          });
        }
      }
      if (
        permissions.canAccessMerchandising() &&
        subscriptionModuleList.includes('merchandising')
      ) {
        menuItems.push({
          key: SIDEBAR_KEYS.WORKSPACE.MERCHANDISING,
          // label: t('common.labels.merchandising'),
          label: t('common.labels.discovery'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.MERCHANDISING ? (
              // <MerchandisingSolidIcon />
              <DiscoverySolidIcon />
            ) : (
              // <MerchandisingIcon />
              <DiscoveryIcon />
            ),
        });
      }
      // TODO: temporary removed
      // if (permissions.canAccessAudience()) {
      // if (user?.user?.email === 'hardik@rapidops.com') {
      //   menuItems.push({
      //     key: SIDEBAR_KEYS.WORKSPACE.AUDIENCE,
      //     label: t('common.labels.audience'),
      //     icon:
      //       sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.AUDIENCE ? (
      //         <AudienceSolidIcon />
      //       ) : (
      //         <AudienceIcon />
      //       ),
      //   });
      // }

      if (allowSpecificDomain(user?.user?.email)) {
        if (permissions.canReadAudience()) {
          menuItems.push({
            key: SIDEBAR_KEYS.WORKSPACE.AUDIENCE,
            label: t('common.labels.audience'),
            icon:
              sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.AUDIENCE ? (
                <AudienceSolidIcon />
              ) : (
                <AudienceIcon />
              ),
          });
        }
      }

      menuItems.push({
        key: 'separator-3',
        label: '',
        className: 'separator',
      });

      if (permissions.canAccessSettings()) {
        menuItems.push({
          key: SIDEBAR_KEYS.WORKSPACE.SETTINGS,
          label: t('common.labels.settings'),
          icon:
            sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.SETTINGS ? (
              <SettingsSolidIcon />
            ) : (
              <SettingsIcon />
            ),
        });
      }
    }

    return menuItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGlobalPage, permissions, t, sidebarActiveItemKey, workspaces.data]);

  const userMenuItems = useMemo(() => {
    const userMenuItem = [] as IMenuItem[];

    if (
      !isGlobalPage ||
      (isGlobalPage &&
        linksOrganization.data &&
        linksOrganization.data.items.length > 0)
    ) {
      userMenuItem.push({
        key: SIDEBAR_KEYS.USER.WORKSPACE,
        popupClassName: 'workspacePopupMenu',
        label: currentWorkspace?.name ? currentWorkspace?.name : '',
        icon: (
          <Avatar
            shape="square"
            style={{ color: '#DB2777', backgroundColor: '#FDF2F8' }}>
            {currentWorkspace?.name?.[0]
              ? currentWorkspace?.name?.[0]
              : !workspaces.isFetching &&
                t('common.labels.global').charAt(0).toUpperCase()}
          </Avatar>
        ),
        children: [
          ...(((!isGlobalPage ||
            (permissions.canManageGlobalUserAndSecurity() &&
              isGlobalPage &&
              !menuItems.find((item) => item.key === 'global.workspace') &&
              workspaces.data &&
              workspaces.data.length > 0)) &&
            workspaces.data?.map((workspace) => ({
              className: `${workspaceId === workspace.id ? 'active' : ''}`,
              label: (
                <Paragraph
                  copyable={{
                    text: `https://${window.location.host}/workspaces/${workspace.id}/dashboard/traffic`,
                    icon: <CopyIcon />,
                    tooltips: ['Copy link', 'Link copied!'],
                  }}>
                  <span className="workspace-menu-title" title={workspace.name}>
                    {workspace.name}
                  </span>
                </Paragraph>
              ),
              key: workspace.id,
            }))) ||
            []),
        ],
      });

      if (
        workspaces.isSuccess &&
        workspaces.data &&
        workspaces.data.length > 0 &&
        !isGlobalPage
      ) {
        userMenuItem[0].children = [
          ...(userMenuItem[0].children || []),
          {
            label: (
              <div className="workspace-menu-left-arrow-text active">
                <DownArrowIcon /> {t('common.labels.all_workspaces')}
              </div>
            ),
            key: SIDEBAR_KEYS.USER.ALL_WORKSPACE,
            className: 'worksplaceMenuItemAll',
          },
        ];

        // TODO: temporarily commented
        // userMenuItem[0].children?.push({
        //   label: (
        //     <Button type="link" href="/workspaces">
        //       + {t('common.labels.add_new_workspace')}
        //     </Button>
        //   ),
        //   key: '',
        // });
      }

      userMenuItem[0].children = [
        {
          label: (
            <div
              onClick={(e) => e.stopPropagation()}
              className="organization-text-inner">
              <Tooltip
                placement="top"
                title={
                  selectedOrganizationData && selectedOrganizationData.name
                }>
                <div className="organization-name">
                  {selectedOrganizationData && selectedOrganizationData.name}
                </div>
              </Tooltip>

              {linksOrganization.data &&
                linksOrganization.data.items.length > 1 && (
                  <Tooltip
                    placement="top"
                    title={t('common.labels.switch_organization')}>
                    <Button
                      type="default"
                      size="small"
                      className="on-hover"
                      icon={<SwitchIcon />}
                      onClick={onTenantClick}
                      style={{ float: 'right' }}
                    />
                  </Tooltip>
                )}
            </div>
          ),
          className: 'organization-text',
          key: SIDEBAR_KEYS.USER.TENANT,
        },
        ...(userMenuItem[0].children || []),
      ];
    }
    userMenuItem.push({
      key: 'separator-4',
      label: '',
      className: 'separator',
    });

    // TODO: temporarily commented

    // userMenuItem.push({
    //   key: SIDEBAR_KEYS.USER.NOTIFICATION,
    //   label: t('common.labels.notifications'),
    //   icon: <BellIcon />,
    // });

    userMenuItem.push({
      key: SIDEBAR_KEYS.USER.USER,
      popupClassName: 'userPopupMenu',
      label: `${user?.user?.firstName || ''} ${user?.user?.lastName || ''}`,
      icon: user?.user?.isProfileImage ? (
        <Avatar
          src={`${process.env.REACT_APP_API_URL}${
            APIS_ROUTES.PROFILE_IMAGE_THUMBNAIL
          }/image-thumbnail?width=32&height=32&&content_type=url&random=${new Date().getTime()}&url=${
            user.user?.profileUrl
          }`}
        />
      ) : (
        <Avatar
          key={user?.user && user.user.firstName}
          className={`avatar-${avatarColorCode(user && user.user?.firstName)}`}>
          {user?.user?.firstName
            .charAt(0)
            .toUpperCase()
            .concat(
              user?.user?.lastName
                ? user.user?.lastName.charAt(0).toUpperCase()
                : user?.user?.firstName.charAt(1).toUpperCase()
            )}
          {/*{`${user?.user?.firstName?.charAt(0).toUpperCase() || ''}${*/}
          {/*  user?.user?.lastName?.charAt(0).toUpperCase() || ''*/}
          {/*}`}*/}
        </Avatar>
      ),
      children: [],
    });

    if (!isGlobalPage && permissions.canManageGlobalUserAndSecurity()) {
      userMenuItem[userMenuItem.length - 1].children?.push({
        label: t('common.labels.admin_console'),
        key: SIDEBAR_KEYS.USER.ADMIN,
        className: 'admin-console-text',
      });
    }

    if (!isGlobalPage) {
      userMenuItem[userMenuItem.length - 1].children?.push({
        label: t('common.labels.my_account'),
        key: SIDEBAR_KEYS.USER.ACCOUNT,
      });
    }

    userMenuItem[userMenuItem.length - 1].children?.push({
      label: t('common.labels.logout'),
      key: SIDEBAR_KEYS.USER.LOGOUT,
    });

    return userMenuItem;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentWorkspace,
    isGlobalPage,
    workspaces.data,
    user,
    t,
    selectedOrganizationData,
    workspaces.isSuccess,
  ]);

  const onMenuItemClick = async (menuItem: MenuInfo) => {
    let link = `/workspaces/${workspaceId}`;

    switch (menuItem.key) {
      case SIDEBAR_KEYS.GLOBAL.WORKSPACE:
      case SIDEBAR_KEYS.USER.ALL_WORKSPACE:
        link = '/workspaces';
        break;
      case SIDEBAR_KEYS.GLOBAL.SETTINGS:
      case SIDEBAR_KEYS.USER.ADMIN:
        link = '/users';
        break;
      case SIDEBAR_KEYS.USER.LOGOUT:
        setIsLogout(true);
        logout.remove();
        link = '';
        break;
      case SIDEBAR_KEYS.WORKSPACE.DASHBOARD:
        link += '/dashboard/traffic';
        break;
      case SIDEBAR_KEYS.WORKSPACE.SETTINGS:
        link += '/workspace';
        break;
      case SIDEBAR_KEYS.USER.ACCOUNT:
        link += '/profile';
        break;
      case SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL:
        link += '/content-model';
        break;
      case SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER:
        link += '/media-manager';
        break;

      case SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY:
        link += '/content-library';
        break;

      case SIDEBAR_KEYS.WORKSPACE.MERCHANDISING:
        link += '/discovery';
        break;

      case SIDEBAR_KEYS.WORKSPACE.PERSONALIZATION:
        link += '/personalization';
        break;

      case SIDEBAR_KEYS.WORKSPACE.AUDIENCE:
        link += '/audience';
        break;
    }

    if (
      menuItem.keyPath.length === 2 &&
      menuItem.keyPath[1] === SIDEBAR_KEYS.USER.WORKSPACE &&
      menuItem.key !== SIDEBAR_KEYS.USER.ALL_WORKSPACE
    ) {
      if (
        workspaces.data &&
        (!isGlobalPage ? workspaces.data.length > 1 : workspaces.data.length) &&
        workspaceId !== menuItem.key
      ) {
        queryClient.clear();
        switchWorkspace.mutate(menuItem.key);
        setNewWorkspaceId(menuItem.key);
        Cookies.remove('pageEditorPopUp');
        removeCookies();
      }
    } else if (link) {
      // queryClient.clear();
      history.push(link);
      removeCookies();
    }
  };

  const hideSwitchOrganizationModal = async () => {
    const { organization } = await form.validateFields();

    if (organization !== selectedOrganizationData?.id) {
      form.resetFields();
      setIsSwitchButtonVisible(false);
    }

    setIsVisibleSwitchOrganizationModal(false);
  };

  const onSubmitOrganization = async () => {
    const values = await form.validateFields();

    const tempSwitchedOrganizationData = linksOrganization.data?.items.filter(
      (link) => link.id === values.organization
    );

    if (
      tempSwitchedOrganizationData &&
      tempSwitchedOrganizationData.length > 0 &&
      user?.user?.email
    ) {
      Cookies.set(
        USER_ACCESS_KEY.TENANT_ID,
        tempSwitchedOrganizationData[0].id,
        { secure: true, sameSite: 'lax' }
      );
      tokenOrganization.mutate({
        username: user?.user?.email,
        linkName: tempSwitchedOrganizationData[0].linkName,
      });
    } else {
      openNotificationWithIcon('error', t('common.messages.tenant_not_exist'));
    }
  };

  const onSwitchOrganization = (value: string) => {
    if (value !== selectedOrganizationData?.id) {
      setIsSwitchButtonVisible(true);
    } else {
      setIsSwitchButtonVisible(false);
    }
  };

  const onTwoFactorAuthenticationUsingEmail = async () => {
    const values = await twoFactorUsingEmail.validateFields();

    if (values.emailCode.trim().length === 0) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.emailCode.trim().length > 6) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.auth_code'),
            }),
          ],
        },
      ]);
    } else if (values.emailCode.trim().length < 6) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [t('common.messages.code_minimum_length')],
        },
      ]);
    } else if (
      values.emailCode !== undefined &&
      values.emailCode !== null &&
      values.emailCode.trim().length > 0 &&
      !NUMBER_REGEX_PATTERN.test(values.emailCode)
    ) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.auth_code'),
            }),
          ],
        },
      ]);
    } else {
      values['accessToken'] = newAccessToken;
      validateInternalEmailCodeTwoFactorAuthentication.mutate(values);
    }
  };

  const onResendCode = () => {
    setIsResendInvitationCode(true);
    setSendInitialMail(false);
    resendInternalEmailCodeTwoFactorAuthentication.refetch();
  };

  const onHideEmailAuthentication = () => {
    if (authenticationUsingEmail) {
      setAuthenticationUsingEmail(false);
    }
    twoFactorUsingEmail.resetFields();

    queryClient.refetchQueries([API_QUERY_KEY.ENVIRONMENTS_LIST, workspaceId]);
    queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
    queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
    queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
  };

  const onSwitchToAuthAppAuthentication = () => {
    setPreference('authenticator_app');
    twoFactorAuthenticationUsingAuthApp.resetFields();
  };

  const onTwoFactorAuthenticationUsingApp = async () => {
    const values = await twoFactorAuthenticationUsingAuthApp.validateFields();

    if (values.authAppCode) {
      if (values.authAppCode.trim().length === 0) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (values.authAppCode.trim().length > 6) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.auth_code'),
              }),
            ],
          },
        ]);
      } else if (values.authAppCode.trim().length < 6) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [t('common.messages.code_minimum_length')],
          },
        ]);
      } else if (
        values.authAppCode !== undefined &&
        values.authAppCode !== null &&
        values.authAppCode.trim().length > 0 &&
        !NUMBER_REGEX_PATTERN.test(values.authAppCode)
      ) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [
              t('common.messages.format', {
                entity: t('common.labels.auth_code'),
              }),
            ],
          },
        ]);
      } else {
        validateAuthAppCodeTwoFactorAuthentication.mutate(values);
      }
    } else {
      if (values.recoveryCode && values.recoveryCode.trim().length === 0) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'recoveryCode',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (
        values.recoveryCode &&
        values.recoveryCode.split(' ').join('').length > 24
      ) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'recoveryCode',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.recovery_key'),
              }),
            ],
          },
        ]);
      } else if (
        values.recoveryCode &&
        values.recoveryCode.split(' ').join('').length < 24
      ) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'recoveryCode',
            errors: [t('common.messages.recovery_key_min_length')],
          },
        ]);
      } else {
        values.recoveryCode = values.recoveryCode?.split(' ').join('');
        values['accessToken'] = newAccessToken;
        validateInternalRecoveryKey.mutate(values);
      }
    }
  };

  const onHideAppAuthentication = () => {
    if (authenticationUsingApp) {
      setAuthenticationUsingApp(false);
    }

    twoFactorAuthenticationUsingAuthApp.resetFields();

    queryClient.refetchQueries([API_QUERY_KEY.ENVIRONMENTS_LIST, workspaceId]);
    queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
    queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
    queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
  };

  const onGoBack = () => {
    twoFactorAuthenticationUsingAuthApp.resetFields();
    setIsRecoveryKeyVisible(false);
  };

  const onAuthenticateUsingRecoverykey = () => {
    twoFactorAuthenticationUsingAuthApp.resetFields();
    setIsRecoveryKeyVisible(true);
  };

  const onSwitchToAuthEmailAuthentication = () => {
    setPreference('email');
    setIsRecoveryKeyVisible(false);
    setIsResendInvitationCode(true);
    setSendInitialMail(true);
    twoFactorUsingEmail.resetFields();
  };

  const onHideBothAuthentication = () => {
    if (authenticationUsingBoth) {
      setAuthenticationUsingBoth(false);
      setPreference('');
    }

    twoFactorUsingEmail.resetFields();
    twoFactorAuthenticationUsingAuthApp.resetFields();

    queryClient.refetchQueries([API_QUERY_KEY.ENVIRONMENTS_LIST, workspaceId]);
    queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
    queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
    queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
  };

  const onTwoFactorAuthenticationUsingBoth = async () => {
    const emailFormValue = await twoFactorUsingEmail.validateFields();
    const authAppFormValue =
      await twoFactorAuthenticationUsingAuthApp.validateFields();

    if (emailFormValue.emailCode) {
      if (emailFormValue.emailCode.trim().length === 0) {
        twoFactorUsingEmail.setFields([
          {
            name: 'emailCode',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (emailFormValue.emailCode.trim().length > 6) {
        twoFactorUsingEmail.setFields([
          {
            name: 'emailCode',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.auth_code'),
              }),
            ],
          },
        ]);
      } else if (emailFormValue.emailCode.trim().length < 6) {
        twoFactorUsingEmail.setFields([
          {
            name: 'emailCode',
            errors: [t('common.messages.code_minimum_length')],
          },
        ]);
      } else if (
        emailFormValue.emailCode !== undefined &&
        emailFormValue.emailCode !== null &&
        emailFormValue.emailCode.trim().length > 0 &&
        !NUMBER_REGEX_PATTERN.test(emailFormValue.emailCode)
      ) {
        twoFactorUsingEmail.setFields([
          {
            name: 'emailCode',
            errors: [
              t('common.messages.format', {
                entity: t('common.labels.auth_code'),
              }),
            ],
          },
        ]);
      } else {
        emailFormValue['accessToken'] = newAccessToken;
        validateInternalEmailCodeTwoFactorAuthentication.mutate(emailFormValue);
      }
    } else {
      if (authAppFormValue.authAppCode) {
        if (authAppFormValue.authAppCode.trim().length === 0) {
          twoFactorAuthenticationUsingAuthApp.setFields([
            {
              name: 'authAppCode',
              errors: [t('common.messages.please_provide')],
            },
          ]);
        } else if (authAppFormValue.authAppCode.trim().length > 6) {
          twoFactorAuthenticationUsingAuthApp.setFields([
            {
              name: 'authAppCode',
              errors: [
                t('common.messages.max_length', {
                  entity: t('common.labels.auth_code'),
                }),
              ],
            },
          ]);
        } else if (authAppFormValue.authAppCode.trim().length < 6) {
          twoFactorAuthenticationUsingAuthApp.setFields([
            {
              name: 'authAppCode',
              errors: [t('common.messages.code_minimum_length')],
            },
          ]);
        } else if (
          authAppFormValue.authAppCode !== undefined &&
          authAppFormValue.authAppCode !== null &&
          authAppFormValue.authAppCode.trim().length > 0 &&
          !NUMBER_REGEX_PATTERN.test(authAppFormValue.authAppCode)
        ) {
          twoFactorAuthenticationUsingAuthApp.setFields([
            {
              name: 'authAppCode',
              errors: [
                t('common.messages.format', {
                  entity: t('common.labels.auth_code'),
                }),
              ],
            },
          ]);
        } else {
          validateAuthAppCodeTwoFactorAuthentication.mutate(authAppFormValue);
        }
      } else {
        if (
          authAppFormValue.recoveryCode &&
          authAppFormValue.recoveryCode.trim().length === 0
        ) {
          twoFactorAuthenticationUsingAuthApp.setFields([
            {
              name: 'recoveryCode',
              errors: [t('common.messages.please_provide')],
            },
          ]);
        } else if (
          authAppFormValue.recoveryCode &&
          authAppFormValue.recoveryCode.split(' ').join('').length > 24
        ) {
          twoFactorAuthenticationUsingAuthApp.setFields([
            {
              name: 'recoveryCode',
              errors: [
                t('common.messages.max_length', {
                  entity: t('common.labels.recovery_key'),
                }),
              ],
            },
          ]);
        } else if (
          authAppFormValue.recoveryCode &&
          authAppFormValue.recoveryCode.split(' ').join('').length < 24
        ) {
          twoFactorAuthenticationUsingAuthApp.setFields([
            {
              name: 'recoveryCode',
              errors: [t('common.messages.recovery_key_min_length')],
            },
          ]);
        } else {
          authAppFormValue.recoveryCode = authAppFormValue.recoveryCode
            ?.split(' ')
            .join('');
          authAppFormValue['accessToken'] = newAccessToken;
          validateInternalRecoveryKey.mutate(authAppFormValue);
        }
      }
    }
  };

  useEffect(() => {
    if (
      currentWorkspace !== undefined &&
      currentWorkspace &&
      currentWorkspace.storeLink
    ) {
      Cookies.set(USER_ACCESS_KEY.STORE_LINK, currentWorkspace.storeLink);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (switchWorkspace.isSuccess) {
      localStorage.clear();
      localStorage.removeItem('environmentId');

      removeCookies();
      openNotificationWithIcon(
        'success',
        t('common.messages.workspace_switched_successfully')
      );
      history.push(`/workspaces/${newWorkspaceId}/dashboard/traffic`);
    }
  }, [
    t,
    switchWorkspace.isSuccess,
    history,
    newWorkspaceId,
    switchWorkspace.data?.message,
  ]);

  useEffect(() => {
    if (isLogout && logout.isSuccess) {
      queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
      setIsLogout(false);
      Cookies.remove(USER_ACCESS_KEY.TOKEN);
      Cookies.remove(USER_ACCESS_KEY.TENANT_ID);
      Cookies.remove(USER_ACCESS_KEY.STORE_LINK);
      Cookies.remove('pageEditorPopUp');
      localStorage.clear();
      localStorage.removeItem('environmentId');
      removeCookies();
    }
  }, [logout.isSuccess, isLogout]);

  useEffect(() => {
    if (
      permissions.canManageGlobalUserAndSecurity() &&
      workspaces.isSuccess &&
      workspaces.data &&
      workspaces.data.length === 0 &&
      window.location.pathname.includes('/workspaces')
    ) {
      history.push('/users');
    }
  }, [
    workspaces.isSuccess,
    permissions.permissions,
    workspaces.data,
    history,
    permissions,
  ]);

  useEffect(() => {
    if (user?.user?.email) {
      linksOrganization.mutate(user.user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (linksOrganization.isSuccess && user?.user?.tenantId) {
      const tempSelectedTenant = linksOrganization.data?.items.filter(
        (tenant) => tenant.id === user?.user?.tenantId
      );

      if (tempSelectedTenant && tempSelectedTenant.length > 0) {
        setSelectedOrganizationData(tempSelectedTenant[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linksOrganization.isSuccess, user?.user?.tenantId]);

  useEffect(() => {
    if (tokenOrganization.isSuccess && tokenOrganization.data) {
      setIsSwitchButtonVisible(false);
      hideSwitchOrganizationModal();

      if (
        tokenOrganization.data.item.isMfa &&
        tokenOrganization.data.item.isMfaEnable &&
        (tokenOrganization.data.item.isMfaMail ||
          (tokenOrganization.data.item.isMfaAuthApp &&
            tokenOrganization.data.item.isRecoveryKeyGenerated))
      ) {
        setNewAccessToken(tokenOrganization.data.item.accesstoken);

        if (
          tokenOrganization.data.item.isMfa &&
          tokenOrganization.data.item.isMfaEnable &&
          tokenOrganization.data.item.isMfaMail &&
          tokenOrganization.data.item.isMfaAuthApp &&
          tokenOrganization.data.item.isRecoveryKeyGenerated &&
          tokenOrganization.data.item.mfaPreference
        ) {
          setAuthenticationUsingBoth(true);
          setPreference(tokenOrganization.data.item.mfaPreference);
        } else if (
          tokenOrganization.data.item.isMfa &&
          tokenOrganization.data.item.isMfaEnable &&
          tokenOrganization.data.item.isMfaMail
        ) {
          setAuthenticationUsingEmail(true);
        } else if (
          tokenOrganization.data.item.isMfa &&
          tokenOrganization.data.item.isMfaEnable &&
          tokenOrganization.data.item.isMfaAuthApp &&
          tokenOrganization.data.item.isRecoveryKeyGenerated
        ) {
          setAuthenticationUsingApp(true);
        }
      } else {
        Cookies.set(
          USER_ACCESS_KEY.TOKEN,
          tokenOrganization.data.item.accesstoken,
          { secure: true, sameSite: 'lax' }
        );

        queryClient.refetchQueries([
          API_QUERY_KEY.ENVIRONMENTS_LIST,
          workspaceId,
        ]);
        queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
        queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
        queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
        window.location.reload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenOrganization.data, tokenOrganization.isSuccess]);

  useEffect(() => {
    if (validateInternalRecoveryKey.isSuccess) {
      twoFactorAuthenticationUsingAuthApp.resetFields();
      setAuthenticationUsingApp(false);

      if (newAccessToken != null) {
        Cookies.set(USER_ACCESS_KEY.TOKEN, newAccessToken, {
          secure: true,
          sameSite: 'lax',
        });
      }

      if (authenticationUsingBoth) {
        setAuthenticationUsingBoth(false);
        setPreference('');
      }

      queryClient.refetchQueries([
        API_QUERY_KEY.ENVIRONMENTS_LIST,
        workspaceId,
      ]);
      queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateInternalRecoveryKey.isSuccess]);

  useEffect(() => {
    if (validateAuthAppCodeTwoFactorAuthentication.isSuccess) {
      if (!validateAuthAppCodeTwoFactorAuthentication.data) {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_auth_app_code')
        );
      } else {
        twoFactorAuthenticationUsingAuthApp.resetFields();
        setAuthenticationUsingApp(false);

        if (newAccessToken != null) {
          Cookies.set(USER_ACCESS_KEY.TOKEN, newAccessToken, {
            secure: true,
            sameSite: 'lax',
          });
        }

        if (authenticationUsingBoth) {
          setAuthenticationUsingBoth(false);
          setPreference('');
        }

        queryClient.refetchQueries([
          API_QUERY_KEY.ENVIRONMENTS_LIST,
          workspaceId,
        ]);
        queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
        queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
        queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
        window.location.reload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    validateAuthAppCodeTwoFactorAuthentication.isSuccess,
    t,
    validateAuthAppCodeTwoFactorAuthentication.data,
  ]);

  useEffect(() => {
    if (
      resendInternalEmailCodeTwoFactorAuthentication.isSuccess &&
      isResendInvitationCode &&
      !sendInitialMail
    ) {
      setIsResendInvitationCode(false);
      setSendInitialMail(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.code_resend_successfully')
      );
    }
    if (
      resendInternalEmailCodeTwoFactorAuthentication.isSuccess &&
      isResendInvitationCode &&
      sendInitialMail
    ) {
      setIsResendInvitationCode(false);
      setSendInitialMail(false);
    }
  }, [
    t,
    sendInitialMail,
    resendInternalEmailCodeTwoFactorAuthentication.isSuccess,
    isResendInvitationCode,
  ]);

  useEffect(() => {
    if (validateInternalEmailCodeTwoFactorAuthentication.isSuccess) {
      twoFactorUsingEmail.resetFields();
      setAuthenticationUsingEmail(false);

      if (newAccessToken != null) {
        Cookies.set(USER_ACCESS_KEY.TOKEN, newAccessToken, {
          secure: true,
          sameSite: 'lax',
        });
      }

      if (authenticationUsingBoth) {
        setAuthenticationUsingBoth(false);
        setPreference('');
      }

      queryClient.refetchQueries([
        API_QUERY_KEY.ENVIRONMENTS_LIST,
        workspaceId,
      ]);
      queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateInternalEmailCodeTwoFactorAuthentication.isSuccess]);

  return {
    menuItems,
    userMenuItems,
    onMenuItemClick,
    isVisibleSwitchOrganizationModal,
    linksOrganization,
    t,
    history,
    workspaceId,
    selectedOrganizationData,
    hideSwitchOrganizationModal,
    form,
    onSubmitOrganization,
    onSwitchOrganization,
    isSwitchButtonVisible,
    preference,
    authenticationUsingEmail,
    authenticationUsingApp,
    authenticationUsingBoth,
    twoFactorUsingEmail,
    onTwoFactorAuthenticationUsingEmail,
    onResendCode,
    onHideEmailAuthentication,
    onSwitchToAuthAppAuthentication,
    twoFactorAuthenticationUsingAuthApp,
    onTwoFactorAuthenticationUsingApp,
    onHideAppAuthentication,
    onGoBack,
    onAuthenticateUsingRecoverykey,
    isRecoveryKeyVisible,
    onSwitchToAuthEmailAuthentication,
    onHideBothAuthentication,
    onTwoFactorAuthenticationUsingBoth,
  };
};

export default useMenuController;
