import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Menu, Tag } from 'antd';
import { useParams } from 'react-router-dom';

import { useListTheme } from '../../services';
import {
  APIS_ROUTES,
  camelToSnackCase,
  openNotificationWithIcon,
  PAGE_SIZE,
  // sortableHeader,
} from '../../../../../utills';
import {
  IAPIError,
  IListEnvironments,
  IListThemeResponse,
  ISortDataObject,
} from '../../../../../types';

import { usePublishTheme } from '../../services';
import EllipsisIcon from '../../../../../images/icons/ellipsis-icon';
import { UseQueryResult } from 'react-query';
import usePermissions from '../../../../../hooks/permissions/permissions';
import moment from 'moment';
import { useListAllUser } from '../../../../../apis/user';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

const useListHistoryController = (
  listEnvironments: UseQueryResult<IListEnvironments[], IAPIError>,
  isPublishButtonDisabled: boolean,
  setIsPublishButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const { canPublishTheme } = usePermissions();

  const [skip, setSkip] = useState(1);
  const [skipLimit, setSkipLimit] = useState(PAGE_SIZE);
  const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
    sortBy: '',
    orderBy: '',
  });
  const [sortFlag, setSortFlag] = useState(false);

  const [themeHistoryData, setThemeHistoryData] =
    useState<IListThemeResponse[]>();
  const [totalRecordsCount, setTotalRecordsCount] = useState<number>(0);

  const listHistory = useListTheme(
    workspaceId,
    skip,
    skipLimit,
    columnSortOrder.orderBy,
    columnSortOrder.sortBy
  );

  const publishTheme = usePublishTheme(workspaceId);

  const listAllUser = useListAllUser();

  const [themeId, setThemeId] = useState<string>('');
  const [selectedPublishThemeEnvironment, setSelectedThemePublishEnvironment] =
    useState<string | null>();
  const [themePublishedEnvironmentId, setThemePublishedEnvironmentId] =
    useState<string>('');
  const [
    isPublishEnvironmentModalVisible,
    setIsPublishEnvironmentModalVisible,
  ] = useState<boolean>(false);
  const [isPublishButtonVisible, setIsPublishButtonVisible] =
    useState<boolean>(true);

  const [allUsersList, setAllUsersList] = useState<IUser[]>([]);

  const onPublishTheme = (record: IListThemeResponse) => {
    if (record.status === 'PUBLISHED') {
      setThemePublishedEnvironmentId(record.publishEnvironmentId);
    } else {
      setThemePublishedEnvironmentId('');
    }
    setThemeId(record.id);
    setIsPublishEnvironmentModalVisible(true);
  };

  const onHideSelectEnvironment = () => {
    setIsPublishEnvironmentModalVisible(false);
    setThemeId('');
    setSelectedThemePublishEnvironment(null);
    setIsPublishButtonVisible(true);
  };

  const onSelectEnvironmentToPublish = (id: string) => {
    setSelectedThemePublishEnvironment(id);
    setIsPublishButtonVisible(false);
  };

  const onEnvironmentToPublish = () => {
    if (themeId && selectedPublishThemeEnvironment) {
      publishTheme.mutate({
        envId: selectedPublishThemeEnvironment,
        themeId: themeId,
      });
    }
  };

  const onPageChange = (page: number, pageSize: number) => {
    setSkip(page);
    setSkipLimit(pageSize);
  };

  //@ts-ignore
  const onChangeTable = (pagination, filter, sorter) => {
    if (!sortFlag) {
      setSortFlag(true);
    }
    if (sorter.order === 'ascend') {
      setColumnSortOrder({
        sortBy: camelToSnackCase(sorter.field),
        orderBy: 'asc',
      });
    } else if (sorter.order === 'descend') {
      setColumnSortOrder({
        sortBy: camelToSnackCase(sorter.field),
        orderBy: 'desc',
      });
    } else {
      setColumnSortOrder({
        sortBy: '',
        orderBy: '',
      });
    }
    listHistory.remove();
  };

  const columns = useMemo(
    () => [
      {
        // title: sortableHeader(t('common.labels.name'), 'name', columnSortOrder),
        title: t('common.labels.name'),
        // sorter: true,
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: (name: string, record: IListThemeResponse) => (
          <div
            className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
            <div className="table-text ant-row ant-space-align-center">
              <div className="m-r-16">{record.name}</div>
              {record.status === 'PUBLISHED' && (
                <Tag color={'success'}>{t('common.labels.Published')}</Tag>
              )}
            </div>
            <Dropdown
              overlay={
                <div className="table-dropdown single-item-dropdown">
                  <Menu>
                    <Menu.Item
                      onClick={() => onPublishTheme(record)}
                      disabled={!canPublishTheme() || isPublishButtonDisabled}>
                      {t('common.labels.publish')}
                    </Menu.Item>
                    {record.hasSourceCode && (
                      <Menu.Item>
                        <Button
                          type="link"
                          href={`${process.env.REACT_APP_API_URL}${APIS_ROUTES.THEME_SERVICE}/${workspaceId}/theme-versions/${record.id}/download`}
                          target="_self">
                          {t('common.labels.download')}
                        </Button>
                      </Menu.Item>
                    )}
                  </Menu>
                </div>
              }
              placement="bottomRight"
              trigger={['click']}>
              <Button
                size="small"
                type="text"
                className="on-hover"
                icon={<EllipsisIcon />}
                style={{ float: 'right' }}
              />
            </Dropdown>
          </div>
        ),
      },
      {
        // title: sortableHeader(
        //   t('common.labels.environment'),
        //   'publishEnvironmentId',
        //   columnSortOrder
        // ),
        title: t('common.labels.environment'),
        // sorter: true,
        dataIndex: 'publishEnvironmentId',
        key: 'publishEnvironmentId',
        width: '15%',
        render: (publishEnvironmentId: string, record: IListThemeResponse) => (
          <div className="table-text">
            {record.publishEnvironmentId
              ? listEnvironments.data?.find(
                  (ele) => ele?.id === record?.publishEnvironmentId
                )?.title
              : '-'}
          </div>
        ),
      },
      // {
      //   title: sortableHeader(
      //     t('common.labels.version'),
      //     'versionHash',
      //     columnSortOrder
      //   ),
      //   title: t('common.labels.version'),
      //   // sorter: true,
      //   dataIndex: 'versionHash',
      //   key: 'versionHash',
      //   width: '15%',
      // },
      {
        // title: sortableHeader(
        //   t('common.labels.published_on'),
        //   'publishAt',
        //   columnSortOrder
        // ),
        title: t('common.labels.published_on'),
        // sorter: true,
        dataIndex: 'publishAt',
        key: 'publishAt',
        width: '17%',
        render: (publishAt: string, record: IListThemeResponse) => (
          <div className="table-text">
            {record.publishAt
              ? moment(record.publishAt).local().format('DD MMM YYYY,LT')
              : '-'}
          </div>
        ),
      },
      {
        // title: sortableHeader(
        //   t('common.labels.published_by'),
        //   'publishAt',
        //   columnSortOrder
        // ),
        title: t('common.labels.published_by'),
        // sorter: true,
        dataIndex: 'publishedBy',
        key: 'publishedBy',
        width: '17%',
        render: (publishedBy: string, record: IListThemeResponse) => {
          const user = allUsersList?.find((users) => {
            const id = record.publishedBy;
            return users.id === id;
          });
          if (user) {
            return `${user.firstName} ${user.lastName}`;
          } else if (record.publishByToken) {
            return `${record.publishByToken}`;
          } else {
            return '-';
          }
        },
      },
      // {
      //   // title: sortableHeader(
      //   //   t('common.labels.publish_by_token'),
      //   //   'publishAt',
      //   //   columnSortOrder
      //   // ),
      //   title: t('common.labels.publish_by_token'),
      //   // sorter: true,
      //   dataIndex: 'publishByToken',
      //   key: 'publishByToken',
      //   width: '17%',
      //   render: (publishByToken: string, record: IListThemeResponse) => (
      //     <div className="table-text">
      //       {publishByToken ? publishByToken : '-'}
      //     </div>
      //   ),
      // },
      {
        // title: sortableHeader(
        //   t('common.labels.upload_by_token'),
        //   'publishAt',
        //   columnSortOrder
        // ),
        title: t('common.labels.upload_by_token'),
        // sorter: true,
        dataIndex: 'uploadByToken',
        key: 'uploadByToken',
        width: '17%',
        render: (uploadByToken: string, record: IListThemeResponse) => (
          <div className="table-text">
            {uploadByToken ? uploadByToken : '-'}
          </div>
        ),
      },
    ],
    [
      t,
      listEnvironments.data,
      isPublishButtonDisabled,
      canPublishTheme,
      // columnSortOrder,
      workspaceId,
      allUsersList,
    ]
  );

  useEffect(() => {
    if (listHistory.isSuccess) {
      if (listHistory.data && listHistory.data.items) {
        setThemeHistoryData([...listHistory.data.items]);
        setTotalRecordsCount(Number(listHistory.data.totalCount));
      } else {
        setSortFlag(false);
      }
    }
  }, [listHistory.isSuccess, listHistory.data]);

  useEffect(() => {
    if (publishTheme.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.theme_published_successfully')
      );
      setIsPublishEnvironmentModalVisible(false);
      setThemeId('');
      setSelectedThemePublishEnvironment(null);
      setIsPublishButtonVisible(true);
      listHistory.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishTheme.isSuccess, t]);

  useEffect(() => {
    if (listAllUser.isSuccess) {
      if (listAllUser.data.length > 0) {
        setAllUsersList(listAllUser.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAllUser.isSuccess]);

  useEffect(() => {
    if (listEnvironments.isError) {
      setAllUsersList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    columns,
    listHistory,
    isPublishEnvironmentModalVisible,
    onHideSelectEnvironment,
    listEnvironments,
    selectedPublishThemeEnvironment,
    onSelectEnvironmentToPublish,
    isPublishButtonVisible,
    onEnvironmentToPublish,
    skip,
    skipLimit,
    onPageChange,
    themePublishedEnvironmentId,
    // isPublishButtonDisabled
    onChangeTable,
    sortFlag,
    themeHistoryData,
    totalRecordsCount,
  };
};

export default useListHistoryController;
