import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../utills';
import { RowRecord } from '../../../../../types';
import useError from '../../../../../hooks/error';
import usePermissions from '../../../../../hooks/permissions';
import { Button, Dropdown, Form, Menu } from 'antd';
import { useListAllUser } from '../../../../../apis/user';
import useListCmsToken from '../../services/list';
import useDeleteCmsToken from '../../services/delete';
import queryClient from '../../../../../query-client';
import EllipsisIcon from '../../../../../images/icons/ellipsis-icon';

interface IParams {
  workspaceId: string;
}

const useListCLITokenController = () => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IParams>();
  const location = useLocation();
  const [form] = Form.useForm();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [CLITokenId, setCLITokenId] = useState<string | undefined>();
  const listAllUser = useListAllUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  // const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
  //   sortBy: '',
  //   orderBy: '',
  // });

  const listCLIToken = useListCmsToken(
    workspaceId,
    page,
    pageSize,
    'CLI'
    // columnSortOrder.orderBy,
    // columnSortOrder.sortBy
  );
  const deleteCLIToken = useDeleteCmsToken(workspaceId);

  const permissions = usePermissions();

  useError({
    mutation: deleteCLIToken,
    entity: t('common.labels.api_token'),
  });

  const onCreateCLIToken = () => {
    form.setFieldsValue({
      name: '',
      validTill: undefined,
      type: '',
    });
    setCLITokenId(undefined);
    setIsCreateModalVisible(true);
  };

  const onCancelCLIToken = useCallback(async () => {
    setIsCreateModalVisible(false);
    setCLITokenId(undefined);
    form.resetFields();
    //eslint-disable-next-line
  }, []);

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const onEditClick = useCallback(
    (tokenId: string, token?: RowRecord) => {
      if (token && moment(token.validTill).isBefore(Date.now())) {
        openNotificationWithIcon(
          'error',
          t('common.messages.edit_token_expired')
        );
      } else {
        setCLITokenId(tokenId);
        setIsCreateModalVisible(true);
        queryClient.refetchQueries([API_QUERY_KEY.TOKEN_DETAIL, CLITokenId]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const onDeleteClick = (tokenId: string) => {
    setIsDeleteModalVisible(true);
    setSelectedTokenId(tokenId);
  };

  const onDeleteToken = async () => {
    if (selectedTokenId) {
      deleteCLIToken.mutate(selectedTokenId);
    }
  };

  // //@ts-ignore
  // const onChangeTable = (pagination, filter, sorter) => {
  //   if (sorter.order === 'ascend') {
  //     setColumnSortOrder({
  //       sortBy: camelToSnackCase(sorter.field),
  //       orderBy: 'asc',
  //     });
  //   } else if (sorter.order === 'descend') {
  //     setColumnSortOrder({
  //       sortBy: camelToSnackCase(sorter.field),
  //       orderBy: 'desc',
  //     });
  //   } else {
  //     setColumnSortOrder({
  //       sortBy: '',
  //       orderBy: '',
  //     });
  //   }
  // };

  // useEffect(() => {
  //   listCLIToken.refetch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [columnSortOrder]);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.token_name'),
        dataIndex: 'name',
        width: '25%',
        key: 'name',
        // sorter: true,
        render: (name: string, record: RowRecord) => (
          <>
            {name && (
              <div
                className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
                {permissions.canUpdateCLIToken() ? (
                  <div
                    onClick={() => onEditClick(record.id, record)}
                    className="text-blue cursor-pointer text-truncate with-pixel-xs">
                    {record.name}
                  </div>
                ) : (
                  <>{record.name}</>
                )}

                {(permissions.canUpdateCLIToken() ||
                  permissions.canDeleteCLIToken()) && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown">
                        <Menu>
                          {permissions.canUpdateCLIToken() && (
                            <Menu.Item
                              onClick={() => onEditClick(record.id, record)}>
                              {t('common.labels.edit')}
                            </Menu.Item>
                          )}
                          {permissions.canDeleteCLIToken() && (
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
        // sorter: true,
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
        // sorter: true,
        render: (record: string): string => {
          return record === 'LOCAL_DEVELOPMENT_ONLY'
            ? t('common.labels.local_development_only')
            : record === 'FULL_ACCESS'
            ? t('common.labels.full_access')
            : t('common.labels.upload');
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
    [t]
  );

  const pagination = useMemo(
    () => ({
      total: listCLIToken?.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        listCLIToken.data?.items &&
        listCLIToken.data.totalCount &&
        listCLIToken.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
        listCLIToken.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listCLIToken.data, page, pageSize]
  );

  useEffect(() => {
    if (deleteCLIToken.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.api_token_deleted_success')
      );
      listCLIToken.remove();
      hideDeleteModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteCLIToken.isSuccess, t, workspaceId]);

  useEffect(() => {
    listCLIToken.refetch();
    // eslint-disable-next-line
  }, [location]);

  return {
    t,
    form,
    columns,
    workspaceId,
    onCreateCLIToken,
    isCreateModalVisible,
    hideDeleteModal,
    onDeleteToken,
    isDeleteModalVisible,
    CLITokenId,
    setIsCreateModalVisible,
    setIsModalVisible,
    isModalVisible,
    setCLITokenId,
    onCancelCLIToken,
    // onChangeTable,
    pagination,
    createCLITokenPermission: permissions.canCreateCLIToken(),
    isDeleteLoading: deleteCLIToken.isLoading,
    listCLITokenData: listCLIToken.data?.items,
    isLoading: listCLIToken.isLoading,
    isFetching: listCLIToken.isFetching,
  };
};

export default useListCLITokenController;
