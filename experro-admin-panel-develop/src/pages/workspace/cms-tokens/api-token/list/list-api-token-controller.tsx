import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { openNotificationWithIcon, PAGE_SIZE } from '../../../../../utills';
import { RowRecord } from '../../../../../types';
import useError from '../../../../../hooks/error';
import usePermissions from '../../../../../hooks/permissions';
import { useListAllUser } from '../../../../../apis/user';
import useListCmsToken from '../../services/list';
import useDeleteCmsToken from '../../services/delete';
import { Button, Dropdown, Menu } from 'antd';
import EllipsisIcon from '../../../../../images/icons/ellipsis-icon';

interface IParams {
  workspaceId: string;
}

const useListAPITokenController = () => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IParams>();
  const history = useHistory();
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const permissions = usePermissions();
  const listAllUser = useListAllUser();
  const listApiToken = useListCmsToken(
    workspaceId,
    page,
    pageSize,
    'API'
    // columnSortOrder.orderBy,
    // columnSortOrder.sortBy
  );
  const deleteAPIToken = useDeleteCmsToken(workspaceId);

  useError({
    mutation: deleteAPIToken,
    entity: t('common.labels.api_token'),
  });

  const onAddAPITokenClick = () => {
    history.push(`/workspaces/${workspaceId}/cms-tokens/create`);
  };

  const onEditClick = useCallback(
    (tokenId: string, token?: RowRecord) => {
      if (token && moment(token.validTill).isBefore(Date.now())) {
        openNotificationWithIcon(
          'error',
          t('common.messages.edit_token_expired')
        );
      } else {
        history.push(`/workspaces/${workspaceId}/cms-tokens/${tokenId}`);
      }
    },
    // eslint-disable-next-line
    [t]
  );

  const onDeleteClick = (tokenId: string) => {
    setIsModalVisible(true);
    setSelectedTokenId(tokenId);
  };

  const onDeleteToken = async () => {
    if (selectedTokenId) {
      deleteAPIToken.mutate(selectedTokenId);
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (deleteAPIToken.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.api_token_deleted_success')
      );
      listApiToken.remove();
      hideModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteAPIToken.isSuccess, t, workspaceId]);

  const pagination = useMemo(
    () => ({
      total: listApiToken?.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        listApiToken.data?.items &&
        listApiToken.data.totalCount &&
        listApiToken.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
        listApiToken.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listApiToken.data, page, pageSize]
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.token_name'),
        dataIndex: 'name',
        width: '20%',
        key: 'name',
        render: (name: string, record: RowRecord) => (
          <>
            {name && (
              <div
                className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
                {permissions.canUpdateAPIToken() ? (
                  <div
                    onClick={() => onEditClick(record.id, record)}
                    className="text-blue cursor-pointer text-truncate with-pixel-xs">
                    {record.name}
                  </div>
                ) : (
                  <>{record.name}</>
                )}

                {(permissions.canDeleteAPIToken() ||
                  permissions.canUpdateAPIToken()) && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown">
                        <Menu>
                          {permissions.canUpdateAPIToken() && (
                            <Menu.Item
                              onClick={() => onEditClick(record.id, record)}>
                              {t('common.labels.edit')}
                            </Menu.Item>
                          )}
                          {permissions.canDeleteAPIToken() && (
                            <Menu.Item
                              key={2}
                              className="text-red"
                              onClick={() => onDeleteClick(record.id)}>
                              <p className="text-red m-0">
                                {t('common.labels.delete')}
                              </p>
                            </Menu.Item>
                          )}
                        </Menu>
                      </div>
                    }>
                    <Button
                      key="recordTableEllipsisIcon"
                      type="text"
                      size="small"
                      className="on-hover"
                      icon={<EllipsisIcon />}
                      style={{ float: 'right' }}
                    />
                  </Dropdown>
                )}
              </div>
            )}
          </>
        ),
      },
      {
        title: t('common.labels.created_by'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '20%',
        render: (record: string) => {
          const user = listAllUser.data?.filter((users) => users.id === record);
          if (user?.length) {
            return `${user?.[0].firstName} ${user?.[0].lastName}`;
          } else {
            return '-';
          }
        },
      },
      {
        title: t('common.labels.created_at'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '20%',
        render: (createdAt: string): string => {
          if (createdAt) {
            return moment(createdAt).format('DD/MM/YYYY,LT');
          } else {
            return '-';
          }
        },
      },
      {
        title: t('common.labels.permission'),
        dataIndex: 'type',
        key: 'type',
        width: '20%',
        render: (record: string) => {
          return record === 'READ_ONLY'
            ? 'Read Only'
            : record === 'LOCAL_DEVELOPMENT_ONLY'
            ? 'Local Development Only'
            : 'Full Access';
        },
      },
      {
        title: t('common.labels.expiration'),
        dataIndex: 'validTill',
        key: 'validTill',
        width: '20%',
        // sorter: true,
        render: (record: string) => {
          if (record) {
            if (moment(record).isBefore(Date.now())) {
              return <div className="text-red">Expired</div>;
            } else {
              return moment(record).format('DD/MM/YYYY');
            }
          } else {
            return '_';
          }
        },
      },
    ],
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    listApiToken.refetch();
    // eslint-disable-next-line
  }, [location]);

  return {
    t,
    isModalVisible,
    hideModal,
    onDeleteToken,
    onDeleteClick,
    workspaceId,
    columns,
    onAddAPITokenClick,
    listApiToken,
    deleteAPIToken,
    pagination,
    createAPITokenPermission: permissions.canCreateAPIToken(),
  };
};

export default useListAPITokenController;
