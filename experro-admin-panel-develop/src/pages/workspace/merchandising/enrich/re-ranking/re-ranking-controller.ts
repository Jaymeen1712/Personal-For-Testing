import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import {
  IReRankingStrategy,
  IReRankingStrategyDisplay,
  IWorkspaceParams,
} from '../../../../../types';
import { openNotificationWithIcon } from '../../../../../utills';
import NoFlower from '../../../../../images/no-flower.png';
import RedFlower from '../../../../../images/red-flower.png';
import YellowFlower from '../../../../../images/yellow-flower.png';
import {
  useUserReRankingStrategy,
  useUpdateUserReRankingStrategy,
  useCostPriceAvailability,
} from '../../services';
import usePermissions from '../../../../../hooks/permissions';

// @ts-ignore
const useReRankingController = () => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const environmentId = localStorage.getItem(`${workspaceId}/environmentId`);
  const history = useHistory();
  const permission = usePermissions();
  const strategiesInitial: IReRankingStrategyDisplay[] = [
    {
      id: 'default',
      title: t('default_strategy'),
      subTitle: t('default_strategy_description'),
      isEnabled: true,
      products: [
        {
          image: NoFlower,
        },
        {
          image: YellowFlower,
        },
        {
          image: RedFlower,
        },
      ],
    },
    // {
    //   id: 'revenue',
    //   title: t('optimize_for_revenue'),
    //   subTitle: t('optimize_for_revenue_description'),
    //   isEnabled: true,
    //   products: [
    //     {
    //       image: YellowFlower,
    //       value: '$$$',
    //       valueColor: '#059669',
    //     },
    //     {
    //       image: RedFlower,
    //       value: '$$',
    //       valueColor: '#059669',
    //     },
    //     {
    //       image: NoFlower,
    //       value: '$',
    //       valueColor: '#059669',
    //     },
    //   ],
    // },
    {
      id: 'conversion',
      title: t('optimize_for_conversion'),
      subTitle: t('optimize_for_conversion_description'),
      isEnabled: true,
      products: [
        {
          image: RedFlower,
          text: 'Orders: ',
          value: '410',
          valueColor: '#2563EB',
        },
        {
          image: NoFlower,
          text: 'Orders: ',
          value: '216',
          valueColor: '#2563EB',
        },
        {
          image: YellowFlower,
          text: 'Orders: ',
          value: '95',
          valueColor: '#2563EB',
        },
      ],
    },
    // {
    //   id: 'profit',
    //   title: t('optimize_for_profit'),
    //   subTitle: t('optimize_for_profit_description'),
    //   isEnabled: true,
    //   products: [
    //     {
    //       image: RedFlower,
    //       text: 'Profit ',
    //       value: '72%',
    //       valueColor: '#059669',
    //     },
    //     {
    //       image: NoFlower,
    //       text: 'Profit ',
    //       value: '53%',
    //       valueColor: '#059669',
    //     },
    //     {
    //       image: YellowFlower,
    //       text: 'Profit ',
    //       value: '38%',
    //       valueColor: '#059669',
    //     },
    //   ],
    // },
    {
      id: 'custom',
      title: t('custom_strategy'),
      subTitle: t('custom_strategy_description'),
      isEnabled: true,
      products: [
        {
          image: YellowFlower,
        },
        {
          image: NoFlower,
        },
        {
          image: RedFlower,
        },
      ],
    },
  ];

  const getUserStrategy = useUserReRankingStrategy(workspaceId, environmentId);
  const getCostPriceStatus = useCostPriceAvailability(
    workspaceId,
    environmentId
  );
  const updateUserStrategy = useUpdateUserReRankingStrategy(
    workspaceId,
    environmentId
  );

  const [strategies, setStrategies] =
    useState<IReRankingStrategyDisplay[]>(strategiesInitial);
  const [isUnknownError, setUnknownError] = useState<boolean>(false);
  const [isStoreFound, setStoreFound] = useState<boolean>(false);
  const [newSelectedStrategy, setNewSelectedStrategy] =
    useState<IReRankingStrategy>({ strategy: '', properties: null });
  const [isActionEnabled, setActionEnabled] = useState(false);
  const [isSavedAction, setSavedAction] = useState<boolean>(false);

  useEffect(() => {
    setNewSelectedStrategy({ strategy: '', properties: null });
    setActionEnabled(false);
    // eslint-disable-next-line
  }, [environmentId]);

  useEffect(() => {
    if (getUserStrategy.isSuccess && getUserStrategy.data) {
      setStoreFound(true);
      setNewSelectedStrategy(getUserStrategy.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserStrategy.isSuccess, getUserStrategy.data]);

  useEffect(() => {
    if (getUserStrategy.isError && getUserStrategy.error) {
      const error = getUserStrategy.error.response?.Error;
      const errorCode = error?.code || error?.errorCode;
      if (errorCode === 'EX-00047') {
        setStoreFound(false);
        openNotificationWithIcon(
          'error',
          t('common.messages.store_does_not_exists')
        );
      } else if (errorCode === 'EX-00213') {
        setStoreFound(true);
        setActionEnabled(true);
        setNewSelectedStrategy({ strategy: 'default', properties: null });
      } else {
        setUnknownError(true);
        openNotificationWithIcon('error', t('common.messages.unknown_error'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserStrategy.isError, getUserStrategy.error]);

  useEffect(() => {
    if (updateUserStrategy.isSuccess) {
      setActionEnabled(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      getUserStrategy.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserStrategy.isSuccess]);

  useEffect(() => {
    if (updateUserStrategy.isError) {
      if (updateUserStrategy.error.response?.Error?.errorCode === 'EX-00213') {
        openNotificationWithIcon(
          'error',
          t('common.messages.re_ranking_algo_not_found')
        );
      } else {
        openNotificationWithIcon('error', t('common.messages.unknown_error'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserStrategy.isError]);

  useEffect(() => {
    const costPriceStatus = getCostPriceStatus.data || {
      isRevenueEfi: false,
      isConversionRateEfi: false,
      isProfitPercentageEfi: false,
    };
    setStrategies((oldStrategies) =>
      oldStrategies.map((strategy) => {
        switch (strategy.id) {
          case 'revenue':
            strategy.isEnabled = costPriceStatus.isRevenueEfi;
            break;
          case 'conversion':
            strategy.isEnabled = costPriceStatus.isConversionRateEfi;
            break;
          case 'profit':
            strategy.isEnabled = costPriceStatus.isProfitPercentageEfi;
            break;
        }

        return strategy;
      })
    );
  }, [getCostPriceStatus.data]);

  const onStrategySelectionChange = (e: RadioChangeEvent) => {
    setActionEnabled(getUserStrategy.data?.strategy !== e.target.value);
    setNewSelectedStrategy({
      ...newSelectedStrategy,
      strategy: e.target.value,
    });
  };

  const updateStrategy = (strategy: IReRankingStrategy) => {
    setNewSelectedStrategy(strategy);
    updateUserStrategy.mutate(strategy);
  };

  const onSaveStrategy = () => {
    if (newSelectedStrategy?.strategy === 'custom') {
      setSavedAction(true);
    } else {
      updateStrategy({ ...newSelectedStrategy, properties: null });
    }
  };

  const onCancel = () => {
    if (getUserStrategy.data) {
      setNewSelectedStrategy({ ...getUserStrategy.data });
      setActionEnabled(false);
    }
  };

  const updateSavedAction = (isSavedAction: boolean) => {
    setSavedAction(isSavedAction);
  };

  const updateActionEnabled = (isActionEnabled: boolean) => {
    setActionEnabled(isActionEnabled);
  };

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
  };

  return {
    t,
    isStrategyFetching: getUserStrategy.isFetching,
    isStoreFound,
    strategies,
    newSelectedStrategy,
    isSavedAction,
    isActionEnabled,
    isUnknownError,
    permission,
    onAddStore,
    updateSavedAction,
    updateStrategy,
    onSaveStrategy,
    onCancel,
    updateActionEnabled,
    onStrategySelectionChange,
  };
};

export default useReRankingController;
