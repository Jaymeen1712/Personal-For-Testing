import { useCallback, useMemo } from 'react';

import useUser from '../user';
import { PERMISSIONS } from '../../utills';

const usePermissions = () => {
  const user = useUser();

  const permissions = useMemo(() => user?.user?.permissions || {}, [user]);

  const canManageGlobalUserAndSecurity = useCallback(
    () => permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_USER_AND_SECURITY']],
    [permissions]
  );

  const canManageGlobalWorkspace = useCallback(
    () => permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canReadRole = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.ROLES.READ']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.ROLES.CREATE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.ROLES.UPDATE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.ROLES.DELETE']],
    [permissions]
  );

  const canCreateRole = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.ROLES.CREATE']],
    [permissions]
  );

  const canUpdateRole = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.ROLES.UPDATE']],
    [permissions]
  );

  const canDeleteRole = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.ROLES.DELETE']],
    [permissions]
  );

  const canReadEcommerceStore = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.ECOMMERCE.READ']] ||
      permissions[PERMISSIONS['SETTINGS.ECOMMERCE.CREATE']] ||
      permissions[PERMISSIONS['SETTINGS.ECOMMERCE.UPDATE']] ||
      permissions[PERMISSIONS['SETTINGS.ECOMMERCE.DELETE']],
    [permissions]
  );

  const canCreateEcommerceStore = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.ECOMMERCE.CREATE']],
    [permissions]
  );

  const canUpdateEcommerceStore = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.ECOMMERCE.UPDATE']],
    [permissions]
  );

  const canDeleteEcommerceStore = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.ECOMMERCE.DELETE']],
    [permissions]
  );

  const canRead301Redirect = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.REDIRECT_301.READ']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.REDIRECT_301.CREATE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.REDIRECT_301.UPDATE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.REDIRECT_301.DELETE']],
    [permissions]
  );

  const canCreate301Redirect = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.REDIRECT_301.CREATE']],
    [permissions]
  );

  const canUpdate301Redirect = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.REDIRECT_301.UPDATE']],
    [permissions]
  );

  const canDelete301Redirect = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.REDIRECT_301.DELETE']],
    [permissions]
  );

  const canReadEmailTemplate = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.PERMISSIONS.READ']
      ],
    [permissions]
  );

  const canReadEmailTemplatesTemplate = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.READ']
      ] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.CREATE']
      ] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.UPDATE']
      ] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.DELETE']
      ],
    [permissions]
  );

  const canCreateEmailTemplatesTemplate = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.CREATE']
      ],
    [permissions]
  );

  const canUpdateEmailTemplatesTemplate = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.UPDATE']
      ],
    [permissions]
  );

  const canDeleteEmailTemplatesTemplate = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.DELETE']
      ],
    [permissions]
  );

  const canReadEmailTemplatesSmtp = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.SMTP.READ']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.SMTP.UPDATE']],
    [permissions]
  );

  const canUpdateEmailTemplatesSmtp = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.EMAIL_TEMPLATES.SMTP.UPDATE']],
    [permissions]
  );

  const canReadUser = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.USERS.READ']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.USERS.CREATE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.USERS.UPDATE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.USERS.DELETE']],
    [permissions]
  );

  const canCreateUser = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.USERS.CREATE']],
    [permissions]
  );

  const canUpdateUser = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.USERS.UPDATE']],
    [permissions]
  );

  const canDeleteUser = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.USERS_AND_ROLES.USERS.DELETE']],
    [permissions]
  );

  const canReadInternationalizationLanguage = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.INTERNATIONALIZATION.READ']] ||
      permissions[PERMISSIONS['SETTINGS.INTERNATIONALIZATION.CREATE']] ||
      permissions[PERMISSIONS['SETTINGS.INTERNATIONALIZATION.UPDATE']] ||
      permissions[PERMISSIONS['SETTINGS.INTERNATIONALIZATION.DELETE']],
    [permissions]
  );

  const canAddInternationalizationLanguage = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.INTERNATIONALIZATION.CREATE']],
    [permissions]
  );

  const canUpdateInternationalizationLanguage = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.INTERNATIONALIZATION.UPDATE']],
    [permissions]
  );

  const canRemoveInternationalizationLanguage = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.INTERNATIONALIZATION.DELETE']],
    [permissions]
  );

  const canReadCMSTokens = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.PERMISSIONS.READ']],
    [permissions]
  );

  const canReadAPIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.READ']] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.CREATE']
      ] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.UPDATE']
      ] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.DELETE']],
    [permissions]
  );

  const canCreateAPIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.CREATE']],
    [permissions]
  );

  const canUpdateAPIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.UPDATE']],
    [permissions]
  );

  const canDeleteAPIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.DELETE']],
    [permissions]
  );

  const canReadCLIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.READ']] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.CREATE']
      ] ||
      permissions[
        PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.UPDATE']
      ] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.DELETE']],
    [permissions]
  );

  const canCreateCLIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.CREATE']],
    [permissions]
  );

  const canUpdateCLIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.UPDATE']],
    [permissions]
  );

  const canDeleteCLIToken = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.DELETE']],
    [permissions]
  );

  const canAccessDashboard = useCallback(() => true, []);

  const canAccessContentLibrary = useCallback(() => true, []);

  const canAccessContentModel = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.CONTENT_MODEL.ACCESS']],
    [permissions]
  );

  const canAccessMediaManager = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.MEDIA_LIBRARY.VIEW']],
    [permissions]
  );

  const canAccessPersonalization = useCallback(() => true, []);

  const canAccessMerchandising = useCallback(() => true, []);

  const canAccessAudience = useCallback(() => true, []);

  const canAccessSettings = useCallback(() => true, []);

  const canReadContentModel = useCallback(
    (contentModelName: string) =>
      permissions[`content_model.model.permissions.read`] ||
      permissions[`content_model.model.${contentModelName}.permissions.read`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canCreateContentModel = useCallback(
    () =>
      permissions[`content_model.model.permissions.create`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canUpdateContentModel = useCallback(
    (contentModelName: string) =>
      permissions[`content_model.model.permissions.update`] ||
      permissions[
        `content_model.model.${contentModelName}.permissions.update`
      ] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canDeleteContentModel = useCallback(
    (contentModelName: string) =>
      permissions[`content_model.model.permissions.delete`] ||
      permissions[
        `content_model.model.${contentModelName}.permissions.delete`
      ] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canReadContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.read`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canCreateContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.create`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canUpdateContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.update`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canDeleteContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.delete`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canCreateComponent = useCallback(
    () =>
      permissions[`content_model.components.permissions.create`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canUpdateComponent = useCallback(
    () =>
      permissions[`content_model.components.permissions.update`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canDeleteComponent = useCallback(
    () =>
      permissions[`content_model.components.permissions.delete`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canCreateRead = useCallback(
    () =>
      permissions[`content_model.components.permissions.read`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  const canReadCache = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CACHE.READ']],
    [permissions]
  );

  const canCreateCache = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CACHE.CREATE']],
    [permissions]
  );

  const canUpdateCache = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CACHE.UPDATE']],
    [permissions]
  );

  const canDeleteCache = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.GENERAL.CACHE.DELETE']],
    [permissions]
  );

  const canPublishTheme = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['SETTINGS.APPEARANCE.THEME.PUBLISH']],
    [permissions]
  );

  const canReadAudience = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['AUDIENCE.READ']],
    [permissions]
  );

  const canCreateAudience = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['AUDIENCE.CREATE']],
    [permissions]
  );

  const canUpdateAudience = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['AUDIENCE.UPDATE']],
    [permissions]
  );

  const canDeleteAudience = useCallback(
    () =>
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] ||
      permissions[PERMISSIONS['AUDIENCE.DELETE']],
    [permissions]
  );

  return {
    permissions,
    canManageGlobalUserAndSecurity,
    canManageGlobalWorkspace,
    canReadRole,
    canCreateRole,
    canUpdateRole,
    canDeleteRole,
    canReadUser,
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canReadInternationalizationLanguage,
    canAddInternationalizationLanguage,
    canUpdateInternationalizationLanguage,
    canRemoveInternationalizationLanguage,
    canReadAPIToken,
    canCreateAPIToken,
    canUpdateAPIToken,
    canDeleteAPIToken,
    canAccessDashboard,
    canAccessContentLibrary,
    canAccessContentModel,
    canAccessMediaManager,
    canAccessPersonalization,
    canAccessMerchandising,
    canAccessAudience,
    canAccessSettings,
    canReadEcommerceStore,
    canCreateEcommerceStore,
    canUpdateEcommerceStore,
    canDeleteEcommerceStore,
    canReadContentModel,
    canCreateContentModel,
    canUpdateContentModel,
    canDeleteContentModel,
    canReadContentModelField,
    canCreateContentModelField,
    canUpdateContentModelField,
    canDeleteContentModelField,
    canCreateComponent,
    canUpdateComponent,
    canDeleteComponent,
    canCreateRead,
    canRead301Redirect,
    canCreate301Redirect,
    canUpdate301Redirect,
    canDelete301Redirect,
    canReadCache,
    canUpdateCache,
    canDeleteCache,
    canCreateCache,
    canReadEmailTemplatesTemplate,
    canCreateEmailTemplatesTemplate,
    canUpdateEmailTemplatesTemplate,
    canDeleteEmailTemplatesTemplate,
    canReadEmailTemplatesSmtp,
    canUpdateEmailTemplatesSmtp,
    canReadEmailTemplate,
    canReadCLIToken,
    canCreateCLIToken,
    canUpdateCLIToken,
    canDeleteCLIToken,
    canReadCMSTokens,
    canPublishTheme,
    canReadAudience,
    canCreateAudience,
    canUpdateAudience,
    canDeleteAudience,
  };
};

export default usePermissions;
