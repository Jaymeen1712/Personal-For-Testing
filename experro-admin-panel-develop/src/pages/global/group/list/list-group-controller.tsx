import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown, Menu, Popover } from 'antd';

import { IGroupDelete, IListGroup, RowRecord } from '../../../../types';
import { openNotificationWithIcon, PAGE_SIZE } from '../../../../utills';
import useError from '../../../../hooks/error';
import {
  useCreateGroup,
  useDeleteGroup,
  useDetailsGroup,
  useGroupUsers,
  useListGroup,
} from '../services';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';

const useListGroupController = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [filter, setFilter] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [group, setGroup] = useState<IGroupDelete>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [cloneGroupId, setCloneGroupId] = useState<string>('');

  const listGroup = useListGroup(page, pageSize, filter);
  const groupUsers = useGroupUsers(selectedGroupId);
  const deleteGroup = useDeleteGroup();
  const detailsGroup = useDetailsGroup(cloneGroupId);
  const createGroup = useCreateGroup();

  useError({
    mutation: createGroup,
    entity: t('common.labels.group'),
    dependentEntities: t('common.labels.role_or_user'),
    cb: () => setCloneGroupId(''),
  });

  useError({
    mutation: deleteGroup,
    entity: t('common.labels.group'),
    cb: () => setIsModalVisible(false),
  });

  const groupUsersDetail = groupUsers?.data?.map((item) => (
    <p key={item.email} className="group-users">
      <strong>
        {item.firstname} {item.lastname}
      </strong>
      {item.email}
    </p>
  ));

  const onUserCountClick = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const onDeleteClick = useCallback((groupId: string, group?: RowRecord) => {
    setGroup(group as unknown as IGroupDelete);
    setIsModalVisible(true);
    setSelectedGroupId(groupId);
  }, []);

  const onCloneClick = useCallback((groupId: string) => {
    setCloneGroupId(groupId);
  }, []);

  const onEditClick = useCallback(
    (groupId: string) => {
      history.push(`/groups/${groupId}`);
    },
    [history]
  );

  const onAddGroup = () => {
    history.push('/groups/create');
  };

  const pagination = useMemo(
    () => ({
      total: listGroup.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        listGroup.data &&
        listGroup.data.totalCount &&
        listGroup.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
        listGroup.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listGroup.data, setPage, page, pageSize, setPageSize]
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.groupName'),
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        // sorter: true,
        render: (name: string, row: IListGroup) => {
          return (
            <>
              <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
                <div className="table-text">
                  <div
                    className="text-truncate with-pixel cursor-pointer text-blue"
                    onClick={() => onEditClick(row.id)}>
                    {row.name ? row.name : '-'}
                  </div>
                </div>

                <Dropdown
                  placement="bottomRight"
                  trigger={['click']}
                  overlay={
                    <div className="table-dropdown">
                      <Menu>
                        <Menu.Item
                          key="edit"
                          onClick={() => onEditClick(row.id)}>
                          {t('common.labels.edit')}
                        </Menu.Item>

                        <Menu.Item
                          key="clone"
                          onClick={() => onCloneClick(row.id)}>
                          {t('common.labels.clone')}
                        </Menu.Item>

                        <Menu.Item
                          //@ts-ignore
                          onClick={() => onDeleteClick(row.id, row)}>
                          <p className="text-red m-0">
                            {t('common.labels.delete')}
                          </p>
                        </Menu.Item>
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
            </>
          );
        },
      },
      {
        title: t('common.labels.users'),
        dataIndex: 'users',
        key: 'users',
        width: '50%',
        render: (useCount: number, row: IListGroup) => {
          return (
            <>
              {row.userCount !== 0 ? (
                <div
                  className="cursor-pointer"
                  onMouseOver={() => onUserCountClick(row.id)}>
                  <Popover placement="bottomRight" content={groupUsersDetail}>
                    {`${row.userCount} ${t('common.labels.user')}`}
                  </Popover>
                </div>
              ) : (
                <div className="gray-text">{`${row.userCount} ${t(
                  'common.labels.user'
                )}`}</div>
              )}
            </>
          );
        },
      },
    ],
    [onCloneClick, onEditClick, onDeleteClick, t, groupUsersDetail]
  );

  const onDeleteGroup = async () => {
    if (selectedGroupId) {
      deleteGroup.mutate(selectedGroupId);
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (deleteGroup.isSuccess) {
      setIsModalVisible(false);
      listGroup.refetch();
      openNotificationWithIcon(
        'success',
        t('common.messages.group_deleted_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteGroup.isSuccess, t]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (detailsGroup.data && detailsGroup.data) {
      createGroup.mutate({
        name: detailsGroup.data.name + ' copy',
        description: detailsGroup.data.description,
        roleIds: detailsGroup.data.roleIds,
        userIds: detailsGroup.data.userIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsGroup.isSuccess, detailsGroup.data]);

  useEffect(() => {
    if (createGroup.isSuccess && createGroup.data) {
      history.push(`/groups/create/?groupId=${createGroup.data.id}`);
      setCloneGroupId('');
      openNotificationWithIcon(
        'success',
        t('common.messages.group_cloned_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createGroup.isSuccess, createGroup.data, t]);

  return {
    t,
    isListLoading: listGroup.isLoading,
    isListFetchig: listGroup.isFetching,
    setFilter,
    columns,
    filter,
    isModalVisible,
    hideModal,
    onDeleteGroup,
    onAddGroup,
    group,
    deleteGroup,
    groupData: listGroup.data?.items,
    totalGroupCount: listGroup.data?.totalCount,
    isSuccess: listGroup.isSuccess,
    pagination,
  };
};

export default useListGroupController;
