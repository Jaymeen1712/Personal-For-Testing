import { useTranslation } from 'react-i18next';
import { useGetAppList } from '../../services';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IAppLIst } from '../../../../../types';
import usePermissions from '../../../../../hooks/permissions/permissions';
import {
  allowSpecificDomain,
  openNotificationWithIcon,
} from '../../../../../utills';
import useUser from '../../../../../hooks/user';

const usePlatformListController = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const user = useUser();

  const { canReadEcommerceStore } = usePermissions();

  const categoryId = '80d1aa3c-9981-4f68-896e-1bd0b62072a3';
  const [platformsList, setPlatformsList] = useState<IAppLIst[]>();
  const getPlatformsList = useGetAppList(workspaceId, categoryId, false, '');

  const platFormItemClick = (
    platformID: string,
    platformIntegrationName: string,
    isInstalled?: boolean
  ) => {
    if (canReadEcommerceStore()) {
      history.push(
        `/workspaces/${workspaceId}/platforms/${platformIntegrationName}/${platformID}/${categoryId}${
          isInstalled ? '/installed' : ''
        }`
      );
    } else {
      openNotificationWithIcon(
        'error',
        t('common.messages.you_dont_have_access')
      );
    }
  };

  useEffect(() => {
    if (getPlatformsList.isSuccess && getPlatformsList.data.length > 0) {
      const tempList: IAppLIst[] = [];
      getPlatformsList.data.forEach((integration) => {
        if (integration.categoryId === categoryId) {
          if (integration.integrationName === 'BigCommerce') {
            tempList.push({
              ...integration,
              categoryName: 'eCommerce',
            });
          } else {
            if (allowSpecificDomain(user?.user?.email)) {
              tempList.push({
                ...integration,
                categoryName: 'eCommerce',
              });
            }
          }
        }
      });
      setPlatformsList(
        tempList.sort((a, b) =>
          a.active && b.active
            ? a.sortOrder - b.sortOrder
            : a.active
            ? -1
            : b.active
            ? 1
            : a.sortOrder - b.sortOrder
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPlatformsList.isSuccess]);

  return {
    t,
    platformsList,
    platFormItemClick,
  };
};
export default usePlatformListController;
