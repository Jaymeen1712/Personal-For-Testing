import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useDetailsWorkspacePublishQueue,
  useEventsCountAudience,
  useListEnvironmentsAudience,
  useUserEvents,
} from '../../../services';

const useOverviewController = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsAudience: any,
  workspaceId: string,
  environmentId: string,
  startDate?: string,
  endDate?: string
) => {
  const { t } = useTranslation();

  const [domain, setDomain] = useState<string>();

  const listEnvironments = useListEnvironmentsAudience(workspaceId);

  const totalViewedOrders = useEventsCountAudience(
    detailsAudience.device_id,
    'product_viewed',
    workspaceId,
    environmentId,
    startDate,
    endDate,
    'count'
  );

  const totalOrders = useEventsCountAudience(
    detailsAudience.device_id,
    'checkout_completed',
    workspaceId,
    environmentId,
    startDate,
    endDate,
    'count'
  );

  const totalPurchasedAmount = useEventsCountAudience(
    detailsAudience.device_id,
    'product_purchased',
    workspaceId,
    environmentId,
    startDate,
    endDate,
    'sum'
  );

  const recentlyViewedProducts = useUserEvents(
    detailsAudience.device_id,
    'product_viewed',
    workspaceId,
    environmentId,
    startDate,
    endDate
  );

  const recentlyPurchasedProducts = useUserEvents(
    detailsAudience.device_id,
    'product_purchased',
    workspaceId,
    environmentId,
    startDate,
    endDate
  );

  const detailsWorkspacePublishQueue =
    useDetailsWorkspacePublishQueue(workspaceId);

  const currencyFormat = ({
    value,
    thousandSeparator,
    decimalSeparator,
    prefixSymbol,
  }: {
    value: number;
    thousandSeparator: string;
    decimalSeparator: string;
    prefixSymbol: string;
  }) => {
    const separator = `$1${thousandSeparator}`;
    if (!value) {
      value = 0;
    }
    const formatedValue =
      prefixSymbol +
      value
        .toFixed(2)
        .replace('.', decimalSeparator)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, separator);
    return formatedValue;
  };

  useEffect(() => {
    if (listEnvironments.isSuccess && listEnvironments.data) {
      listEnvironments.data.forEach((environment) => {
        if (environment.id === environmentId) {
          if (environment.customDomain) {
            setDomain(environment.customDomain);
          } else if (environment?.cacheDomain) {
            setDomain(environment.cacheDomain);
          } else {
            setDomain(environment.workspaceDomain);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEnvironments.isSuccess]);

  return {
    t,
    recentlyViewedProducts,
    recentlyPurchasedProducts,
    totalViewedOrders,
    totalOrders,
    totalPurchasedAmount,
    domain,
    detailsWorkspacePublishQueue,
    currencyFormat,
  };
};

export default useOverviewController;
