import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';

import { IListEnvironments, RowRecord } from '../../../../types';
import useUser from '../../../../hooks/user';
import {
  useAccessTokenGraphQlEnvironments,
  useListEnvironments,
  useSetDefaultEnvironment,
} from '../services';
import {
  allowSpecificDomain,
  camelToSnackCase,
  openNotificationWithIcon,
} from '../../../../utills';
import { Button, Dropdown, Menu, Tag, TablePaginationConfig } from 'antd';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';

const useListEnvironmentController = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = useUser();

  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  // const [selectedEnvironment, setSelectedEnvironment] = useState('');

  const [columnSortOrder, setColumnSortOrder] = useState({
    sortBy: '',
    orderBy: '',
  });
  const [isSortByClick, setIsSortByClick] = useState(false);

  const listEnvironments = useListEnvironments(workspaceId, columnSortOrder);

  const setDefaultEnvironment = useSetDefaultEnvironment(workspaceId);
  const accessTokenGraphQlEnvironments = useAccessTokenGraphQlEnvironments(
    user?.user?.id
  );

  const [listEnvironmentsData, setListEnvironmentsData] = useState<
    IListEnvironments[]
  >([]);

  const onChangeTable = (
    pagination: TablePaginationConfig,
    //@ts-ignore
    filters,
    //@ts-ignore
    sorter
  ) => {
    if (!isSortByClick) {
      setIsSortByClick(true);
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
    listEnvironments.remove();
  };

  const onEditClick = useCallback((environmentId: string) => {
    history.push(`/workspaces/${workspaceId}/environments/${environmentId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDefaultButtonClick = useCallback((environmentId: string) => {
    setDefaultEnvironment.mutate(environmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGraphQlClick = useCallback(
    (environmentId: string) => {
      if (accessTokenGraphQlEnvironments.data) {
        history.push(
          `/workspaces/${workspaceId}/environments/${environmentId}/graphQl?accessToken=${accessTokenGraphQlEnvironments.data}`
        );
      }
    },
    // eslint-disable-next-line
    [
      accessTokenGraphQlEnvironments.data,
      accessTokenGraphQlEnvironments.isSuccess,
    ]
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'title',
        key: 'title',
        width: '20%',
        render: (title: string, record: RowRecord) => (
          <div
            className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
            <div className="ant-row ant-row-middle">
              <Link
                to={`/workspaces/${workspaceId}/environments/${record.id}`}
                className="m-r-12">
                {title}
              </Link>
              {record.isDefault && (
                <Tag color={'success'}>{t('common.labels.default')}</Tag>
              )}
            </div>
            <Dropdown
              placement="bottomRight"
              trigger={['click']}
              overlay={
                <div className="table-dropdown">
                  <Menu>
                    <Menu.Item
                      onClick={() => {
                        // setSelectedEnvironment(record.id);
                        onEditClick(record.id);
                      }}>
                      {t('common.labels.edit')}
                    </Menu.Item>
                    {!record.isDefault && (
                      <Menu.Item
                        onClick={() => {
                          onDefaultButtonClick(record.id);
                        }}>
                        {t('common.labels.make_default')}
                      </Menu.Item>
                    )}

                    {allowSpecificDomain(user?.user?.email) && (
                      <Menu.Item
                        onClick={() => {
                          onGraphQlClick(record.id);
                        }}>
                        {t('common.labels.graph_ql')}
                      </Menu.Item>
                    )}
                  </Menu>
                </div>
              }>
              <Button
                type="text"
                size="small"
                className="on-hover"
                icon={<EllipsisIcon />}
                style={{ float: 'right' }}
              />
            </Dropdown>
          </div>
        ),
      },
      {
        title: t('common.labels.base_url'),
        dataIndex: 'workspaceDomain',
        key: 'workspaceDomain',
        width: '20%',
        render: (workspaceDomain: string, record: RowRecord) => {
          return workspaceDomain ||
            record.customDomain ||
            record.cacheDomain ? (
            <div className="text-truncate">
              {record.type === 'PRODUCTION' ? (
                record.customDomain ? (
                  <a
                    title={record.customDomain}
                    href={`https://${record.customDomain}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {record.customDomain}
                  </a>
                ) : record.cacheDomain ? (
                  <a
                    title={record.cacheDomain}
                    href={`https://${record.cacheDomain}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {record.cacheDomain}
                  </a>
                ) : (
                  <a
                    title={workspaceDomain}
                    href={`https://${workspaceDomain}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {workspaceDomain}
                  </a>
                )
              ) : (
                <a
                  title={workspaceDomain}
                  href={`https://${workspaceDomain}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  {workspaceDomain}
                </a>
              )}
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        title: t('common.labels.pointed_domain'),
        dataIndex: 'customDomain',
        key: 'customDomain',
        width: '25%',
        render: (customDomain: string, record: RowRecord) => {
          if (
            record.pointYourDomain &&
            record.customDomain &&
            (record.type === 'PRODUCTION' || record.type === 'CUSTOM')
          ) {
            return `${record.customDomain}`;
          } else {
            return '-';
          }
        },
      },
      // {
      //   title: t('common.labels.preview_code'),
      //   dataIndex: 'enablePasswordProtect',
      //   key: 'enablePasswordProtect',
      //   width: '20%',
      //   // sorter: true,
      //   render: (enablePasswordProtect: boolean) => {
      //     return enablePasswordProtect ? 'YES' : '-';
      //   },
      // },
      // {
      //   title: t('common.labels.under_maintenance'),
      //   dataIndex: 'enableMaintenance',
      //   key: 'enableMaintenance',
      //   width: '20%',
      //   // sorter: true,
      //   render: (enableMaintenance: boolean) => {
      //     return enableMaintenance ? 'YES' : '-';
      //   },
      // },
    ],
    // eslint-disable-next-line
    [t, onEditClick, onDefaultButtonClick, onGraphQlClick]
  );

  useEffect(() => {
    if (listEnvironments.isSuccess && listEnvironments.data.length > 0) {
      setListEnvironmentsData([...listEnvironments.data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEnvironments.isSuccess, listEnvironments.data]);

  useEffect(() => {
    if (setDefaultEnvironment.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.make_environment_default_successfully')
      );
      localStorage.removeItem(`${workspaceId}/environmentId`);
      listEnvironments.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDefaultEnvironment.isSuccess]);

  useEffect(() => {
    if (setDefaultEnvironment.isError) {
      console.log('test', setDefaultEnvironment.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDefaultEnvironment.isError]);
  return {
    columns,
    workspaceId,
    listEnvironmentsData,
    isSuccess: listEnvironments?.isSuccess,
    t,
    onChangeTable,
    isSortByClick,
  };
};

export default useListEnvironmentController;
