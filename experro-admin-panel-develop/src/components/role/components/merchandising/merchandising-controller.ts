import { useTranslation } from 'react-i18next';

const useMerchandising = () => {
  const { t } = useTranslation();

  const listMerchandising = {
    merchandising: [
      {
        label: t('common.labels.facets'),
        value: 'facets',
        description: t('common.labels.facets_description'),
      },
      {
        label: t('common.labels.synonyms'),
        value: 'synonyms',
        description: t('common.labels.synonyms_description'),
      },
      {
        label: t('common.labels.rules'),
        value: 'rules',
        description: t('common.labels.rules_description'),
        subrules: [
          {
            label: t('common.labels.global_rules'),
            value: 'globalRules',
          },
          {
            label: t('common.labels.search_rules'),
            value: 'searchRules',
          },
          {
            label: t('common.labels.category_rules'),
            value: 'categoryRules',
          },
        ],
      },
    ],
  };

  return {
    t,
    listMerchandising,
  };
};

export default useMerchandising;
