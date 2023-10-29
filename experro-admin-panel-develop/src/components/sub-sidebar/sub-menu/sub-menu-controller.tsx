import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import {
  allowSpecificDomain,
  SIDEBAR_KEYS,
  SUB_SIDEBAR_KEYS,
} from '../../../utills';
import DownArrowIcon from '../../../images/icons/downarrow-icon';
import usePermissions from '../../../hooks/permissions';
import useUser from '../../../hooks/user';

const useSubMenuController = ({
  sidebarActiveItemKey,
  onSubSidebarParentMenuItemClick,
  openSubSidebarMenuItems,
}: {
  sidebarActiveItemKey: string;
  onSubSidebarParentMenuItemClick?: (key: string) => void;
  openSubSidebarMenuItems?: string[];
}) => {
  const { t } = useTranslation();
  const permissions = usePermissions();
  const user = useUser();

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [title, setTitle] = useState('');

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    if (sidebarActiveItemKey === SIDEBAR_KEYS.GLOBAL.SETTINGS) {
      return [
        SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.KEY,
        SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.SECURITY.KEY,
      ];
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.SETTINGS) {
      return [
        SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.KEY,
        SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ADMINISTRATION.KEY,
        SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ECOMMERCE_PLUGINS.KEY,
        SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.KEY,
        SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.INTEGRATIONS.KEY,
      ];
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL) {
      if (openSubSidebarMenuItems) {
        if (
          openSubSidebarMenuItems[openSubSidebarMenuItems.length - 1] !==
            'model' ||
          openSubSidebarMenuItems[openSubSidebarMenuItems.length - 1] !== ''
        ) {
          openSubSidebarMenuItems = [];
          openSubSidebarMenuItems.push('component');
        }
        return openSubSidebarMenuItems;
      } else {
        return ['model', 'component'];
      }
    } else if (
      sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY
    ) {
      return ['collection-type', 'single-type'];
    } else if (openSubSidebarMenuItems) {
      // return openSubSidebarMenuItems;
    }
    return [];
  });

  const globalSettingsMenuItems = useMemo(
    () => [
      {
        key: SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.KEY,
        icon: (
          <div className="ant-menu-submenu-arrows">
            <DownArrowIcon />
          </div>
        ),
        label: t('common.labels.general'),
        children: [
          {
            label: <Link to="/users">{t('common.labels.users')}</Link>,
            key: SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.USERS,
          },
          {
            label: <Link to="/roles">{t('common.labels.roles')}</Link>,
            key: SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.ROLES,
          },
          {
            label: <Link to="/groups">{t('common.labels.groups')}</Link>,
            key: SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.GROUPS,
          },
          {
            label: (
              <Link to="/audit-logs">{t('common.labels.audit_logs')}</Link>
            ),
            key: SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.AUDIT_LOGS,
          },
        ],
      },
      // TODO: temporarily commented
      // {
      //   key: SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.SECURITY.KEY,
      //   label: t('common.labels.sso'),
      //   icon: (
      //     <div className="ant-menu-submenu-arrows">
      //       <DownArrowIcon />
      //     </div>
      //   ),
      //   children: [
      //     {
      //       key: SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.SECURITY.SSO,
      //       label: t('common.labels.sso'),
      //     },
      //   ],
      // },
    ],
    [t]
  );

  const workspaceSettingsMenuItems = useMemo(() => {
    const workspaceLink = `/workspaces/${workspaceId}`;
    const menuItems = [];

    menuItems.push({
      key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.KEY,
      label: t('common.labels.general'),
      icon: (
        <div className="ant-menu-submenu-arrows">
          <DownArrowIcon />
        </div>
      ),
      children: [
        {
          key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.WORKSPACE,
          label: (
            <Link to={`${workspaceLink}/workspace`}>
              {t('common.labels.workspace')}
            </Link>
          ),
        },
      ],
    });

    if (permissions.canReadCMSTokens()) {
      menuItems[0].children.push({
        key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.CMS_TOKENS,
        label: (
          <Link to={`${workspaceLink}/cms-tokens`}>
            {t('common.labels.tokens')}
          </Link>
        ),
      });
    }

    if (permissions.canReadInternationalizationLanguage()) {
      menuItems[0].children.push({
        key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.INTERNATIONALIZATION,
        label: (
          <Link to={`${workspaceLink}/internationalization`}>
            {t('common.labels.internationalization')}
          </Link>
        ),
      });
    }

    menuItems[0].children.push({
      key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.ENVIRONMENTS,
      label: (
        <Link to={`${workspaceLink}/environments`}>
          {t('common.labels.environments')}
        </Link>
      ),
    });

    menuItems[0].children.push({
      key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.PUBLISH_QUEUE,
      label: (
        <Link to={`${workspaceLink}/publishQueue`}>
          {t('common.labels.publish_queue')}
        </Link>
      ),
    });

    if (permissions.canRead301Redirect()) {
      menuItems[0].children.push({
        key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.REDIRECTS,
        label: (
          <Link to={`${workspaceLink}/301-redirects`}>
            {t('common.labels.301_redirects')}
          </Link>
        ),
      });
    }

    if (permissions.canReadEmailTemplate()) {
      menuItems[0].children.push({
        key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.EMAILS,
        label: (
          <Link to={`${workspaceLink}/emails`}>
            {t('common.labels.emails')}
          </Link>
        ),
      });
    }

    if (permissions.canReadCache()) {
      menuItems[0].children.push({
        key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.EDGE_CACHING,
        label: (
          <Link to={`${workspaceLink}/edge-caching`}>
            {t('common.labels.cache')}
          </Link>
        ),
      });
    }

    // TODO: temporarily commented
    // menuItems[0].children.push({
    //   key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.DNS_MANAGEMENT,
    //   label: t('common.labels.dns_management'),
    // });

    if (permissions.canReadRole() || permissions.canReadUser()) {
      menuItems.push({
        key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ADMINISTRATION.KEY,
        label: t('common.labels.administration'),
        icon: (
          <div className="ant-menu-submenu-arrows">
            <DownArrowIcon />
          </div>
        ),
        children: [],
      });

      if (permissions.canReadUser()) {
        menuItems[menuItems.length - 1].children.push({
          key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ADMINISTRATION.USERS,
          label: (
            <Link to={`${workspaceLink}/users`}>
              {t('common.labels.users')}
            </Link>
          ),
        });
      }
      if (permissions.canReadRole()) {
        menuItems[menuItems.length - 1].children.push({
          key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ADMINISTRATION.ROLES,
          label: (
            <Link to={`${workspaceLink}/roles`}>
              {t('common.labels.roles')}
            </Link>
          ),
        });
      }
    }

    // TODO: temporarily commented
    // menuItems.push({
    //   key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.KEY,
    //   label: t('common.labels.appearance'),
    //   icon: (
    //     <div className="ant-menu-submenu-arrows">
    //       <DownArrowIcon />
    //     </div>
    //   ),
    //   children: [
    //     {
    //       key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.THEME,
    //       label: t('common.labels.theme'),
    //     },
    //     {
    //       key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.VISUAL_BUILDER,
    //       label: t('common.labels.visual_builder'),
    //     },
    //     {
    //       key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.RAW_CODE_EDITOR,
    //       label: t('common.labels.raw_code_editor'),
    //     },
    //   ],
    // });

    // if (permissions.canReadBigcommerceStore()) {
    //   menuItems.push({
    //     key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ECOMMERCE_PLUGINS.KEY,
    //     label: t('common.labels.ecommerce_plugins'),
    //     icon: (
    //       <div className="ant-menu-submenu-arrows">
    //         <DownArrowIcon />
    //       </div>
    //     ),
    //     children: [
    //       {
    //         key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ECOMMERCE_PLUGINS
    //           .BIGCOMMERCE,
    //         label: (
    //           <Link to={`${workspaceLink}/bigcommerce-store`}>
    //             {t('common.labels.bigcommerce')}
    //           </Link>
    //         ),
    //       },
    //     ],
    //   });
    // }

    menuItems.push({
      key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.KEY,
      label: t('common.labels.appearance'),
      icon: (
        <div className="ant-menu-submenu-arrows">
          <DownArrowIcon />
        </div>
      ),
      children: [
        {
          key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.THEME,
          label: (
            <Link to={`${workspaceLink}/theme`}>
              {t('common.labels.theme')}
            </Link>
          ),
        },
        {
          key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.NAVIGATION,
          label: (
            <Link to={`${workspaceLink}/navigation`}>
              {t('common.labels.navigation')}
            </Link>
          ),
        },
      ],
    });
    // if (user?.user?.email.toLowerCase() === 'hardik@rapidops.com') {
    menuItems.push({
      key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.INTEGRATIONS.KEY,
      label: t('common.labels.integrations'),
      icon: (
        <div className="ant-menu-submenu-arrows">
          <DownArrowIcon />
        </div>
      ),
      children: [
        ...(allowSpecificDomain(user?.user?.email)
          ? [
              {
                key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.INTEGRATIONS.PLATFORMS,
                label: (
                  <Link to={`${workspaceLink}/platforms`}>
                    {t('common.labels.platforms')}
                  </Link>
                ),
              },
              {
                key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.INTEGRATIONS.APPS,
                label: (
                  <Link to={`${workspaceLink}/apps`}>
                    {t('common.labels.apps')}
                  </Link>
                ),
              },
            ]
          : [
              {
                key: SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.INTEGRATIONS.PLATFORMS,
                label: (
                  <Link to={`${workspaceLink}/platforms`}>
                    {t('common.labels.platforms')}
                  </Link>
                ),
              },
            ]),
      ],
    });
    // }

    return menuItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, workspaceId, permissions]);

  const myAccountMenuItems = useMemo(() => {
    const workspaceLink = `/workspaces/${workspaceId}`;
    return [
      {
        key: SUB_SIDEBAR_KEYS.USER.ACCOUNT.PROFILE,
        label: (
          <Link to={`${workspaceLink}/profile`}>
            {t('common.labels.profile')}
          </Link>
        ),
      },
      {
        key: SUB_SIDEBAR_KEYS.USER.ACCOUNT.SECURITY,
        label: (
          <Link to={`${workspaceLink}/security`}>
            {t('common.labels.security')}
          </Link>
        ),
      },
      // TODO: temporarily commented
      // {
      //   key: SUB_SIDEBAR_KEYS.USER.ACCOUNT.NOTIFICATION_PREFERENCE,
      //   label: (
      //     <Link to={`${workspaceLink}/notification`}>
      //       {t('common.labels.notification_preference')}
      //     </Link>
      //   ),
      // },
    ];
  }, [t, workspaceId]);

  const menuItems = useMemo(() => {
    if (sidebarActiveItemKey === SIDEBAR_KEYS.GLOBAL.SETTINGS) {
      return globalSettingsMenuItems;
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.SETTINGS) {
      return workspaceSettingsMenuItems;
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.USER.ACCOUNT) {
      return myAccountMenuItems;
    }

    return [];
  }, [
    globalSettingsMenuItems,
    myAccountMenuItems,
    sidebarActiveItemKey,
    workspaceSettingsMenuItems,
  ]);

  const onOpenChange = useCallback(
    (keys: string[]) => {
      setOpenKeys(keys);
      if (onSubSidebarParentMenuItemClick) {
        const key =
          keys.length > openKeys.length
            ? keys.filter((key) => !openKeys.includes(key))
            : openKeys.filter((key) => !keys.includes(key));
        if (key.length) onSubSidebarParentMenuItemClick(key[0]);
      }
    },
    [onSubSidebarParentMenuItemClick, openKeys]
  );

  useEffect(() => {
    if (sidebarActiveItemKey === SIDEBAR_KEYS.GLOBAL.SETTINGS) {
      setTitle(t('common.labels.admin_console'));
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.SETTINGS) {
      setTitle(t('common.labels.settings'));
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL) {
      setTitle(t('common.labels.content_model'));
    } else if (
      sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.CONTENT_LIBRARY
    ) {
      setTitle(t('common.labels.content_library'));
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.USER.ACCOUNT) {
      setTitle(t('common.labels.my_account'));
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER) {
      setTitle(t('common.labels.media_manager'));
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.MERCHANDISING) {
      // setTitle(t('common.labels.merchandising'));
      setTitle(t('common.labels.discovery'));
    } else if (
      sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.PERSONALIZATION
    ) {
      setTitle(t('common.labels.personalization'));
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.DASHBOARD) {
      setTitle(t('common.labels.dashboard'));
    } else if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.AUDIENCE) {
      setTitle(t('common.labels.audiences'));
    }
  }, [sidebarActiveItemKey, t]);

  useEffect(() => {
    if (openSubSidebarMenuItems) {
      if (sidebarActiveItemKey === SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER) {
        setOpenKeys(openSubSidebarMenuItems);
      } else {
        setOpenKeys([...openKeys, ...openSubSidebarMenuItems]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSubSidebarMenuItems]);

  return {
    openKeys,
    menuItems,
    onOpenChange,
    title,
    t,
  };
};

export default useSubMenuController;
