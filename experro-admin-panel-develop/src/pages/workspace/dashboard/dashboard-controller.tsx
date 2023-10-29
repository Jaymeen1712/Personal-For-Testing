import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';

import { IDashboardParams } from '../../../types';
import { SIDEBAR_KEYS } from '../../../utills';

interface IUseListDashboardController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useListDashboardController = ({
  onMainSidebarActiveItem,
}: IUseListDashboardController) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId, dashboardType } = useParams<IDashboardParams>();

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [pastStartDate, setPastStartDate] = useState<string>();
  const [pastEndDate, setPastEndDate] = useState<string>();
  const [environment, setEnvironment] = useState<string | null>(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.DASHBOARD);
    }

    document.addEventListener('environmentChange', () =>
      setEnvironment(localStorage.getItem(`${workspaceId}/environmentId`))
    );

    setStartDate(
      moment(new Date(new Date(Date.now()).getTime() - 7 * 24 * 60 * 60 * 1000))
        .utc()
        .format('YYYY-MM-DD')
    );
    setEndDate(
      moment(new Date(new Date(Date.now()).getTime()))
        .utc()
        .format('YYYY-MM-DD')
    );
    setPastStartDate(
      moment(
        new Date(new Date(Date.now()).getTime() - 14 * 24 * 60 * 60 * 1000)
      )
        .utc()
        .format('YYYY-MM-DD')
    );
    setPastEndDate(
      moment(new Date(new Date(Date.now()).getTime() - 7 * 24 * 60 * 60 * 1000))
        .utc()
        .format('YYYY-MM-DD')
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = useMemo(() => {
    return [
      {
        key: 'traffic',
        label: (
          <div className={dashboardType === 'traffic' ? 'text-blue' : ''}>
            {t('common.labels.traffic')}
          </div>
        ),
        icon: <div></div>,
        children: [],
        className: 'cms-margin-zero',
      },
      {
        key: 'cms',
        label: (
          <div className={dashboardType === 'cms' ? 'text-blue' : ''}>
            {t('common.labels.cms')}
          </div>
        ),
        icon: <div></div>,
        children: [],
        className: 'cms-margin-zero',
      },
      {
        key: 'orders',
        label: (
          <div className={dashboardType === 'orders' ? 'text-blue' : ''}>
            {t('common.labels.orders')}
          </div>
        ),
        icon: <div></div>,
        children: [],
        className: 'cms-margin-zero',
      },
      {
        key: 'products',
        label: (
          <div className={dashboardType === 'products' ? 'text-blue' : ''}>
            {t('common.labels.products')}
          </div>
        ),
        icon: <div></div>,
        children: [],
        className: 'cms-margin-zero',
      },
      {
        key: 'customers',
        label: (
          <div className={dashboardType === 'customers' ? 'text-blue' : ''}>
            {t('common.labels.customers')}
          </div>
        ),
        icon: <div></div>,
        children: [],
        className: 'cms-margin-zero',
      },
    ];
  }, [t, dashboardType]);

  const onSubSidebarParentMenuItemClick = useCallback(
    (key: string) => {
      history.push(`/workspaces/${workspaceId}/dashboard/${key}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceId]
  );

  const onEnvironmentChange = (value: string) => {
    setEnvironment(value);
  };

  const onStartDateEndDateChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dates: any,
    dateStrings: [string, string]
  ) => {
    if (dates) {
      setStartDate(moment(new Date(dateStrings[0])).format('YYYY-MM-DD'));
      setEndDate(
        // @ts-ignore
        moment(new Date(dateStrings[1]).getTime()).format('YYYY-MM-DD')
      );
      setPastStartDate(
        moment(
          new Date(
            new Date(dateStrings[0]).getTime() -
              Math.ceil(
                (new Date(dateStrings[1]).getTime() -
                  new Date(dateStrings[0]).getTime()) /
                  (1000 * 3600 * 24)
              ) *
                24 *
                60 *
                60 *
                1000
          )
        )
          .utc()
          .format('YYYY-MM-DD')
      );
      setPastEndDate(
        moment(new Date(dateStrings[0])).utc().format('YYYY-MM-DD')
      );
    }
  };

  return {
    environment,
    onEnvironmentChange,
    t,
    workspaceId,
    onSubSidebarParentMenuItemClick,
    menuItems,
    dashboardType,
    startDate,
    endDate,
    pastStartDate,
    pastEndDate,
    onStartDateEndDateChange,
  };
};

export default useListDashboardController;
