import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import {
  useCreateNavigation,
  useDeleteNavigation,
  useDetailsNavigation,
  useGetContentModelId,
  useListNavigation,
  useUpdateNavigation,
} from '../services';
import { IWorkspaceParams, RowRecord } from '../../../../types';
import {
  APIS_ROUTES,
  API_QUERY_KEY,
  convertDateTimeToUserTimezone,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
  // sortableHeader,
  camelToSnackCase,
} from '../../../../utills';
import useWorkspaceRoute from '../../../../hooks/workspace-route';
import useUser from '../../../../hooks/user';
import { useListAllUser } from '../../../../apis/user';
import queryClient from '../../../../query-client';
import useError from '../../../../hooks/error/error';
import { Button, Dropdown, Form, Menu } from 'antd';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import { debounce } from 'lodash';

interface IUseListNavigationController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useListNavigationController = ({
  onMainSidebarActiveItem,
}: IUseListNavigationController) => {
  const { t } = useTranslation();
  const { push } = useWorkspaceRoute();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState<boolean>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>();
  const [selectedNavigationId, setSelectedNavigationId] = useState<string>();
  const [contentModelId, setContentModelId] = useState<string | undefined>('');
  const [isRename, setIsRename] = useState<boolean>();
  const [filter, setFilter] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSaveButtonDisable, setIsSaveButtonDisable] = useState(true);

  const [columnSortOrder, setColumnSortOrder] = useState({
    sortBy: '',
    orderBy: '',
  });

  const user = useUser();
  const listAllUser = useListAllUser();
  const contentModel = useGetContentModelId(workspaceId);
  const createNavigation = useCreateNavigation(workspaceId, contentModelId);
  const [isSortByClick, setIsSortByClick] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isUserIds, setIsUserIds] = useState(false);
  const [isClone, setIsClone] = useState<boolean>(false);
  const [menuId, setMenuId] = useState<string>('');

  const listNavigation = useListNavigation(
    workspaceId,
    contentModelId,
    filter,
    selectedUserIds,
    columnSortOrder.orderBy,
    columnSortOrder.sortBy
  );

  const updateNavigation = useUpdateNavigation(
    workspaceId,
    selectedNavigationId,
    contentModelId
  );

  const deleteNavigation = useDeleteNavigation();

  const getMenuDetails = useDetailsNavigation(
    workspaceId,
    menuId,
    contentModelId
  );

  useError({
    mutation: deleteNavigation,
    entity: t('common.labels.navigation'),
    cb: () => setIsDeleteModalVisible(false),
  });
  useError({
    mutation: createNavigation,
    entity: t('common.labels.navigation'),
    cb: () => setIsDeleteModalVisible(false),
  });

  const onAddNavigation = async () => {
    const values = await form.validateFields();
    if (values.navigationName.trim().length === 0) {
      form.setFields([
        {
          name: 'navigationName',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.navigationName.trim().length > 255) {
      form.setFields([
        {
          name: 'navigationName',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.navigation_name'),
            }),
          ],
        },
      ]);
    } else {
      values.navigationName = values.navigationName.trim();
      if (isRename) {
        updateNavigation.mutate({ title: values.navigationName });
      } else {
        createNavigation.mutate({ title: values.navigationName });
      }
    }
  };

  const onAddNavigationClick = () => {
    setIsModalVisible(true);
  };

  const onCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    if (isRename) {
      setIsRename(false);
    }
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const onDeleteNavigation = () => {
    deleteNavigation.mutate({
      workspaceId: workspaceId,
      menuId: selectedNavigationId,
      contentModelId: contentModelId,
    });
  };

  const onEditClick = useCallback(
    (menuId: string) => {
      push(`/navigation/${menuId}`);
    },
    [push]
  );

  const onRenameClick = (menuId: string) => {
    setIsModalVisible(true);
    setIsRename(true);
    setSelectedNavigationId(menuId);
  };

  const onCloneClick = useCallback((menuId: string) => {
    setMenuId(menuId);

    setIsClone(true);
  }, []);

  const onFilterChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsFilter(true);
      setFilter(event.target.value);
    },
    500
  );

  const onUserChange = useCallback((userIds: string[]) => {
    if (userIds.length === 0) {
      setIsFilter(false);
    } else {
      setIsFilter(true);
    }

    setIsUserIds(true);
    const allUserIds = [...userIds];

    if (allUserIds.findIndex((ele) => ele === 'All') > -1) {
      allUserIds.splice(
        allUserIds.findIndex((ele) => ele === 'All'),
        1
      );
    }

    setSelectedUserIds(allUserIds);
  }, []);

  const onDeleteClick = (menuId: string) => {
    setIsDeleteModalVisible(true);
    setSelectedNavigationId(menuId);
  };

  // @ts-ignore
  const onTableChange = (pagination, filter, sorter) => {
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
  };

  const onFormFieldChange = () => {
    setIsSaveButtonDisable(false);
  };

  const columns = useMemo(
    () => [
      {
        // title: sortableHeader(
        //   t('common.labels.name'),
        //   'title',
        //   columnSortOrder
        // ),
        title: t('common.labels.name'),
        dataIndex: 'title',
        key: 'title',
        width: '30%',
        // sorter: true,
        render: (navigationName: string, record: RowRecord) => (
          <div
            className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
            <div
              onClick={() => onEditClick(record.id)}
              className="text-blue cursor-pointer text-truncate">
              {record.title}
            </div>
            <Dropdown
              placement="bottomRight"
              trigger={['click']}
              overlay={
                <div className="table-dropdown">
                  <Menu>
                    <Menu.Item onClick={() => onEditClick(record.id)}>
                      {t('common.labels.edit')}
                    </Menu.Item>
                    <Menu.Item onClick={() => onRenameClick(record.id)}>
                      {t('common.labels.rename')}
                    </Menu.Item>
                    <Menu.Item onClick={() => onCloneClick(record.id)}>
                      {t('common.labels.clone')}
                    </Menu.Item>
                    <Menu.Item
                      className="text-red"
                      onClick={() => onDeleteClick(record.id)}>
                      <p className="text-red m-0">
                        {t('common.labels.delete')}
                      </p>
                    </Menu.Item>
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
          </div>
        ),
      },
      {
        title: 'ID',
        dataIndex: 'navigationId',
        key: 'navigationId',
        width: '30%',
        // sorter: true,
        render: (navigationId: string, record: RowRecord) => {
          return `${record.id}`;
        },
      },
      {
        title: 'Modified by',
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        width: '20%',
        // sorter: true,
        render: (modifiedBy: string, record: RowRecord) => {
          const user = listAllUser.data?.filter(
            (users) => users.id === record.modifiedBy
          );
          if (user?.length) {
            return `${user?.[0].firstName} ${user?.[0].lastName}`;
          } else {
            return '-';
          }
        },
      },
      {
        title: 'Modified at',
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        width: '20%',
        // sorter: true,
        render: (modifiedAt: string, record: RowRecord) => {
          return convertDateTimeToUserTimezone(
            record.modifiedAt,
            user?.user?.timezone
          );
        },
      },
    ],
    [onCloneClick, onEditClick, t, listAllUser.data, user?.user?.timezone]
  );

  useEffect(() => {
    if (createNavigation.isSuccess) {
      if (isClone) {
        openNotificationWithIcon(
          'success',
          t('common.messages.navigation_cloned_successfully')
        );
        setIsClone(false);
        push(`/navigation/${createNavigation.data.contentModelDataId}`);
      } else {
        openNotificationWithIcon(
          'success',
          t('common.messages.navigation_added_successfully')
        );
        setIsModalVisible(false);
        form.resetFields();
        push(`/navigation/${createNavigation.data.contentModelDataId}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createNavigation.isSuccess, t]);

  useEffect(() => {
    if (updateNavigation.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.NAVIGATION_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.NAVIGATION_DETAILS]);
      setIsModalVisible(false);
      form.resetFields();
      setIsRename(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateNavigation.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (deleteNavigation.isSuccess) {
      setIsRename(false);
      form.resetFields();
      hideDeleteModal();
      listNavigation.refetch();
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([
        'grid',
        `${APIS_ROUTES.NAVIGATION}/${workspaceId}/menu/${contentModelId}/menu-items`,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteNavigation.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (contentModel.isSuccess) {
      setContentModelId(contentModel.data?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentModel.isSuccess]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listNavigation.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSortOrder, selectedUserIds, filter]);

  useEffect(() => {
    if (listNavigation.isSuccess && isRename) {
      const getMenuTitle = listNavigation?.data?.filter(
        (ele) => ele.id === selectedNavigationId
      );
      form.setFieldsValue({
        navigationName: getMenuTitle?.[0]?.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listNavigation.isSuccess, isRename]);

  useEffect(() => {
    if (getMenuDetails.isSuccess && getMenuDetails.data) {
      const getMenuTitle = listNavigation?.data?.filter(
        (ele) => ele.id === menuId
      )[0].title;
      createNavigation.mutateAsync({
        title: `${getMenuTitle} copy`,
        // @ts-ignore
        dynamicFieldsData: { contentEj: getMenuDetails.data.contentEj },
      });
      setMenuId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMenuDetails.isSuccess]);

  return {
    t,
    onAddNavigation,
    onAddNavigationClick,
    isModalVisible,
    onCancel,
    columns,
    workspaceId,
    isDeleteModalVisible,
    hideDeleteModal,
    onDeleteNavigation,
    listNavigation,
    contentModelId,
    contentModel,
    isRename,
    createNavigation,
    deleteNavigation,
    form,
    updateNavigation,
    onTableChange,
    filter,
    onFilterChange,
    listAllUsers: user?.listAllUser,
    onUserChange,
    selectedUserIds,
    isSortByClick,
    isFilter,
    isUserIds,
    isSaveButtonDisable,
    onFormFieldChange,
  };
};

export default useListNavigationController;
