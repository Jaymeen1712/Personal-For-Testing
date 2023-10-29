import { useTranslation } from 'react-i18next';

const useSettings = () => {
  const { t } = useTranslation();

  const listSettings = {
    settings: [
      {
        label: t('common.labels.internationalization'),
        value: 'internationalization',
        description: t('common.labels.internationalization_description'),
      },
      {
        label: t('common.labels.301_redirects_title'),
        value: 'redirect_301',
        description: t('common.labels.301_redirect_description'),
      },
      {
        label: t('common.labels.edge_caching'),
        value: 'edgeCaching',
        description: t('common.labels.edge_caching_description'),
      },
      {
        label: t('common.labels.ecommerce_plugin'),
        value: 'ecommerce',
        description: t('common.labels.ecommerce_plugin_description'),
      },
      {
        label: t('common.labels.users_roles'),
        value: 'usersAndRoles',
        description: t('common.labels.users_roles_description'),
        subrules: [
          {
            label: t('common.labels.users'),
            value: 'users',
          },
          {
            label: t('common.labels.roles'),
            value: 'roles',
          },
        ],
      },
    ],
  };

  return {
    listSettings,
    t,
  };
};

export default useSettings;
